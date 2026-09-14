import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminOrdersAction } from "@/actions/admin";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = {
  title: "Orders & Fulfillment — Mirai Mart Admin",
  description: "Track customer orders, manage fulfillment logistics, assign courier tracking numbers, and process customer returns.",
};

export default async function AdminOrdersPage() {
  const initialData = await getAdminOrdersAction();

  return (
    <Suspense
      fallback={
        <div className="space-y-6 pb-12 animate-pulse">
          <div className="h-8 w-48 bg-neutral-border/50 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7 gap-3 sm:gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-border/30 rounded-2xl" />
            ))}
          </div>
          <div className="h-96 bg-neutral-border/30 rounded-2xl" />
        </div>
      }
    >
      <AdminOrdersClient initialData={initialData} />
    </Suspense>
  );
}

