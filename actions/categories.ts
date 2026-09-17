"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/lib/validations/categories.schema";
import type { CategoryRecord } from "@/types";

export interface CategoryWithProductCount extends CategoryRecord {
  productCount: number;
  parentName?: string | null;
  subcategories?: CategoryWithProductCount[];
}

export interface CategoryKPIMetrics {
  totalCategories: number;
  parentCount: number;
  subcategoryCount: number;
  activeCount: number;
}

/**
 * Fetches all categories with nested subcategories, product counts, and KPI metrics.
 * 100% database-driven with zero hardcoded fallbacks.
 */
export async function getAdminCategoriesDetailedAction(): Promise<{
  success: boolean;
  categories: CategoryWithProductCount[];
  parentCategories: CategoryWithProductCount[];
  metrics: CategoryKPIMetrics;
  error?: string;
}> {
  try {
    const insforge = await createInsforgeServer();

    // 1. Query all categories ordered by display_order then name
    const { data: dbCategories, error: catError } = await insforge.database
      .from("categories")
      .select("id, name, slug, description, image_url, icon_name, parent_id, display_order, is_active, created_at, updated_at")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (catError) {
      console.error("[getAdminCategoriesDetailedAction] Error fetching categories:", catError);
      return {
        success: false,
        categories: [],
        parentCategories: [],
        metrics: { totalCategories: 0, parentCount: 0, subcategoryCount: 0, activeCount: 0 },
        error: catError.message,
      };
    }

    const categoriesList: CategoryRecord[] = dbCategories || [];

    // 2. Query product counts per category
    const { data: productRecords } = await insforge.database
      .from("products")
      .select("category_id");

    const countsMap = new Map<string, number>();
    if (productRecords && Array.isArray(productRecords)) {
      for (const prod of productRecords) {
        if (prod.category_id) {
          countsMap.set(prod.category_id, (countsMap.get(prod.category_id) || 0) + 1);
        }
      }
    }

    // Map parent name lookup
    const idToNameMap = new Map<string, string>();
    for (const cat of categoriesList) {
      idToNameMap.set(cat.id, cat.name);
    }

    // 3. Build enriched category records
    const enrichedList: CategoryWithProductCount[] = categoriesList.map((cat) => ({
      ...cat,
      productCount: countsMap.get(cat.id) || 0,
      parentName: cat.parent_id ? idToNameMap.get(cat.parent_id) || null : null,
    }));

    // 4. Separate parents and subcategories, and nest children under parents
    const parents: CategoryWithProductCount[] = [];
    const subcategories: CategoryWithProductCount[] = [];

    for (const cat of enrichedList) {
      if (!cat.parent_id) {
        parents.push({ ...cat, subcategories: [] });
      } else {
        subcategories.push(cat);
      }
    }

    // Attach subcategories to corresponding parents
    for (const sub of subcategories) {
      const parent = parents.find((p) => p.id === sub.parent_id);
      if (parent) {
        if (!parent.subcategories) parent.subcategories = [];
        parent.subcategories.push(sub);
      }
    }

    // Sort subcategories by display_order
    for (const parent of parents) {
      if (parent.subcategories) {
        parent.subcategories.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      }
    }

    const metrics: CategoryKPIMetrics = {
      totalCategories: enrichedList.length,
      parentCount: parents.length,
      subcategoryCount: subcategories.length,
      activeCount: enrichedList.filter((c) => c.is_active).length,
    };

    return {
      success: true,
      categories: enrichedList,
      parentCategories: parents,
      metrics,
    };
  } catch (err: unknown) {
    console.error("[getAdminCategoriesDetailedAction] Unexpected error:", err);
    return {
      success: false,
      categories: [],
      parentCategories: [],
      metrics: { totalCategories: 0, parentCount: 0, subcategoryCount: 0, activeCount: 0 },
      error: err instanceof Error ? err.message : "Failed to load categories",
    };
  }
}

/**
 * Fetches active categories and subcategories for the storefront navigation.
 * Zero hardcoded fallbacks.
 */
export async function getStorefrontCategoriesAction(): Promise<{
  success: boolean;
  categories: CategoryWithProductCount[];
  error?: string;
}> {
  try {
    const insforge = await createInsforgeServer();

    const { data: dbCategories, error } = await insforge.database
      .from("categories")
      .select("id, name, slug, description, image_url, icon_name, parent_id, display_order, is_active, created_at, updated_at")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error || !dbCategories) {
      return { success: false, categories: [], error: error?.message };
    }

    const activeList: CategoryRecord[] = dbCategories;
    const parents: CategoryWithProductCount[] = [];
    const subs: CategoryWithProductCount[] = [];

    for (const cat of activeList) {
      const item: CategoryWithProductCount = { ...cat, productCount: 0 };
      if (!cat.parent_id) {
        parents.push({ ...item, subcategories: [] });
      } else {
        subs.push(item);
      }
    }

    for (const sub of subs) {
      const parent = parents.find((p) => p.id === sub.parent_id);
      if (parent) {
        if (!parent.subcategories) parent.subcategories = [];
        parent.subcategories.push(sub);
      }
    }

    return { success: true, categories: parents };
  } catch (err) {
    console.error("[getStorefrontCategoriesAction] Error:", err);
    return { success: false, categories: [] };
  }
}

/**
 * Creates a new category or subcategory in InsForge PostgreSQL.
 */
export async function createAdminCategoryAction(
  rawInput: CreateCategoryInput
): Promise<{
  success: boolean;
  category?: CategoryRecord;
  error?: string;
}> {
  try {
    const input = createCategorySchema.parse(rawInput);
    const insforge = await createInsforgeServer();

    // Check slug uniqueness
    const { data: existingSlug } = await insforge.database
      .from("categories")
      .select("id")
      .eq("slug", input.slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `A category with slug "${input.slug}" already exists. Please choose a unique slug.`,
      };
    }

    // If parent_id provided, enforce 2-level hierarchy: parent must be a top-level category
    if (input.parent_id) {
      const { data: parentCat } = await insforge.database
        .from("categories")
        .select("id, parent_id")
        .eq("id", input.parent_id)
        .single();

      if (!parentCat) {
        return { success: false, error: "Selected parent category does not exist." };
      }

      if (parentCat.parent_id) {
        return {
          success: false,
          error: "Subcategories cannot be nested under another subcategory. Hierarchy is strictly 2 levels.",
        };
      }
    }

    const payload = {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      image_url: input.image_url || null,
      icon_name: input.icon_name || null,
      parent_id: input.parent_id || null,
      display_order: input.display_order ?? 0,
      is_active: input.is_active ?? true,
    };

    const { data: inserted, error: insertError } = await insforge.database
      .from("categories")
      .insert([payload])
      .select()
      .single();

    if (insertError) {
      console.error("[createAdminCategoryAction] Insert error:", insertError);
      return { success: false, error: insertError.message };
    }

    // Revalidate paths across storefront and admin
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/category/[slug]", "page");

    return { success: true, category: inserted };
  } catch (err: unknown) {
    console.error("[createAdminCategoryAction] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create category",
    };
  }
}

/**
 * Updates an existing category or subcategory in InsForge PostgreSQL.
 */
export async function updateAdminCategoryAction(
  rawInput: UpdateCategoryInput
): Promise<{
  success: boolean;
  category?: CategoryRecord;
  error?: string;
}> {
  try {
    const input = updateCategorySchema.parse(rawInput);
    const insforge = await createInsforgeServer();

    // Check slug collision with other records
    const { data: existingSlug } = await insforge.database
      .from("categories")
      .select("id")
      .eq("slug", input.slug)
      .neq("id", input.id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `Slug "${input.slug}" is already used by another category. Please use a unique slug.`,
      };
    }

    // Enforce hierarchy rules on edit
    if (input.parent_id) {
      if (input.parent_id === input.id) {
        return { success: false, error: "A category cannot be its own parent." };
      }

      // If this category currently has children, it cannot be turned into a subcategory
      const { data: children } = await insforge.database
        .from("categories")
        .select("id")
        .eq("parent_id", input.id);

      if (children && children.length > 0) {
        return {
          success: false,
          error: "This category has child subcategories and cannot be converted into a subcategory itself.",
        };
      }

      // Check that chosen parent is a root category
      const { data: parentCat } = await insforge.database
        .from("categories")
        .select("id, parent_id")
        .eq("id", input.parent_id)
        .single();

      if (!parentCat) {
        return { success: false, error: "Selected parent category does not exist." };
      }

      if (parentCat.parent_id) {
        return {
          success: false,
          error: "Selected parent is already a subcategory. Hierarchy cannot exceed 2 levels.",
        };
      }
    }

    const payload = {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      image_url: input.image_url || null,
      icon_name: input.icon_name || null,
      parent_id: input.parent_id || null,
      display_order: input.display_order ?? 0,
      is_active: input.is_active ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error: updateError } = await insforge.database
      .from("categories")
      .update(payload)
      .eq("id", input.id)
      .select()
      .single();

    if (updateError) {
      console.error("[updateAdminCategoryAction] Update error:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/category/[slug]", "page");
    revalidatePath(`/category/${input.slug}`);

    return { success: true, category: updated };
  } catch (err: unknown) {
    console.error("[updateAdminCategoryAction] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update category",
    };
  }
}

/**
 * Toggles category active status on/off.
 */
export async function toggleAdminCategoryStatusAction(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();

    const { error } = await insforge.database
      .from("categories")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("[toggleAdminCategoryStatusAction] Error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/category/[slug]", "page");

    return { success: true };
  } catch (err: unknown) {
    console.error("[toggleAdminCategoryStatusAction] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle status",
    };
  }
}

/**
 * Deletes a category with safety checks:
 * 1. Blocks if child subcategories exist.
 * 2. Blocks if assigned products exist.
 */
export async function deleteAdminCategoryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const insforge = await createInsforgeServer();

    // Guard 1: Check for child subcategories
    const { data: subcategories, error: subError } = await insforge.database
      .from("categories")
      .select("id, name")
      .eq("parent_id", id);

    if (subError) {
      return { success: false, error: subError.message };
    }

    if (subcategories && subcategories.length > 0) {
      return {
        success: false,
        error: `Cannot delete: This category contains ${subcategories.length} child subcategory(ies). Please delete or reassign them first.`,
      };
    }

    // Guard 2: Check for assigned products
    const { data: assignedProducts, error: prodError } = await insforge.database
      .from("products")
      .select("id, title")
      .eq("category_id", id);

    if (prodError) {
      return { success: false, error: prodError.message };
    }

    if (assignedProducts && assignedProducts.length > 0) {
      return {
        success: false,
        error: `Cannot delete: ${assignedProducts.length} product(s) are assigned to this category. Please reassign products to another category first.`,
      };
    }

    // Safe to delete
    const { error: deleteError } = await insforge.database
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[deleteAdminCategoryAction] Delete error:", deleteError);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/category/[slug]", "page");

    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteAdminCategoryAction] Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete category",
    };
  }
}

export interface StorefrontCategoryDetail {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent?: { id: string; name: string; slug: string } | null;
  subcategories?: { id: string; name: string; slug: string; description?: string | null }[];
}

/**
 * Fetches dynamic category details and subcategories for the PLP by slug.
 * Zero hardcoded fallbacks.
 */
export async function getCategoryBySlugAction(
  slug: string
): Promise<{ success: boolean; category: StorefrontCategoryDetail | null }> {
  if (slug === "all") {
    return {
      success: true,
      category: {
        name: "All Products",
        slug: "all",
        description: "Browse all curated toys, creative gifts, and modern lifestyle items.",
        subcategories: [],
      },
    };
  }

  if (slug === "deals") {
    return {
      success: true,
      category: {
        name: "Deals Zone",
        slug: "deals",
        description: "Special curated offers, seasonal promotions, and discounted combos.",
        subcategories: [],
      },
    };
  }

  try {
    const insforge = await createInsforgeServer();

    // 1. Fetch category by slug
    const { data: cat, error } = await insforge.database
      .from("categories")
      .select("id, name, slug, description, image_url, parent_id, is_active")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !cat || !cat.is_active) {
      return { success: false, category: null };
    }

    let parentInfo: { id: string; name: string; slug: string } | null = null;
    let subcategories: { id: string; name: string; slug: string; description?: string | null }[] = [];

    if (cat.parent_id) {
      // Subcategory: fetch parent info
      const { data: parentCat } = await insforge.database
        .from("categories")
        .select("id, name, slug, is_active")
        .eq("id", cat.parent_id)
        .maybeSingle();

      if (!parentCat || !parentCat.is_active) {
        return { success: false, category: null };
      }

      parentInfo = {
        id: parentCat.id,
        name: parentCat.name,
        slug: parentCat.slug,
      };
    } else {
      // Parent category: fetch active child subcategories
      const { data: subs } = await insforge.database
        .from("categories")
        .select("id, name, slug, description")
        .eq("parent_id", cat.id)
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });

      if (subs) {
        subcategories = subs;
      }
    }

    return {
      success: true,
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image_url,
        parent: parentInfo,
        subcategories,
      },
    };
  } catch (err) {
    console.error("[getCategoryBySlugAction] Error:", err);
    return { success: false, category: null };
  }
}

