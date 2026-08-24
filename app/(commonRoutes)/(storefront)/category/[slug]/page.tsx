import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLPClient } from "@/components/storefront/PLPClient";
import { CATEGORIES_META, ALL_PRODUCTS } from "@/lib/mock-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    sub?: string;
    age?: string;
    sort?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES_META[slug] || CATEGORIES_META["all"];

  if (!category) {
    return {
      title: "Category Not Found | Mirai Mart",
    };
  }

  return {
    title: `${category.name} | Curated Collection — Mirai Mart`,
    description:
      category.description ||
      "Discover curated educational toys, STEM gadgets, and celebration gift combos at Mirai Mart.",
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialSub = resolvedSearchParams.sub || "";

  // 1. Resolve Category Metadata
  const category =
    CATEGORIES_META[slug] ||
    Object.values(CATEGORIES_META).find(
      (c) =>
        c.slug === slug || c.subcategories.some((sub) => sub.slug === slug)
    ) ||
    CATEGORIES_META["all"];

  if (!category && slug !== "all") {
    notFound();
  }

  // 2. Filter initial products for this category
  const initialProducts = ALL_PRODUCTS.filter((product) => {
    if (slug === "all") return true;
    if (slug === "deals") return !!product.badge && product.badge.includes("%");
    if (slug === "new-arrivals") return product.badge === "New";
    if (slug === "best-sellers") return product.badge === "Bestseller";

    return (
      product.categorySlug === slug ||
      product.subCategorySlug === slug ||
      (category.subcategories &&
        category.subcategories.some((sub) => sub.slug === product.categorySlug))
    );
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PLPClient
        category={category}
        initialProducts={initialProducts.length > 0 ? initialProducts : ALL_PRODUCTS}
        initialSubCategorySlug={initialSub}
      />
    </main>
  );
}
