"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Save,
  Eye,
  Truck,
  UploadCloud,
  Loader2,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  type StorefrontContentConfig,
  type HeroSlideConfig,
  updateAdminStorefrontContentAction,
  uploadBannerImageAction,
} from "@/actions/admin";

interface WebsiteContentManagerProps {
  initialContent: StorefrontContentConfig;
}

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

export function WebsiteContentManager({
  initialContent,
}: WebsiteContentManagerProps) {
  const [content, setContent] = useState<StorefrontContentConfig>(() => {
    let slides = DEFAULT_SLIDES;
    if (Array.isArray(initialContent.hero?.slides) && initialContent.hero.slides.length > 0) {
      slides = [0, 1, 2].map((idx) => {
        const existing = initialContent.hero.slides[idx];
        return existing
          ? {
              ...DEFAULT_SLIDES[idx],
              ...existing,
              ctaPrimaryActive: existing.ctaPrimaryActive !== false,
              ctaSecondaryActive: existing.ctaSecondaryActive === true,
            }
          : DEFAULT_SLIDES[idx];
      });
    } else if (initialContent.hero?.imageUrl) {
      slides = [
        {
          ...DEFAULT_SLIDES[0],
          imageUrl: initialContent.hero.imageUrl,
          ctaPrimaryActive: initialContent.hero.ctaPrimaryActive !== false,
          ctaPrimaryText: initialContent.hero.ctaPrimaryText || DEFAULT_SLIDES[0].ctaPrimaryText,
          ctaPrimaryLink: initialContent.hero.ctaPrimaryLink || DEFAULT_SLIDES[0].ctaPrimaryLink,
          ctaSecondaryActive: initialContent.hero.ctaSecondaryActive === true,
          ctaSecondaryText: initialContent.hero.ctaSecondaryText || DEFAULT_SLIDES[0].ctaSecondaryText,
          ctaSecondaryLink: initialContent.hero.ctaSecondaryLink || DEFAULT_SLIDES[0].ctaSecondaryLink,
        },
        DEFAULT_SLIDES[1],
        DEFAULT_SLIDES[2],
      ];
    }

    return {
      hero: {
        ...initialContent.hero,
        slides,
      },
      announcement: initialContent.announcement,
    };
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSlide = content.hero.slides[activeSlideIndex] || DEFAULT_SLIDES[0];

  const updateCurrentSlide = (updates: Partial<HeroSlideConfig>) => {
    setContent((prev) => {
      const updatedSlides = [...prev.hero.slides];
      updatedSlides[activeSlideIndex] = {
        ...updatedSlides[activeSlideIndex],
        ...updates,
      };
      return {
        ...prev,
        hero: {
          ...prev.hero,
          slides: updatedSlides,
          ...(activeSlideIndex === 0
            ? {
                imageUrl: updates.imageUrl ?? prev.hero.slides[0].imageUrl,
                ctaPrimaryActive: updates.ctaPrimaryActive ?? prev.hero.slides[0].ctaPrimaryActive,
                ctaPrimaryText: updates.ctaPrimaryText ?? prev.hero.slides[0].ctaPrimaryText,
                ctaPrimaryLink: updates.ctaPrimaryLink ?? prev.hero.slides[0].ctaPrimaryLink,
                ctaSecondaryActive: updates.ctaSecondaryActive ?? prev.hero.slides[0].ctaSecondaryActive,
                ctaSecondaryText: updates.ctaSecondaryText ?? prev.hero.slides[0].ctaSecondaryText,
                ctaSecondaryLink: updates.ctaSecondaryLink ?? prev.hero.slides[0].ctaSecondaryLink,
              }
            : {}),
        },
      };
    });
  };

  // Preset gallery for quick selection
  const PRESET_IMAGES = [
    {
      label: "Sensory Toys & Play",
      url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1600&auto=format&fit=crop&q=80",
    },
    {
      label: "Robotics & Tech Gadgets",
      url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&auto=format&fit=crop&q=80",
    },
    {
      label: "Creative Pastel Blocks",
      url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1600&auto=format&fit=crop&q=80",
    },
    {
      label: "Default Graphic Vector",
      url: "/images/hero-showcase.svg",
    },
  ];

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    // Validate size: max 5 MB
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(
        `File is too large (${sizeMb} MB). Maximum allowed size is 5 MB.`
      );
      return;
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      setUploadError(
        "Invalid file type. Please upload a valid image file (PNG, JPG, WebP, SVG)."
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadBannerImageAction(formData);
      if (res.success && res.url) {
        updateCurrentSlide({ imageUrl: res.url });
        setUploadSuccess(
          `Uploaded "${file.name}" to Slide ${activeSlideIndex + 1} successfully! Preview updated below.`
        );
        setTimeout(() => setUploadSuccess(null), 6000);
      } else {
        setUploadError(res.error || "Failed to upload image. Please try again.");
      }
    } catch (err) {
      console.error("[WebsiteContentManager] Upload error:", err);
      setUploadError("An unexpected error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await updateAdminStorefrontContentAction(content);
      if (res.success && res.content) {
        let savedSlides = DEFAULT_SLIDES;
        if (Array.isArray(res.content.hero?.slides) && res.content.hero.slides.length > 0) {
          savedSlides = res.content.hero.slides;
        }
        setContent({
          hero: {
            ...res.content.hero,
            slides: savedSlides,
          },
          announcement: res.content.announcement,
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 5000);
      }
    } catch (err) {
      console.error("[WebsiteContentManager] Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-12">
      {/* Header with Save CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border">
        <div>
          <h2 className="font-heading font-bold text-2xl text-neutral-dark flex items-center gap-2">
            <span>Website Content Manager</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              3-Slide CMS
            </span>
          </h2>
          <p className="text-xs text-neutral-muted mt-1">
            Manage your full-width background banner (3 slides, 3s auto-play, centered buttons, no text overlay) and the top announcement bar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Preview Storefront</span>
            <ExternalLink className="w-3 h-3 text-neutral-muted" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-tertiary text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Publishing..." : "Publish Changes"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-success-surface border border-success/30 text-success-foreground text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Website content successfully saved! 3-slide full-width banner is now live on the storefront.</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="underline font-bold hover:text-success"
          >
            View Live →
          </Link>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. Homepage Hero Banner (3 Slides Full-Width Background)      */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-dark">
                Homepage Hero Banner (3 Slides)
              </h3>
              <p className="text-[11px] text-neutral-muted">
                Full-width background image banner with 3-second auto-play, centered CTA buttons, and no title/subtitle overlays.
              </p>
            </div>
          </div>
        </div>

        {/* Live Visual Preview (Full-Width Background + Centered Buttons, No Text Overlays) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block">
              Live Preview (Slide {activeSlideIndex + 1} of 3)
            </span>
            <span className="text-[11px] font-medium text-neutral-muted">
              Auto-advances every 3 seconds on the storefront
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-neutral-border bg-neutral-dark min-h-[260px] sm:min-h-[320px] flex items-center justify-center text-white group">
            {/* Background Image Preview */}
            <Image
              src={currentSlide.imageUrl || "/images/hero-showcase.svg"}
              alt={`Slide ${activeSlideIndex + 1} Preview`}
              fill
              className="object-cover w-full h-full transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, 800px"
            />

            {/* Middle-Aligned Buttons Overlay */}
            {(currentSlide.ctaPrimaryActive || currentSlide.ctaSecondaryActive) ? (
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 p-4">
                {currentSlide.ctaPrimaryActive && currentSlide.ctaPrimaryText && (
                  <span className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <span>{currentSlide.ctaPrimaryText}</span>
                  </span>
                )}
                {currentSlide.ctaSecondaryActive && currentSlide.ctaSecondaryText && (
                  <span className="px-5 py-2.5 rounded-xl bg-white/95 text-neutral-dark text-xs font-semibold shadow-lg backdrop-blur-xs">
                    {currentSlide.ctaSecondaryText}
                  </span>
                )}
              </div>
            ) : (
              <div className="relative z-10 px-4 py-2 rounded-lg bg-neutral-dark/60 backdrop-blur-md text-[11px] text-white/70">
                Buttons disabled (Clean image only)
              </div>
            )}

            {/* Indicator Dots in Preview */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-neutral-dark/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3 Slides Tab Switcher */}
        <div className="space-y-3 pt-2 border-t border-neutral-border/60">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-neutral-dark">
              Select Slide to Edit (1 of 3)
            </label>
            <span className="text-[11px] text-neutral-muted font-medium">
              Configure image design & buttons for each slide individually
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => {
              const slide = content.hero.slides[idx] || DEFAULT_SLIDES[idx];
              const isActive = activeSlideIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-neutral-border hover:border-primary/40 bg-surface"
                  }`}
                >
                  <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-neutral-bg shrink-0 border border-neutral-border">
                    <Image
                      src={slide.imageUrl || "/images/hero-showcase.svg"}
                      alt={`Slide ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="60px"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-dark">
                        Slide {idx + 1}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-muted truncate mt-0.5">
                      {slide.ctaPrimaryActive ? slide.ctaPrimaryText : "Buttons disabled"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Custom Image Upload for Current Slide                         */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-neutral-dark">
              Upload Custom Banner Image Design for Slide {activeSlideIndex + 1}
            </label>
            <span className="text-[11px] font-medium text-neutral-muted">
              Recommended: <strong className="text-neutral-dark">1200 × 800 px (or 16:9 / 21:9)</strong> • Max: <strong className="text-neutral-dark">Up to 5 MB</strong>
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-2.5 ${
              isDragOver
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-neutral-border hover:border-primary/50 hover:bg-neutral-bg/60 bg-surface"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-primary-surface text-primary flex items-center justify-center shadow-xs">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-neutral-dark">
                {uploading
                  ? `Uploading banner design to Slide ${activeSlideIndex + 1}...`
                  : `Click or drag & drop banner design for Slide ${activeSlideIndex + 1}`}
              </p>
              <p className="text-[11px] text-neutral-muted mt-0.5">
                Support for PNG, JPG, WebP, SVG • Maximum file size up to 5 MB
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                Size: 1200 × 800 px (or full-width wide)
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary text-neutral-dark">
                Max 5 MB
              </span>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-error-surface border border-error/30 text-error-foreground text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-success-surface border border-success/30 text-success-foreground text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
              <FileCheck className="w-4 h-4 text-success shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        {/* Preset Gallery & Direct URL for current slide */}
        <div className="pt-2 border-t border-neutral-border/60 space-y-3">
          <label className="block text-xs font-bold text-neutral-dark">
            Or Choose from Preset Gallery for Slide {activeSlideIndex + 1}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.url}
                type="button"
                onClick={() => updateCurrentSlide({ imageUrl: img.url })}
                className={`relative rounded-xl overflow-hidden border p-2 text-left transition-all ${
                  currentSlide.imageUrl === img.url
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-neutral-border hover:border-primary/50"
                }`}
              >
                <div className="relative h-16 w-full rounded-lg overflow-hidden bg-neutral-bg mb-1.5">
                  <Image
                    src={img.url}
                    alt={img.label}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <p className="text-[11px] font-semibold text-neutral-dark truncate">
                  {img.label}
                </p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-muted mb-1">
              Active Image URL for Slide {activeSlideIndex + 1}
            </label>
            <input
              type="text"
              value={currentSlide.imageUrl}
              onChange={(e) => updateCurrentSlide({ imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
              placeholder="/uploads/banners/... or https://..."
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Banner Buttons (Middle-Aligned) with Toggle Switchbars         */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4 pt-4 border-t border-neutral-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-neutral-dark flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>Middle-Aligned CTA Buttons for Slide {activeSlideIndex + 1}</span>
            </h4>
            <span className="text-[11px] text-neutral-muted">
              Toggle each button Active or Disabled. When active, buttons are centered in the middle.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Button Control Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentSlide.ctaPrimaryActive
                  ? "border-primary/40 bg-surface shadow-2xs"
                  : "border-neutral-border bg-neutral-bg/50 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-border/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-xs font-bold text-neutral-dark">
                    Primary Button
                  </span>
                </div>

                {/* Primary Button Switchbar */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[11px] font-semibold text-neutral-dark">
                    {currentSlide.ctaPrimaryActive ? "Active" : "Disabled"}
                  </span>
                  <input
                    type="checkbox"
                    checked={currentSlide.ctaPrimaryActive}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaPrimaryActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-muted mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!currentSlide.ctaPrimaryActive}
                    value={currentSlide.ctaPrimaryText}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaPrimaryText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
                    placeholder="e.g. Shop New Arrivals"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-muted mb-1">
                    Link Destination
                  </label>
                  <input
                    type="text"
                    disabled={!currentSlide.ctaPrimaryActive}
                    value={currentSlide.ctaPrimaryLink}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaPrimaryLink: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono disabled:bg-neutral-100 disabled:text-neutral-400"
                    placeholder="/category/..."
                  />
                </div>
              </div>
            </div>

            {/* Secondary Button Control Card */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentSlide.ctaSecondaryActive
                  ? "border-primary/40 bg-surface shadow-2xs"
                  : "border-neutral-border bg-neutral-bg/50 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-border/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-dark"></span>
                  <span className="text-xs font-bold text-neutral-dark">
                    Secondary Button
                  </span>
                </div>

                {/* Secondary Button Switchbar */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[11px] font-semibold text-neutral-dark">
                    {currentSlide.ctaSecondaryActive ? "Active" : "Disabled"}
                  </span>
                  <input
                    type="checkbox"
                    checked={currentSlide.ctaSecondaryActive}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaSecondaryActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-dark"></div>
                </label>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-muted mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!currentSlide.ctaSecondaryActive}
                    value={currentSlide.ctaSecondaryText}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaSecondaryText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
                    placeholder="e.g. Explore Collections"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-muted mb-1">
                    Link Destination
                  </label>
                  <input
                    type="text"
                    disabled={!currentSlide.ctaSecondaryActive}
                    value={currentSlide.ctaSecondaryLink}
                    onChange={(e) =>
                      updateCurrentSlide({ ctaSecondaryLink: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono disabled:bg-neutral-100 disabled:text-neutral-400"
                    placeholder="/category/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. Top Announcement Bar CMS                                   */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-border/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary text-neutral-dark flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-dark">
                Top Announcement Bar
              </h3>
              <p className="text-[11px] text-neutral-muted">
                Displays promotional free delivery thresholds and active coupon codes at the very top of all store pages.
              </p>
            </div>
          </div>

          {/* Toggle Active */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="text-xs font-semibold text-neutral-dark">
              {content.announcement.isActive ? "Active (Visible)" : "Disabled (Hidden)"}
            </span>
            <input
              type="checkbox"
              checked={content.announcement.isActive}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: {
                    ...prev.announcement,
                    isActive: e.target.checked,
                  },
                }))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
          </label>
        </div>

        {/* Live Preview Box */}
        <div>
          <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block mb-2">
            Announcement Live Preview
          </span>
          {content.announcement.isActive ? (
            <div className="bg-secondary text-neutral-dark px-4 py-2.5 rounded-xl flex items-center justify-center gap-3 text-xs font-semibold shadow-inner">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>{content.announcement.text}</span>
              <span className="opacity-40">•</span>
              <span className="bg-neutral-dark text-secondary px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide">
                {content.announcement.highlightText}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-neutral-border bg-neutral-bg/60 text-center text-xs text-neutral-muted">
              Announcement Bar is currently disabled (hidden on storefront).
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-dark mb-1.5">
              Announcement Message
            </label>
            <input
              type="text"
              value={content.announcement.text}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: {
                    ...prev.announcement,
                    text: e.target.value,
                  },
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Free shipping on orders over ৳ 3,000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-dark mb-1.5">
              Promo Highlight / Code Badge
            </label>
            <input
              type="text"
              value={content.announcement.highlightText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: {
                    ...prev.announcement,
                    highlightText: e.target.value,
                  },
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Use code MIRAI10 for 10% off"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
