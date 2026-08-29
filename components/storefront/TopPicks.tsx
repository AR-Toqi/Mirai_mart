import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/storefront/ProductCard";
import { TOP_PICKS_PRODUCTS } from "@/lib/mock-data";

export function TopPicks() {
  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
          Top Picks for You
        </h2>
        <Link
          href="/category/top-picks"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-tertiary transition-colors group"
        >
          <span>View all</span>
          <ArrowRightIcon size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {TOP_PICKS_PRODUCTS.map((prod, index) => (
          <ProductCard key={prod.id} product={prod} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}
