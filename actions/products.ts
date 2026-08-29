"use server";

import { createInsforgeServer } from "@/lib/insforge-server";
import {
  productFilterSchema,
  type ProductFilterInput,
} from "@/lib/validations/products.schema";
import { ALL_PRODUCTS } from "@/lib/mock-data";
import type { Product, ProductRecord, ProductVariantRecord, CategoryRecord } from "@/types";

type FilteredProductsResult = {
  success: boolean;
  products: Product[];
  total: number;
  error?: string;
};

/**
 * Maps database product and variant records to storefront Product type
 */
/**
 * Maps database product and variant records to storefront Product type
 */
function mapRecordToProduct(
  p: ProductRecord,
  variants: ProductVariantRecord[] = [],
  cat?: CategoryRecord
): Product {
  const defaultVariant = variants.find((v) => v.is_default) || variants[0];
  const matchingMock = ALL_PRODUCTS.find(
    (item) => item.slug === p.slug || item.id === p.id
  );

  const primaryImage =
    defaultVariant?.images?.[0] ||
    matchingMock?.imageUrl ||
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800";

  const specsImages = Array.isArray(p.specs?.images) ? (p.specs.images as string[]) : [];
  const mockImages = matchingMock?.images || [];

  const allImages = Array.from(
    new Set([
      primaryImage,
      ...(variants.flatMap((v) => v.images || [])),
      ...specsImages,
      ...mockImages,
    ])
  ).filter(Boolean);

  const isOutOfStock =
    variants.length > 0 && variants.every((v) => (v.stock_quantity ?? 0) <= 0);

  const tags = (p.specs?.tags as string[]) || (p.specs?.skills as string[]) || matchingMock?.tags || [];
  const features = (p.specs?.features as string[]) || matchingMock?.features || undefined;
  const safetyCertifications =
    (p.specs?.safetyCertifications as string[]) || matchingMock?.safetyCertifications || undefined;
  const inBoxItems = (p.specs?.inBoxItems as string[]) || matchingMock?.inBoxItems || undefined;

  const mappedVariants = variants.map((v) => {
    const matchingMockVariant = matchingMock?.variants?.find(
      (mv) => mv.sku === v.sku || mv.title === v.title
    );
    const variantImages =
      Array.isArray(v.images) && v.images.length > 0
        ? v.images
        : matchingMockVariant?.images || (mockImages.length > 0 ? mockImages : [primaryImage]);

    return {
      id: v.id,
      sku: v.sku,
      title: v.title,
      price: v.price,
      compareAtPrice: v.compare_at_price ?? undefined,
      stockQuantity: v.stock_quantity,
      attributes: v.attributes,
      images: variantImages,
      isDefault: v.is_default,
    };
  });

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    sku: defaultVariant?.sku || undefined,
    category: cat?.name || "General",
    categorySlug: cat?.slug || "all",
    price: defaultVariant?.price ?? 0,
    compareAtPrice: defaultVariant?.compare_at_price ?? undefined,
    rating: (p.specs?.rating as number) ?? 4.8,
    reviewCount: (p.specs?.review_count as number) ?? 12,
    imageUrl: primaryImage,
    images: allImages.length > 0 ? allImages : [primaryImage],
    badge: (p.badge as Product["badge"]) || undefined,
    isOutOfStock,
    ageRange: p.age_range || "all",
    tags,
    description: p.description,
    curatorNotes: p.curator_notes || undefined,
    features,
    specs: p.specs as Record<string, string | number | string[]>,
    safetyCertifications,
    inBoxItems,
    variants: mappedVariants.length > 0 ? mappedVariants : undefined,
  };
}

const PARENT_CATEGORY_MAP: Record<string, string[]> = {
  "baby-kids": [
    "baby-kids",
    "educational-toys",
    "cars-vehicles",
    "unique-toys",
    "puzzles-games",
    "newborn-babies",
  ],
  "gift-combos": [
    "gift-combos",
    "newborn-babies",
    "birthday-babies",
    "home-decor-gifts",
    "gadget-bundles",
  ],
  "digital-gadgets": [
    "digital-gadgets",
    "smart-gadgets",
    "planetarium-lights",
    "coding-robots",
    "kids-smartwatches",
    "desk-tech",
  ],
  "home-decor": [
    "home-decor",
    "ambient-lighting",
    "wall-shelves",
    "kinetic-sculptures",
    "nursery-decor",
    "home-decor-gifts",
  ],
};

/**
 * Pure fallback filter function against mock data
 */
function filterMockProducts(filters: ProductFilterInput): Product[] {
  let list = [...ALL_PRODUCTS];

  // 1. Category / Subcategory
  if (filters.category && filters.category !== "all") {
    const cat = filters.category.toLowerCase();
    if (cat === "deals") {
      list = list.filter((p) => !!p.badge && p.badge.includes("%"));
    } else if (cat === "new-arrivals") {
      list = list.filter((p) => p.badge === "New");
    } else if (cat === "best-sellers") {
      list = list.filter((p) => p.badge === "Bestseller");
    } else if (PARENT_CATEGORY_MAP[cat]) {
      const allowed = PARENT_CATEGORY_MAP[cat];
      list = list.filter(
        (p) =>
          (p.categorySlug && allowed.includes(p.categorySlug.toLowerCase())) ||
          (p.subCategorySlug && allowed.includes(p.subCategorySlug.toLowerCase()))
      );
    } else {
      list = list.filter(
        (p) =>
          p.categorySlug?.toLowerCase() === cat ||
          p.subCategorySlug?.toLowerCase() === cat
      );
    }
  }

  // 2. Subcategory specific
  if (filters.subCategory) {
    const sub = filters.subCategory.toLowerCase();
    list = list.filter(
      (p) =>
        p.subCategorySlug?.toLowerCase() === sub ||
        p.categorySlug?.toLowerCase() === sub
    );
  }

  // 3. Search query
  if (filters.query) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  // 4. Age ranges
  if (filters.ageRanges && filters.ageRanges.length > 0) {
    list = list.filter(
      (p) =>
        !p.ageRange ||
        p.ageRange === "all" ||
        filters.ageRanges?.includes(p.ageRange)
    );
  }

  // 5. Price bounds
  if (filters.minPrice !== undefined) {
    list = list.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= filters.maxPrice);
  }

  // 6. Tags
  if (filters.tags && filters.tags.length > 0) {
    list = list.filter((p) =>
      filters.tags?.some((t) => p.tags?.includes(t))
    );
  }

  // 7. In stock only
  if (filters.inStockOnly) {
    list = list.filter((p) => !p.isOutOfStock);
  }

  // 8. Sorting
  switch (filters.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list.reverse();
      break;
    case "featured":
    default:
      break;
  }

  return list;
}

/**
 * Server Action to fetch products matching dynamic filter criteria
 */
export async function getFilteredProducts(
  rawFilters: Partial<ProductFilterInput> = {}
): Promise<FilteredProductsResult> {
  try {
    const filters = productFilterSchema.parse(rawFilters);
    const insforge = await createInsforgeServer();

    // Query InsForge PostgreSQL products table
    let query = insforge.database
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("is_active", true);

    // 1. Text search
    if (filters.query) {
      query = query.ilike("title", `%${filters.query}%`);
    }

    // 2. Age range filter
    if (filters.ageRanges && filters.ageRanges.length > 0) {
      query = query.in("age_range", filters.ageRanges);
    }

    const { data: dbProducts, error } = await query;

    if (error || !dbProducts || dbProducts.length === 0) {
      // Fallback to mock catalog
      const fallbackList = filterMockProducts(filters);
      return {
        success: true,
        products: fallbackList,
        total: fallbackList.length,
      };
    }

    // Map database records
    let mappedProducts: Product[] = (dbProducts as (ProductRecord & {
      category?: CategoryRecord;
      variants?: ProductVariantRecord[];
    })[]).map((p) =>
      mapRecordToProduct(p, p.variants || [], p.category)
    );

    // Apply client-friendly price and sorting bounds
    if (filters.category && filters.category !== "all") {
      const cat = filters.category.toLowerCase();
      mappedProducts = mappedProducts.filter(
        (p) =>
          p.categorySlug?.toLowerCase() === cat ||
          p.subCategorySlug?.toLowerCase() === cat
      );
    }

    if (filters.minPrice !== undefined) {
      mappedProducts = mappedProducts.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      mappedProducts = mappedProducts.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.inStockOnly) {
      mappedProducts = mappedProducts.filter((p) => !p.isOutOfStock);
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        mappedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        mappedProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        mappedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        mappedProducts.reverse();
        break;
      default:
        break;
    }

    if (mappedProducts.length === 0) {
      // If DB has active products but none matched exact sub-filter, fallback to mock data
      const fallbackList = filterMockProducts(filters);
      return {
        success: true,
        products: fallbackList,
        total: fallbackList.length,
      };
    }

    return {
      success: true,
      products: mappedProducts,
      total: mappedProducts.length,
    };
  } catch (error) {
    console.error("[actions/products/getFilteredProducts]", error);
    // Graceful fallback to mock data on error
    const fallbackList = filterMockProducts(
      productFilterSchema.parse(rawFilters)
    );
    return {
      success: true,
      products: fallbackList,
      total: fallbackList.length,
    };
  }
}

/**
 * Server Action to fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge.database
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      const mockProduct = ALL_PRODUCTS.find((p) => p.slug === slug);
      return mockProduct || null;
    }

    const record = data as ProductRecord & {
      category?: CategoryRecord;
      variants?: ProductVariantRecord[];
    };
    return mapRecordToProduct(record, record.variants || [], record.category);
  } catch (error) {
    console.error("[actions/products/getProductBySlug]", error);
    return ALL_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Server Action to fetch related products from same category
 */
export async function getRelatedProducts(
  categorySlug?: string,
  currentProductId?: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    let list = ALL_PRODUCTS.filter((p) => p.id !== currentProductId);

    if (categorySlug && categorySlug !== "all") {
      const cat = categorySlug.toLowerCase();
      const categoryMatches = list.filter(
        (p) =>
          p.categorySlug?.toLowerCase() === cat ||
          p.subCategorySlug?.toLowerCase() === cat
      );
      if (categoryMatches.length > 0) {
        list = categoryMatches;
      }
    }

    return list.slice(0, limit);
  } catch (error) {
    console.error("[actions/products/getRelatedProducts]", error);
    return ALL_PRODUCTS.filter((p) => p.id !== currentProductId).slice(0, limit);
  }
}

