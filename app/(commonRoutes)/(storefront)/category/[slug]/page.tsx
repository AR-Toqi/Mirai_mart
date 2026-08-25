import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLPClient } from "@/components/storefront/PLPClient";
import { getFilteredProducts } from "@/actions/products";
import { CATEGORIES_META } from "@/lib/mock-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    sub?: string;
    age?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    tags?: string;
    inStock?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams.q;

  const category = CATEGORIES_META[slug] || CATEGORIES_META["all"];

  if (query) {
    return {
      title: `Search: "${query}" | Mirai Mart`,
      description: `Browse curated products matching "${query}" at Mirai Mart.`,
    };
  }

  if (!category && slug !== "all") {
    return {
      title: "Category Not Found | Mirai Mart",
    };
  }

  const categoryName = category?.name || "Curated Collection";
  return {
    title: `${categoryName} | Mirai Mart`,
    description:
      category?.description ||
      "Discover handcrafted Montessori toys, STEM electronic gadgets, ambient home decor, and ready-to-gift celebration hampers at Mirai Mart.",
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialSub = resolvedSearchParams.sub || "";
  const initialQuery = resolvedSearchParams.q || "";

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

  // 2. Fetch products via Server Action
  const filterResult = await getFilteredProducts({
    category: slug,
    subCategory: initialSub || undefined,
    query: initialQuery || undefined,
    ageRanges: resolvedSearchParams.age
      ? resolvedSearchParams.age.split(",").filter(Boolean)
      : undefined,
    minPrice: resolvedSearchParams.minPrice
      ? Number(resolvedSearchParams.minPrice)
      : undefined,
    maxPrice: resolvedSearchParams.maxPrice
      ? Number(resolvedSearchParams.maxPrice)
      : undefined,
    tags: resolvedSearchParams.tags
      ? resolvedSearchParams.tags.split(",").filter(Boolean)
      : undefined,
    inStockOnly: resolvedSearchParams.inStock === "true",
    sort: (resolvedSearchParams.sort as any) || "featured",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <PLPClient
        category={category}
        initialProducts={filterResult.products}
        initialSubCategorySlug={initialSub}
        initialQuery={initialQuery}
      />
    </main>
  );
}
