"use client";

import { useState } from "react";
import posthog from "posthog-js";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  ChevronDownIcon,
} from "@/components/ui/Icons";

import { useAuth } from "@/components/providers/AuthProvider";
import { UserRoleBadge } from "@/components/auth/UserRoleBadge";

const CATEGORIES = [
  "All Categories",
  "Educational Toys",
  "Smart Gadgets",
  "Baby & Kids",
  "Home Decor",
  "Outdoor & Play",
  "Arts & Crafts",
  "Puzzles & Games",
  "Gift Combos",
];

export function Header() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, profile, role, isAuthenticated, signOut } = useAuth();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      posthog.capture("site_search_submitted", {
        query_length: searchQuery.trim().length,
        selected_category: selectedCategory,
      });
      window.location.href = `/category/all?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/mirai-mart_logo.png"
            alt="Mirai Mart Logo"
            width={160}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Predictive Search Bar with Category Dropdown */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl hidden md:flex items-center border border-neutral-border rounded-full bg-surface pl-5 pr-1.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for toys, gadgets, home decor..."
            className="flex-1 bg-transparent border-none text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none"
          />

          {/* Category Dropdown */}
          <div className="relative border-l border-neutral-border pl-3 pr-2 py-0.5">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-dark hover:text-primary transition-colors cursor-pointer"
            >
              <span className="max-w-[110px] truncate">{selectedCategory}</span>
              <ChevronDownIcon size={13} className="text-neutral-muted" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-border rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      posthog.capture("category_filter_selected", {
                        category: cat,
                      });
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary-surface text-primary font-medium"
                        : "text-neutral-dark hover:bg-neutral-bg"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-primary hover:bg-tertiary text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <SearchIcon size={16} className="w-4 h-4" />
          </button>
        </form>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-5 lg:gap-7 shrink-0 font-sans">
          {/* Wishlist */}
          <Link
            href="/account"
            className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group"
          >
            <div className="relative">
              <HeartIcon size={20} className="text-neutral-dark group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[11px] font-medium mt-0.5">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group"
          >
            <div className="relative">
              <ShoppingCartIcon size={20} className="text-neutral-dark group-hover:text-primary transition-colors" />
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </div>
            <span className="text-[11px] font-medium mt-0.5">Cart</span>
          </Link>

          {/* Account / User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-primary-surface text-primary font-heading font-bold text-xs flex items-center justify-center border border-primary/30">
                  {(profile?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
                <span className="text-[11px] font-medium mt-0.5 flex items-center gap-0.5 max-w-[70px] truncate">
                  {profile?.fullName?.split(" ")[0] || "Account"}
                </span>
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-neutral-border">
                    <p className="text-xs font-semibold text-neutral-dark truncate">
                      {profile?.fullName || "Mirai Member"}
                    </p>
                    <p className="text-[11px] text-neutral-muted truncate">
                      {profile?.email || user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-4 py-1.5 text-xs text-neutral-dark hover:bg-neutral-bg font-medium transition-colors"
                    >
                      My Account & Orders
                    </Link>
                  </div>


                  <div className="pt-1 border-t border-neutral-border">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs text-error hover:bg-error-surface font-medium transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group"
            >
              <UserIcon size={20} className="text-neutral-dark group-hover:text-primary transition-colors" />
              <span className="text-[11px] font-medium mt-0.5">Account</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

