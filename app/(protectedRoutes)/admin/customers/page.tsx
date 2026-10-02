import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getAdminCustomersAction } from "@/actions/customers";
import { AdminCustomersClient } from "@/components/admin/AdminCustomersClient";

export const metadata: Metadata = {
  title: "Customers Directory & CRM — Mirai Mart Admin",
  description:
    "View customer profiles, lifetime purchase value, contact shortcuts, and order ledgers.",
};

function CustomersSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* 4 KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-neutral-border/30 rounded-2xl p-5" />
        ))}
      </div>
      {/* Table container skeleton */}
      <div className="h-[520px] bg-neutral-border/30 rounded-2xl" />
    </div>
  );
}

async function CustomersDataLoader() {
  const result = await getAdminCustomersAction();

  return (
    <AdminCustomersClient
      initialCustomers={result.customers}
      initialMetrics={result.metrics}
    />
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<CustomersSkeleton />}>
      <CustomersDataLoader />
    </Suspense>
  );
}
