import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";

export const metadata: Metadata = {
  title: "Careers | Mirai Mart",
  description: "Open roles and hiring updates at Mirai Mart.",
};

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers"
      lead="Join the team that curates play, learning, and discovery."
    >
      <div className="space-y-4 text-sm leading-relaxed text-neutral-muted">
        <p>We have no open roles right now. Please check back later.</p>
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
