"use client";

import { cn } from "@/lib/utils";
import type { FilterState } from "@/components/storefront/FilterSidebar";

export type SortOption =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest";

export type ViewMode = "grid" | "list";

type Props = {
  totalCount: number;
  filteredCount: number;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
  activeSubCategoryName?: string;
  onClearSubCategory?: () => void;
};

export function ProductToolbar({
  totalCount,
  filteredCount,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeSubCategoryName,
  onClearSubCategory,
}: Props) {
  const activeCount =
    filters.ageRanges.length +
    filters.tags.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0) +
    (activeSubCategoryName ? 1 : 0);

  function removeAge(id: string) {
    onFilterChange({
      ...filters,
      ageRanges: filters.ageRanges.filter((a) => a !== id),
    });
  }

  function removeTag(tag: string) {
    onFilterChange({
      ...filters,
      tags: filters.tags.filter((t) => t !== tag),
    });
  }

  function removePrice() {
    onFilterChange({
      ...filters,
      minPrice: 0,
      maxPrice: 10000,
    });
  }

  function removeStock() {
    onFilterChange({
      ...filters,
      inStockOnly: false,
    });
  }

  return (
    <div className="space-y-3">
      {/* Main Toolbar Bar */}
      <div className="bg-surface border border-neutral-border rounded-2xl px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Left: Product Counts */}
        <div className="flex items-center gap-3">
          <p className="text-xs sm:text-sm font-sans text-neutral-muted">
            Showing{" "}
            <span className="font-bold text-neutral-dark">
              {filteredCount}
            </span>{" "}
            of {totalCount} items
          </p>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-bg border border-neutral-border hover:border-primary rounded-xl text-xs font-semibold text-neutral-dark cursor-pointer transition-colors shadow-xs"
          >
            <svg
              className="w-3.5 h-3.5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Sort & View Switcher */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-muted hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-neutral-bg border border-neutral-border text-neutral-dark text-xs font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-neutral-bg border border-neutral-border rounded-xl p-0.5">
            <button
              type="button"
              aria-label="Grid View"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-surface text-primary shadow-xs"
                  : "text-neutral-muted hover:text-neutral-dark"
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="List View"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-surface text-primary shadow-xs"
                  : "text-neutral-muted hover:text-neutral-dark"
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
                <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
                <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
                <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" strokeWidth={3} />
                <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" strokeWidth={3} />
                <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" strokeWidth={3} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Row */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
          <span className="text-neutral-muted text-[11px] font-medium mr-1">
            Active filters:
          </span>

          {activeSubCategoryName && onClearSubCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-surface text-tertiary font-semibold text-xs border border-primary/20">
              Subcategory: {activeSubCategoryName}
              <button
                type="button"
                onClick={onClearSubCategory}
                className="hover:text-error transition-colors ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {filters.ageRanges.map((age) => (
            <span
              key={age}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-surface text-tertiary font-semibold text-xs border border-primary/20"
            >
              Age: {age} yrs
              <button
                type="button"
                onClick={() => removeAge(age)}
                className="hover:text-error transition-colors ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}

          {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-surface text-tertiary font-semibold text-xs border border-primary/20">
              Price: ৳{filters.minPrice} – ৳{filters.maxPrice}
              <button
                type="button"
                onClick={removePrice}
                className="hover:text-error transition-colors ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}

          {filters.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-surface text-neutral-dark font-semibold text-xs border border-secondary/30"
            >
              Tag: {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-error transition-colors ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          ))}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-light text-success font-semibold text-xs border border-success/30">
              In Stock Only
              <button
                type="button"
                onClick={removeStock}
                className="hover:text-error transition-colors ml-0.5 cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
