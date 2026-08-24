"use client";

import { useState, useMemo } from "react";
import { CategoryHeader } from "@/components/storefront/CategoryHeader";
import { FilterSidebar, type FilterState } from "@/components/storefront/FilterSidebar";
import { ProductToolbar, type SortOption, type ViewMode } from "@/components/storefront/ProductToolbar";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductListRow } from "@/components/storefront/ProductListRow";
import type { Product } from "@/types";
import type { CategoryMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const INITIAL_FILTERS: FilterState = {
  ageRanges: [],
  minPrice: 0,
  maxPrice: 10000,
  tags: [],
  inStockOnly: false,
};

type Props = {
  category: CategoryMeta;
  initialProducts: Product[];
  initialSubCategorySlug?: string;
};

export function PLPClient({
  category,
  initialProducts,
  initialSubCategorySlug = "",
}: Props) {
  const [activeSubCategorySlug, setActiveSubCategorySlug] = useState<string>(
    initialSubCategorySlug
  );
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Active subcategory name for toolbar chip
  const activeSubCategory = category.subcategories?.find(
    (s) => s.slug === activeSubCategorySlug
  );

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Subcategory filter
      if (activeSubCategorySlug) {
        const matchesCategory =
          product.categorySlug === activeSubCategorySlug ||
          product.subCategorySlug === activeSubCategorySlug;
        if (!matchesCategory) return false;
      }

      // 2. Age Range filter
      if (filters.ageRanges.length > 0) {
        if (!product.ageRange || !filters.ageRanges.includes(product.ageRange)) {
          if (product.ageRange !== "all") {
            return false;
          }
        }
      }

      // 3. Price Range filter
      if (
        product.price < filters.minPrice ||
        product.price > filters.maxPrice
      ) {
        return false;
      }

      // 4. Skills / Theme tags
      if (filters.tags.length > 0) {
        if (
          !product.tags ||
          !filters.tags.some((t) => product.tags?.includes(t))
        ) {
          return false;
        }
      }

      // 5. In-stock only
      if (filters.inStockOnly && product.isOutOfStock) {
        return false;
      }

      return true;
    });
  }, [initialProducts, activeSubCategorySlug, filters]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => a.price - b.price);
      case "price_desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.reverse();
      case "featured":
      default:
        return list;
    }
  }, [filteredProducts, sort]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  function handleFilterChange(newFilters: FilterState) {
    setFilters(newFilters);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setFilters(INITIAL_FILTERS);
    setActiveSubCategorySlug("");
    setCurrentPage(1);
  }

  function handleSelectSubCategory(slug: string) {
    setActiveSubCategorySlug(slug);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Category Header Banner */}
      <CategoryHeader
        category={category}
        activeSubCategorySlug={activeSubCategorySlug}
        onSelectSubCategory={handleSelectSubCategory}
      />

      {/* 2. Main Layout: Left Sidebar + Product Grid */}
      <div className="flex items-start gap-6 lg:gap-8">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Right Product Listing Area */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Toolbar */}
          <ProductToolbar
            totalCount={initialProducts.length}
            filteredCount={sortedProducts.length}
            filters={filters}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            activeSubCategoryName={activeSubCategory?.name}
            onClearSubCategory={() => setActiveSubCategorySlug("")}
          />

          {/* Product Cards Container */}
          {paginatedProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {paginatedProducts.map((product) => (
                  <ProductListRow key={product.id} product={product} />
                ))}
              </div>
            )
          ) : (
            /* Empty State */
            <div className="bg-surface border border-neutral-border rounded-2xl p-10 sm:p-14 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-primary-surface flex items-center justify-center mx-auto text-primary mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-dark">
                No matching products found
              </h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-muted max-w-md mx-auto mt-1.5 leading-relaxed">
                We couldn&apos;t find any items matching your selected filters. Try
                broadening your price range or clearing age filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 inline-flex items-center gap-2 bg-primary text-white hover:bg-tertiary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-neutral-border/60 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3.5 py-2 rounded-xl border border-neutral-border bg-surface text-xs font-semibold text-neutral-dark hover:border-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={cn(
                    "w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                    currentPage === p
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-neutral-border text-neutral-dark hover:border-primary hover:bg-neutral-bg"
                  )}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-3.5 py-2 rounded-xl border border-neutral-border bg-surface text-xs font-semibold text-neutral-dark hover:border-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
