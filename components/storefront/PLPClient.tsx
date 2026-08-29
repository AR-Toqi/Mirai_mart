"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CategoryHeader } from "@/components/storefront/CategoryHeader";
import { FilterSidebar, type FilterState } from "@/components/storefront/FilterSidebar";
import { ProductToolbar, type SortOption, type ViewMode } from "@/components/storefront/ProductToolbar";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductListRow } from "@/components/storefront/ProductListRow";
import type { Product } from "@/types";
import type { CategoryMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

type Props = {
  category: CategoryMeta;
  initialProducts: Product[];
  initialSubCategorySlug?: string;
  initialQuery?: string;
};

export function PLPClient({
  category,
  initialProducts,
  initialSubCategorySlug = "",
  initialQuery = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL search params or props
  const urlSub = searchParams.get("sub") || initialSubCategorySlug;
  const urlQuery = searchParams.get("q") || initialQuery;
  const urlSort = (searchParams.get("sort") as SortOption) || "featured";
  const urlView = (searchParams.get("view") as ViewMode) || "grid";
  const urlMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const urlMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 10000;
  const urlAge = searchParams.get("age") ? searchParams.get("age")!.split(",").filter(Boolean) : [];
  const urlTags = searchParams.get("tags") ? searchParams.get("tags")!.split(",").filter(Boolean) : [];
  const urlInStock = searchParams.get("inStock") === "true";

  const [activeSubCategorySlug, setActiveSubCategorySlug] = useState<string>(urlSub);
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery);
  const [filters, setFilters] = useState<FilterState>({
    ageRanges: urlAge,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
    tags: urlTags,
    inStockOnly: urlInStock,
  });
  const [sort, setSort] = useState<SortOption>(urlSort);
  const [viewMode, setViewMode] = useState<ViewMode>(urlView);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Determine whether this category shows the Age Filter
  // (Only true for baby/kids/toy categories per user requirement)
  const showAgeFilter = useMemo(() => {
    if (typeof category.showAgeFilter === "boolean") {
      return category.showAgeFilter;
    }
    const kidsSlugs = [
      "educational-toys",
      "toys-games",
      "cars-vehicles",
      "unique-toys",
      "gift-combos",
      "newborn-babies",
      "birthday-babies",
      "baby-kids",
    ];
    return kidsSlugs.includes(category.slug);
  }, [category.showAgeFilter, category.slug]);

  // Active subcategory name for toolbar chip
  const activeSubCategory = category.subcategories?.find(
    (s) => s.slug === activeSubCategorySlug
  );

  // Sync state changes to URL query parameters
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }
      if (activeSubCategorySlug) {
        params.set("sub", activeSubCategorySlug);
      }
      if (showAgeFilter && filters.ageRanges.length > 0) {
        params.set("age", filters.ageRanges.join(","));
      }
      if (filters.minPrice > 0) {
        params.set("minPrice", String(filters.minPrice));
      }
      if (filters.maxPrice < 10000) {
        params.set("maxPrice", String(filters.maxPrice));
      }
      if (filters.tags.length > 0) {
        params.set("tags", filters.tags.join(","));
      }
      if (filters.inStockOnly) {
        params.set("inStock", "true");
      }
      if (sort !== "featured") {
        params.set("sort", sort);
      }
      if (viewMode !== "grid") {
        params.set("view", viewMode);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    }, 200);

    return () => clearTimeout(handler);
  }, [
    activeSubCategorySlug,
    searchQuery,
    filters,
    sort,
    viewMode,
    showAgeFilter,
    pathname,
    router,
  ]);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search Query filter (matches title, description, category, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 2. Subcategory filter
      if (activeSubCategorySlug) {
        const matchesCategory =
          product.categorySlug === activeSubCategorySlug ||
          product.subCategorySlug === activeSubCategorySlug;
        if (!matchesCategory) return false;
      }

      // 3. Age Range filter (Only applied if category supports age filtering)
      if (showAgeFilter && filters.ageRanges.length > 0) {
        if (!product.ageRange || !filters.ageRanges.includes(product.ageRange)) {
          if (product.ageRange !== "all") {
            return false;
          }
        }
      }

      // 4. Price Range filter (BDT ৳)
      if (
        product.price < filters.minPrice ||
        product.price > filters.maxPrice
      ) {
        return false;
      }

      // 5. Skills / Theme tags
      if (filters.tags.length > 0) {
        if (
          !product.tags ||
          !filters.tags.some((t) => product.tags?.includes(t))
        ) {
          return false;
        }
      }

      // 6. In-stock only
      if (filters.inStockOnly && product.isOutOfStock) {
        return false;
      }

      return true;
    });
  }, [
    initialProducts,
    searchQuery,
    activeSubCategorySlug,
    showAgeFilter,
    filters,
  ]);

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

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      ageRanges: [],
      minPrice: 0,
      maxPrice: 10000,
      tags: [],
      inStockOnly: false,
    });
    setActiveSubCategorySlug("");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  const handleSelectSubCategory = useCallback((slug: string) => {
    setActiveSubCategorySlug(slug);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Category Header Banner */}
      <CategoryHeader
        category={category}
        activeSubCategorySlug={activeSubCategorySlug}
        onSelectSubCategory={handleSelectSubCategory}
      />

      {/* Search Query Banner (if search is active) */}
      {searchQuery.trim() && (
        <div className="bg-primary-surface/50 border border-primary/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              🔍
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-neutral-dark">
                Search results for &ldquo;
                <span className="text-primary">{searchQuery.trim()}</span>
                &rdquo;
              </p>
              <p className="font-sans text-xs text-neutral-muted">
                Found {sortedProducts.length} matching item
                {sortedProducts.length === 1 ? "" : "s"} in this collection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearSearch}
            className="px-3 py-1.5 rounded-xl border border-neutral-border bg-white text-xs font-semibold text-neutral-dark hover:border-error hover:text-error transition-colors cursor-pointer shadow-xs"
          >
            Clear Search ✕
          </button>
        </div>
      )}

      {/* 2. Main Layout: Left Sidebar + Product Grid */}
      <div className="flex items-start gap-6 lg:gap-8">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
          showAgeFilter={showAgeFilter}
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
            activeSearchQuery={searchQuery.trim() || undefined}
            onClearSearch={handleClearSearch}
            showAgeFilter={showAgeFilter}
          />

          {/* Product Cards Container */}
          {paginatedProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-5">
                {paginatedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                {paginatedProducts.map((product, index) => (
                  <ProductListRow
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
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
                We couldn&apos;t find any items matching your selected criteria. Try
                broadening your search term or resetting active filters.
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
