import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Settings — Mirai Mart Admin",
};

export default function AdminSettingsPage() {
  return (
    <AdminSectionPlaceholder
      title="Store Settings & Configuration"
      description="Shipping rates, delivery zones, MFS payment accounts, and staff administration."
      featurePhase="Admin Store Configuration"
      upcomingFeatures={[
        "Delivery zone rates: Inside Dhaka (৳80) & Outside Dhaka (৳120)",
        "Free shipping threshold configuration (default ৳3,000)",
        "MFS Merchant accounts (bKash & Nagad) and transaction verification modes",
        "Staff permissions and store manager role delegation",
      ]}
    />
  );
}
