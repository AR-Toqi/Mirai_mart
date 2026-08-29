"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/storefront/ProductCard";
import { FEATURED_PRODUCTS } from "@/lib/mock-data";

export function FeaturedProducts() {
  const [activeDot, setActiveDot] = useState(1);

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
          Featured Products
        </h2>
        <Link
          href="/category/featured"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-tertiary transition-colors group"
        >
          <span>View all</span>
          <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {FEATURED_PRODUCTS.map((prod, index) => (
          <ProductCard key={prod.id} product={prod} priority={index < 4} />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {[0, 1, 2, 3].map((dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Featured page ${dotIndex + 1}`}
            onClick={() => setActiveDot(dotIndex)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              activeDot === dotIndex
                ? "w-6 bg-primary"
                : "w-2 bg-neutral-border hover:bg-neutral-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
