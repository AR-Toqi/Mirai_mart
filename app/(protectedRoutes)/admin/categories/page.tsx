import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminCategoriesDetailedAction } from "@/actions/categories";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = {
  title: "Categories & Subcategories — Mirai Mart Admin",
  description:
    "Organize store departments, subcategories, display orders, and storefront navigation. Zero hardcoded fallbacks.",
};

export default async function AdminCategoriesPage() {
  const result = await getAdminCategoriesDetailedAction();

  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-12 animate-pulse">
          <div className="h-8 w-64 bg-neutral-border/50 rounded-lg" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-border/30 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-neutral-border/30 rounded-2xl" />
        </div>
      }
    >
      <AdminCategoriesClient
        initialCategories={result.categories}
        initialParents={result.parentCategories}
        initialMetrics={result.metrics}
      />
    </Suspense>
  );
}
