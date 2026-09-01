import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountDashboardClient } from "@/components/account/AccountDashboardClient";

export const metadata: Metadata = {
  title: "My Account — Mirai Mart",
  description: "Manage your profile, view orders, and track shipments on Mirai Mart.",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-neutral-muted">Loading account...</div>}>
      <AccountDashboardClient />
    </Suspense>
  );
}
