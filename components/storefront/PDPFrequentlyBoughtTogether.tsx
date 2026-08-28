"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  mainProduct: Product;
  bundleItems: Product[];
  onAddBundleToCart: (items: Product[]) => void;
};

export function PDPFrequentlyBoughtTogether({
  mainProduct,
  bundleItems,
  onAddBundleToCart,
}: Props) {
  if (!bundleItems || bundleItems.length === 0) return null;

  const allItems = [mainProduct, ...bundleItems.slice(0, 2)];
  const [selectedIds, setSelectedIds] = useState<string[]>(
    allItems.map((p) => p.id)
  );

  function toggleItem(id: string) {
    if (id === mainProduct.id) return; // Main product cannot be deselected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const selectedProducts = allItems.filter((p) => selectedIds.includes(p.id));
  const rawTotalPrice = selectedProducts.reduce((acc, p) => acc + p.price, 0);

  // 10% bundle discount when all items are selected
  const isFullBundle = selectedProducts.length === allItems.length && allItems.length > 1;
  const bundleDiscount = isFullBundle ? Math.round(rawTotalPrice * 0.1) : 0;
  const finalTotalPrice = rawTotalPrice - bundleDiscount;

  return (
    <div className="rounded-2xl border border-neutral-border bg-surface p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-secondary" />
        <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark">
          Frequently Bought Together
        </h3>
        {isFullBundle && (
          <span className="rounded-full bg-secondary-surface px-2.5 py-0.5 text-xs font-bold text-neutral-dark">
            Bundle & Save 10%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Product Cards Strip */}
        <div className="lg:col-span-2 flex items-center flex-wrap gap-3 sm:gap-4">
          {allItems.map((item, idx) => {
            const isSelected = selectedIds.includes(item.id);
            const isMain = item.id === mainProduct.id;

            return (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className={`group relative flex flex-col items-center rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-primary/40 bg-surface shadow-2xs"
                      : "border-neutral-border bg-neutral-bg/40 opacity-60"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg bg-neutral-bg">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="mt-2 text-center max-w-[100px] sm:max-w-[120px]">
                    <span className="line-clamp-1 text-xs font-bold text-neutral-dark">
                      {item.title}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Selection Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    disabled={isMain}
                    aria-label={`Select ${item.title}`}
                    className={`mt-2 flex h-5 w-5 items-center justify-center rounded-md border text-white transition-all ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-neutral-border bg-surface text-transparent"
                    } ${isMain ? "cursor-default opacity-80" : "hover:scale-105"}`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                </div>

                {idx < allItems.length - 1 && (
                  <Plus className="h-5 w-5 text-neutral-muted flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bundle Summary & CTA */}
        <div className="rounded-xl border border-neutral-border/80 bg-neutral-bg/60 p-5 flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-muted">
              Total for {selectedProducts.length} items:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-2xl font-extrabold text-neutral-dark">
                {formatCurrency(finalTotalPrice)}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-xs text-neutral-muted line-through">
                  {formatCurrency(rawTotalPrice)}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <span className="text-[11px] font-bold text-success mt-0.5">
                🎉 You save {formatCurrency(bundleDiscount)} on this combo!
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddBundleToCart(selectedProducts)}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add Selected to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
