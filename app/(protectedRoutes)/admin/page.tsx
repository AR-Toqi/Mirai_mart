import type { Metadata } from "next";
import { getAdminDashboardMetricsAction } from "@/actions/admin";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Dashboard — Mirai Mart Admin",
  description: "Live store overview, sales metrics, and inventory health for Mirai Mart.",
};

export default async function AdminRootPage() {
  const metricsResult = await getAdminDashboardMetricsAction();

  return <AdminDashboardClient initialMetrics={metricsResult.data} />;
}
