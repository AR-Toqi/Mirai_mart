import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { searchRequestSchema } from "@/lib/validations/products.schema";
import { ALL_PRODUCTS } from "@/lib/mock-data";
import type { ProductRecord, ProductVariantRecord, CategoryRecord } from "@/types";

export type SearchResultItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  imageUrl: string;
  badge?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQ = searchParams.get("q") || "";
    const rawCategory = searchParams.get("category") || undefined;
    const rawLimit = searchParams.get("limit") || "6";

    const parsed = searchRequestSchema.safeParse({
      q: rawQ,
      category: rawCategory,
      limit: rawLimit,
    });

    if (!parsed.success) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const { q, category, limit } = parsed.data;
    const queryTerm = q.trim().toLowerCase();

    // 1. Try querying InsForge PostgreSQL
    try {
      const insforge = await createInsforgeServer();
      let dbQuery = insforge.database
        .from("products")
        .select("*, category:categories(*), variants:product_variants(*)")
        .eq("is_active", true)
        .ilike("title", `%${queryTerm}%`)
        .limit(limit);

      const { data: dbProducts, error } = await dbQuery;

      if (!error && dbProducts && dbProducts.length > 0) {
        const results: SearchResultItem[] = (
          dbProducts as (ProductRecord & {
            category?: CategoryRecord;
            variants?: ProductVariantRecord[];
          })[]
        ).map((p) => {
          const defaultVariant =
            p.variants?.find((v) => v.is_default) || p.variants?.[0];
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category?.name || "General",
            categorySlug: p.category?.slug || "all",
            price: defaultVariant?.price ?? 0,
            imageUrl:
              defaultVariant?.images?.[0] ||
              "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400",
            badge: p.badge || undefined,
          };
        });

        return NextResponse.json(
          {
            success: true,
            data: results,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
            },
          }
        );
      }
    } catch {
      // Fallback to local catalog
    }

    // 2. Fallback search against ALL_PRODUCTS
    const filtered = ALL_PRODUCTS.filter((product) => {
      // Category constraint if specified
      if (
        category &&
        category !== "all" &&
        category !== "All Categories" &&
        product.category.toLowerCase() !== category.toLowerCase() &&
        product.categorySlug?.toLowerCase() !== category.toLowerCase()
      ) {
        return false;
      }

      const matchesTitle = product.title.toLowerCase().includes(queryTerm);
      const matchesCategory = product.category.toLowerCase().includes(queryTerm);
      const matchesDesc = product.description?.toLowerCase().includes(queryTerm);
      const matchesTags = product.tags?.some((t) =>
        t.toLowerCase().includes(queryTerm)
      );

      return matchesTitle || matchesCategory || matchesDesc || matchesTags;
    }).slice(0, limit);

    const results: SearchResultItem[] = filtered.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      categorySlug: p.categorySlug || "all",
      price: p.price,
      imageUrl: p.imageUrl,
      badge: p.badge,
    }));

    return NextResponse.json(
      {
        success: true,
        data: results,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[api/search]", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search query" },
      { status: 500 }
    );
  }
}
