"use client";

import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react";
import Link from "next/link";
import { MiraiMartLogo } from "@/components/shared/MiraiMartLogo";

export interface FilterState {
  searchQuery: string;
  category: string;
  status: string;
  stockFilter: "all" | "in_stock" | "low_stock" | "out_of_stock";
  minPrice: string;
  maxPrice: string;
  badge: string;
  sortBy: "newest" | "price_asc" | "price_desc" | "stock_asc";
}

type Props = {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  categories: { label: string; value: string }[];
  activeFilterCount: number;
};

export function AdminProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isDrawerOpen,
  onToggleDrawer,
  categories,
  activeFilterCount,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Top Header matching Product_screen.jpeg */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2.5">
            <MiraiMartLogo className="h-7 w-auto" />
            <div className="h-6 w-[1.5px] bg-neutral-border" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark tracking-tight">
            Products
          </h1>
        </div>

        {/* Action button in header */}
        <div className="hidden sm:block">
          <Link
            href="/admin/products/add-new"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:opacity-95 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all duration-150 active:scale-98"
          >
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Primary Search & Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar matching mockup */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-surface border border-neutral-border rounded-xl px-4 py-2.5 pl-4 pr-10 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs transition-all"
          />
          {filters.searchQuery ? (
            <button
              onClick={() => onFilterChange("searchQuery", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-dark transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted pointer-events-none" />
          )}
        </div>

        {/* Mobile Add New Button */}
        <div className="sm:hidden">
          <Link
            href="/admin/products/add-new"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:opacity-95 text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter Row matching Product_screen.jpeg */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-neutral-border shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Select Category Dropdown */}
          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              className="w-full appearance-none bg-surface border border-neutral-border rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative min-w-[180px] sm:min-w-[200px]">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full appearance-none bg-surface border border-neutral-border rounded-xl px-4 py-2.5 pr-9 text-xs sm:text-sm font-medium text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">Status (active, draft, etc.)</option>
              <option value="active">Active Only</option>
              <option value="draft">Draft Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted pointer-events-none" />
          </div>
        </div>

        {/* Filters Toggle Button matching mockup */}
        <button
          onClick={onToggleDrawer}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
            isDrawerOpen || activeFilterCount > 0
              ? "bg-primary-surface/40 border-primary text-tertiary shadow-xs"
              : "bg-surface hover:bg-neutral-bg border-neutral-border text-neutral-dark"
          }`}
          aria-expanded={isDrawerOpen}
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable Advanced Filter Drawer */}
      {isDrawerOpen && (
        <div className="bg-surface rounded-2xl border border-neutral-border p-5 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-border/60 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-semibold text-sm text-neutral-dark">
                Advanced Inventory Filters
              </h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-error hover:underline cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stock Level Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-muted">Stock Level</label>
              <select
                value={filters.stockFilter}
                onChange={(e) => onFilterChange("stockFilter", e.target.value as FilterState["stockFilter"])}
                className="w-full bg-neutral-bg/60 border border-neutral-border rounded-xl px-3 py-2 text-xs text-neutral-dark focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Inventory</option>
                <option value="in_stock">In Stock (&gt; 5 items)</option>
                <option value="low_stock">Low Stock (&le; 5 items)</option>
                <option value="out_of_stock">Out of Stock (0 items)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-muted">Price Range (৳)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange("minPrice", e.target.value)}
                  className="w-full bg-neutral-bg/60 border border-neutral-border rounded-xl px-3 py-2 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                />
                <span className="text-neutral-muted text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                  className="w-full bg-neutral-bg/60 border border-neutral-border rounded-xl px-3 py-2 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Badges Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-muted">Badge / Flag</label>
              <select
                value={filters.badge}
                onChange={(e) => onFilterChange("badge", e.target.value)}
                className="w-full bg-neutral-bg/60 border border-neutral-border rounded-xl px-3 py-2 text-xs text-neutral-dark focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Badges</option>
                <option value="New">New Arrival</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Sale">On Sale</option>
                <option value="-20%">Special Discount</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-muted">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange("sortBy", e.target.value as FilterState["sortBy"])}
                className="w-full bg-neutral-bg/60 border border-neutral-border rounded-xl px-3 py-2 text-xs text-neutral-dark focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock_asc">Stock: Lowest First</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
