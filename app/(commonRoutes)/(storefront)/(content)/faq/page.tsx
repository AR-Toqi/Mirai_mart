import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "FAQ | Mirai Mart",
  description: "Answers to common questions about shopping with Mirai Mart.",
};

export default function FaqPage() {
  return (
    <StaticPageLayout
      title="Frequently Asked Questions"
      lead="Answers to common questions about shopping with Mirai Mart."
    >
      <div className="space-y-6">
        <StaticSection heading="How do I track my order?">
          Open{" "}
          <Link href="/track-order" className="text-primary hover:underline">
            Track Your Order
          </Link>{" "}
          or sign in to your account to see the latest status.
        </StaticSection>
        <StaticSection heading="Which payment methods can I use?">
          You can pay with Visa, Mastercard, American Express, bKash, and Nagad.
        </StaticSection>
        <StaticSection heading="Do you offer free delivery?">
          Yes. Orders over ৳ 999 qualify for free delivery.
        </StaticSection>
        <StaticSection heading="How do I return an item?">
          See{" "}
          <Link href="/returns" className="text-primary hover:underline">
            Returns &amp; Refunds
          </Link>{" "}
          for the full process.
        </StaticSection>
        <StaticSection heading="Is my payment secure?">
          Yes. We encrypt every payment.
        </StaticSection>
      </div>
    </StaticPageLayout>
  );
}
