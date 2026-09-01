"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ScaleIcon,
  XIcon,
  PlusIcon,
  CheckIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  InfoIcon,
  Trash2Icon,
  SearchIcon,
} from "lucide-react";
import { useCompare } from "@/lib/context/CompareContext";
import { useCart } from "@/components/providers/CartProvider";
import { RatingStars } from "@/components/shared/RatingStars";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { formatCurrency, cn } from "@/lib/utils";
import { MAX_COMPARE_ITEMS, generateWhatsAppOrderLink } from "@/lib/constants";
import type { Product } from "@/types";

type Props = {
  catalogProducts: Product[];
};

export function CompareClient({ catalogProducts }: Props) {
  const { compareItems, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Extract all unique spec keys across currently compared products
  const allSpecKeys = useMemo(() => {
    const keysSet = new Set<string>();
    compareItems.forEach((p) => {
      if (p.specs && typeof p.specs === "object") {
        Object.keys(p.specs).forEach((k) => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [compareItems]);

  // Filter catalog for picker modal
  const pickerProducts = useMemo(() => {
    return catalogProducts.filter((p) => {
      const alreadyIn = compareItems.some((item) => item.id === p.id);
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return !alreadyIn && matchesSearch;
    });
  }, [catalogProducts, compareItems, searchQuery]);

  // Empty comparison state
  if (compareItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-neutral-dark font-medium">Compare Products</span>
        </nav>

        {/* Empty State Showcase */}
        <div className="bg-surface border border-neutral-border rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-primary-surface text-primary flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ScaleIcon className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-dark mb-2">
            No Products Selected for Comparison
          </h1>
          <p className="text-sm text-neutral-muted max-w-md mx-auto mb-8">
            Compare technical specifications, age suitability, and curator recommendations side-by-side to make the best choice.
          </p>

          <div className="border-t border-neutral-border pt-8">
            <h2 className="font-heading font-bold text-base text-neutral-dark mb-4">
              Select Popular Products to Compare:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {catalogProducts.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="bg-neutral-bg border border-neutral-border rounded-2xl p-3 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-surface border border-neutral-border overflow-hidden relative shrink-0">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-xs text-neutral-dark truncate">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-neutral-muted truncate">
                        {p.category}
                      </p>
                      <p className="font-sans font-bold text-xs text-primary">
                        {formatCurrency(p.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCompare(p)}
                    className="w-full py-1.5 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add to Compare</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <TrustStrip />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-1.5">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-neutral-dark font-medium">Compare Products</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-dark">
              Side-by-Side Product Comparison
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-bold text-xs">
              {compareItems.length} / {MAX_COMPARE_ITEMS} items
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Highlight Differences Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-dark bg-surface border border-neutral-border px-3 py-2 rounded-xl cursor-pointer hover:bg-neutral-bg transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4"
            />
            <span className="flex items-center gap-1.5">
              <SlidersHorizontalIcon className="w-3.5 h-3.5 text-primary" />
              <span>Highlight Differences</span>
            </span>
          </label>

          {/* Clear Comparison */}
          <button
            type="button"
            onClick={clearCompare}
            className="flex items-center gap-1.5 text-xs text-neutral-muted hover:text-error px-3 py-2 rounded-xl hover:bg-error-surface transition-colors cursor-pointer"
          >
            <Trash2Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Matrix Table */}
      <div className="bg-surface border border-neutral-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[720px]">
            {/* Header Product Cards */}
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-bg/40">
                <th className="p-4 sm:p-5 w-48 text-left font-heading font-bold text-xs uppercase tracking-wider text-neutral-muted align-top">
                  Product Overview
                </th>
                {compareItems.map((product) => (
                  <th key={product.id} className="p-4 sm:p-5 min-w-[220px] max-w-[280px] align-top text-left font-normal">
                    <div className="flex flex-col h-full justify-between">
                      <div className="relative">
                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeFromCompare(product.id)}
                          aria-label={`Remove ${product.title}`}
                          className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-white border border-neutral-border text-neutral-muted hover:text-error hover:bg-error-surface flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>

                        {/* Thumbnail */}
                        <div className="w-full aspect-square rounded-2xl bg-surface border border-neutral-border overflow-hidden relative mb-3">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                        </div>

                        {/* Title & Category */}
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                          {product.category}
                        </p>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-heading font-bold text-sm sm:text-base text-neutral-dark hover:text-primary transition-colors line-clamp-2 mt-0.5"
                        >
                          {product.title}
                        </Link>

                        {/* Rating */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                        </div>

                        {/* Price */}
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="font-heading font-bold text-lg sm:text-xl text-neutral-dark">
                            {formatCurrency(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-xs text-neutral-muted line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="mt-4 space-y-2">
                        <button
                          type="button"
                          onClick={() =>
                            addItem(
                              {
                                productId: product.id,
                                productTitle: product.title,
                                productSlug: product.slug,
                                price: product.price,
                                compareAtPrice: product.compareAtPrice,
                                imageUrl: product.imageUrl,
                                quantity: 1,
                              },
                              { openDrawer: true }
                            )
                          }
                          className="w-full py-2.5 bg-primary hover:bg-tertiary text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <ShoppingCartIcon className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <a
                          href={generateWhatsAppOrderLink({
                            productTitle: product.title,
                            quantity: 1,
                            unitPrice: product.price,
                            totalPrice: product.price,
                            productSlug: product.slug,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Order via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Empty Slot Card if < 4 */}
                {compareItems.length < MAX_COMPARE_ITEMS && (
                  <th className="p-4 sm:p-5 min-w-[200px] align-middle text-center font-normal">
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="w-full h-full min-h-[300px] border-2 border-dashed border-neutral-border hover:border-primary/60 bg-neutral-bg/30 hover:bg-primary-surface/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-surface border border-neutral-border text-neutral-muted group-hover:text-primary group-hover:border-primary flex items-center justify-center transition-colors">
                        <PlusIcon className="w-6 h-6" />
                      </div>
                      <p className="font-heading font-bold text-sm text-neutral-dark group-hover:text-primary transition-colors">
                        Add Product
                      </p>
                      <p className="text-xs text-neutral-muted">
                        Select another product to compare specs
                      </p>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            {/* Matrix Body: Specs & Attributes */}
            <tbody className="divide-y divide-neutral-border text-xs">
              {/* SECTION 1: CORE ATTRIBUTES */}
              <tr className="bg-neutral-bg/60">
                <td
                  colSpan={compareItems.length + (compareItems.length < MAX_COMPARE_ITEMS ? 2 : 1)}
                  className="px-5 py-2.5 font-heading font-bold text-xs uppercase tracking-wider text-neutral-dark"
                >
                  General Information
                </td>
              </tr>

              {/* Age Suitability */}
              <tr className="hover:bg-neutral-bg/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-neutral-dark">Target Age Group</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="px-5 py-3.5 text-neutral-muted">
                    {p.ageRange ? (
                      <span className="px-2.5 py-1 rounded-full bg-primary-surface text-primary font-bold text-[11px]">
                        {p.ageRange} yrs
                      </span>
                    ) : (
                      "All Ages"
                    )}
                  </td>
                ))}
                {compareItems.length < MAX_COMPARE_ITEMS && <td />}
              </tr>

              {/* In-Stock Status */}
              <tr className="hover:bg-neutral-bg/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-neutral-dark">Availability</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="px-5 py-3.5">
                    {p.isOutOfStock ? (
                      <span className="text-error font-bold flex items-center gap-1">
                        ✕ Out of Stock
                      </span>
                    ) : (
                      <span className="text-success font-bold flex items-center gap-1">
                        ✓ In Stock (Ready to Ship)
                      </span>
                    )}
                  </td>
                ))}
                {compareItems.length < MAX_COMPARE_ITEMS && <td />}
              </tr>

              {/* Tags / Skills */}
              <tr className="hover:bg-neutral-bg/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-neutral-dark">Tags & Skills</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="px-5 py-3.5 text-neutral-muted">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-neutral-bg border border-neutral-border text-[10px] font-medium text-neutral-dark"
                        >
                          {t}
                        </span>
                      )) || "—"}
                    </div>
                  </td>
                ))}
                {compareItems.length < MAX_COMPARE_ITEMS && <td />}
              </tr>

              {/* SECTION 2: TECHNICAL & PHYSICAL SPECIFICATIONS */}
              {allSpecKeys.length > 0 && (
                <>
                  <tr className="bg-neutral-bg/60">
                    <td
                      colSpan={compareItems.length + (compareItems.length < MAX_COMPARE_ITEMS ? 2 : 1)}
                      className="px-5 py-2.5 font-heading font-bold text-xs uppercase tracking-wider text-neutral-dark"
                    >
                      Technical & Material Specifications
                    </td>
                  </tr>

                  {allSpecKeys.map((key) => {
                    const values = compareItems.map((p) => {
                      const val = p.specs?.[key];
                      if (val === undefined || val === null) return "—";
                      if (Array.isArray(val)) return val.join(", ");
                      return String(val);
                    });

                    // Check if all values are identical
                    const isIdentical = values.every((v) => v === values[0]);
                    if (highlightDifferences && isIdentical) {
                      return null; // hide identical rows when highlight toggle is active
                    }

                    return (
                      <tr
                        key={key}
                        className={cn(
                          "transition-colors",
                          !isIdentical && highlightDifferences
                            ? "bg-secondary-surface/30 font-medium"
                            : "hover:bg-neutral-bg/30"
                        )}
                      >
                        <td className="px-5 py-3.5 font-semibold text-neutral-dark capitalize">
                          {key.replace(/_/g, " ")}
                        </td>
                        {values.map((v, i) => (
                          <td key={compareItems[i].id} className="px-5 py-3.5 text-neutral-muted">
                            {v}
                          </td>
                        ))}
                        {compareItems.length < MAX_COMPARE_ITEMS && <td />}
                      </tr>
                    );
                  })}
                </>
              )}

              {/* SECTION 3: CURATOR NOTES */}
              <tr className="bg-neutral-bg/60">
                <td
                  colSpan={compareItems.length + (compareItems.length < MAX_COMPARE_ITEMS ? 2 : 1)}
                  className="px-5 py-2.5 font-heading font-bold text-xs uppercase tracking-wider text-neutral-dark"
                >
                  Curator Editorial Insights
                </td>
              </tr>
              <tr className="hover:bg-neutral-bg/30 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-neutral-dark">Why We Love It</td>
                {compareItems.map((p) => (
                  <td key={p.id} className="px-5 py-3.5 text-neutral-muted leading-relaxed">
                    {p.curatorNotes ? (
                      <p className="italic text-neutral-dark">&ldquo;{p.curatorNotes}&rdquo;</p>
                    ) : (
                      "—"
                    )}
                  </td>
                ))}
                {compareItems.length < MAX_COMPARE_ITEMS && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-neutral-border rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="p-5 border-b border-neutral-border flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-neutral-dark">
                  Add Product to Comparison
                </h3>
                <p className="text-xs text-neutral-muted">
                  Choose from available catalog products
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 text-neutral-muted hover:text-neutral-dark rounded-lg cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-neutral-border bg-neutral-bg/40">
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title or category..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {pickerProducts.length === 0 ? (
                <p className="text-xs text-neutral-muted text-center py-8">
                  No additional products match your search.
                </p>
              ) : (
                pickerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-neutral-border hover:bg-neutral-bg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-surface border border-neutral-border overflow-hidden relative shrink-0">
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs text-neutral-dark truncate">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-neutral-muted truncate">
                          {p.category}
                        </p>
                        <p className="font-sans font-bold text-xs text-primary">
                          {formatCurrency(p.price)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCompare(p);
                        setIsPickerOpen(false);
                      }}
                      className="px-3.5 py-1.5 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trust Strip */}
      <div className="mt-14">
        <TrustStrip />
      </div>
    </div>
  );
}
