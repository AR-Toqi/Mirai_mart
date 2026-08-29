"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { HeartIcon, ShoppingCartIcon } from "@/components/ui/Icons";
import { ProductBadge } from "@/components/shared/ProductBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductListRow({ product, className, priority }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  return (
    <div
      className={cn(
        "bg-surface border border-neutral-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all group relative",
        className
      )}
    >
      {/* 1. Thumbnail Image */}
      <div className="relative w-full sm:w-44 aspect-square rounded-xl bg-neutral-bg/60 overflow-hidden shrink-0 flex items-center justify-center">
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <ProductBadge badge={product.badge} />
          </div>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            const nextWishlisted = !isWishlisted;
            setIsWishlisted(nextWishlisted);
            if (nextWishlisted) {
              posthog.capture("product_wishlisted", {
                product_id: product.id,
                product_name: product.title,
                product_category: product.category,
                product_price: product.price,
                product_slug: product.slug,
              });
            }
          }}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-muted hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
        >
          <HeartIcon
            size={15}
            filled={isWishlisted}
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              isWishlisted ? "text-rose-500 fill-rose-500" : "text-neutral-muted"
            )}
          />
        </button>

        <Link
          href={`/product/${product.slug}`}
          className="w-full h-full relative block"
        >
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, 176px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* 2. Middle Content */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[11px] font-sans font-medium text-neutral-muted bg-neutral-bg px-2.5 py-0.5 rounded-md">
            {product.category}
          </span>
          {product.ageRange && (
            <span className="text-[11px] font-sans font-medium text-tertiary bg-primary-surface/40 px-2 py-0.5 rounded-md">
              Age {product.ageRange} yrs
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-heading font-bold text-base sm:text-lg text-neutral-dark hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs font-sans text-neutral-muted mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-2.5 flex items-center gap-3">
          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
          {product.tags && product.tags.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-neutral-muted">
              <span>•</span>
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-neutral-bg px-1.5 py-0.5 rounded text-neutral-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Action & Pricing */}
      <div className="w-full sm:w-48 sm:border-l sm:border-neutral-border/60 sm:pl-4 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-neutral-border/40 sm:border-t-0">
        <div className="text-left sm:text-right">
          {product.compareAtPrice && (
            <span className="text-xs text-neutral-muted line-through font-sans block">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
          <span className="font-sans font-bold text-lg sm:text-xl text-neutral-dark block">
            {formatCurrency(product.price)}
          </span>
          <span className="text-[10px] font-medium text-success block">
            Free Delivery eligible
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
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
            );
          }}
          className="inline-flex items-center gap-1.5 bg-primary text-white hover:bg-tertiary px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
        >
          <ShoppingCartIcon size={14} className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
