import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Contact Us | Mirai Mart",
  description: "How to reach the Mirai Mart team for help with your order.",
};

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      lead="Have a question about a product or an order? Here is how to reach us."
    >
      <div className="space-y-6">
        <StaticSection heading="Order help">
          To check an order, use{" "}
          <Link href="/track-order" className="text-primary hover:underline">
            Track Your Order
          </Link>{" "}
          or sign in to your{" "}
          <Link href="/account" className="text-primary hover:underline">
            account
          </Link>
          .
        </StaticSection>
        <StaticSection heading="Common questions">
          Many answers are on our{" "}
          <Link href="/faq" className="text-primary hover:underline">
            FAQ
          </Link>{" "}
          page.
        </StaticSection>
        <StaticSection heading="Direct contact">
          We will list our support email and phone number here soon.
        </StaticSection>
      </div>
    </StaticPageLayout>
  );
}
