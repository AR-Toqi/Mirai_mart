"use client";

import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";

export type FilterState = {
  ageRanges: string[];
  minPrice: number;
  maxPrice: number;
  tags: string[];
  inStockOnly: boolean;
};

type Props = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  className?: string;
};

const AGE_OPTIONS = [
  { id: "0-1", label: "0–1 yr", description: "Infants & Sensory" },
  { id: "1-3", label: "1–3 yrs", description: "Toddler & Montessori" },
  { id: "3-5", label: "3–5 yrs", description: "Preschool & Creative" },
  { id: "5-8", label: "5–8 yrs", description: "STEM & Construction" },
  { id: "8+", label: "8+ yrs", description: "Advanced & Robotics" },
];

const SKILL_TAGS = [
  "Montessori",
  "STEM",
  "Sensory",
  "Kinetic",
  "Creative",
  "Eco-friendly",
  "Smart",
];

const QUICK_PRICES = [
  { label: "All Prices", min: 0, max: 10000 },
  { label: "Under ৳ 1,500", min: 0, max: 1500 },
  { label: "৳ 1,500 – ৳ 3,000", min: 1500, max: 3000 },
  { label: "৳ 3,000+", min: 3000, max: 10000 },
];

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
  className,
}: Props) {
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const hasActiveFilters =
    filters.ageRanges.length > 0 ||
    filters.tags.length > 0 ||
    filters.inStockOnly ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000;

  function toggleAge(id: string) {
    const next = filters.ageRanges.includes(id)
      ? filters.ageRanges.filter((a) => a !== id)
      : [...filters.ageRanges, id];
    onFilterChange({ ...filters, ageRanges: next });
  }

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: next });
  }

  function handlePriceApply() {
    onFilterChange({
      ...filters,
      minPrice: Math.min(localMin, localMax),
      maxPrice: Math.max(localMin, localMax),
    });
  }

  function setQuickPrice(min: number, max: number) {
    setLocalMin(min);
    setLocalMax(max);
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  }

  const sidebarContent = (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="font-heading font-bold text-base text-neutral-dark">
            Filters
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:text-tertiary transition-colors cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* 1. Age Range Filter */}
      <div>
        <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-neutral-muted mb-2.5">
          Shop by Age Group
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {AGE_OPTIONS.map((age) => {
            const isSelected = filters.ageRanges.includes(age.id);
            return (
              <button
                key={age.id}
                type="button"
                onClick={() => toggleAge(age.id)}
                className={cn(
                  "flex flex-col items-start px-3 py-2 rounded-xl text-left border transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary-surface/60 border-primary text-neutral-dark shadow-xs ring-1 ring-primary/30"
                    : "bg-surface border-neutral-border text-neutral-dark hover:border-primary/40 hover:bg-neutral-bg/60"
                )}
              >
                <span className="font-heading font-bold text-xs">
                  {age.label}
                </span>
                <span className="text-[10px] text-neutral-muted font-sans line-clamp-1">
                  {age.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter (BDT ৳) */}
      <div className="pt-2 border-t border-neutral-border/60">
        <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-neutral-muted mb-2.5">
          Price Range (৳)
        </h3>

        {/* Quick Price Buttons */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {QUICK_PRICES.map((qp) => {
            const isSelected =
              filters.minPrice === qp.min && filters.maxPrice === qp.max;
            return (
              <button
                key={qp.label}
                type="button"
                onClick={() => setQuickPrice(qp.min, qp.max)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-neutral-bg text-neutral-dark border-neutral-border hover:border-primary/40"
                )}
              >
                {qp.label}
              </button>
            );
          })}
        </div>

        {/* Range Slider Inputs */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-dark font-medium mb-1">
              <span>Max Price: {formatCurrency(localMax)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              onMouseUp={handlePriceApply}
              onTouchEnd={handlePriceApply}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-muted">
                ৳
              </span>
              <input
                type="number"
                min={0}
                max={localMax}
                value={localMin}
                onChange={(e) => setLocalMin(Number(e.target.value))}
                onBlur={handlePriceApply}
                placeholder="Min"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-neutral-bg border border-neutral-border rounded-lg text-neutral-dark focus:outline-none focus:border-primary"
              />
            </div>
            <span className="text-neutral-muted text-xs">–</span>
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-muted">
                ৳
              </span>
              <input
                type="number"
                min={localMin}
                max={10000}
                value={localMax}
                onChange={(e) => setLocalMax(Number(e.target.value))}
                onBlur={handlePriceApply}
                placeholder="Max"
                className="w-full pl-6 pr-2 py-1.5 text-xs bg-neutral-bg border border-neutral-border rounded-lg text-neutral-dark focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handlePriceApply}
              className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* 3. Skills & Tags Multi-Select */}
      <div className="pt-2 border-t border-neutral-border/60">
        <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-neutral-muted mb-2.5">
          Skills & Themes
        </h3>
        <div className="space-y-1.5">
          {SKILL_TAGS.map((tag) => {
            const isChecked = filters.tags.includes(tag);
            return (
              <label
                key={tag}
                className="flex items-center gap-2.5 text-xs font-medium text-neutral-dark hover:text-primary transition-colors cursor-pointer py-0.5 select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTag(tag)}
                  className="w-4 h-4 rounded-sm border-neutral-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <span>{tag}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Availability Toggle */}
      <div className="pt-2 border-t border-neutral-border/60">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div>
            <span className="font-heading font-semibold text-xs text-neutral-dark block">
              In Stock Only
            </span>
            <span className="text-[11px] text-neutral-muted font-sans block">
              Hide currently unavailable items
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 rounded-sm border-neutral-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
          />
        </label>
      </div>

      {/* Reset CTA */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2 px-3 border border-neutral-border hover:border-primary/40 bg-neutral-bg hover:bg-primary-surface/20 text-neutral-dark font-sans text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Clear All Active Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          "w-[280px] shrink-0 bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs h-fit sticky top-24 hidden lg:block",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-surface h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-border">
                <h3 className="font-heading font-bold text-lg text-neutral-dark">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-neutral-border transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {sidebarContent}
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-border">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-primary text-white font-sans font-bold text-sm rounded-xl hover:bg-tertiary transition-colors shadow-xs cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
