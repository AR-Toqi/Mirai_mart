"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { PDPImageGallery } from "./PDPImageGallery";
import { PDPBuyBox } from "./PDPBuyBox";
import { PDPTabs } from "./PDPTabs";
import { PDPFrequentlyBoughtTogether } from "./PDPFrequentlyBoughtTogether";
import { PDPStickyBar } from "./PDPStickyBar";
import { ProductCard } from "./ProductCard";
import type { Product, ProductVariant, ProductReview, ReviewEligibility } from "@/types";

type Props = {
  product: Product;
  relatedProducts: Product[];
  bundleProducts?: Product[];
  initialReviews?: ProductReview[];
  reviewEligibility?: ReviewEligibility;
};

export function PDPClient({
  product,
  relatedProducts,
  bundleProducts,
  initialReviews,
  reviewEligibility,
}: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  // Selected variant state
  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ||
    product.variants?.[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gallery images: prioritized from selected variant combined with full product image gallery
  const activeImages = Array.from(
    new Set([
      ...(selectedVariant?.images || []),
      ...(product.images || []),
      product.imageUrl,
    ])
  ).filter(Boolean);

  // Track product_viewed event on mount
  useEffect(() => {
    try {
      posthog.capture("product_viewed", {
        productId: product.id,
        title: product.title,
        category: product.category,
        price: selectedVariant?.price ?? product.price,
        slug: product.slug,
        sku: selectedVariant?.sku || product.sku,
      });
    } catch (err) {
      console.warn("[PostHog] product_viewed capture error:", err);
    }
  }, [product, selectedVariant]);

  // Show transient toast
  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }

  function handleAddToCart() {
    setIsAddingToCart(true);

    addItem(
      {
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        sku: selectedVariant?.sku || product.sku,
        price: selectedVariant?.price ?? product.price,
        compareAtPrice: selectedVariant?.compareAtPrice ?? product.compareAtPrice,
        imageUrl: activeImages[0] || product.imageUrl,
        quantity,
        maxStock: selectedVariant?.stockQuantity,
      },
      { openDrawer: true }
    );

    setTimeout(() => {
      setIsAddingToCart(false);
      showToast(`Added ${quantity}x "${product.title}" to cart! 🛍️`);
    }, 200);
  }

  function handleBuyNow() {
    addItem(
      {
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        sku: selectedVariant?.sku || product.sku,
        price: selectedVariant?.price ?? product.price,
        compareAtPrice: selectedVariant?.compareAtPrice ?? product.compareAtPrice,
        imageUrl: activeImages[0] || product.imageUrl,
        quantity,
        maxStock: selectedVariant?.stockQuantity,
      },
      { openDrawer: false }
    );
    router.push("/checkout");
  }

  function handleAddBundleToCart(items: Product[]) {
    // Add main product
    addItem(
      {
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        variantId: selectedVariant?.id,
        variantTitle: selectedVariant?.title,
        sku: selectedVariant?.sku || product.sku,
        price: Math.round((selectedVariant?.price ?? product.price) * 0.9), // 10% bundle discount
        compareAtPrice: selectedVariant?.price ?? product.price,
        imageUrl: activeImages[0] || product.imageUrl,
        quantity: 1,
      },
      { openDrawer: false }
    );

    // Add complementary bundle items
    items.forEach((item, idx) => {
      const isLast = idx === items.length - 1;
      addItem(
        {
          productId: item.id,
          productTitle: item.title,
          productSlug: item.slug,
          price: Math.round(item.price * 0.9), // 10% bundle discount
          compareAtPrice: item.price,
          imageUrl: item.imageUrl,
          quantity: 1,
        },
        { openDrawer: isLast } // open drawer on last item added
      );
    });

    try {
      posthog.capture("bundle_added_to_cart", {
        mainProductId: product.id,
        itemCount: items.length + 1,
        itemIds: [product.id, ...items.map((i) => i.id)],
      });
    } catch (err) {
      console.warn("[PostHog] bundle_added_to_cart capture error:", err);
    }

    showToast(`Added ${items.length + 1} bundle items with 10% discount to cart! 🎉`);
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 rounded-xl border border-success/30 bg-surface px-4 py-3 text-xs sm:text-sm font-bold text-neutral-dark shadow-xl">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-14">
        {/* 1. Top Section: 60/40 Split Showcase */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (60%): High-Resolution Image Gallery */}
          <div className="lg:col-span-7">
            <PDPImageGallery
              images={activeImages}
              title={product.title}
              badge={product.badge}
            />
          </div>

          {/* Right Column (40%): Purchasing Buy Box */}
          <div className="lg:col-span-5">
            <PDPBuyBox
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              onSelectVariant={setSelectedVariant}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </section>

        {/* 2. Frequently Bought Together Bundle */}
        {((bundleProducts && bundleProducts.length > 0) ||
          (relatedProducts && relatedProducts.length > 0)) && (
          <section>
            <PDPFrequentlyBoughtTogether
              mainProduct={product}
              bundleItems={
                bundleProducts && bundleProducts.length > 0
                  ? bundleProducts
                  : relatedProducts.slice(0, 2)
              }
              onAddBundleToCart={handleAddBundleToCart}
            />
          </section>
        )}

        {/* 3. Comprehensive Specifications & Reviews Tabs */}
        <section>
          <PDPTabs
            product={product}
            reviews={initialReviews}
            eligibility={reviewEligibility}
          />
        </section>

        {/* 4. Related / Recommended Products Rail */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Curated Recommendations
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-dark">
                  You May Also Love
                </h2>
              </div>

              <Link
                href={`/category/${product.categorySlug || "all"}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-tertiary transition-colors"
              >
                <span>View More in {product.category}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. Sticky Order Bar on Scroll / Mobile */}
      <PDPStickyBar
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}
