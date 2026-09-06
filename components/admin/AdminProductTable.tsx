"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  AlertCircle,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import type { AdminProductItem } from "@/actions/admin";
import { formatCurrency } from "@/lib/utils";

type Props = {
  products: AdminProductItem[];
  totalFiltered: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string, currentStatus: "active" | "draft") => void;
  onDeleteClick: (product: AdminProductItem) => void;
  alertBanner: {
    type: "error" | "success";
    message: string;
  } | null;
  onDismissAlert: () => void;
  isMutatingId?: string | null;
};

export function AdminProductTable({
  products,
  totalFiltered,
  currentPage,
  pageSize,
  onPageChange,
  onToggleStatus,
  onDeleteClick,
  alertBanner,
  onDismissAlert,
  isMutatingId,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const startIndex = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalFiltered);

  // Pagination page numbers generator
  function renderPaginationPages() {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="bg-surface rounded-2xl border border-neutral-border shadow-xs overflow-hidden">
      {/* Inline Notification Alert Banner matching Product_screen.jpeg */}
      {alertBanner && (
        <div
          className={`flex items-center justify-between px-6 py-3 border-b text-xs sm:text-sm font-medium transition-all ${
            alertBanner.type === "error"
              ? "bg-error-surface border-error/20 text-error-foreground"
              : "bg-success-surface border-success/20 text-success-foreground"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle
              className={`w-4 h-4 flex-shrink-0 ${
                alertBanner.type === "error" ? "text-error" : "text-success"
              }`}
            />
            <span>{alertBanner.message}</span>
          </div>
          <button
            onClick={onDismissAlert}
            className="p-1 rounded-md hover:bg-black/5 text-neutral-muted hover:text-neutral-dark cursor-pointer transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Component */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[840px]">
          <thead>
            <tr className="border-b border-neutral-border/80 bg-neutral-bg/40">
              <th className="py-3.5 px-5 text-xs font-semibold text-neutral-muted uppercase tracking-wider w-20">
                Image
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                Product Name
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                SKU
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                Category
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                Stock
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                Price
              </th>
              <th className="py-3.5 px-4 text-xs font-semibold text-neutral-muted uppercase tracking-wider">
                Status
              </th>
              <th className="py-3.5 px-5 text-xs font-semibold text-neutral-muted uppercase tracking-wider text-right w-28">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-border/60">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-muted">
                      <Package className="w-6 h-6" />
                    </div>
                    <p className="font-heading font-semibold text-neutral-dark text-base">
                      No products found
                    </p>
                    <p className="text-xs text-neutral-muted max-w-sm">
                      Try adjusting your search query, clearing active filters, or adding a new product.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((item) => {
                const isOutOfStock = item.stock === 0;
                const isLowStock = item.stock > 0 && item.stock <= 5;
                const isMutating = isMutatingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-neutral-bg/40 transition-colors ${
                      isMutating ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    {/* Image Thumbnail */}
                    <td className="py-3.5 px-5">
                      <div className="w-14 h-14 rounded-xl bg-neutral-bg border border-neutral-border/60 overflow-hidden relative flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized={item.imageUrl.startsWith("http")}
                        />
                      </div>
                    </td>

                    {/* Product Name & Badges */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-semibold text-[15px] text-neutral-dark leading-snug">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                                item.badge === "New"
                                  ? "bg-success-light text-success"
                                  : item.badge === "Best Seller"
                                  ? "bg-primary-surface text-primary"
                                  : item.badge === "Sale"
                                  ? "bg-error-light text-error"
                                  : "bg-warning-light text-warning"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="font-sans text-xs text-neutral-muted truncate">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-xs text-neutral-muted">
                      <span className="bg-neutral-bg/80 border border-neutral-border/60 px-2 py-1 rounded-md">
                        {item.sku}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-sans text-xs font-medium text-neutral-dark">
                      {item.category}
                    </td>

                    {/* Stock Count */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-sans font-bold text-base sm:text-lg ${
                          isOutOfStock
                            ? "text-error"
                            : isLowStock
                            ? "text-warning"
                            : "text-neutral-dark"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    {/* Price in Bangladeshi Taka */}
                    <td className="py-3.5 px-4 font-sans font-bold text-sm sm:text-base text-neutral-dark whitespace-nowrap">
                      {formatCurrency(item.price)}
                    </td>

                    {/* Status Pill Badge matching Product_screen.jpeg */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleStatus(item.id, item.status)}
                        title="Click to toggle Active / Draft"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150 ${
                          item.status === "active"
                            ? "bg-success-light text-success hover:bg-success-light/80"
                            : "bg-neutral-muted/15 text-neutral-muted hover:bg-neutral-muted/25"
                        }`}
                      >
                        {item.status === "active" && (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>{item.status === "active" ? "Active" : "Draft"}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/${item.id}`}
                          title="Edit Product"
                          className="p-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-muted hover:text-primary transition-colors cursor-pointer shadow-2xs"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteClick(item)}
                          title="Delete Product"
                          className="p-2 rounded-xl border border-error/20 bg-error-surface/40 hover:bg-error-surface text-error transition-colors cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching Product_screen.jpeg */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-neutral-border/80 bg-surface">
        <p className="text-xs sm:text-sm text-neutral-muted">
          Showing <span className="font-semibold text-neutral-dark">{startIndex}</span>-
          <span className="font-semibold text-neutral-dark">{endIndex}</span> of{" "}
          <span className="font-semibold text-neutral-dark">{totalFiltered}</span> products
        </p>

        <div className="flex items-center gap-1.5">
          {/* Previous Page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex items-center justify-center p-2 rounded-xl border border-neutral-border text-neutral-muted hover:bg-neutral-bg hover:text-neutral-dark disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {renderPaginationPages().map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-neutral-muted select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "border border-neutral-border text-neutral-dark hover:bg-neutral-bg"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-neutral-border text-xs font-medium text-neutral-dark hover:bg-neutral-bg disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
