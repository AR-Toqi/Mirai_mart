import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Categories — Mirai Mart Admin",
};

export default function AdminCategoriesPage() {
  return (
    <AdminSectionPlaceholder
      title="Category Hierarchy CMS"
      description="Organize store departments, gift combo collections, and subcategories."
      featurePhase="Admin Catalog Management"
      upcomingFeatures={[
        "Hierarchical category tree with parent-child relationships",
        "Category banner and thumbnail image management",
        "Curated collection tags (Montessori, Tech Gadgets, Gift Combos)",
        "Display order and navigation menu positioning",
      ]}
    />
  );
}
