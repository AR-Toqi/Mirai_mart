"use client";

import Image from "next/image";
import Link from "next/link";
import { LockIcon, ArrowUpIcon } from "@/components/ui/Icons";

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="bg-white border-t border-neutral-border pt-16 pb-12 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-neutral-border">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <Image
                src="/mirai-mart_logo.png"
                alt="Mirai Mart Logo"
                width={150}
                height={42}
                className="h-9 w-auto object-contain"
              />
              <p className="text-xs text-neutral-muted leading-relaxed mt-4 max-w-xs">
                Bringing joy, learning and innovation to every home. Curated with care, delivered with love.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="w-8 h-8 rounded-full bg-neutral-bg flex items-center justify-center text-neutral-dark hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-dark mb-4">Shop</h4>
            <ul className="space-y-2.5 text-xs text-neutral-muted">
              <li><Link href="/category/all" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/category/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link href="/category/deals" className="hover:text-primary transition-colors">Deals Zone</Link></li>
              <li><Link href="/category/gift-combos" className="hover:text-primary transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-dark mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-neutral-muted">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Column 4: About Mirai Mart */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-dark mb-4">About Mirai Mart</h4>
            <ul className="space-y-2.5 text-xs text-neutral-muted">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/story" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/press" className="hover:text-primary transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Column 5: Secure Payments */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-dark mb-4">Secure Payments</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-neutral-border rounded-md text-[11px] font-bold text-[#1A1F71] shadow-2xs">
                VISA
              </span>
              <span className="px-2 py-1 bg-white border border-neutral-border rounded-md text-[11px] font-bold text-[#EB001B] shadow-2xs">
                Mastercard
              </span>
              <span className="px-2 py-1 bg-white border border-neutral-border rounded-md text-[11px] font-bold text-[#006FCF] shadow-2xs">
                AMEX
              </span>
              <span className="px-2.5 py-1 bg-[#E2136E]/10 border border-[#E2136E]/30 rounded-md text-[11px] font-bold text-[#E2136E] shadow-2xs">
                bKash
              </span>
              <span className="px-2.5 py-1 bg-[#F7941D]/10 border border-[#F7941D]/30 rounded-md text-[11px] font-bold text-[#F7941D] shadow-2xs">
                Nagad
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-muted mt-5 font-medium">
              <LockIcon size={14} className="text-emerald-600" />
              <span>100% secure & encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-muted">
          <p>© 2024 Mirai Mart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-neutral-dark transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-neutral-dark transition-colors">Privacy Policy</Link>
            <Link href="/sitemap" className="hover:text-neutral-dark transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-tertiary hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <ArrowUpIcon size={18} />
      </button>
    </footer>
  );
}
