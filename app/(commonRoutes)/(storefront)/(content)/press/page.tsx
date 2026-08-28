import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";

export const metadata: Metadata = {
  title: "Press | Mirai Mart",
  description: "Press kit and media contact for Mirai Mart.",
};

export default function PressPage() {
  return (
    <StaticPageLayout
      title="Press"
      lead="Media resources and contact for Mirai Mart."
    >
      <div className="space-y-4 text-sm leading-relaxed text-neutral-muted">
        <p>
          We will share our press kit and media contact here soon. For other
          questions, please use our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>{" "}
          page.
        </p>
      </div>
    </StaticPageLayout>
  );
}
