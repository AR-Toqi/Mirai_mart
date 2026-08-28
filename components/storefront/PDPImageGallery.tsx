"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, ZoomIn, Check, Sparkles } from "lucide-react";
import { ProductBadge } from "@/components/shared/ProductBadge";
import type { ProductBadgeVariant } from "@/types";

type Props = {
  images: string[];
  title: string;
  badge?: ProductBadgeVariant;
};

export function PDPImageGallery({ images, title, badge }: Props) {
  const imageList = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop"];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeImage = imageList[activeIndex] || imageList[0];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePosition({ x, y });
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Map badge variant string to ProductBadge component variant prop
  const badgeVariantMap: Record<string, "bestseller" | "new" | "sale" | "discount" | "exclusive"> = {
    "Bestseller": "bestseller",
    "New": "new",
    "Sale": "sale",
    "-15%": "discount",
    "-20%": "discount",
    "Exclusive": "exclusive",
  };

  const badgeVariant = badge ? badgeVariantMap[badge] || "bestseller" : undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-border bg-surface shadow-xs">
        {/* Floating Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
          {badgeVariant && (
            <ProductBadge variant={badgeVariant} label={badge} className="shadow-xs" />
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md shadow-2xs border border-primary/20">
            <Sparkles className="h-3 w-3 text-secondary" />
            Curated Pick
          </span>
        </div>

        {/* Floating Action Buttons (Wishlist & Share) */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-border bg-surface/95 backdrop-blur-md shadow-xs transition-all hover:scale-110 active:scale-95 ${
              isWishlisted
                ? "text-error border-error/30 bg-error-surface"
                : "text-neutral-muted hover:text-neutral-dark"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform ${
                isWishlisted ? "fill-error text-error scale-110" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share product"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-border bg-surface/95 backdrop-blur-md text-neutral-muted shadow-xs transition-all hover:scale-110 hover:text-neutral-dark active:scale-95"
          >
            {copied ? (
              <Check className="h-5 w-5 text-success" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
            {copied && (
              <span className="absolute -bottom-8 right-0 whitespace-nowrap rounded-md bg-neutral-dark px-2 py-0.5 text-[10px] font-medium text-white shadow-md">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        {/* Zoomable Image Container */}
        <div
          className="relative h-full w-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 650px"
            className={`object-cover transition-transform duration-200 ease-out ${
              isZoomed ? "scale-160" : "scale-100"
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Zoom Hint Overlay */}
        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-dark/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity group-hover:opacity-0">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Hover to zoom</span>
        </div>
      </div>

      {/* Thumbnails Rail */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {imageList.map((imgUrl, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:opacity-100 ${
                  isActive
                    ? "border-primary shadow-xs ring-2 ring-primary/20 scale-102"
                    : "border-neutral-border opacity-70 hover:border-primary/50"
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
