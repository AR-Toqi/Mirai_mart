"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TruckIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@/components/ui/Icons";
import type { StorefrontContentConfig, HeroSlideConfig } from "@/actions/admin";

type Props = {
  content?: StorefrontContentConfig["hero"];
};

const DEFAULT_SLIDES: HeroSlideConfig[] = [
  {
    id: "slide-1",
    imageUrl: "/images/hero-showcase.svg",
    ctaPrimaryActive: true,
    ctaPrimaryText: "Shop New Arrivals",
    ctaPrimaryLink: "/category/new-arrivals",
    ctaSecondaryActive: true,
    ctaSecondaryText: "Explore Collections",
    ctaSecondaryLink: "/category/all",
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&auto=format&fit=crop&q=80",
    ctaPrimaryActive: true,
    ctaPrimaryText: "Discover Tech Gadgets",
    ctaPrimaryLink: "/category/digital-gadgets",
    ctaSecondaryActive: false,
    ctaSecondaryText: "Learn More",
    ctaSecondaryLink: "/category/digital-gadgets",
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1600&auto=format&fit=crop&q=80",
    ctaPrimaryActive: true,
    ctaPrimaryText: "Explore Gift Combos",
    ctaPrimaryLink: "/category/gift-combos",
    ctaSecondaryActive: false,
    ctaSecondaryText: "Browse All",
    ctaSecondaryLink: "/category/all",
  },
];

export function HeroBanner({ content }: Props) {
  // Extract 3 slides with robust fallbacks
  const slides: HeroSlideConfig[] =
    content?.slides && content.slides.length > 0
      ? content.slides
      : content?.imageUrl
      ? [
          {
            id: "slide-1",
            imageUrl: content.imageUrl,
            ctaPrimaryActive: content.ctaPrimaryActive !== false,
            ctaPrimaryText: content.ctaPrimaryText || "Shop New Arrivals",
            ctaPrimaryLink: content.ctaPrimaryLink || "/category/new-arrivals",
            ctaSecondaryActive: content.ctaSecondaryActive === true,
            ctaSecondaryText: content.ctaSecondaryText || "Explore Collections",
            ctaSecondaryLink: content.ctaSecondaryLink || "/category/all",
          },
          DEFAULT_SLIDES[1],
          DEFAULT_SLIDES[2],
        ]
      : DEFAULT_SLIDES;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // 3-second auto-play timer (pauses on hover)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, nextSlide]);

  const currentSlide = slides[activeSlide] || slides[0];

  return (
    <div className="space-y-6">
      {/* 1. Full-Width Background Carousel (3 Sliders, 3 Seconds Auto-Play, Middle Aligned Buttons) */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full rounded-3xl overflow-hidden h-[280px] sm:h-[360px] lg:h-[420px] shadow-sm border border-neutral-border bg-neutral-dark"
      >
        {/* Full-width Background Slide Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.imageUrl || "/images/hero-showcase.svg"}
              alt={`Banner slide ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {/* Middle-Aligned Buttons Overlay (No Hero Title / Subtitle as requested) */}
        {(currentSlide.ctaPrimaryActive || currentSlide.ctaSecondaryActive) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3.5">
              {currentSlide.ctaPrimaryActive && currentSlide.ctaPrimaryText && (
                <Link
                  href={currentSlide.ctaPrimaryLink || "/category/new-arrivals"}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98"
                >
                  <span>{currentSlide.ctaPrimaryText}</span>
                  <ArrowRightIcon size={16} />
                </Link>
              )}

              {currentSlide.ctaSecondaryActive && currentSlide.ctaSecondaryText && (
                <Link
                  href={currentSlide.ctaSecondaryLink || "/category/all"}
                  className="inline-flex items-center bg-white/95 hover:bg-white text-neutral-dark border border-neutral-border font-sans font-medium text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-98 backdrop-blur-xs"
                >
                  {currentSlide.ctaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 3 Slide Indicator Dots at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-neutral-dark/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-xs">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx
                    ? "w-7 bg-primary"
                    : "w-2 bg-white/70 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Trust Value Strip Below Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-surface border border-neutral-border shadow-2xs">
        {/* Perk 1 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
            <TruckIcon size={18} />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs text-neutral-dark">Free Shipping</h4>
            <p className="text-[11px] text-neutral-muted">On orders over ৳3,000</p>
          </div>
        </div>

        {/* Perk 2 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
            <RotateCcwIcon size={18} />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs text-neutral-dark">Easy Returns</h4>
            <p className="text-[11px] text-neutral-muted">30-day hassle free</p>
          </div>
        </div>

        {/* Perk 3 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
            <ShieldCheckIcon size={18} />
          </div>
          <div>
            <h4 className="font-sans font-bold text-xs text-neutral-dark">Secure Payment</h4>
            <p className="text-[11px] text-neutral-muted">100% protected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
