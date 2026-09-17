"use client";

import { useState, useEffect, useCallback } from "react";
import { TruckIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";
import type { StorefrontContentConfig } from "@/actions/admin";

type Props = {
  announcement?: StorefrontContentConfig["announcement"];
};

export function AnnouncementBar({ announcement }: Props) {
  // If toggled off in CMS, hide bar completely
  if (announcement && announcement.isActive === false) {
    return null;
  }

  const primaryText = announcement?.text || "Free shipping on orders over ৳ 3,000";
  const highlightBadge = announcement?.highlightText || "Use code MIRAI10 for 10% off";

  const secondaryAnnouncements = [
    "Special Gift Combos available for Newborns & Birthdays!",
    "30-Day Hassle-Free Returns on all items",
  ];

  const totalSlides = 1 + secondaryAnnouncements.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function prevSlide() {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  // Subtle 5-second auto-rotate timer, paused on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, nextSlide]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-secondary border-b border-secondary/40 text-neutral-dark text-xs py-2 px-4 font-semibold select-none transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous announcement"
          className="text-neutral-dark/70 hover:text-neutral-dark transition-colors cursor-pointer p-0.5 rounded-md hover:bg-neutral-dark/5"
        >
          <ChevronLeftIcon size={14} className="w-3.5 h-3.5" />
        </button>

        {currentIndex === 0 ? (
          <div className="flex items-center justify-center gap-2 font-medium tracking-tight overflow-hidden text-center">
            <TruckIcon size={15} className="w-3.5 h-3.5 text-neutral-dark shrink-0" />
            <span className="truncate">{primaryText}</span>
            {highlightBadge && (
              <>
                <span className="opacity-40 shrink-0">•</span>
                <span className="bg-neutral-dark text-secondary px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide shrink-0">
                  {highlightBadge}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 font-medium tracking-tight overflow-hidden text-center">
            <TruckIcon size={15} className="w-3.5 h-3.5 text-neutral-dark shrink-0" />
            <span className="truncate">{secondaryAnnouncements[currentIndex - 1]}</span>
          </div>
        )}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next announcement"
          className="text-neutral-dark/70 hover:text-neutral-dark transition-colors cursor-pointer p-0.5 rounded-md hover:bg-neutral-dark/5"
        >
          <ChevronRightIcon size={14} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

