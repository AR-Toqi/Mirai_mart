import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import { PDPClient } from "@/components/storefront/PDPClient";
import { ALL_PRODUCTS } from "@/lib/mock-data";

/**
 * ISR (Incremental Static Regeneration): Revalidate PDP catalog data at most once every hour,
 * or on-demand when orders or admin CMS update inventory via revalidatePath.
 */
export const revalidate = 3600;

/**
 * Pre-generate static routes for popular products at build time
 */
export async function generateStaticParams() {
  return ALL_PRODUCTS.slice(0, 20).map((product) => ({
    slug: product.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Mirai Mart",
      description: "The requested product is unavailable or does not exist.",
    };
  }

  return {
    title: `${product.title} | Mirai Mart`,
    description:
      product.description ||
      "Discover curated educational toys, creative developmental items, and gifts at Mirai Mart.",
    openGraph: {
      title: `${product.title} | Mirai Mart`,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Mirai Mart`,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.categorySlug,
    product.id,
    4
  );

  return <PDPClient product={product} relatedProducts={relatedProducts} />;
}
