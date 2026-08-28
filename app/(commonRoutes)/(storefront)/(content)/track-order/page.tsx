import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Track Your Order | Mirai Mart",
  description: "Check the status of your Mirai Mart order.",
};

export default function TrackOrderPage() {
  return (
    <StaticPageLayout
      title="Track Your Order"
      lead="Check the status of your Mirai Mart order."
      notice="Live order lookup is coming soon. Until then, sign in to your account to see order status."
    >
      <div className="space-y-6">
        <StaticSection heading="See your orders">
          Sign in to your{" "}
          <Link href="/account" className="text-primary hover:underline">
            account
          </Link>{" "}
          to view every order and its delivery status.
        </StaticSection>
        <StaticSection heading="Delivery details">
          Read our{" "}
          <Link href="/shipping" className="text-primary hover:underline">
            Shipping Policy
          </Link>{" "}
          to learn how long delivery takes.
        </StaticSection>
      </div>
    </StaticPageLayout>
  );
}
