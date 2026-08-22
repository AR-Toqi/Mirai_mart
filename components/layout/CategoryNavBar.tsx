"use client";

import Link from "next/link";
import { MenuIcon, ArrowRightIcon, SparklesIcon } from "@/components/ui/Icons";

const NAV_LINKS = [
  { name: "New Arrivals", href: "/category/new-arrivals" },
  { name: "Best Sellers", href: "/category/best-sellers" },
  { name: "Toys & Games", href: "/category/toys-games" },
  { name: "Smart Gadgets", href: "/category/smart-gadgets" },
  { name: "Home & Living", href: "/category/home-living" },
  { name: "Baby & Kids", href: "/category/baby-kids" },
];

export function CategoryNavBar() {
  return (
    <nav className="bg-white border-b border-neutral-border py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Categories Button */}
        <div className="flex items-center gap-6">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2.5 bg-primary text-white hover:bg-tertiary px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors shadow-xs"
          >
            <MenuIcon size={16} className="w-4 h-4" />
            <span>Categories</span>
            <ArrowRightIcon size={14} className="w-3.5 h-3.5" />
          </Link>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-neutral-dark">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-primary transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-primary after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Deals Zone Button */}
        <Link
          href="/category/deals"
          className="inline-flex items-center gap-1.5 bg-[#FCE35F] hover:bg-[#FFE680] text-neutral-dark px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0"
        >
          <SparklesIcon size={14} className="w-3.5 h-3.5 text-neutral-dark fill-neutral-dark/10" />
          <span>Deals Zone</span>
        </Link>
      </div>
    </nav>
  );
}
