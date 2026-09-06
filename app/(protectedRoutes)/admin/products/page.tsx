import type { Metadata } from "next";
import { getAdminProductsAction } from "@/actions/admin";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = {
  title: "Products & Inventory — Mirai Mart Admin",
  description: "Manage product catalog items, stock levels, categories, and pricing.",
};

export default async function AdminProductsPage() {
  const result = await getAdminProductsAction();
  const initialProducts = result.success ? result.products : [];

  return <AdminProductsClient initialProducts={initialProducts} />;
}

