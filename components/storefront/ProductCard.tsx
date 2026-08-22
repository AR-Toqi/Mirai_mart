"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, ShoppingCartIcon } from "@/components/ui/Icons";
import { ProductBadge } from "@/components/shared/ProductBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency, cn } from "@/lib/utils";
import type { Product } from "@/types";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);

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

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
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

          <Link href={`/product/${product.slug}`} className="w-full h-full relative block">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
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
          <p className="text-[12px] font-sans text-neutral-muted mt-0.5">{product.category}</p>

          <div className="mt-1.5">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>
      </div>

      {/* Footer Price & Cart */}
      <div className="flex items-center justify-between mt-3 pt-1">
        <div className="flex items-baseline gap-1.5">
          {product.compareAtPrice && (
            <span className="text-[12px] text-neutral-muted line-through font-sans">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
          <span className="font-sans font-bold text-[17px] text-neutral-dark">
            {formatCurrency(product.price)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          className="w-8 h-8 rounded-lg bg-secondary/60 text-neutral-dark hover:bg-secondary-light flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ShoppingCartIcon size={16} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
