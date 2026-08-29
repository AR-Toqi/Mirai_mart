"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { useCart } from "@/components/providers/CartProvider";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { formatCurrency } from "@/lib/utils";

type Props = {
  item: CartItem;
  compact?: boolean;
  onItemClick?: () => void;
};

export function CartItemRow({ item, compact = false, onItemClick }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;
  const hasSavings = item.compareAtPrice && item.compareAtPrice > item.price;
  const lineSavings = hasSavings ? (item.compareAtPrice! - item.price) * item.quantity : 0;

  return (
    <div
      className={`group relative flex items-start gap-3.5 sm:gap-4 rounded-xl border border-neutral-border bg-surface transition-all hover:border-neutral-border/80 ${
        compact ? "p-3" : "p-4 sm:p-5 shadow-2xs"
      }`}
    >
      {/* Product Image Thumbnail */}
      <Link
        href={`/product/${item.productSlug}`}
        onClick={onItemClick}
        className="relative shrink-0 overflow-hidden rounded-lg border border-neutral-border/60 bg-neutral-bg aspect-square"
        style={{ width: compact ? "68px" : "88px", height: compact ? "68px" : "88px" }}
      >
        <Image
          src={item.imageUrl}
          alt={item.productTitle}
          fill
          sizes={compact ? "68px" : "88px"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/product/${item.productSlug}`}
              onClick={onItemClick}
              className="font-heading font-bold text-xs sm:text-sm text-neutral-dark hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {item.productTitle}
            </Link>

            {/* Variant / SKU Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {item.variantTitle && item.variantTitle !== "Default" && (
                <span className="inline-flex items-center rounded-md bg-primary-surface/40 px-2 py-0.5 text-[10px] font-semibold text-tertiary">
                  {item.variantTitle}
                </span>
              )}
              {item.sku && (
                <span className="text-[10px] text-neutral-muted font-mono">
                  SKU: {item.sku}
                </span>
              )}
            </div>
          </div>

          {/* Delete action */}
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.productTitle} from cart`}
            className="text-neutral-muted hover:text-error transition-colors p-1 rounded-md hover:bg-error-surface shrink-0 cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Stepper + Price row */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-border/40">
          <QuantityStepper
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.id, qty)}
            min={1}
            max={item.maxStock ?? 99}
            size={compact ? "sm" : "md"}
          />

          <div className="text-right">
            <div className="font-heading font-bold text-sm sm:text-base text-neutral-dark">
              {formatCurrency(lineTotal)}
            </div>

            {/* Unit price / Compare at savings */}
            <div className="flex items-center justify-end gap-1.5 text-[11px] text-neutral-muted">
              {item.quantity > 1 && (
                <span>({formatCurrency(item.price)} ea)</span>
              )}
              {hasSavings && (
                <span className="text-[10px] text-warning font-bold">
                  Save {formatCurrency(lineSavings)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
