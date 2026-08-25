"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MenuIcon,
  ChevronDownIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import { NAV_DEPARTMENTS, type NavDepartment } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CategoryNavBar() {
  const pathname = usePathname();
  const [activeHoverSlug, setActiveHoverSlug] = useState<string | null>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileExpandedSlug, setMobileExpandedSlug] = useState<string | null>(null);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns when navigating to a new route
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setActiveHoverSlug(null);
    setIsMobileDrawerOpen(false);
  }, [pathname]);

  // Click outside listener for Mega Menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setIsMegaMenuOpen(false);
        setActiveHoverSlug(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleMouseEnter(slug: string) {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsMegaMenuOpen(false);
    setActiveHoverSlug(slug);
  }

  function handleMouseLeave() {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverSlug(null);
    }, 160);
  }

  function toggleMobileCategory(slug: string) {
    setMobileExpandedSlug((prev) => (prev === slug ? null : slug));
  }

  const activeDepartment = NAV_DEPARTMENTS.find(
    (d) => d.slug === activeHoverSlug
  );

  return (
    <nav
      ref={navContainerRef}
      className="bg-white border-b border-neutral-border py-2 sticky top-20 z-30 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mega-Menu Button & Primary Category Links */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* All Categories Mega-Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setActiveHoverSlug(null);
                setIsMegaMenuOpen(!isMegaMenuOpen);
              }}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer",
                isMegaMenuOpen
                  ? "bg-tertiary text-white ring-2 ring-primary/30"
                  : "bg-primary text-white hover:bg-tertiary"
              )}
            >
              <MenuIcon size={15} className="w-4 h-4" />
              <span>Categories</span>
              <ChevronDownIcon
                size={13}
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isMegaMenuOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Mega-Menu Dropdown Panel */}
            {isMegaMenuOpen && (
              <div className="absolute left-0 top-full mt-3 w-[min(92vw,920px)] bg-white border border-neutral-border rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-border">
                  <div>
                    <h3 className="font-heading font-bold text-base text-neutral-dark">
                      All Departments & Categories
                    </h3>
                    <p className="font-sans text-xs text-neutral-muted">
                      Select a department or explore specific curated subcategories
                    </p>
                  </div>
                  <Link
                    href="/category/all"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-tertiary transition-colors"
                  >
                    <span>View All Catalog</span>
                    <ArrowRightIcon size={12} className="w-3 h-3" />
                  </Link>
                </div>

                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {NAV_DEPARTMENTS.map((dept) => (
                    <div key={dept.slug} className="space-y-2.5">
                      {/* Department Title */}
                      <Link
                        href={dept.href}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="group flex items-center justify-between pb-1.5 border-b border-neutral-border/60 hover:text-primary transition-colors"
                      >
                        <span className="font-heading font-bold text-sm text-neutral-dark group-hover:text-primary transition-colors">
                          {dept.name}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="w-3 h-3 text-neutral-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>

                      {/* Subcategory List */}
                      <ul className="space-y-1.5">
                        {dept.subcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={sub.href}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="block text-xs text-neutral-muted hover:text-primary hover:translate-x-0.5 transition-all py-0.5"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Bottom Promo Strip in Mega-Menu */}
                <div className="mt-6 pt-4 border-t border-neutral-border flex flex-wrap items-center justify-between gap-3 bg-neutral-bg/60 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary-dark animate-pulse" />
                    <span className="text-xs text-neutral-dark font-medium">
                      Special curated offers available in Deals Zone
                    </span>
                  </div>
                  <Link
                    href="/category/deals"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-neutral-dark rounded-full text-xs font-bold hover:bg-secondary-light transition-all shadow-2xs"
                  >
                    <SparklesIcon size={12} className="w-3 h-3" />
                    <span>Explore Deals Zone</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Category Nav Links with Hover Subcategory Dropdowns */}
          <div className="hidden lg:flex items-center gap-1 font-sans">
            {NAV_DEPARTMENTS.map((dept) => {
              const isHovered = activeHoverSlug === dept.slug;
              const isActive = pathname.startsWith(dept.href);

              return (
                <div
                  key={dept.slug}
                  onMouseEnter={() => handleMouseEnter(dept.slug)}
                  onMouseLeave={handleMouseLeave}
                  className="relative py-1"
                >
                  <Link
                    href={dept.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                      isHovered
                        ? "bg-primary-surface text-primary font-bold shadow-2xs"
                        : isActive
                        ? "text-primary bg-primary-surface/40"
                        : "text-neutral-dark hover:text-primary hover:bg-neutral-bg"
                    )}
                  >
                    <span>{dept.name}</span>
                    <ChevronDownIcon
                      size={11}
                      className={cn(
                        "w-3 h-3 text-neutral-muted transition-transform duration-200",
                        isHovered ? "rotate-180 text-primary" : ""
                      )}
                    />
                  </Link>

                  {/* Subcategory Floating Dropdown Card */}
                  {isHovered && (
                    <div
                      onMouseEnter={() => handleMouseEnter(dept.slug)}
                      onMouseLeave={handleMouseLeave}
                      className="absolute left-0 top-full mt-2 w-[340px] bg-white border border-neutral-border rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {/* Dropdown Header */}
                      <div className="pb-2.5 mb-2.5 border-b border-neutral-border/70 flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-xs uppercase tracking-wider text-primary">
                            {dept.name}
                          </p>
                          <p className="font-sans text-[11px] text-neutral-muted line-clamp-1 mt-0.5">
                            {dept.description}
                          </p>
                        </div>
                      </div>

                      {/* Subcategories List */}
                      <div className="space-y-1">
                        {dept.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveHoverSlug(null)}
                            className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-primary-surface/40 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-neutral-bg group-hover:bg-primary-surface text-neutral-dark group-hover:text-primary flex items-center justify-center shrink-0 transition-colors mt-0.5 text-xs font-bold border border-neutral-border/60">
                              •
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-heading font-bold text-xs text-neutral-dark group-hover:text-primary transition-colors truncate">
                                {sub.name}
                              </p>
                              <p className="font-sans text-[10px] text-neutral-muted line-clamp-1">
                                {sub.description}
                              </p>
                            </div>
                            <ChevronRightIcon
                              size={11}
                              className="w-3 h-3 text-neutral-muted/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                            />
                          </Link>
                        ))}
                      </div>

                      {/* View All Footer */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-border/60">
                        <Link
                          href={dept.href}
                          onClick={() => setActiveHoverSlug(null)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold text-primary hover:text-tertiary hover:bg-neutral-bg rounded-lg transition-colors"
                        >
                          <span>Explore All {dept.name}</span>
                          <ArrowRightIcon size={12} className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deals Zone & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Deals Zone Button */}
          <Link
            href="/category/deals"
            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary-light text-neutral-dark px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 active:scale-98"
          >
            <SparklesIcon size={13} className="w-3.5 h-3.5 text-neutral-dark fill-neutral-dark/10" />
            <span>Deals Zone</span>
          </Link>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            type="button"
            aria-label="Open mobile categories"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden p-1.5 rounded-xl border border-neutral-border bg-neutral-bg text-neutral-dark hover:border-primary transition-colors cursor-pointer"
          >
            <MenuIcon size={18} className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer with Accordions */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-surface h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-surface text-primary flex items-center justify-center font-bold text-xs">
                    📁
                  </div>
                  <h3 className="font-heading font-bold text-base text-neutral-dark">
                    Explore Departments
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-neutral-border transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Accordion Categories */}
              <div className="space-y-2">
                {NAV_DEPARTMENTS.map((dept) => {
                  const isExpanded = mobileExpandedSlug === dept.slug;

                  return (
                    <div
                      key={dept.slug}
                      className="border border-neutral-border rounded-xl overflow-hidden bg-neutral-bg/40"
                    >
                      {/* Department Accordion Trigger */}
                      <div className="flex items-center justify-between p-3 bg-white">
                        <Link
                          href={dept.href}
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className="font-heading font-bold text-xs text-neutral-dark hover:text-primary transition-colors flex-1"
                        >
                          {dept.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobileCategory(dept.slug)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-bg text-neutral-muted cursor-pointer"
                        >
                          <ChevronDownIcon
                            size={14}
                            className={cn(
                              "transition-transform duration-200",
                              isExpanded ? "rotate-180 text-primary" : ""
                            )}
                          />
                        </button>
                      </div>

                      {/* Subcategories Expanded */}
                      {isExpanded && (
                        <div className="px-3.5 py-2.5 space-y-2 border-t border-neutral-border/60 bg-neutral-bg/60">
                          {dept.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={sub.href}
                              onClick={() => setIsMobileDrawerOpen(false)}
                              className="block py-1 text-xs text-neutral-dark hover:text-primary transition-colors"
                            >
                              <p className="font-semibold">{sub.name}</p>
                              <p className="text-[10px] text-neutral-muted line-clamp-1">
                                {sub.description}
                              </p>
                            </Link>
                          ))}
                          <Link
                            href={dept.href}
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className="block pt-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            Explore All {dept.name} →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Deals Zone Card in Mobile Drawer */}
                <Link
                  href="/category/deals"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary text-neutral-dark font-heading font-bold text-xs shadow-xs mt-3"
                >
                  <div className="flex items-center gap-2">
                    <SparklesIcon size={14} className="w-4 h-4 fill-neutral-dark/10" />
                    <span>Deals Zone & Offers</span>
                  </div>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-neutral-border">
              <Link
                href="/category/all"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-2.5 bg-primary text-white font-sans font-bold text-xs rounded-xl hover:bg-tertiary transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Browse All Products</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
