import type { Metadata } from "next";
import { getAdminCategoriesAction } from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Add New Product — Mirai Mart Admin",
  description: "Create and publish a new product with real-time live preview.",
};

export default async function AddNewProductPage() {
  const { categories } = await getAdminCategoriesAction();

  return <ProductForm mode="create" categories={categories} />;
}
