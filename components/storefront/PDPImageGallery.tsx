"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  ZoomIn,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
} from "lucide-react";
import { ProductBadge } from "@/components/shared/ProductBadge";
import type { ProductBadgeVariant } from "@/types";

type Props = {
  images: string[];
  title: string;
  badge?: ProductBadgeVariant;
  videoUrl?: string;
};

export function PDPImageGallery({ images, title, badge, videoUrl }: Props) {
  const fallbackPerspectiveAngles = [
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?q=80&w=1200&auto=format&fit=crop",
  ];

  const imageList = (() => {
    if (Array.isArray(images) && images.length > 1) {
      return images;
    }
    if (Array.isArray(images) && images.length === 1) {
      return [
        images[0],
        ...fallbackPerspectiveAngles.filter((img) => img !== images[0]).slice(0, 3),
      ];
    }
    return fallbackPerspectiveAngles;
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Parse video source (YouTube / Vimeo / MP4)
  const parsedVideo = (() => {
    if (!videoUrl || !videoUrl.trim()) return null;
    const trimmed = videoUrl.trim();

    const ytMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return {
        type: "youtube" as const,
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      };
    }

    const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: "vimeo" as const,
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      };
    }

    return {
      type: "mp4" as const,
      embedUrl: trimmed,
    };
  })();

  // Close full-screen video lightbox on Escape key
  useEffect(() => {
    if (!isVideoModalOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsVideoModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoModalOpen]);

  // Auto-cycle through thumbnail images every 3 seconds (pauses on hover or zoom)
  useEffect(() => {
    if (imageList.length <= 1 || isHovered || isZoomed) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imageList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageList.length, isHovered, isZoomed]);

  const safeIndex = activeIndex >= imageList.length ? 0 : activeIndex;
  const activeImage = imageList[safeIndex] || imageList[0];

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

  function handlePrevImage(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  }

  function handleNextImage(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      className="flex flex-col gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Stage */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-border bg-surface shadow-xs">
        {/* Floating Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
          {badge && <ProductBadge badge={badge} className="shadow-xs" />}
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

        {/* Navigation Arrows for Multiple Images */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 backdrop-blur-md border border-neutral-border text-neutral-dark shadow-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-surface active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 backdrop-blur-md border border-neutral-border text-neutral-dark shadow-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-surface active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

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

        {/* Image Counter & Zoom Hint */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10">
          {imageList.length > 1 && (
            <span className="rounded-full bg-neutral-dark/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              {safeIndex + 1} / {imageList.length}
            </span>
          )}
        </div>

        {/* Watch Video Floating Trigger */}
        {parsedVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoModalOpen(true);
            }}
            className="absolute bottom-3 left-16 sm:left-20 z-10 inline-flex items-center gap-1.5 rounded-full bg-neutral-dark/85 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-neutral-dark transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <Play className="h-3 w-3 fill-white text-white" />
            <span>Watch Video</span>
          </button>
        )}

        <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-neutral-dark/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity group-hover:opacity-0">
          <ZoomIn className="h-3.5 w-3.5" />
          <span>Hover to zoom</span>
        </div>
      </div>

      {/* Thumbnails Rail with Smooth Navigation & Video Tile */}
      {(imageList.length > 1 || parsedVideo) && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
          {imageList.map((imgUrl, index) => {
            const isActive = index === safeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:opacity-100 ${
                  isActive
                    ? "border-primary shadow-xs ring-2 ring-primary/20 scale-102 opacity-100"
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

          {/* Video Thumbnail Button */}
          {parsedVideo && (
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              aria-label="Play product showcase video in full screen"
              className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-neutral-border hover:border-primary transition-all bg-neutral-dark flex flex-col items-center justify-center group cursor-pointer shadow-xs"
            >
              <Image
                src={activeImage}
                alt="Product video preview"
                fill
                sizes="80px"
                className="object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all"
              />
              <div className="relative z-10 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
              </div>
              <span className="relative z-10 text-[10px] font-bold text-white mt-1 drop-shadow-md">
                Video
              </span>
            </button>
          )}
        </div>
      )}

      {/* Full-Screen Video Lightbox Modal */}
      {isVideoModalOpen && parsedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-dark/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-neutral-dark shadow-2xl border border-white/10 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-neutral-dark/80 text-white hover:bg-white/20 transition-colors shadow-lg cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Embedded Player */}
            {parsedVideo.type === "youtube" || parsedVideo.type === "vimeo" ? (
              <iframe
                src={parsedVideo.embedUrl}
                title={`${title} video player`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={parsedVideo.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
