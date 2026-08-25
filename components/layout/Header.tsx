"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import posthog from "posthog-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@/components/ui/Icons";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import type { SearchResultItem } from "@/app/api/search/route";

export function Header() {
  const router = useRouter();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAuthenticated, signOut } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced predictive search fetch
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=6`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setSearchResults(json.data);
            setIsSearchOpen(true);
            setSelectedIndex(-1);
          }
        }
      } catch (err) {
        console.error("[Header/PredictiveSearch]", err);
      } finally {
        setIsSearching(false);
      }
    }, 260);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const executeFullSearch = useCallback(
    (queryToSearch: string) => {
      const q = queryToSearch.trim();
      if (!q) return;

      posthog.capture("search_performed", {
        query: q,
        resultsCount: searchResults.length,
      });

      setIsSearchOpen(false);
      router.push(`/category/all?q=${encodeURIComponent(q)}`);
    },
    [router, searchResults.length]
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      selectedIndex >= 0 &&
      selectedIndex < searchResults.length &&
      searchResults[selectedIndex]
    ) {
      const target = searchResults[selectedIndex];
      setIsSearchOpen(false);
      router.push(`/category/${target.categorySlug}?q=${encodeURIComponent(target.title)}`);
    } else {
      executeFullSearch(searchQuery);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
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

        {/* Clean, Full-Width Predictive Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-2xl hidden md:block"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border border-neutral-border rounded-full bg-surface pl-5 pr-1.5 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0 && searchQuery.trim().length >= 2) {
                  setIsSearchOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search for toys, gadgets, home decor, gift combos..."
              className="flex-1 bg-transparent border-none text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none"
            />

            {/* Loading Indicator */}
            {isSearching && (
              <div className="w-4 h-4 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
            )}

            {/* Search Button */}
            <button
              type="submit"
              aria-label="Search"
              className="w-9 h-9 rounded-full bg-primary hover:bg-tertiary text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <SearchIcon size={16} className="w-4 h-4" />
            </button>
          </form>

          {/* Predictive Autocomplete Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 bg-neutral-bg/60 border-b border-neutral-border/60 flex items-center justify-between text-[11px] text-neutral-muted font-medium">
                <span>Suggested Products</span>
                <span>Press ↵ to search</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-border/40">
                {searchResults.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(
                        `/category/${item.categorySlug}?q=${encodeURIComponent(
                          item.title
                        )}`
                      );
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      selectedIndex === index
                        ? "bg-primary-surface/60"
                        : "hover:bg-neutral-bg/60"
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-bg border border-neutral-border/50 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs sm:text-sm text-neutral-dark truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-surface px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-medium text-secondary-dark bg-secondary-surface px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-heading font-bold text-sm text-primary">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Results Footer */}
              <button
                type="button"
                onClick={() => executeFullSearch(searchQuery)}
                className="w-full px-4 py-2.5 bg-neutral-bg/90 hover:bg-primary-surface text-center font-sans font-semibold text-xs text-primary transition-colors border-t border-neutral-border/60 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View all results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-5 lg:gap-7 shrink-0 font-sans">
          {/* Wishlist */}
          <Link
            href="/account"
            className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group"
          >
            <div className="relative">
              <HeartIcon
                size={20}
                className="text-neutral-dark group-hover:text-primary transition-colors"
              />
            </div>
            <span className="text-[11px] font-medium mt-0.5">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex flex-col items-center text-neutral-dark hover:text-primary transition-colors group"
          >
            <div className="relative">
              <ShoppingCartIcon
                size={20}
                className="text-neutral-dark group-hover:text-primary transition-colors"
              />
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
              <UserIcon
                size={20}
                className="text-neutral-dark group-hover:text-primary transition-colors"
              />
              <span className="text-[11px] font-medium mt-0.5">Account</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
