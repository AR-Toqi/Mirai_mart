import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLPClient } from "@/components/storefront/PLPClient";
import { getFilteredProducts } from "@/actions/products";
import { getCategoryBySlugAction } from "@/actions/categories";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { CategoryMeta } from "@/lib/mock-data";

/**
 * ISR: Category catalog pages are cached at edge/server with 1-hour background revalidation,
 * or on-demand when orders or admin CMS update inventory via revalidatePath / revalidateTag.
 */
export const revalidate = 3600;

/**
 * Pre-generate static routes for all primary and secondary category pages from the database
 */
export async function generateStaticParams() {
  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.database
      .from("categories")
      .select("slug")
      .eq("is_active", true);

    const slugs = (data || []).map((c: any) => c.slug);
    return ["all", "deals", ...slugs].map((slug) => ({ slug }));
  } catch {
    return [{ slug: "all" }, { slug: "deals" }];
  }
}

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

  const { category } = await getCategoryBySlugAction(slug);

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

  // 1. Resolve Category from Database
  const { category: dbCategory } = await getCategoryBySlugAction(slug);

  if (!dbCategory && slug !== "all") {
    notFound();
  }

  // Construct typed CategoryMeta shape for PLPClient
  const categoryMeta: CategoryMeta = {
    id: dbCategory?.id || slug,
    name: dbCategory?.name || "All Products",
    slug: dbCategory?.slug || slug,
    headline: dbCategory?.name || "All Products",
    description:
      dbCategory?.description ||
      "Discover handcrafted Montessori toys, STEM electronic gadgets, ambient home decor, and ready-to-gift celebration hampers at Mirai Mart.",
    bannerImage: dbCategory?.image_url || undefined,
    showAgeFilter: true,
    subcategories: (dbCategory?.subcategories || []).map((sub) => ({
      id: sub.id || sub.slug,
      name: sub.name,
      slug: sub.slug,
      description: sub.description || undefined,
    })),
  };

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
        category={categoryMeta}
        initialProducts={filterResult.products}
        initialSubCategorySlug={initialSub}
        initialQuery={initialQuery}
      />
    </main>
  );
}
