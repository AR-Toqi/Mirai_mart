"use client";

import { useState } from "react";
import posthog from "posthog-js";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon } from "@/components/ui/Icons";
import { ScaleIcon } from "lucide-react";
import { ProductBadge } from "@/components/shared/ProductBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCart } from "@/components/providers/CartProvider";
import { useCompare } from "@/lib/context/CompareContext";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const isCompared = isInCompare(product.id);

  return (
    <div
      className={cn(
        "bg-surface border border-neutral-border rounded-2xl p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative",
        className
      )}
    >
      <div>
        {/* Image Area */}
        <div className="relative w-full aspect-square rounded-xl bg-neutral-bg/60 overflow-hidden flex items-center justify-center">
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <ProductBadge badge={product.badge} />
            </div>
          )}

          {/* Quick Action Badges (Wishlist & Compare) */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
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
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-muted hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
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

            <button
              type="button"
              aria-label={isCompared ? "Remove from compare" : "Add to compare"}
              title={isCompared ? "In Comparison" : "Add to Compare"}
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(product);
              }}
              className={cn(
                "w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center shadow-xs transition-all cursor-pointer",
                isCompared
                  ? "bg-primary text-white"
                  : "bg-white/90 text-neutral-muted hover:text-primary"
              )}
            >
              <ScaleIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link href={`/product/${product.slug}`} className="w-full h-full relative block">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="pt-3">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-heading font-semibold text-[15px] leading-tight text-neutral-dark line-clamp-1 hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Category & Review on same row */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-[12px] font-sans text-neutral-muted truncate">
              {product.category}
            </p>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5 mt-2.5">
            {product.compareAtPrice && (
              <span className="text-[12px] text-neutral-muted line-through font-sans">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
            <span className="font-sans font-bold text-[17px] text-neutral-dark">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Full-width Action Button at bottom of card with smooth ease-in hover animation */}
      <button
        type="button"
        aria-label={`Add ${product.title} to cart`}
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
        className="w-full mt-3 h-9 rounded-xl bg-secondary hover:bg-secondary-light text-neutral-dark flex items-center justify-center gap-1.5 font-sans font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-150 ease-out cursor-pointer active:scale-[0.98] group/btn overflow-hidden relative"
      >
        <span className="inline-flex items-center gap-1.5 transition-all duration-150 ease-out group-hover/btn:-translate-y-6 group-hover/btn:opacity-0">
          <span>Add to Cart</span>
        </span>
        <span className="inline-flex items-center gap-1.5 transition-all duration-150 ease-out translate-y-6 opacity-0 group-hover/btn:translate-y-0 group-hover/btn:opacity-100 absolute">
          <ShoppingCartIcon size={16} className="w-4 h-4" />
          <span>Add to Cart</span>
        </span>
      </button>
    </div>
  );
}
