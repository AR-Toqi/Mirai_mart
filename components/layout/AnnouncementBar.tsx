"use client";

import { useState } from "react";
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

  const primaryMessage = announcement?.text
    ? announcement.highlightText
      ? `${announcement.text} • ${announcement.highlightText}`
      : announcement.text
    : "Free shipping on orders over ৳ 3,000 • Use code MIRAI10 for 10% off";

  const announcementsList = [
    primaryMessage,
    "Special Gift Combos available for Newborns & Birthdays!",
    "30-Day Hassle-Free Returns on all items",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  function prevSlide() {
    setCurrentIndex((prev) => (prev === 0 ? announcementsList.length - 1 : prev - 1));
  }

  function nextSlide() {
    setCurrentIndex((prev) => (prev === announcementsList.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="bg-secondary/90 border-b border-secondary/30 text-neutral-dark text-xs py-2 px-4 font-semibold">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous announcement"
          className="text-neutral-dark/70 hover:text-neutral-dark transition-colors cursor-pointer p-0.5"
        >
          <ChevronLeftIcon size={14} className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center justify-center gap-2 font-medium tracking-tight overflow-hidden">
          <TruckIcon size={15} className="w-3.5 h-3.5 text-neutral-dark shrink-0" />
          <span className="truncate">{announcementsList[currentIndex]}</span>
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next announcement"
          className="text-neutral-dark/70 hover:text-neutral-dark transition-colors cursor-pointer p-0.5"
        >
          <ChevronRightIcon size={14} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
