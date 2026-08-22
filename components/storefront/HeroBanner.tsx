"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TruckIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/Icons";

export function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E9F6FC] via-[#F4FAFD] to-[#FFF9E6] border border-[#D9EFF9]/80 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-14">
        {/* Left Copy & CTAs */}
        <div className="lg:col-span-7 z-10 flex flex-col items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFF3B3] text-[#191C1E] border border-[#FCE35F]/70 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs mb-5">
            <SparklesIcon size={13} className="text-amber-600 fill-amber-500/20" />
            <span>New Collection</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] text-neutral-dark tracking-tight">
            Play More. <br />
            <span className="text-primary">Discover</span> Tomorrow.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-neutral-muted max-w-md mt-4 leading-relaxed font-sans">
            Curated toys, smart gadgets & lifestyle essentials designed to spark joy and imagination.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <Link
              href="/category/new-arrivals"
              className="inline-flex items-center gap-2 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-98"
            >
              <span>Shop New Arrivals</span>
              <ArrowRightIcon size={16} />
            </Link>

            <Link
              href="/category/all"
              className="inline-flex items-center bg-white hover:bg-neutral-bg text-neutral-dark border border-neutral-border font-sans font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-2xs active:scale-98"
            >
              Explore Collections
            </Link>
          </div>

          {/* Trust Value Badges Under Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 mt-6 border-t border-neutral-border/60 w-full">
            {/* Perk 1 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center shrink-0">
                <TruckIcon size={16} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-neutral-dark">Free Shipping</h4>
                <p className="text-[11px] text-neutral-muted">On orders over ৳999</p>
              </div>
            </div>

            {/* Perk 2 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center shrink-0">
                <RotateCcwIcon size={16} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-neutral-dark">Easy Returns</h4>
                <p className="text-[11px] text-neutral-muted">30-day hassle free</p>
              </div>
            </div>

            {/* Perk 3 */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center shrink-0">
                <ShieldCheckIcon size={16} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-xs text-neutral-dark">Secure Payment</h4>
                <p className="text-[11px] text-neutral-muted">100% protected</p>
              </div>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="flex items-center gap-2 mt-8">
            <button
              type="button"
              aria-label="Slide 1"
              onClick={() => setActiveSlide(0)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 0 ? "w-6 bg-primary" : "w-2 bg-neutral-border hover:bg-neutral-muted"
              }`}
            />
            <button
              type="button"
              aria-label="Slide 2"
              onClick={() => setActiveSlide(1)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 1 ? "w-6 bg-primary" : "w-2 bg-neutral-border hover:bg-neutral-muted"
              }`}
            />
            <button
              type="button"
              aria-label="Slide 3"
              onClick={() => setActiveSlide(2)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeSlide === 2 ? "w-6 bg-primary" : "w-2 bg-neutral-border hover:bg-neutral-muted"
              }`}
            />
          </div>
        </div>

        {/* Right Hero Graphic */}
        <div className="lg:col-span-5 relative w-full aspect-4/3 lg:aspect-square flex items-center justify-center">
          <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xs border border-white/60">
            <Image
              src="/images/hero-showcase.svg"
              alt="Kids playing with educational toys and robot"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
