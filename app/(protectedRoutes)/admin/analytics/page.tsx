import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Analytics — Mirai Mart Admin",
};

export default function AdminAnalyticsPage() {
  return (
    <AdminSectionPlaceholder
      title="Storefront Analytics & Telemetry"
      description="PostHog event stream, conversion funnel drop-offs, and product performance."
      featurePhase="PostHog & Commerce Telemetry"
      upcomingFeatures={[
        "Product view to Add-to-cart conversion rates",
        "Cart checkout abandonment drop-off funnel",
        "Top search queries and zero-result search terms",
        "Revenue trends by delivery zone and category",
      ]}
    />
  );
}
