import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Shipping Policy | Mirai Mart",
  description: "How Mirai Mart processes, ships, and delivers your order.",
};

const sections = [
  {
    heading: "Processing time",
    body: "This section explains how long we take to prepare an order before it ships.",
  },
  {
    heading: "Delivery areas",
    body: "This section lists the places we deliver to.",
  },
  {
    heading: "Delivery time",
    body: "This section explains how long delivery takes after an order ships.",
  },
  {
    heading: "Delivery fees",
    body: "This section explains delivery costs and the order value that earns free delivery.",
  },
];

export default function ShippingPage() {
  return (
    <StaticPageLayout
      title="Shipping Policy"
      lead="How Mirai Mart processes, ships, and delivers your order."
      notice="Our final shipping policy is under review. The sections below show what the policy will cover. For help with a current order, please contact us."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <StaticSection key={section.heading} heading={section.heading}>
            {section.body}
          </StaticSection>
        ))}
        <p className="text-sm leading-relaxed text-neutral-muted">
          To follow an order that has shipped, use{" "}
          <Link href="/track-order" className="text-primary hover:underline">
            Track Your Order
          </Link>
          .
        </p>
      </div>
    </StaticPageLayout>
  );
}
