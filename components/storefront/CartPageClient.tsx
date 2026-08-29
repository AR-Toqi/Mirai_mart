"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  Gift,
  Trash2,
  Tag,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { FreeShippingBar } from "@/components/storefront/FreeShippingBar";
import { CartItemRow } from "@/components/storefront/CartItemRow";
import { formatCurrency } from "@/lib/utils";
import {
  GIFT_WRAP_PRICE,
  DEFAULT_WHATSAPP_NUMBER,
  VALID_PROMO_CODES,
} from "@/lib/constants";
import { ALL_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

export function CartPageClient() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    rawSavings,
    giftOptions,
    appliedPromo,
    discountAmount,
    giftWrapFee,
    shippingFee,
    grandTotal,
    isFreeShippingEligible,
    toggleGiftWrap,
    setGiftMessage,
    applyPromoCode,
    removePromoCode,
    clearCart,
    addItem,
    isHydrated,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Cross-sell recommendations
  const recommendedProducts: Product[] = ALL_PRODUCTS.slice(0, 4);

  function handleApplyPromo(e: React.FormEvent) {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoFeedback({ type: "success", message: result.message });
      setPromoInput("");
    } else {
      setPromoFeedback({ type: "error", message: result.message });
    }
  }

  function handleQuickApplyCode(code: string) {
    const result = applyPromoCode(code);
    if (result.success) {
      setPromoFeedback({ type: "success", message: result.message });
    } else {
      setPromoFeedback({ type: "error", message: result.message });
    }
  }

  // WhatsApp Order for entire Cart
  const whatsAppCartUrl = (() => {
    const cleanNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
    ).replace(/[^\d+]/g, "");

    const itemListText = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.productTitle}* ${
            it.variantTitle && it.variantTitle !== "Default"
              ? `(${it.variantTitle})`
              : ""
          } x ${it.quantity} = ৳ ${(it.price * it.quantity).toLocaleString()}`
      )
      .join("\n");

    const message = [
      "👋 Hello Mirai Mart! I want to place an order for my cart:",
      "",
      itemListText,
      "",
      giftOptions.isGift ? `🎁 *Gift Wrapping:* Yes (৳ ${GIFT_WRAP_PRICE})` : null,
      giftOptions.isGift && giftOptions.message
        ? `💌 *Gift Note:* "${giftOptions.message}"`
        : null,
      appliedPromo ? `🏷️ *Promo Applied:* ${appliedPromo.code}` : null,
      `💰 *Grand Total:* ৳ ${grandTotal.toLocaleString()}`,
      `🚚 *Delivery:* ${shippingFee === 0 ? "FREE" : `৳ ${shippingFee}`}`,
      "",
      "Please confirm my order and send payment instructions! ✨",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
  })();

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-neutral-muted">Loading your shopping bag...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Empty Cart Card */}
        <div className="rounded-2xl border border-neutral-border bg-surface p-8 sm:p-14 text-center shadow-xs max-w-2xl mx-auto">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-surface/40 text-primary">
            <ShoppingBag size={44} />
            <Sparkles className="absolute -top-1 -right-1 h-7 w-7 text-secondary animate-bounce" />
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-dark">
            Your shopping bag is empty
          </h1>
          <p className="mt-2 text-sm text-neutral-muted max-w-md mx-auto leading-relaxed">
            Looks like you haven't added any items yet. Discover our curated collection of
            developmental toys, creative gifts, and smart gadgets!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/all"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
            >
              <span>Explore All Products</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/category/gift-combos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-8 py-3.5 font-sans text-sm font-bold text-neutral-dark shadow-xs transition-all hover:bg-secondary-light active:scale-[0.99]"
            >
              <span>Shop Gift Combos</span>
            </Link>
          </div>
        </div>

        {/* Recommended Products Strip */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-dark">
                Popular Bestsellers
              </h2>
              <p className="text-xs text-neutral-muted">
                Handpicked favorites loved by families across Bangladesh
              </p>
            </div>
            <Link
              href="/category/all"
              className="text-xs font-bold text-primary hover:text-tertiary flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedProducts.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col rounded-xl border border-neutral-border bg-surface p-4 shadow-2xs hover:shadow-md transition-all"
              >
                <Link
                  href={`/product/${p.slug}`}
                  className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-bg mb-3"
                >
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {p.category}
                    </span>
                    <Link
                      href={`/product/${p.slug}`}
                      className="block font-heading font-bold text-sm text-neutral-dark hover:text-primary transition-colors line-clamp-2 mt-0.5"
                    >
                      {p.title}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-border/50">
                    <span className="font-heading font-bold text-sm text-neutral-dark">
                      {formatCurrency(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          productId: p.id,
                          productTitle: p.title,
                          productSlug: p.slug,
                          price: p.price,
                          compareAtPrice: p.compareAtPrice,
                          imageUrl: p.imageUrl,
                          quantity: 1,
                        })
                      }
                      className="rounded-md bg-primary-surface p-2 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-neutral-dark">Shopping Cart</span>
      </nav>

      {/* Page Title & Count Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted mt-1">
            You have <strong className="text-neutral-dark">{itemCount}</strong> items in your cart. Review and proceed to checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-muted hover:text-error transition-colors p-2 rounded-md hover:bg-error-surface self-start sm:self-auto cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Clear Shopping Bag</span>
        </button>
      </div>

      {/* 2-Column Responsive Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items & Gift Options (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dynamic Free Shipping Bar */}
          <FreeShippingBar />

          {/* Cart Line Items */}
          <div className="space-y-3.5">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} compact={false} />
            ))}
          </div>

          {/* Luxury Gift Wrapping & Message Card */}
          <div className="rounded-2xl border border-secondary/40 bg-secondary-surface/20 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-neutral-dark shadow-2xs">
                  <Gift size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-neutral-dark">
                    Make It a Special Gift (+{formatCurrency(GIFT_WRAP_PRICE)})
                  </h3>
                  <p className="text-xs text-neutral-muted mt-0.5">
                    Includes eco-friendly premium gift wrapping with satin ribbon and a personalized handwritten greeting card.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="cartGiftWrapToggle"
                checked={giftOptions.isGift}
                onChange={(e) => toggleGiftWrap(e.target.checked)}
                className="h-5 w-5 rounded border-neutral-border accent-primary cursor-pointer mt-1"
              />
            </div>

            {giftOptions.isGift && (
              <div className="mt-4 pt-4 border-t border-secondary/30 space-y-2 animate-in fade-in duration-200">
                <label
                  htmlFor="giftMessageText"
                  className="block font-sans text-xs font-bold text-neutral-dark"
                >
                  Personalized Greeting Card Message:
                </label>
                <textarea
                  id="giftMessageText"
                  value={giftOptions.message}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="e.g. Happy 5th Birthday, Aarav! Wishing you endless fun and discoveries with your new toy set. With love from Uncle & Auntie."
                  maxLength={250}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-border bg-surface p-3 text-xs text-neutral-dark placeholder:text-neutral-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex items-center justify-between text-[11px] text-neutral-muted">
                  <span className="italic">
                    💌 Printed on an embossed Mirai Mart greeting card.
                  </span>
                  <span>{giftOptions.message.length}/250 chars</span>
                </div>
              </div>
            )}
          </div>

          {/* Continue Shopping Link */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-tertiary transition-colors"
            >
              <span>← Continue Shopping & Explore Catalog</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="sticky top-24 rounded-2xl border border-neutral-border bg-surface p-6 shadow-sm space-y-5">
            <h2 className="font-heading text-xl font-bold text-neutral-dark border-b border-neutral-border/60 pb-3">
              Order Summary
            </h2>

            {/* Cost Breakdown */}
            <div className="space-y-3 text-xs font-sans">
              <div className="flex justify-between text-neutral-muted">
                <span>Items Subtotal ({itemCount} items)</span>
                <span className="font-bold text-neutral-dark">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {rawSavings > 0 && (
                <div className="flex justify-between text-warning">
                  <span>Catalog Discount Savings</span>
                  <span className="font-bold">
                    -{formatCurrency(rawSavings)}
                  </span>
                </div>
              )}

              {giftOptions.isGift && (
                <div className="flex justify-between text-neutral-dark">
                  <span className="flex items-center gap-1">
                    <Gift size={13} className="text-secondary-dark" />
                    Gift Wrapping & Card
                  </span>
                  <span className="font-bold">
                    +{formatCurrency(giftWrapFee)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-muted">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-primary" />
                  Delivery across Bangladesh
                </span>
                <span className="font-bold text-neutral-dark">
                  {shippingFee === 0 ? (
                    <span className="text-success font-bold">FREE</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              {appliedPromo && discountAmount > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-success-surface border border-success/20 p-2.5 text-success">
                  <div className="flex items-center gap-1.5">
                    <Tag size={13} />
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      {appliedPromo.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      -{formatCurrency(discountAmount)}
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-neutral-muted hover:text-error transition-colors text-xs font-bold cursor-pointer"
                      aria-label="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between items-baseline pt-3 border-t border-neutral-border text-neutral-dark">
                <div>
                  <span className="font-heading font-bold text-base">Grand Total</span>
                  <p className="text-[10px] text-neutral-muted">Includes all applicable taxes</p>
                </div>
                <span className="font-heading font-bold text-2xl text-primary">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            <div className="pt-2 border-t border-neutral-border/60">
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code"
                      className="w-full rounded-md border border-neutral-border bg-neutral-bg px-3 py-2 text-xs font-mono font-semibold uppercase text-neutral-dark placeholder:font-sans placeholder:normal-case placeholder:text-neutral-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-neutral-dark hover:bg-black text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {/* Feedback note */}
                {promoFeedback && (
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-medium ${
                      promoFeedback.type === "success"
                        ? "text-success"
                        : "text-error"
                    }`}
                  >
                    {promoFeedback.type === "success" ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <AlertCircle size={12} />
                    )}
                    <span>{promoFeedback.message}</span>
                  </div>
                )}

                {/* Quick available codes */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-muted">Available:</span>
                  {Object.keys(VALID_PROMO_CODES).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleQuickApplyCode(code)}
                      className="rounded-full bg-primary-surface/60 hover:bg-primary-surface border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-tertiary transition-colors cursor-pointer"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Primary Action Group */}
            <div className="space-y-2.5 pt-2">
              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-3.5 px-4 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              {/* 1-Click WhatsApp Full Cart Order */}
              <a
                href={whatsAppCartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 px-4 font-sans text-xs font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a] active:scale-[0.99]"
              >
                <MessageCircle size={16} />
                <span>Order Entire Bag via WhatsApp</span>
              </a>
            </div>

            {/* Trust Assurance Strip */}
            <div className="rounded-xl bg-neutral-bg/60 border border-neutral-border/60 p-3.5 space-y-2 text-[11px] text-neutral-muted">
              <div className="flex items-center gap-2 text-neutral-dark font-medium">
                <ShieldCheck size={14} className="text-success shrink-0" />
                <span>100% Genuine & Safety Certified Products</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-dark font-medium">
                <RotateCcw size={14} className="text-primary shrink-0" />
                <span>30-Day Easy Exchanges & Returns</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-dark font-medium">
                <Truck size={14} className="text-tertiary shrink-0" />
                <span>Cash on Delivery (COD) Available Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
