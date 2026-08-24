"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/lib/mock-data";

type Props = {
  category: CategoryMeta;
  activeSubCategorySlug?: string;
  onSelectSubCategory: (slug: string) => void;
};

export function CategoryHeader({
  category,
  activeSubCategorySlug,
  onSelectSubCategory,
}: Props) {
  return (
    <div className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary-surface/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-secondary-surface/40 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="relative z-10">
        <ol className="flex items-center gap-1.5 text-xs text-neutral-muted">
          <li>
            <Link
              href="/"
              className="hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-neutral-border flex items-center">
            <ChevronRightIcon size={12} className="w-3 h-3 text-neutral-muted/70" />
          </li>
          <li>
            <Link
              href="/category/all"
              className="hover:text-primary transition-colors font-medium"
            >
              Categories
            </Link>
          </li>
          <li aria-hidden="true" className="text-neutral-border flex items-center">
            <ChevronRightIcon size={12} className="w-3 h-3 text-neutral-muted/70" />
          </li>
          <li className="font-semibold text-neutral-dark truncate max-w-[200px]">
            {category.name}
          </li>
        </ol>
      </nav>

      {/* 2. Main Title & Description */}
      <div className="mt-3 relative z-10">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-neutral-dark tracking-tight">
          {category.headline || category.name}
        </h1>
        {category.description && (
          <p className="font-sans text-neutral-muted text-xs sm:text-sm max-w-3xl mt-1.5 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* 3. Subcategory Pill Chips */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-border/60 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 relative z-10">
          <button
            type="button"
            onClick={() => onSelectSubCategory("")}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
              !activeSubCategorySlug
                ? "bg-primary text-white shadow-xs"
                : "bg-neutral-bg text-neutral-dark hover:bg-primary-surface/40 hover:text-primary border border-neutral-border/80"
            )}
          >
            All {category.name}
          </button>

          {category.subcategories.map((sub) => {
            const isActive = activeSubCategorySlug === sub.slug;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubCategory(sub.slug)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-neutral-bg text-neutral-dark hover:bg-primary-surface/40 hover:text-primary border border-neutral-border/80"
                )}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
