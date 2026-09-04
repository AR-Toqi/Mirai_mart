import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Products & Inventory — Mirai Mart Admin",
};

export default function AdminProductsPage() {
  return (
    <AdminSectionPlaceholder
      title="Products & Inventory CMS"
      description="Manage catalog items, dynamic category specs, stock levels, and media assets."
      featurePhase="Phase 5 — Feature 13"
      upcomingFeatures={[
        "Product catalog table with category & stock level filters",
        "Dynamic category-dependent attribute editor (age range vs gadget specs)",
        "Multi-variant SKU & price matrix editor",
        "Media drag-and-drop file uploader to InsForge Storage",
      ]}
    />
  );
}
