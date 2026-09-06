"use client";

import { useState, useMemo } from "react";
import {
  type AdminProductItem,
  toggleAdminProductStatusAction,
  deleteAdminProductAction,
} from "@/actions/admin";
import { AdminProductFilters, type FilterState } from "./AdminProductFilters";
import { AdminProductTable } from "./AdminProductTable";
import { Trash2, AlertTriangle, X } from "lucide-react";

type Props = {
  initialProducts: AdminProductItem[];
};

export function AdminProductsClient({ initialProducts }: Props) {
  // Master product list (optimistic updates)
  const [products, setProducts] = useState<AdminProductItem[]>(initialProducts);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "all",
    status: "all",
    stockFilter: "all",
    minPrice: "",
    maxPrice: "",
    badge: "all",
    sortBy: "newest",
  });

  // UI state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);

  // Notification Banner (as shown in Product_screen.jpeg)
  const [alertBanner, setAlertBanner] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<AdminProductItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories from items
  const categoryOptions = useMemo(() => {
    const unique = new Map<string, string>();
    products.forEach((p) => {
      if (p.category) {
        unique.set(p.categorySlug || p.category.toLowerCase().replace(/\s+/g, "-"), p.category);
      }
    });

    return Array.from(unique.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [products]);

  // Count active advanced filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.stockFilter !== "all") count++;
    if (filters.minPrice.trim() !== "") count++;
    if (filters.maxPrice.trim() !== "") count++;
    if (filters.badge !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  }, [filters]);

  // Handle single filter change
  function handleFilterChange<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 upon filtering
  }

  // Reset all filters
  function handleResetFilters() {
    setFilters({
      searchQuery: "",
      category: "all",
      status: "all",
      stockFilter: "all",
      minPrice: "",
      maxPrice: "",
      badge: "all",
      sortBy: "newest",
    });
    setCurrentPage(1);
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // 1. Search query (title, SKU, subtitle)
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchSku = item.sku.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchSubtitle = item.subtitle?.toLowerCase().includes(q);
          if (!matchTitle && !matchSku && !matchCategory && !matchSubtitle) {
            return false;
          }
        }

        // 2. Category
        if (filters.category !== "all") {
          const matchSlug = item.categorySlug === filters.category;
          const matchName = item.category.toLowerCase().replace(/\s+/g, "-") === filters.category;
          if (!matchSlug && !matchName) return false;
        }

        // 3. Status
        if (filters.status !== "all" && item.status !== filters.status) {
          return false;
        }

        // 4. Stock level
        if (filters.stockFilter === "in_stock" && item.stock <= 5) return false;
        if (filters.stockFilter === "low_stock" && (item.stock === 0 || item.stock > 5)) return false;
        if (filters.stockFilter === "out_of_stock" && item.stock !== 0) return false;

        // 5. Price range
        if (filters.minPrice && item.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && item.price > Number(filters.maxPrice)) return false;

        // 6. Badge
        if (filters.badge !== "all" && item.badge !== filters.badge) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        if (filters.sortBy === "stock_asc") return a.stock - b.stock;
        // Default newest first
        return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      });
  }, [products, filters]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Toggle active/draft status
  async function handleToggleStatus(id: string, currentStatus: "active" | "draft") {
    const nextStatus = currentStatus === "active" ? "draft" : "active";
    const prevProducts = [...products];

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
    );
    setIsMutatingId(id);

    try {
      const res = await toggleAdminProductStatusAction(id, nextStatus === "active");
      if (!res.success) {
        throw new Error(res.error || "Failed to update status");
      }
      setAlertBanner({
        type: "success",
        message: `Product status updated to ${nextStatus.toUpperCase()}.`,
      });
    } catch (err: any) {
      console.error(err);
      // Rollback
      setProducts(prevProducts);
      setAlertBanner({
        type: "error",
        message: "Something went wrong while updating status. Please try again.",
      });
    } finally {
      setIsMutatingId(null);
    }
  }

  // Delete product action
  async function handleConfirmDelete() {
    if (!productToDelete) return;
    setIsDeleting(true);

    const prevProducts = [...products];
    const deletedTitle = productToDelete.title;

    // Optimistic remove
    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

    try {
      const res = await deleteAdminProductAction(productToDelete.id);
      if (!res.success) {
        throw new Error(res.error || "Failed to delete");
      }
      setAlertBanner({
        type: "success",
        message: `Product "${deletedTitle}" was deleted successfully.`,
      });
      setProductToDelete(null);
    } catch (err: any) {
      console.error(err);
      // Rollback
      setProducts(prevProducts);
      setAlertBanner({
        type: "error",
        message: "Something went wrong. Could not delete product. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <AdminProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        categories={categoryOptions}
        activeFilterCount={activeFilterCount}
      />

      {/* Catalog Table Card */}
      <AdminProductTable
        products={paginatedProducts}
        totalFiltered={filteredProducts.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onToggleStatus={handleToggleStatus}
        onDeleteClick={(p) => setProductToDelete(p)}
        alertBanner={alertBanner}
        onDismissAlert={() => setAlertBanner(null)}
        isMutatingId={isMutatingId}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-dark/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface rounded-2xl border border-neutral-border p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-error-surface text-error flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-neutral-dark">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="p-1 rounded-lg text-neutral-muted hover:bg-neutral-bg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-sans text-sm text-neutral-muted">
              Are you sure you want to delete{" "}
              <strong className="text-neutral-dark">{productToDelete.title}</strong> (
              <span className="font-mono text-xs">{productToDelete.sku}</span>)? This action
              will remove it from the catalog.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-neutral-border text-xs sm:text-sm font-medium text-neutral-dark hover:bg-neutral-bg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error text-white text-xs sm:text-sm font-semibold hover:bg-error/90 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "Deleting..." : "Delete Product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
