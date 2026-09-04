import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Customers — Mirai Mart Admin",
};

export default function AdminCustomersPage() {
  return (
    <AdminSectionPlaceholder
      title="Customer CRM & Profiles"
      description="View registered accounts, lifetime purchase value, and delivery addresses."
      featurePhase="Admin Customer Management"
      upcomingFeatures={[
        "Customer profile list with registration date and order history counts",
        "Lifetime spend (LTV) and average order value (AOV) per customer",
        "Direct email and order lookup shortcuts",
        "Role assignment and account access controls",
      ]}
    />
  );
}
