"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Minus,
  Plus,
  Lock,
  Truck,
  Tag,
  Check,
  Info,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    selectedItemIds,
    itemCount,
    selectedCount,
    selectedSubtotal,
    appliedPromo,
    discountAmount,
    shippingFee,
    grandTotal,
    isFreeShippingEligible,
    freeShippingRemaining,
    freeShippingProgress,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    toggleSelectItem,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("MIRAI10");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCartDrawerOpen) {
        closeCartDrawer();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartDrawerOpen]);

  function handleProceedToCheckout() {
    closeCartDrawer();
    router.push("/checkout");
  }

  function handleViewCart() {
    closeCartDrawer();
    router.push("/cart");
  }

  function handleApplyPromo(codeToApply?: string) {
    const code = codeToApply || promoInput;
    const res = applyPromoCode(code);
    if (res.success) {
      setPromoFeedback({ type: "success", message: res.message });
    } else {
      setPromoFeedback({ type: "error", message: res.message });
    }
    setTimeout(() => {
      setPromoFeedback(null);
    }, 3500);
  }

  const isPromoApplied = appliedPromo?.code === "MIRAI10";

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur Overlay with Framer Motion fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel with Framer Motion spring slide-in */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative z-10 flex h-full w-full max-w-[500px] sm:max-w-[520px] flex-col bg-surface shadow-2xl rounded-l-3xl border-l border-neutral-border overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart Drawer"
          >
            {/* 1. Header */}
            <div className="px-6 pt-6 pb-4 bg-surface shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-2xl text-neutral-dark">
                  Your Cart ({itemCount})
                </h2>

                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="w-9 h-9 rounded-full border border-neutral-border hover:bg-neutral-bg flex items-center justify-center text-neutral-dark transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Subtitle / Free delivery milestone indicator */}
              <p className="font-sans text-xs sm:text-sm text-neutral-muted mt-1.5">
                {isFreeShippingEligible ? (
                  <span className="text-success font-semibold">
                    🎉 You have unlocked free shipping!
                  </span>
                ) : (
                  <>
                    Almost there! Add{" "}
                    <span className="font-bold text-neutral-dark">
                      ৳{freeShippingRemaining.toLocaleString()}
                    </span>{" "}
                    more for free shipping.
                  </>
                )}
              </p>

              {/* Progress Bar & Amount/Truck row */}
              <div className="mt-3.5 space-y-2">
                <div className="w-full bg-neutral-border/70 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(4, freeShippingProgress)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-dark font-semibold">
                  <span>
                    ৳{selectedSubtotal.toLocaleString()} / ৳
                    {FREE_SHIPPING_THRESHOLD.toLocaleString()}
                  </span>
                  <Truck size={17} className="text-primary" />
                </div>
              </div>
            </div>

            {/* 2. Items List or Empty State */}
            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3.5 divide-y divide-transparent">
                {items.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-neutral-border bg-surface p-3.5 sm:p-4 flex items-center gap-3.5 transition-all shadow-2xs hover:border-neutral-border/80"
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelectItem(item.id)}
                        aria-label={
                          isSelected
                            ? `Deselect ${item.productTitle}`
                            : `Select ${item.productTitle}`
                        }
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isSelected
                            ? "bg-primary text-white"
                            : "border border-neutral-border bg-surface"
                        }`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </button>

                      {/* Thumbnail Image */}
                      <Link
                        href={`/product/${item.productSlug}`}
                        onClick={closeCartDrawer}
                        className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-bg border border-neutral-border/60 shrink-0"
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.productTitle}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.productSlug}`}
                          onClick={closeCartDrawer}
                          className="font-heading font-bold text-sm sm:text-[15px] text-neutral-dark hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {item.productTitle}
                        </Link>

                        <div className="font-heading font-bold text-sm sm:text-base text-neutral-dark mt-0.5">
                          {formatCurrency(item.price)}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="mt-2 inline-flex items-center border border-neutral-border rounded-lg bg-surface">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-neutral-muted hover:text-neutral-dark cursor-pointer transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-neutral-dark font-sans select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-neutral-muted hover:text-neutral-dark cursor-pointer transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Trash Delete Action */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.productTitle} from cart`}
                        className="text-neutral-muted hover:text-error transition-colors p-2 rounded-lg hover:bg-error-surface shrink-0 cursor-pointer"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  );
                })}

                {/* 3. Promo Banner Card */}
                <div className="rounded-2xl border border-primary/30 bg-primary-surface/30 p-3.5 flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary shadow-2xs shrink-0">
                      <Tag size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-bold text-xs text-primary leading-tight">
                        Extra 10% off on prepaid orders
                      </p>
                      <p className="text-xs text-neutral-dark font-sans mt-0.5">
                        Use code: <strong className="font-bold">MIRAI10</strong>
                      </p>
                    </div>
                  </div>

                  {isPromoApplied ? (
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="px-3.5 py-1.5 rounded-lg bg-success text-white font-bold text-xs transition-colors hover:bg-error cursor-pointer shrink-0"
                    >
                      Applied ✓
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyPromo("MIRAI10")}
                      className="px-4 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs transition-colors cursor-pointer shrink-0 bg-white"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {promoFeedback && (
                  <p
                    className={`text-xs px-2 font-medium ${
                      promoFeedback.type === "success"
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {promoFeedback.message}
                  </p>
                )}
              </div>
            ) : (
              /* Empty Cart State */
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-surface/40 text-primary">
                  <ShoppingBag size={36} />
                  <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-secondary animate-bounce" />
                </div>
                <h3 className="font-heading text-lg font-bold text-neutral-dark">
                  Your cart is empty
                </h3>
                <p className="mt-1 max-w-xs text-xs text-neutral-muted">
                  Explore our curated educational toys, creative items, and digital gadgets!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    router.push("/category/all");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-sans text-xs font-bold text-white shadow-xs transition-all hover:bg-tertiary cursor-pointer"
                >
                  <span>Start Shopping</span>
                </button>
              </div>
            )}

            {/* 4. Footer Summary, Celebration, CTAs & Trust Strip */}
            {items.length > 0 && (
              <div className="border-t border-neutral-border bg-surface px-6 pt-4 pb-6 space-y-3.5 shrink-0">
                {/* Cost Breakdown */}
                <div className="space-y-2 text-xs sm:text-sm font-sans text-neutral-dark">
                  <div className="flex justify-between">
                    <span className="text-neutral-dark">
                      Subtotal ({selectedCount} {selectedCount === 1 ? "item" : "items"})
                    </span>
                    <span className="font-bold text-neutral-dark">
                      {formatCurrency(selectedSubtotal)}
                    </span>
                  </div>

                  {appliedPromo && discountAmount > 0 && (
                    <div className="flex justify-between text-success font-semibold">
                      <span>Discount ({appliedPromo.code})</span>
                      <span className="font-bold">
                        -{formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-neutral-dark">
                      Shipping <Info size={13} className="text-neutral-muted" />
                    </span>
                    <span className="font-bold text-neutral-dark">
                      {shippingFee === 0 ? (
                        <span className="text-success font-bold">FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2.5 border-t border-neutral-border font-heading font-bold text-neutral-dark">
                    <span className="text-base sm:text-lg">Total</span>
                    <span className="text-xl sm:text-2xl text-neutral-dark">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Celebratory Free Shipping Banner */}
                {isFreeShippingEligible && (
                  <div className="bg-[#eaf8f0] border border-[#c3edd5] rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-[#15803d] font-bold text-xs sm:text-sm">
                    <Truck size={16} />
                    <span>Yay! You got free shipping!</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-sans text-sm sm:text-base font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99] cursor-pointer"
                  >
                    <Lock size={16} />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleViewCart}
                    className="w-full flex items-center justify-center py-2 px-4 font-sans text-sm font-bold text-primary hover:bg-primary-surface/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>View Cart</span>
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
