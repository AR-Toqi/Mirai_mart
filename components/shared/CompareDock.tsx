"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScaleIcon, XIcon, ArrowRightIcon, Trash2Icon } from "lucide-react";
import { useCompare } from "@/lib/context/CompareContext";
import { MAX_COMPARE_ITEMS } from "@/lib/constants";

export function CompareDock() {
  const {
    compareItems,
    removeFromCompare,
    clearCompare,
    isDockVisible,
    setIsDockVisible,
  } = useCompare();

  if (compareItems.length === 0 || !isDockVisible) {
    return null;
  }

  const emptySlotsCount = Math.max(0, MAX_COMPARE_ITEMS - compareItems.length);

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Product comparison dock"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 260 }}
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-2xl bg-surface/95 backdrop-blur-md border border-neutral-border shadow-xl rounded-2xl p-3 sm:p-4 font-sans"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left Title & Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
              <ScaleIcon className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-heading font-bold text-sm text-neutral-dark leading-tight">
                Compare Products
              </h2>
              <p className="text-[11px] text-neutral-muted">
                {compareItems.length} of {MAX_COMPARE_ITEMS} items selected
              </p>
            </div>
          </div>

          {/* Center: Selected Thumbnails & Empty Slots */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-0.5 max-w-full">
            {compareItems.map((product) => (
              <div
                key={product.id}
                className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-bg border border-neutral-border overflow-hidden shrink-0"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFromCompare(product.id)}
                  aria-label={`Remove ${product.title} from comparison`}
                  className="absolute inset-0 bg-neutral-dark/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: emptySlotsCount }).map((_, idx) => (
              <div
                key={`empty-slot-${idx}`}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 border-dashed border-neutral-border bg-neutral-bg/50 flex items-center justify-center text-neutral-muted/60 text-[10px] font-semibold shrink-0"
                title="Empty comparison slot"
              >
                +
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              title="Clear all comparison items"
              className="p-2 text-neutral-muted hover:text-error hover:bg-error-surface rounded-lg transition-colors cursor-pointer hidden sm:block"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>

            <Link
              href="/compare"
              className="flex items-center gap-1.5 bg-secondary hover:bg-secondary-light active:scale-95 text-neutral-dark font-sans font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Compare</span>
              <span className="w-4 h-4 rounded-full bg-neutral-dark text-white text-[10px] font-bold flex items-center justify-center">
                {compareItems.length}
              </span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsDockVisible(false)}
              aria-label="Close comparison dock"
              className="p-1.5 text-neutral-muted hover:text-neutral-dark rounded-lg cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
