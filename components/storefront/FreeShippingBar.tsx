"use client";

import { useMemo } from "react";
import { Truck, Sparkles, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

type Props = {
  show?: boolean; // Toggleable for admin control
  className?: string;
  compact?: boolean;
};

export function FreeShippingBar({
  show = true,
  className = "",
  compact = false,
}: Props) {
  const { subtotal, isFreeShippingEligible, freeShippingRemaining, freeShippingProgress } =
    useCart();

  const isUnlocked = isFreeShippingEligible || subtotal >= FREE_SHIPPING_THRESHOLD;

  if (!show) return null;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isUnlocked
          ? "bg-success-surface border-success/30 text-success-foreground"
          : "bg-primary-surface/40 border-primary/20 text-neutral-dark"
      } ${compact ? "p-2.5" : "p-3.5 sm:p-4"} ${className}`}
    >
      {/* Status message */}
      <div className="flex items-center justify-between gap-2 mb-2 text-xs font-sans font-medium">
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success text-white shrink-0 shadow-2xs">
              <CheckCircle2 size={13} className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white shrink-0 shadow-2xs">
              <Truck size={13} className="w-3.5 h-3.5" />
            </span>
          )}

          <span className="leading-tight">
            {isUnlocked ? (
              <strong className="font-heading font-bold text-success text-xs sm:text-sm">
                🎉 Free delivery unlocked across Bangladesh!
              </strong>
            ) : (
              <>
                Add{" "}
                <span className="font-heading font-bold text-primary">
                  {formatCurrency(freeShippingRemaining)}
                </span>{" "}
                more to unlock <span className="font-bold">Free Delivery</span>
              </>
            )}
          </span>
        </div>

        <span className="text-[11px] font-bold shrink-0 font-heading">
          {freeShippingProgress}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-neutral-border/80 h-2 rounded-full overflow-hidden p-0.5 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isUnlocked
              ? "bg-gradient-to-r from-success to-emerald-500"
              : "bg-gradient-to-r from-primary to-primary-light"
          }`}
          style={{ width: `${Math.max(5, freeShippingProgress)}%` }}
        />
      </div>

      {/* Subtle threshold indicator */}
      {!isUnlocked && (
        <div className="flex items-center justify-between text-[10px] text-neutral-muted mt-1.5 px-0.5">
          <span>৳ 0</span>
          <span>Threshold: {formatCurrency(FREE_SHIPPING_THRESHOLD)}</span>
        </div>
      )}
    </div>
  );
}
