import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard — Mirai Mart",
  description: "Manage orders, inventory, and storefront promotions on Mirai Mart.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
