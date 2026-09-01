import type { Metadata } from "next";
import { CompareClient } from "@/components/storefront/CompareClient";
import { mockProducts } from "@/lib/mock-data";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "Compare Products — Mirai Mart",
  description:
    "Compare specifications, age suitability, and curator recommendations side-by-side on Mirai Mart.",
};

export default async function ComparePage() {
  let products: Product[] = mockProducts;

  try {
    const insforge = await createInsforgeServer();
    const { data, error } = await insforge
      .from("products")
      .select(`
        id,
        title,
        slug,
        description,
        curator_notes,
        age_range,
        specs,
        is_active,
        categories (name, slug),
        product_variants (id, sku, price, compare_at_price, stock_quantity, images)
      `)
      .eq("is_active", true)
      .limit(20);

    if (!error && data && data.length > 0) {
      // Map DB schema to Product type if available
      products = data.map((d: any) => {
        const defaultVariant = d.product_variants?.[0];
        const rawImages = defaultVariant?.images || [];
        const imageUrl = Array.isArray(rawImages) && rawImages.length > 0 ? rawImages[0] : "";

        return {
          id: d.id,
          title: d.title,
          slug: d.slug,
          category: d.categories?.name || "General",
          categorySlug: d.categories?.slug,
          price: defaultVariant?.price ? Number(defaultVariant.price) : 0,
          compareAtPrice: defaultVariant?.compare_at_price ? Number(defaultVariant.compare_at_price) : undefined,
          rating: 4.8,
          reviewCount: 12,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop",
          curatorNotes: d.curator_notes,
          ageRange: d.age_range,
          specs: d.specs || {},
          isOutOfStock: (defaultVariant?.stock_quantity ?? 0) <= 0,
        };
      });
    }
  } catch (err) {
    console.warn("[ComparePage] Error fetching DB products, fallback to catalog:", err);
  }

  return <CompareClient catalogProducts={products} />;
}
