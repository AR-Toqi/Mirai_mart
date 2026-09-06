"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Info,
  DollarSign,
  Package,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  Star,
  Eye,
  Save,
  Send,
  Wand2,
  Image as ImageIcon,
  Tag,
  X,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type {
  ProductFormData,
  AdminCategoryItem,
  AdminVariantInput,
} from "@/actions/admin";
import {
  createAdminProductAction,
  updateAdminProductAction,
  uploadProductMediaAction,
} from "@/actions/admin";

type Props = {
  mode: "create" | "edit";
  initialData?: ProductFormData;
  categories: AdminCategoryItem[];
};

// Preset high quality product photography for one-click testing
const PRESET_PRODUCT_IMAGES = [
  {
    label: "Toy Train Set",
    url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Smart Watch",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Robot STEM Companion",
    url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Sensory Pastel Blocks",
    url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Galaxy Planetarium Lamp",
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Speed Racer Car",
    url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&auto=format&fit=crop&q=80",
  },
];

const AGE_RANGES = ["0–1 yr", "1–3 yrs", "3–5 yrs", "5–8 yrs", "8+ yrs", "All Ages"];
const UNIT_OPTIONS = ["Piece", "Set", "Box", "Pack", "Pair"];
const BADGE_OPTIONS = ["None", "New", "Best Seller", "Sale", "-20%"] as const;

export function ProductForm({ mode, initialData, categories }: Props) {
  const router = useRouter();

  // Primary form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [curatorNotes, setCuratorNotes] = useState(initialData?.curatorNotes || "");

  // Category and dynamic fields
  const [categorySlug, setCategorySlug] = useState(
    initialData?.categorySlug || categories[0]?.slug || "educational-toys"
  );
  const [ageRange, setAgeRange] = useState(initialData?.ageRange || "3–5 yrs");
  const [badge, setBadge] = useState<"New" | "Best Seller" | "Sale" | "-20%" | null>(
    initialData?.badge || null
  );

  // Tags
  const [tags, setTags] = useState<string[]>(
    initialData?.tags?.length ? initialData.tags : ["Educational", "Montessori"]
  );
  const [tagInput, setTagInput] = useState("");

  // Media
  const [images, setImages] = useState<string[]>(
    initialData?.images?.length
      ? initialData.images
      : [PRESET_PRODUCT_IMAGES[0].url]
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Pricing
  const [sellPrice, setSellPrice] = useState<string>(
    initialData?.price ? String(initialData.price) : "1250"
  );
  const [regularPrice, setRegularPrice] = useState<string>(
    initialData?.compareAtPrice ? String(initialData.compareAtPrice) : "1650"
  );
  const [buyingPrice, setBuyingPrice] = useState<string>(
    initialData?.buyingPrice ? String(initialData.buyingPrice) : "900"
  );

  // Inventory
  const [sku, setSku] = useState(
    initialData?.sku || `MM-PR-${Math.floor(100 + Math.random() * 900)}`
  );
  const [unitName, setUnitName] = useState(initialData?.unitName || "Piece");
  const [stock, setStock] = useState<string>(
    initialData?.stock !== undefined ? String(initialData.stock) : "100"
  );
  const [initialSold, setInitialSold] = useState<string>(
    initialData?.initialSold !== undefined ? String(initialData.initialSold) : "0"
  );

  // Variants matrix
  const [variants, setVariants] = useState<AdminVariantInput[]>(
    initialData?.variants || []
  );
  const [newVariantTitle, setNewVariantTitle] = useState("");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantStock, setNewVariantStock] = useState("");
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // Technical Specs (for Gadgets / Decor)
  const [techSpecs, setTechSpecs] = useState<Record<string, string>>(
    initialData?.techSpecs || {
      Material: "Eco-friendly natural wood & ABS",
      Dimensions: "24 x 18 x 12 cm",
      Warranty: "6 Months Official Warranty",
    }
  );

  // Active sub-navigation anchor tab
  const [activeTab, setActiveTab] = useState<
    "basic" | "media" | "pricing" | "inventory" | "variants" | "additional"
  >("basic");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Derive active category object
  const currentCategory = useMemo(() => {
    return (
      categories.find((c) => c.slug === categorySlug) ||
      categories[0] || {
        id: "cat-default",
        name: "Toys, Educational",
        slug: "educational-toys",
      }
    );
  }, [categories, categorySlug]);

  const isAgeCategory = useMemo(() => {
    const s = categorySlug.toLowerCase();
    return (
      s.includes("toy") ||
      s.includes("baby") ||
      s.includes("kid") ||
      s.includes("combo")
    );
  }, [categorySlug]);

  // Handle auto-generating SKU
  function handleGenerateSku() {
    const prefix = currentCategory.name
      .split(" ")
      .map((w) => w[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 3);
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSku(`MM-${prefix || "PRD"}-${rand}`);
  }

  // Handle adding image URL
  function handleAddImageUrl() {
    if (!newImageUrl.trim()) return;
    if (!images.includes(newImageUrl.trim())) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
    }
    setNewImageUrl("");
  }

  // Handle removing image
  function handleRemoveImage(index: number) {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  // Handle setting primary image (moves to index 0)
  function handleSetPrimaryImage(index: number) {
    if (index === 0) return;
    const selected = images[index];
    const filtered = images.filter((_, i) => i !== index);
    setImages([selected, ...filtered]);
  }

  // Handle local file upload (drag & drop or file picker)
  async function handleFileUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select valid image files (PNG, JPG, WebP).");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds 5 MB limit.`);
        continue;
      }

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await uploadProductMediaAction(fd);
        if (res.success && res.url) {
          setImages((prev) => [...prev, res.url!]);
        } else {
          setUploadError(res.error || `Failed to upload ${file.name}`);
        }
      } catch (err: any) {
        setUploadError(err.message || "Failed to upload file");
      }
    }
    setIsUploading(false);
  }

  // Handle adding a tag
  function handleAddTag() {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim();
    if (!tags.includes(cleanTag)) {
      setTags((prev) => [...prev, cleanTag]);
    }
    setTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  }

  // Handle adding a variant
  function handleAddVariantRow() {
    if (!newVariantTitle.trim()) return;

    const newVar: AdminVariantInput = {
      id: crypto.randomUUID(),
      title: newVariantTitle.trim(),
      sku: newVariantSku.trim() || `${sku}-${variants.length + 1}`,
      price: Number(newVariantPrice) || Number(sellPrice) || 1250,
      stock: Number(newVariantStock) || 20,
    };

    setVariants((prev) => [...prev, newVar]);
    setNewVariantTitle("");
    setNewVariantSku("");
    setNewVariantPrice("");
    setNewVariantStock("");
    setIsAddingVariant(false);
  }

  function handleRemoveVariant(id?: string) {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }

  // Rich text formatting toolbar helper
  function handleInsertFormat(prefix: string, suffix: string = "") {
    setDescription((prev) => {
      return prev ? `${prev}\n${prefix}Sample Text${suffix}` : `${prefix}Sample Text${suffix}`;
    });
  }

  // Handle submission
  async function handleSubmit(targetStatus: "active" | "draft") {
    if (!title.trim()) {
      setSubmitError("Please provide a product name.");
      return;
    }

    if (!sellPrice || Number(sellPrice) <= 0) {
      setSubmitError("Please enter a valid selling price.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const payload: ProductFormData = {
      id: initialData?.id,
      title: title.trim(),
      slug: slug.trim() || undefined,
      shortDescription: shortDescription.trim(),
      description: description.trim() || `${title} — Curated by Mirai Mart.`,
      curatorNotes: curatorNotes.trim(),
      category: currentCategory.name,
      categorySlug: currentCategory.slug,
      categoryId: currentCategory.id,
      ageRange: isAgeCategory ? ageRange : "All Ages",
      tags: tags,
      badge: badge,
      price: Number(sellPrice),
      compareAtPrice: regularPrice ? Number(regularPrice) : null,
      buyingPrice: buyingPrice ? Number(buyingPrice) : null,
      sku: sku.trim() || `MM-PR-${Date.now().toString().slice(-4)}`,
      unitName: unitName,
      stock: Number(stock) || 0,
      initialSold: Number(initialSold) || 0,
      images: images.length > 0 ? images : [PRESET_PRODUCT_IMAGES[0].url],
      videoUrl: videoUrl.trim() || undefined,
      status: targetStatus,
      variants: variants,
      techSpecs: techSpecs,
    };

    try {
      if (mode === "create") {
        const res = await createAdminProductAction(payload);
        if (!res.success) {
          throw new Error(res.error || "Failed to create product");
        }
        setSubmitSuccess("Product created successfully! Redirecting to catalog...");
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1200);
      } else {
        const targetId = initialData?.id || "";
        const res = await updateAdminProductAction(targetId, payload);
        if (!res.success) {
          throw new Error(res.error || "Failed to update product");
        }
        setSubmitSuccess("Product updated successfully! Redirecting to catalog...");
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Live preview derived metrics
  const previewSellPrice = Number(sellPrice) || 1250;
  const previewRegularPrice = regularPrice ? Number(regularPrice) : null;
  const previewStock = Number(stock) || 0;
  const isOutOfStock = previewStock <= 0;
  const discountPct =
    previewRegularPrice && previewRegularPrice > previewSellPrice
      ? Math.round(((previewRegularPrice - previewSellPrice) / previewRegularPrice) * 100)
      : null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Header Row matching add-new_screen.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark tracking-tight">
            {mode === "create" ? "Add New Product" : `Edit Product`}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-neutral-muted">
            {mode === "create"
              ? "Fill in the details below to add a new product to your store."
              : `Update details, pricing, inventory, and variants for ${title || "this product"}.`}
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs sm:text-sm font-semibold hover:bg-neutral-bg transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Save className="w-4 h-4 text-neutral-muted" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit("active")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:opacity-95 transition-all shadow-xs cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{mode === "create" ? "Publish Product" : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Notifications Alert Banner */}
      {submitError && (
        <div className="bg-error-surface border border-error/30 text-error rounded-xl p-4 flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="p-1 hover:bg-error-surface/60 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {submitSuccess && (
        <div className="bg-success-surface border border-success/30 text-success-foreground rounded-xl p-4 flex items-center justify-between shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        </div>
      )}

      {/* Quick Anchor Tabs matching add-new_screen.png */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-border/60 scrollbar-none">
        {[
          { id: "basic", label: "Basic Info", icon: Info },
          { id: "media", label: "Media", icon: ImageIcon },
          { id: "pricing", label: "Pricing", icon: DollarSign },
          { id: "inventory", label: "Inventory", icon: Package },
          { id: "variants", label: "Variants", icon: Layers },
          { id: "additional", label: "SEO & Additional", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                const el = document.getElementById(`section-${tab.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary-surface text-primary border border-primary/20"
                  : "bg-surface text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Grid (Left: Form Cards, Right: Live Product Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Cards (approx. 68%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div
            id="section-basic"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-border/60">
              <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                Basic Information
              </h2>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="block font-sans font-semibold text-xs text-neutral-dark">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (mode === "create" && !slug) {
                    // Auto-slugify
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                    );
                  }
                }}
                placeholder="e.g. Hot Wheels Car Collection Set"
                className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-4 py-2.5 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Short Description (SEO & Data Feed) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Short Description (SEO & Data Feed) <span className="text-error">*</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-muted">
                  {shortDescription.length}/160
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={160}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Write a short teaser description for search results and social share cards..."
                className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-4 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Product Description with Toolbar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Product Description <span className="text-error">*</span>
                </label>
                <span className="text-[11px] font-mono text-neutral-muted">
                  {description.length}/2000
                </span>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-1.5 bg-neutral-bg rounded-t-xl border border-b-0 border-neutral-border">
                <button
                  type="button"
                  onClick={() => handleInsertFormat("**", "**")}
                  className="px-2 py-1 rounded-md text-xs font-bold text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat("*", "*")}
                  className="px-2 py-1 rounded-md text-xs italic text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat("<u>", "</u>")}
                  className="px-2 py-1 rounded-md text-xs underline text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Underline"
                >
                  U
                </button>
                <div className="h-4 w-[1px] bg-neutral-border mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertFormat("• ")}
                  className="px-2 py-1 rounded-md text-xs font-medium text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Bullet list"
                >
                  • Bullet
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat("1. ")}
                  className="px-2 py-1 rounded-md text-xs font-medium text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Numbered list"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertFormat("[Link title](", ")")}
                  className="px-2 py-1 rounded-md text-xs font-medium text-neutral-dark hover:bg-surface transition-colors cursor-pointer"
                  title="Insert Link"
                >
                  Link
                </button>
              </div>

              <textarea
                rows={5}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write detailed product description, craftsmanship, materials, safety standards..."
                className="w-full bg-neutral-bg/40 border border-neutral-border rounded-b-xl px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
              />
            </div>

            {/* Curator Notes ("Why We Love It") */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Why We Love It (Curator Editorial Notes)
                </label>
              </div>
              <textarea
                rows={2}
                value={curatorNotes}
                onChange={(e) => setCuratorNotes(e.target.value)}
                placeholder="e.g. Hand-carved from natural beechwood with non-toxic water-based paints. A timeless Montessori gift."
                className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-4 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          {/* Card 2: Category & Dynamic Attributes (SEO & Additional specs) */}
          <div
            id="section-additional"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-border/60">
              <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                Category & Attributes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Badge */}
              <div className="space-y-1.5">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Product Badge / Label
                </label>
                <select
                  value={badge || "None"}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBadge(val === "None" ? null : (val as any));
                  }}
                  className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                >
                  {BADGE_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Age Range for Toys & Kids */}
            {isAgeCategory && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Target Age Range (Shop By Age)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {AGE_RANGES.map((age) => {
                    const isSelected = ageRange === age;
                    return (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setAgeRange(age)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary text-white shadow-xs"
                            : "bg-neutral-bg border border-neutral-border text-neutral-muted hover:text-neutral-dark hover:border-primary/40"
                        }`}
                      >
                        {age}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags Input */}
            <div className="space-y-2 pt-1">
              <label className="block font-sans font-semibold text-xs text-neutral-dark">
                Tags (Search & Filter Facets)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. trending, best-seller, montessori, eco-wood"
                  className="flex-1 bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 rounded-xl bg-primary-surface text-primary hover:bg-primary hover:text-white transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-neutral-bg border border-neutral-border text-neutral-dark text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-neutral-muted hover:text-error cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Product Media */}
          <div
            id="section-media"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-lg text-neutral-dark">
                  Product Media
                </h2>
              </div>
              <span className="text-xs text-neutral-muted">
                {images.length} image{images.length !== 1 ? "s" : ""} added
              </span>
            </div>

            {/* Drag & Drop Dropzone to InsForge Storage */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                isDragging
                  ? "border-primary bg-primary-surface/30 scale-[1.01]"
                  : "border-neutral-border/80 hover:border-primary/50 bg-neutral-bg/30"
              }`}
            >
              <input
                type="file"
                id="product-image-upload"
                multiple
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />
              <label
                htmlFor="product-image-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-surface text-primary flex items-center justify-center shadow-2xs">
                  {isUploading ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-neutral-dark">
                    {isUploading
                      ? "Uploading photos to storage..."
                      : "Drag & drop photos here, or click to browse"}
                  </p>
                  <p className="font-sans text-xs text-neutral-muted">
                    Supports PNG, JPG, WebP up to 5 MB per file
                  </p>
                </div>
              </label>
            </div>

            {uploadError && (
              <div className="p-3 bg-error-surface border border-error/30 text-error rounded-xl text-xs flex items-center justify-between">
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="p-1 hover:bg-error-surface/60 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Add Image by URL or Presets */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Sample Preset Buttons for Instant Testing */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PRESET_PRODUCT_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        if (!images.includes(preset.url)) {
                          setImages((prev) => [...prev, preset.url]);
                        }
                      }}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-bg border border-neutral-border/80 text-neutral-dark hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                {images.map((img, idx) => {
                  const isPrimary = idx === 0;
                  return (
                    <div
                      key={img + idx}
                      className={`group relative aspect-square rounded-xl overflow-hidden border transition-all ${
                        isPrimary
                          ? "border-primary ring-2 ring-primary/20 shadow-xs"
                          : "border-neutral-border/80 hover:border-neutral-dark/40"
                      }`}
                    >
                      <Image
                        src={img}
                        alt="Product preview"
                        fill
                        sizes="120px"
                        className="object-cover"
                        unoptimized={img.startsWith("http")}
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold shadow-xs">
                          Primary
                        </div>
                      )}

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-neutral-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="p-1.5 rounded-lg bg-surface text-neutral-dark hover:text-primary text-[10px] font-bold cursor-pointer"
                            title="Make primary image"
                          >
                            Set Main
                          </button>
                        )}
                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-lg bg-error text-white hover:bg-error/90 cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Video URL */}
              <div className="space-y-1 pt-2">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Product Showcase Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://... (MP4 or YouTube embed)"
                  className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Pricing */}
          <div
            id="section-pricing"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-border/60">
              <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                Pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sell Price */}
              <div className="space-y-1.5">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Sell Price <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans font-bold text-neutral-muted">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    placeholder="1250"
                    className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-bold text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Regular Price (Old Strikethrough Price) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-sans font-semibold text-xs text-neutral-dark">
                    Regular Price (Old Price)
                  </label>
                  <span className="text-[10px] text-neutral-muted">Optional</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans font-bold text-neutral-muted">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    placeholder="1650"
                    className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Buying Price */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-sans font-semibold text-xs text-neutral-dark">
                    Buying Price (Cost)
                  </label>
                  <span className="text-[10px] text-neutral-muted">Optional</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans font-bold text-neutral-muted">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(e.target.value)}
                    placeholder="900"
                    className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Inventory */}
          <div
            id="section-inventory"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-neutral-border/60">
              <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                Inventory & Stock
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* SKU */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block font-sans font-semibold text-xs text-neutral-dark">
                    SKU <span className="text-error">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSku}
                    className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. MM-HW-001"
                  className="w-full font-mono bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Unit Name */}
              <div className="space-y-1.5">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Unit Name <span className="text-error">*</span>
                </label>
                <select
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3 py-2.5 text-sm text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                >
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Quantity (Stock) <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="100"
                  className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2.5 text-sm font-bold text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card 6: Variants Matrix */}
          <div
            id="section-variants"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-neutral-dark">
                    Product Variants
                  </h2>
                  <p className="text-xs text-neutral-muted">
                    Add product variants like size, color, weight, or bundle tier
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingVariant(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-surface text-primary hover:bg-primary hover:text-white transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            {/* Inline Add Variant Drawer / Form */}
            {isAddingVariant && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary-surface/20 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-neutral-dark">
                    New Variant Details
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingVariant(false)}
                    className="text-neutral-muted hover:text-neutral-dark cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newVariantTitle}
                    onChange={(e) => setNewVariantTitle(e.target.value)}
                    placeholder="Title (e.g. Deluxe Edition)"
                    className="bg-surface border border-neutral-border rounded-lg px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={newVariantSku}
                    onChange={(e) => setNewVariantSku(e.target.value)}
                    placeholder="SKU (e.g. MM-WT-001-DLX)"
                    className="bg-surface border border-neutral-border rounded-lg px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary font-mono"
                  />
                  <input
                    type="number"
                    value={newVariantPrice}
                    onChange={(e) => setNewVariantPrice(e.target.value)}
                    placeholder="Price in ৳"
                    className="bg-surface border border-neutral-border rounded-lg px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <input
                    type="number"
                    value={newVariantStock}
                    onChange={(e) => setNewVariantStock(e.target.value)}
                    placeholder="Stock Qty"
                    className="bg-surface border border-neutral-border rounded-lg px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingVariant(false)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-border text-xs text-neutral-muted hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-2xs"
                  >
                    Save Variant
                  </button>
                </div>
              </div>
            )}

            {/* Variant List or Empty State */}
            {variants.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-neutral-border/80 bg-neutral-bg/40 space-y-2">
                <p className="text-sm font-semibold text-neutral-muted">
                  No variants added yet.
                </p>
                <p className="text-xs text-neutral-muted max-w-sm mx-auto">
                  Click &apos;Add Variant&apos; to create alternative color, size, or material options.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-border/60 border border-neutral-border/80 rounded-xl overflow-hidden">
                {variants.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    className="flex items-center justify-between p-3.5 bg-surface hover:bg-neutral-bg/30 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-sm text-neutral-dark">
                          {v.title}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-muted bg-neutral-bg px-1.5 py-0.5 rounded border border-neutral-border/60">
                          {v.sku}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-muted">
                        <span>
                          Price:{" "}
                          <strong className="text-neutral-dark font-sans">
                            {formatCurrency(v.price)}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Stock:{" "}
                          <strong className="text-neutral-dark">{v.stock}</strong>
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="p-1.5 rounded-lg text-neutral-muted hover:text-error hover:bg-error-surface transition-colors cursor-pointer"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Live Product Preview (approx. 32%) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          {/* Live Product Preview Card matching add-new_screen.png */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-border/60">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Eye className="w-3.5 h-3.5" />
                <span>Product Preview</span>
              </span>
              <span className="text-[11px] font-sans text-neutral-muted">
                Live Storefront Card
              </span>
            </div>

            {/* Product Image Box */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-bg relative border border-neutral-border/60 flex items-center justify-center">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={title || "Product preview"}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                  unoptimized={images[0].startsWith("http")}
                />
              ) : (
                <div className="text-center text-neutral-muted p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs">No image provided</span>
                </div>
              )}

              {/* Active Badge Pill */}
              {badge && (
                <div
                  className={`absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs ${
                    badge === "New"
                      ? "bg-success-light text-success"
                      : badge === "Best Seller"
                      ? "bg-primary-surface text-primary"
                      : badge === "Sale"
                      ? "bg-error-light text-error"
                      : "bg-warning-light text-warning"
                  }`}
                >
                  {badge}
                </div>
              )}
            </div>

            {/* Product Title & Pricing */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-muted">
                {currentCategory.name}
              </span>
              <h3 className="font-heading font-bold text-lg text-neutral-dark leading-snug">
                {title || "Product Name"}
              </h3>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="font-sans font-bold text-xl text-neutral-dark">
                  {formatCurrency(previewSellPrice)}
                </span>
                {previewRegularPrice && previewRegularPrice > previewSellPrice && (
                  <>
                    <span className="font-sans text-xs text-neutral-muted line-through">
                      {formatCurrency(previewRegularPrice)}
                    </span>
                    {discountPct && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warning-light text-warning">
                        -{discountPct}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-neutral-muted font-sans">
                  (128 reviews)
                </span>
              </div>

              {/* Short Description */}
              <p className="font-sans text-xs text-neutral-muted line-clamp-3 pt-1">
                {shortDescription ||
                  "This is a short description of the product. It will appear in search results and storefront cards."}
              </p>
            </div>

            {/* Trust and Stock Badges */}
            <div className="pt-2 border-t border-neutral-border/60 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    isOutOfStock ? "text-error" : "text-success"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? "Out of Stock" : "In Stock"}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-muted">
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span>Free shipping on orders over ৳ 3,000</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>7 Days Easy Return Policy</span>
              </div>
            </div>

            {/* Product Highlights derived from features */}
            <div className="pt-3 border-t border-neutral-border/60 bg-neutral-bg/50 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-dark">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Product Highlights</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-muted">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-success flex-shrink-0" />
                  <span>High quality child-safe material</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-success flex-shrink-0" />
                  <span>Perfect for {isAgeCategory ? ageRange : "family gifting"}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-success flex-shrink-0" />
                  <span>Curated & tested by Mirai Mart</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Action Callout Card matching add-new_screen.png */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm sm:text-base text-neutral-dark">
                  Ready to make it live?
                </h4>
                <p className="font-sans text-xs text-neutral-muted">
                  Save as draft or publish your product when you&apos;re ready.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("draft")}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs sm:text-sm font-semibold hover:bg-neutral-bg transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5 text-neutral-muted" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("active")}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:opacity-95 transition-all shadow-xs cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{mode === "create" ? "Publish" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
