import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  getAdminProductByIdAction,
  getAdminCategoriesAction,
} from "@/actions/admin";
import { ProductForm } from "@/components/admin/ProductForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const res = await getAdminProductByIdAction(id);
  const title = res.product?.title || "Edit Product";

  return {
    title: `${title} — Mirai Mart Admin`,
    description: `Edit specifications, pricing, inventory, and variants for ${title}.`,
  };
}

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productRes, categoriesRes] = await Promise.all([
    getAdminProductByIdAction(id),
    getAdminCategoriesAction(),
  ]);

  if (!productRes.success || !productRes.product) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-error-surface text-error flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-neutral-dark">
          Product Not Found
        </h2>
        <p className="font-sans text-sm text-neutral-muted">
          The requested product ID &quot;{id}&quot; could not be found in the database or catalog.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-95 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      mode="edit"
      initialData={productRes.product}
      categories={categoriesRes.categories}
    />
  );
}
