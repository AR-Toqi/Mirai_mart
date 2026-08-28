"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Quote,
  ChevronRight,
} from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, generateWhatsAppOrderLink } from "@/lib/constants";
import type { Product, ProductVariant } from "@/types";

type Props = {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  onSelectVariant: (variant: ProductVariant) => void;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart?: boolean;
};

export function PDPBuyBox({
  product,
  selectedVariant,
  quantity,
  onSelectVariant,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isAddingToCart = false,
}: Props) {
  const currentPrice = selectedVariant?.price ?? product.price;
  const compareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const stockQuantity = selectedVariant?.stockQuantity ?? (product.isOutOfStock ? 0 : 25);
  const sku = selectedVariant?.sku || product.sku || `MM-${product.id.slice(0, 6).toUpperCase()}`;

  const hasDiscount = compareAtPrice && compareAtPrice > currentPrice;
  const discountAmount = hasDiscount ? compareAtPrice - currentPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : 0;

  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity > 0 && stockQuantity <= 5;

  const totalPrice = currentPrice * quantity;

  // Generate WhatsApp order URL
  const whatsAppUrl = generateWhatsAppOrderLink({
    productTitle: product.title,
    variantTitle: selectedVariant?.title,
    quantity,
    unitPrice: currentPrice,
    totalPrice,
    productSlug: product.slug,
    sku,
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-muted"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-neutral-border" />
        <Link
          href={`/category/${product.categorySlug || "all"}`}
          className="transition-colors hover:text-primary"
        >
          {product.category}
        </Link>
        {product.subCategorySlug && (
          <>
            <ChevronRight className="h-3 w-3 text-neutral-border" />
            <Link
              href={`/category/${product.categorySlug || "all"}?sub=${product.subCategorySlug}`}
              className="capitalize transition-colors hover:text-primary"
            >
              {product.subCategorySlug.replace(/-/g, " ")}
            </Link>
          </>
        )}
      </nav>

      {/* Category Pill & Age Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary-surface px-3 py-1 text-xs font-bold text-tertiary">
          {product.category}
        </span>
        {product.ageRange && product.ageRange !== "all" && (
          <span className="rounded-full bg-secondary-surface px-3 py-1 text-xs font-bold text-neutral-dark">
            Age: {product.ageRange} yrs
          </span>
        )}
        <span className="text-xs text-neutral-muted font-mono">
          SKU: {sku}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark tracking-tight leading-tight">
        {product.title}
      </h1>

      {/* Star Rating & Review Anchor */}
      <div className="flex items-center gap-3">
        <RatingStars rating={product.rating} />
        <span className="text-neutral-border">•</span>
        <a
          href="#reviews"
          className="text-xs font-medium text-neutral-muted underline underline-offset-4 hover:text-primary transition-colors"
        >
          {product.reviewCount} customer reviews
        </a>
      </div>

      {/* Pricing Block */}
      <div className="rounded-2xl border border-neutral-border bg-surface p-4 sm:p-5 shadow-xs">
        <div className="flex items-baseline flex-wrap gap-3">
          <span className="font-sans text-3xl sm:text-4xl font-extrabold text-neutral-dark">
            {formatCurrency(currentPrice)}
          </span>

          {hasDiscount && (
            <>
              <span className="text-lg text-neutral-muted line-through">
                {formatCurrency(compareAtPrice)}
              </span>
              <span className="rounded-full bg-warning-light px-2.5 py-0.5 text-xs font-bold text-warning">
                Save {formatCurrency(discountAmount)} ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        {/* Stock Status Indicator */}
        <div className="mt-3 flex items-center gap-2">
          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-error">
              <AlertCircle className="h-4 w-4" />
              <span>Currently Out of Stock</span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-warning animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <span>Limited Stock — Only {stockQuantity} items left!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>In Stock — Ready to ship from Dhaka warehouse</span>
            </div>
          )}
        </div>
      </div>

      {/* Variant Selectors (If multiple variants exist) */}
      {product.variants && product.variants.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Select Edition / Variant:
            </span>
            {selectedVariant && (
              <span className="text-xs text-neutral-muted font-medium">
                {selectedVariant.title}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isVarOutOfStock = variant.stockQuantity <= 0;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelectVariant(variant)}
                  disabled={isVarOutOfStock}
                  className={`relative flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary-surface/30 ring-2 ring-primary/20 shadow-xs"
                      : "border-neutral-border bg-surface hover:border-primary/40 hover:bg-neutral-bg/50"
                  } ${isVarOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? "text-tertiary" : "text-neutral-dark"
                      }`}
                    >
                      {variant.title}
                    </span>
                    <span className="text-[11px] text-neutral-muted">
                      {variant.stockQuantity > 0
                        ? `${variant.stockQuantity} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-neutral-dark">
                      {formatCurrency(variant.price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-neutral-border rounded-md bg-surface shadow-2xs">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="px-3.5 py-2 text-base font-bold text-neutral-dark transition-colors hover:bg-neutral-bg disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center font-sans text-sm font-bold text-neutral-dark">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(stockQuantity, quantity + 1))}
              disabled={quantity >= stockQuantity || isOutOfStock}
              className="px-3.5 py-2 text-base font-bold text-neutral-dark transition-colors hover:bg-neutral-bg disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-xs text-neutral-muted">
            Total:{" "}
            <span className="font-bold text-neutral-dark text-sm">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        {/* Triple Action Buttons: Add to Cart, Buy Now, WhatsApp */}
        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Primary Add to Cart */}
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
            </button>

            {/* Accent Buy Now */}
            <button
              type="button"
              onClick={onBuyNow}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-2 rounded-md bg-secondary px-5 py-3.5 font-sans text-sm font-bold text-neutral-dark shadow-xs transition-all hover:bg-secondary-light active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              <Zap className="h-4 w-4 fill-neutral-dark text-neutral-dark" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-md bg-[#25D366] px-5 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a] active:scale-[0.99]"
          >
            {/* Official WhatsApp SVG Icon */}
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Order via WhatsApp (Instant Chat)</span>
          </a>
        </div>
      </div>

      {/* Trust & Delivery Strip */}
      <div className="rounded-xl border border-primary/20 bg-primary-surface/30 p-3.5 text-xs text-neutral-dark flex flex-col gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Truck className="h-4 w-4 text-primary flex-shrink-0" />
          <span>
            {currentPrice >= FREE_SHIPPING_THRESHOLD
              ? "🎉 You qualify for FREE Delivery on this item!"
              : `Add items over ৳ ${FREE_SHIPPING_THRESHOLD} for Free Delivery across Bangladesh.`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-muted text-[11px] pt-1 border-t border-primary/10">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            100% Authentic
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5 text-primary" />
            30-Day Easy Returns
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5 text-tertiary" />
            Cash on Delivery Available
          </span>
        </div>
      </div>

      {/* "Why We Love It" Curator Editorial Card */}
      {product.curatorNotes && (
        <div className="relative overflow-hidden rounded-xl border border-secondary/40 bg-secondary-surface/30 p-4.5">
          <Quote className="absolute -right-2 -bottom-2 h-16 w-16 text-secondary/20 rotate-180 pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-neutral-dark text-xs font-black">
              ★
            </span>
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Why We Love It • Curator's Note
            </span>
          </div>
          <p className="text-xs font-sans text-neutral-dark/90 leading-relaxed italic">
            "{product.curatorNotes}"
          </p>
        </div>
      )}
    </div>
  );
}
