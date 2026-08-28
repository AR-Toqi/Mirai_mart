import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";

export const metadata: Metadata = {
  title: "Blog | Mirai Mart",
  description: "Gift guides and product tips from Mirai Mart.",
};

export default function BlogPage() {
  return (
    <StaticPageLayout
      title="Blog"
      lead="Gift guides and product tips from the Mirai Mart team."
    >
      <div className="space-y-4 text-sm leading-relaxed text-neutral-muted">
        <p>Our blog is coming soon. Please check back later.</p>
        <Link
          href="/category/all"
          className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-95"
        >
          Browse products
        </Link>
      </div>
    </StaticPageLayout>
  );
}
