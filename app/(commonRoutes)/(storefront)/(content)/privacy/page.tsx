import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { StaticSection } from "@/components/storefront/StaticSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Mirai Mart",
  description: "How Mirai Mart collects, uses, and protects your data.",
};

const sections = [
  {
    heading: "Information we collect",
    body: "This section explains the data we collect when you use the site.",
  },
  {
    heading: "How we use information",
    body: "This section explains why we use your data.",
  },
  {
    heading: "Cookies and analytics",
    body: "This section explains the cookies and analytics tools the site uses.",
  },
  {
    heading: "Data sharing",
    body: "This section explains when we share data with service providers.",
  },
  {
    heading: "Your choices",
    body: "This section explains how you can view, change, or remove your data.",
  },
  {
    heading: "Contact",
    body: "This section explains how to reach us about your privacy.",
  },
];

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      lead="How Mirai Mart collects, uses, and protects your data."
      notice="Our final privacy policy is under review. The sections below show what the policy will cover. For questions, please contact us."
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
