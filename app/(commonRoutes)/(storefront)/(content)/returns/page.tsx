import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Returns & Refunds | Mirai Mart",
  description: "How to return an item and request a refund from Mirai Mart.",
};

const sections = [
  {
    heading: "Return window",
    body: "This section states how long you have to start a return after your order arrives.",
  },
  {
    heading: "Items you can return",
    body: "This section lists which products you can return and which items are final sale.",
  },
  {
    heading: "How to start a return",
    body: "This section explains the steps to request a return and receive a return label.",
  },
  {
    heading: "Refund method and timing",
    body: "This section explains how we send your refund and when it reaches you.",
  },
  {
    heading: "Damaged or wrong items",
    body: "This section explains what to do if an item arrives damaged or incorrect.",
  },
];

export default function ReturnsPage() {
  return (
    <StaticPageLayout
      title="Returns & Refunds"
      lead="How to return an item and request a refund from Mirai Mart."
      notice="Our final returns policy is under review. The sections below show what the policy will cover. For help with a current order, please contact us."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <StaticSection key={section.heading} heading={section.heading}>
            {section.body}
          </StaticSection>
        ))}
        <p className="text-sm leading-relaxed text-neutral-muted">
          Need help now? Visit our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>{" "}
          page.
        </p>
      </div>
    </StaticPageLayout>
  );
}
