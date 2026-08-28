import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Terms of Service | Mirai Mart",
  description: "The terms that govern your use of Mirai Mart.",
};

const sections = [
  {
    heading: "Use of the site",
    body: "This section explains the rules for using the Mirai Mart site.",
  },
  {
    heading: "Orders and pricing",
    body: "This section explains how we accept orders and how we set prices.",
  },
  {
    heading: "Accounts",
    body: "This section explains your duties when you create and use an account.",
  },
  {
    heading: "Intellectual property",
    body: "This section explains who owns the content and brand marks on the site.",
  },
  {
    heading: "Limitation of liability",
    body: "This section explains the limits of our responsibility.",
  },
  {
    heading: "Changes to these terms",
    body: "This section explains how we update these terms.",
  },
];

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      lead="The terms that govern your use of Mirai Mart."
      notice="Our final terms of service are under review. The sections below show what the terms will cover. For questions, please contact us."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <StaticSection key={section.heading} heading={section.heading}>
            {section.body}
          </StaticSection>
        ))}
      </div>
    </StaticPageLayout>
  );
}
