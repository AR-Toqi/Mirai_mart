import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminPromotionsAction } from "@/actions/promotions";
import { AdminPromosClient } from "@/components/admin/AdminPromosClient";

export const metadata: Metadata = {
  title: "Promo Codes & Coupons — Mirai Mart Admin",
  description: "Create and manage promotional discount vouchers, free shipping coupons, and usage restrictions.",
};

export default async function AdminPromosPage() {
  const result = await getAdminPromotionsAction();

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
      <AdminPromosClient initialPromotions={result.promotions} />
    </Suspense>
  );
}
