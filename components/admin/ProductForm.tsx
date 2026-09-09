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
  Play,
  Video,
  Palette,
  Ruler,
  Scale,
  SlidersHorizontal,
  Copy,
  RotateCcw,
  Camera,
} from "lucide-react";
import { formatCurrency, getColorHex } from "@/lib/utils";
import type {
  ProductFormData,
  AdminCategoryItem,
  AdminVariantInput,
} from "@/actions/admin";
import {
  createAdminProductAction,
  updateAdminProductAction,
  uploadProductMediaAction,
  deleteProductMediaAction,
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

export const COLOR_PRESETS = [
  "Pastel Blue",
  "Mint Green",
  "Natural Wood",
  "Warm Coral",
  "Sunflower Yellow",
  "Pure White",
  "Charcoal Black",
  "Lavender",
];

export const SIZE_PRESETS = [
  "Small",
  "Medium",
  "Large",
  "Deluxe (48 pcs)",
  "Jumbo (96 pcs)",
  "Compact",
];

export const WEIGHT_PRESETS = ["100g", "250g", "500g", "1kg", "2kg", "5kg"];

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

  // Media: strict 1 to 4 images
  const [images, setImages] = useState<string[]>(
    initialData?.images?.length ? initialData.images.slice(0, 4) : []
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || "");
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Storage cleanup tracking
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);
  const [newlyUploadedUrls, setNewlyUploadedUrls] = useState<Set<string>>(new Set());

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

  // Variants matrix & Option Builder
  const [variants, setVariants] = useState<AdminVariantInput[]>(
    initialData?.variants || []
  );

  // Enabled attribute types (Color, Size, Weight)
  const [enabledAttributes, setEnabledAttributes] = useState<{
    color: boolean;
    size: boolean;
    weight: boolean;
  }>(() => {
    const hasColor = Boolean(
      initialData?.variants?.some((v) => v.attributes?.color || v.attributes?.Color)
    );
    const hasSize = Boolean(
      initialData?.variants?.some((v) => v.attributes?.size || v.attributes?.Size)
    );
    const hasWeight = Boolean(
      initialData?.variants?.some((v) => v.attributes?.weight || v.attributes?.Weight)
    );
    return {
      color: hasColor,
      size: hasSize,
      weight: hasWeight,
    };
  });

  const [colorValues, setColorValues] = useState<string[]>(() => {
    const set = new Set<string>();
    initialData?.variants?.forEach((v) => {
      const c = v.attributes?.color || v.attributes?.Color;
      if (c) set.add(c);
    });
    return Array.from(set);
  });
  const [colorInput, setColorInput] = useState("");

  const [sizeValues, setSizeValues] = useState<string[]>(() => {
    const set = new Set<string>();
    initialData?.variants?.forEach((v) => {
      const s = v.attributes?.size || v.attributes?.Size;
      if (s) set.add(s);
    });
    return Array.from(set);
  });
  const [sizeInput, setSizeInput] = useState("");

  const [weightValues, setWeightValues] = useState<string[]>(() => {
    const set = new Set<string>();
    initialData?.variants?.forEach((v) => {
      const w = v.attributes?.weight || v.attributes?.Weight;
      if (w) set.add(w);
    });
    return Array.from(set);
  });
  const [weightInput, setWeightInput] = useState("");

  const [showOptionBuilder, setShowOptionBuilder] = useState(
    Boolean(
      initialData?.variants &&
        initialData.variants.length > 0 &&
        initialData.variants.some(
          (v) => v.attributes?.color || v.attributes?.size || v.attributes?.weight
        )
    )
  );

  const [variantSearch, setVariantSearch] = useState("");
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(null);
  const [catalogPickerVariantId, setCatalogPickerVariantId] = useState<string | null>(null);
  const [previewActiveVariantId, setPreviewActiveVariantId] = useState<string | null>(null);

  // Single variant addition
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [newVariantTitle, setNewVariantTitle] = useState("");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantStock, setNewVariantStock] = useState("");
  const [newVariantColor, setNewVariantColor] = useState("");
  const [newVariantSize, setNewVariantSize] = useState("");
  const [newVariantWeight, setNewVariantWeight] = useState("");

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

  // Real-time video source detection
  const parsedVideo = useMemo(() => {
    const trimmed = videoUrl.trim();
    if (!trimmed) return null;

    // YouTube regex (supports standard watch, share URLs, embeds, and /shorts/)
    const ytMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return {
        type: "youtube" as const,
        id: ytMatch[1],
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
        label: "YouTube Video",
      };
    }

    // Vimeo regex
    const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return {
        type: "vimeo" as const,
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
        label: "Vimeo Video",
      };
    }

    // Direct MP4 / WebM
    if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i) || trimmed.startsWith("http")) {
      return {
        type: "mp4" as const,
        embedUrl: trimmed,
        label: "Direct Video Link",
      };
    }

    return {
      type: "unknown" as const,
      embedUrl: trimmed,
      label: "External Video Link",
    };
  }, [videoUrl]);

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

  // Handle adding image URL (strictly up to 4 images)
  function handleAddImageUrl() {
    if (!newImageUrl.trim()) return;
    if (images.length >= 4) {
      setUploadError("Maximum 4 photos allowed. Please remove a photo before adding another.");
      return;
    }
    const clean = newImageUrl.trim();
    if (!images.includes(clean)) {
      setImages((prev) => [...prev, clean].slice(0, 4));
    }
    setNewImageUrl("");
    setUploadError(null);
  }

  // Handle removing image and staging/executing InsForge Storage cleanup
  async function handleRemoveImage(index: number) {
    const targetUrl = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);

    // If this image was uploaded in this session and not yet saved, purge immediately from storage
    if (newlyUploadedUrls.has(targetUrl)) {
      try {
        await deleteProductMediaAction([targetUrl]);
        setNewlyUploadedUrls((prev) => {
          const next = new Set(prev);
          next.delete(targetUrl);
          return next;
        });
      } catch (err) {
        console.warn("[ProductForm] Immediate storage prune warning:", err);
      }
    } else {
      // Stage for deletion when user clicks Save Draft or Publish Product
      setPendingDeletions((prev) => (prev.includes(targetUrl) ? prev : [...prev, targetUrl]));
    }
  }

  // Handle setting primary cover image (moves to slot 0)
  function handleSetPrimaryImage(index: number) {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    setImages([selected, ...remaining]);
  }

  // Handle local file upload (strictly up to 4 images)
  async function handleFileUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const fileArray = Array.from(files);
    const availableSlots = 4 - images.length;
    if (availableSlots <= 0) {
      setUploadError("Maximum 4 photos reached. Please delete a photo before uploading a new one.");
      return;
    }

    const filesToUpload = fileArray.slice(0, availableSlots);
    if (fileArray.length > availableSlots) {
      setUploadError(`Only ${availableSlots} slot(s) remaining (max 4). Additional files were skipped.`);
    }

    setIsUploading(true);
    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        setUploadError(`"${file.name}" is not a supported image. Please select PNG, JPG, or WebP.`);
        continue;
      }

      // 8 MB client-side check (safely within Next.js 10 MB limit)
      const MAX_FILE_BYTES = 8 * 1024 * 1024;
      if (file.size > MAX_FILE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`"${file.name}" is ${sizeMb} MB, exceeding the 8 MB upload limit. Please compress or select an image under 8 MB.`);
        continue;
      }

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await uploadProductMediaAction(fd);
        if (res.success && res.url) {
          const uploadedUrl = res.url;
          setImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, uploadedUrl];
          });
          setNewlyUploadedUrls((prev) => new Set(prev).add(uploadedUrl));
        } else {
          setUploadError(res.error || `Failed to upload "${file.name}". Please try again.`);
        }
      } catch (err: any) {
        const msg = String(err?.message || "");
        if (msg.includes("413") || msg.toLowerCase().includes("body exceeded") || msg.toLowerCase().includes("limit")) {
          setUploadError(
            `"${file.name}" exceeds the server body size limit. Please choose an image under 8 MB or compress the file.`
          );
        } else if (msg.includes("fetch") || msg.includes("NetworkError")) {
          setUploadError(`Network error while uploading "${file.name}". Please check your internet connection.`);
        } else {
          setUploadError(msg || `Failed to upload "${file.name}". Please retry with another file.`);
        }
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

  // -------------------------------------------------------------
  // Variant Management & Option Builder Handlers
  // -------------------------------------------------------------

  function handleToggleAttributeType(attr: "color" | "size" | "weight") {
    setEnabledAttributes((prev) => ({
      ...prev,
      [attr]: !prev[attr],
    }));
  }

  function handleAddAttributeValue(attr: "color" | "size" | "weight", val: string) {
    const trimmed = val.trim();
    if (!trimmed) return;

    if (attr === "color") {
      if (!colorValues.includes(trimmed)) setColorValues((p) => [...p, trimmed]);
      setColorInput("");
    } else if (attr === "size") {
      if (!sizeValues.includes(trimmed)) setSizeValues((p) => [...p, trimmed]);
      setSizeInput("");
    } else if (attr === "weight") {
      if (!weightValues.includes(trimmed)) setWeightValues((p) => [...p, trimmed]);
      setWeightInput("");
    }
  }

  function handleRemoveAttributeValue(attr: "color" | "size" | "weight", valToRemove: string) {
    if (attr === "color") {
      setColorValues((p) => p.filter((x) => x !== valToRemove));
    } else if (attr === "size") {
      setSizeValues((p) => p.filter((x) => x !== valToRemove));
    } else if (attr === "weight") {
      setWeightValues((p) => p.filter((x) => x !== valToRemove));
    }
  }

  function handleGenerateCombinations() {
    const activeAttrs: { type: "color" | "size" | "weight"; values: string[] }[] = [];

    if (enabledAttributes.color && colorValues.length > 0) {
      activeAttrs.push({ type: "color", values: colorValues });
    }
    if (enabledAttributes.size && sizeValues.length > 0) {
      activeAttrs.push({ type: "size", values: sizeValues });
    }
    if (enabledAttributes.weight && weightValues.length > 0) {
      activeAttrs.push({ type: "weight", values: weightValues });
    }

    if (activeAttrs.length === 0) {
      setUploadError("Please add at least one attribute value for Color, Size, or Weight to generate variants.");
      return;
    }

    // Cartesian product
    let combinations: Record<string, string>[] = [{}];
    for (const attr of activeAttrs) {
      const nextCombos: Record<string, string>[] = [];
      for (const current of combinations) {
        for (const val of attr.values) {
          nextCombos.push({ ...current, [attr.type]: val });
        }
      }
      combinations = nextCombos;
    }

    const baseSku = sku.trim() || `MM-${(title || "PR").slice(0, 4).toUpperCase()}`;
    const basePrice = Number(sellPrice) || 1250;
    const baseCompare = regularPrice ? Number(regularPrice) : null;
    const baseStock = Number(stock) || 20;

    const generated: AdminVariantInput[] = combinations.map((combo, idx) => {
      // Retain existing variant properties if matching attribute combination already exists
      const existing = variants.find((ev) => {
        const evColor = ev.attributes?.color || ev.attributes?.Color;
        const evSize = ev.attributes?.size || ev.attributes?.Size;
        const evWeight = ev.attributes?.weight || ev.attributes?.Weight;
        return (
          (!combo.color || evColor === combo.color) &&
          (!combo.size || evSize === combo.size) &&
          (!combo.weight || evWeight === combo.weight)
        );
      });

      if (existing) {
        return existing;
      }

      const titleParts = [combo.color, combo.size, combo.weight].filter(Boolean);
      const variantTitle = titleParts.join(" • ");
      const skuSuffix = titleParts
        .map((p) => (p || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase())
        .join("-");

      return {
        id: crypto.randomUUID(),
        title: variantTitle,
        sku: `${baseSku}-${skuSuffix || idx + 1}`,
        price: basePrice,
        compareAtPrice: baseCompare,
        stock: baseStock,
        attributes: combo,
        images: [],
      };
    });

    setVariants(generated);
    setShowOptionBuilder(false);
  }

  function handleBulkPrice(priceVal: number) {
    if (isNaN(priceVal) || priceVal <= 0) return;
    setVariants((prev) => prev.map((v) => ({ ...v, price: priceVal })));
  }

  function handleBulkStock(stockVal: number) {
    if (isNaN(stockVal) || stockVal < 0) return;
    setVariants((prev) => prev.map((v) => ({ ...v, stock: stockVal })));
  }

  function handleBulkAutoSku() {
    const baseSku = sku.trim() || "MM-PR";
    setVariants((prev) =>
      prev.map((v, i) => {
        const titleParts = [
          v.attributes?.color,
          v.attributes?.size,
          v.attributes?.weight,
        ].filter(Boolean);
        const skuSuffix = titleParts
          .map((p) => (p || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase())
          .join("-");
        return {
          ...v,
          sku: `${baseSku}-${skuSuffix || i + 1}`,
        };
      })
    );
  }

  function handleClearVariants() {
    if (variants.length === 0) return;
    if (confirm("Are you sure you want to remove all variants?")) {
      setVariants([]);
    }
  }

  function handleVariantFieldChange<K extends keyof AdminVariantInput>(
    id: string,
    field: K,
    value: AdminVariantInput[K]
  ) {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  async function handleVariantImageUpload(variantId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setUploadError(`"${file.name}" is not a supported image. Please select PNG, JPG, or WebP.`);
      return;
    }

    const MAX_FILE_BYTES = 8 * 1024 * 1024;
    if (file.size > MAX_FILE_BYTES) {
      setUploadError(`"${file.name}" exceeds the 8 MB upload limit.`);
      return;
    }

    setUploadingVariantId(variantId);
    setUploadError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadProductMediaAction(fd);
      if (res.success && res.url) {
        const uploadedUrl = res.url;
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, images: [uploadedUrl] } : v))
        );
        setNewlyUploadedUrls((prev) => new Set(prev).add(uploadedUrl));
      } else {
        setUploadError(res.error || `Failed to upload variant image "${file.name}".`);
      }
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload variant image.");
    } finally {
      setUploadingVariantId(null);
    }
  }

  function handleSelectCatalogImage(variantId: string, imgUrl: string) {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, images: [imgUrl] } : v))
    );
    setCatalogPickerVariantId(null);
  }

  function handleRemoveVariantImage(variantId: string) {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const removedUrl = v.images?.[0];
          if (removedUrl && newlyUploadedUrls.has(removedUrl)) {
            setPendingDeletions((p) => [...p, removedUrl]);
          }
          return { ...v, images: [] };
        }
        return v;
      })
    );
  }

  function handleAddSingleCustomVariant() {
    if (!newVariantTitle.trim()) {
      setUploadError("Please provide a title for the new variant.");
      return;
    }

    const customAttrs: Record<string, string> = {};
    if (newVariantColor.trim()) customAttrs.color = newVariantColor.trim();
    if (newVariantSize.trim()) customAttrs.size = newVariantSize.trim();
    if (newVariantWeight.trim()) customAttrs.weight = newVariantWeight.trim();

    const newVar: AdminVariantInput = {
      id: crypto.randomUUID(),
      title: newVariantTitle.trim(),
      sku: newVariantSku.trim() || `${sku.trim() || "MM"}-${variants.length + 1}`,
      price: Number(newVariantPrice) || Number(sellPrice) || 1250,
      stock: Number(newVariantStock) || 20,
      attributes: Object.keys(customAttrs).length > 0 ? customAttrs : undefined,
      images: [],
    };

    setVariants((prev) => [...prev, newVar]);
    setNewVariantTitle("");
    setNewVariantSku("");
    setNewVariantPrice("");
    setNewVariantStock("");
    setNewVariantColor("");
    setNewVariantSize("");
    setNewVariantWeight("");
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

    if (targetStatus === "active" && images.length === 0) {
      setSubmitError("Please add at least one product photo (Cover slot) before publishing to the catalog.");
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
      images: images.slice(0, 4),
      videoUrl: videoUrl.trim() || undefined,
      deletedImages: pendingDeletions,
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
        setPendingDeletions([]);
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
        setPendingDeletions([]);
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

          {/* Card 3: Product Media (Strict 4 Images & Video URL) */}
          <div
            id="section-media"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-neutral-dark">
                    Product Media
                  </h2>
                  <p className="font-sans text-xs text-neutral-muted">
                    Upload up to 4 high-resolution photos and 1 showcase video URL.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    images.length === 4
                      ? "bg-success-light text-success border border-success/30"
                      : "bg-primary-surface text-primary border border-primary/20"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {images.length} / 4 Photos {images.length === 4 ? "(Max Limit)" : `(${4 - images.length} open)`}
                </span>
              </div>
            </div>

            {/* Media Specifications Guidelines Callout */}
            <div className="bg-primary-surface/40 border border-primary/20 rounded-xl p-3.5 text-xs text-neutral-dark space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Media & Upload Guidelines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] text-neutral-dark/80 pt-0.5">
                <div className="space-y-0.5">
                  <p className="font-semibold text-neutral-dark flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Photos: Up to 4 Images (1:1 Square)
                  </p>
                  <p className="text-neutral-muted pl-2.5">
                    1200 × 1200 px recommended (min 800×800 px). WebP, JPG, PNG up to 8 MB each. Slot 1 serves as the primary catalog cover.
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-neutral-dark flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Video: 1 Showcase URL
                  </p>
                  <p className="text-neutral-muted pl-2.5">
                    YouTube, Vimeo, or direct MP4 link. Storefront visitors can click the video thumbnail to launch an immersive full-screen player.
                  </p>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="p-4 bg-error-surface border border-error/30 text-error rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-error/10 text-error flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-heading font-semibold text-xs text-error">
                      Image Upload Notice
                    </p>
                    <p className="text-xs text-neutral-dark/80 font-sans leading-relaxed">
                      {uploadError}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="p-1.5 hover:bg-error/10 text-neutral-muted hover:text-error rounded-lg cursor-pointer transition-colors shrink-0"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Structured 4-Slot Photo Gallery Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-sans font-semibold text-xs text-neutral-dark">
                  Photo Gallery Slots (1 to 4)
                </label>
                <span className="text-[11px] text-neutral-muted">
                  Slot 1 is your store cover photo. Hover any photo to reorder or delete.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const img = images[slotIdx];
                  const isPrimary = slotIdx === 0;

                  if (img) {
                    return (
                      <div
                        key={img + slotIdx}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          isPrimary
                            ? "border-primary ring-3 ring-primary/20 shadow-xs"
                            : "border-neutral-border hover:border-neutral-dark/40 bg-surface shadow-2xs"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Product photo slot ${slotIdx + 1}`}
                          fill
                          sizes="200px"
                          className="object-cover"
                          unoptimized={img.startsWith("http")}
                        />

                        {/* Slot Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                          {isPrimary ? (
                            <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-white text-white" />
                              Cover (Slot 1)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-dark/80 backdrop-blur-xs text-white text-[10px] font-semibold shadow-xs">
                              Slot {slotIdx + 1}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons Overlay */}
                        <div className="absolute inset-0 bg-neutral-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-3 z-20">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(slotIdx)}
                              className="w-full py-1.5 px-2 rounded-lg bg-surface text-neutral-dark hover:text-primary text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(slotIdx)}
                            className="w-full py-1.5 px-2 rounded-lg bg-error text-white hover:bg-error/90 text-[11px] font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Photo</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Empty Slot Tile
                  return (
                    <div
                      key={`empty-slot-${slotIdx}`}
                      onClick={() => {
                        const input = document.getElementById("product-image-upload") as HTMLInputElement;
                        if (input) input.click();
                      }}
                      className="group aspect-square rounded-2xl border-2 border-dashed border-neutral-border hover:border-primary/70 bg-neutral-bg/30 hover:bg-primary-surface/20 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface border border-neutral-border/80 group-hover:border-primary/40 group-hover:scale-105 flex items-center justify-center text-neutral-muted group-hover:text-primary transition-all shadow-2xs mb-2">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="font-heading font-semibold text-xs text-neutral-dark group-hover:text-primary transition-colors">
                        {isPrimary ? "Add Cover Photo" : `Add Photo ${slotIdx + 1}`}
                      </span>
                      <span className="text-[10px] text-neutral-muted mt-0.5">
                        Slot {slotIdx + 1} of 4
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drag & Drop Dropzone (Disabled when 4 images reached) */}
            <div className="space-y-2 pt-1">
              <input
                type="file"
                id="product-image-upload"
                multiple
                disabled={images.length >= 4}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(e.target.files);
                  }
                }}
              />

              {images.length < 4 ? (
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
                          ? "Uploading photo to storage..."
                          : "Drag & drop photos here, or click to browse"}
                      </p>
                      <p className="font-sans text-xs text-neutral-muted">
                        Supports PNG, JPG, WebP up to 8 MB per file ({4 - images.length} slots available)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-4 border border-success/30 bg-success-surface/40 rounded-xl text-center text-xs text-success flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="font-medium">
                    All 4 image slots are filled. To upload a different photo, please delete one of the existing slots above.
                  </span>
                </div>
              )}
            </div>

            {/* Add Image by URL or Quick Presets (Only when slots are available) */}
            {images.length < 4 && (
              <div className="space-y-3 pt-1 border-t border-neutral-border/60">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="flex-1 bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Slot {images.length + 1}</span>
                  </button>
                </div>

                {/* Quick Presets for Demo / Testing */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider">
                    Quick Testing Presets:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PRESET_PRODUCT_IMAGES.map((preset) => {
                      const isAlreadyAdded = images.includes(preset.url);
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          disabled={isAlreadyAdded || images.length >= 4}
                          onClick={() => {
                            if (!isAlreadyAdded && images.length < 4) {
                              setImages((prev) => [...prev, preset.url].slice(0, 4));
                            }
                          }}
                          className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                            isAlreadyAdded
                              ? "bg-neutral-border/40 text-neutral-muted border-transparent cursor-not-allowed"
                              : "bg-neutral-bg border-neutral-border/80 text-neutral-dark hover:border-primary hover:text-primary cursor-pointer"
                          }`}
                        >
                          {isAlreadyAdded ? "✓ " : "+ "}
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Video URL Section with format detection & live preview */}
            <div className="space-y-3 pt-4 border-t border-neutral-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                    <Video className="w-3.5 h-3.5 text-neutral-dark" />
                  </div>
                  <div>
                    <label className="block font-sans font-semibold text-xs text-neutral-dark">
                      Product Showcase Video URL (Optional)
                    </label>
                    <p className="font-sans text-[11px] text-neutral-muted">
                      Customers can watch this full-screen by clicking the video thumbnail on the storefront.
                    </p>
                  </div>
                </div>

                {parsedVideo && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      parsedVideo.type === "youtube"
                        ? "bg-red-50 text-red-600 border-red-200"
                        : parsedVideo.type === "vimeo"
                        ? "bg-sky-50 text-sky-600 border-sky-200"
                        : "bg-purple-50 text-purple-600 border-purple-200"
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    {parsedVideo.label}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setShowVideoPreview(false);
                    }}
                    placeholder="Paste YouTube, Vimeo, or direct MP4 URL (e.g. https://www.youtube.com/watch?v=...)"
                    className="w-full bg-neutral-bg/40 border border-neutral-border rounded-xl px-3.5 py-2 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-8"
                  />
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl("");
                        setShowVideoPreview(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-error cursor-pointer p-0.5"
                      title="Clear video URL"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {parsedVideo && (
                  <button
                    type="button"
                    onClick={() => setShowVideoPreview(!showVideoPreview)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-border bg-surface text-neutral-dark hover:bg-neutral-bg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-primary" />
                    <span>{showVideoPreview ? "Hide Preview" : "Test Playback"}</span>
                  </button>
                )}
              </div>

              {/* Inline Video Player Preview */}
              {showVideoPreview && parsedVideo && (
                <div className="rounded-2xl overflow-hidden border border-neutral-border bg-neutral-dark aspect-video max-w-xl mx-auto shadow-md animate-in fade-in">
                  {parsedVideo.type === "youtube" || parsedVideo.type === "vimeo" ? (
                    <iframe
                      src={parsedVideo.embedUrl}
                      title="Product Video Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={parsedVideo.embedUrl}
                      controls
                      autoPlay
                      muted
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}
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

          {/* Card 6: Variants Matrix & Option Builder */}
          <div
            id="section-variants"
            className="bg-surface border border-neutral-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-border/60 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center shadow-2xs">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-lg text-neutral-dark">
                      Product Variants
                    </h2>
                    {variants.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-surface text-primary text-xs font-bold font-sans">
                        {variants.length} variant{variants.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-muted">
                    Configure Color, Size, and Weight variants with dedicated photos and matrix generation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOptionBuilder((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                    showOptionBuilder
                      ? "bg-primary text-white"
                      : "bg-primary-surface text-primary hover:bg-primary-surface/80"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{showOptionBuilder ? "Hide Option Builder" : "Option Builder"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingVariant(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-bg hover:bg-neutral-border/50 text-neutral-dark border border-neutral-border/80 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Variant</span>
                </button>
              </div>
            </div>

            {/* Option Builder Drawer / Configuration Card */}
            {showOptionBuilder && (
              <div className="p-5 rounded-2xl border border-primary/30 bg-primary-surface/15 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="font-heading font-bold text-sm text-neutral-dark">
                      Attribute Option Builder (Color, Size, Weight)
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-muted">
                    Select attributes and add values to automatically generate all variant combinations
                  </span>
                </div>

                {/* Attribute Type Toggles */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleAttributeType("color")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      enabledAttributes.color
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface text-neutral-muted border border-neutral-border hover:border-primary/40"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Color {colorValues.length > 0 ? `(${colorValues.length})` : ""}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAttributeType("size")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      enabledAttributes.size
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface text-neutral-muted border border-neutral-border hover:border-primary/40"
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size {sizeValues.length > 0 ? `(${sizeValues.length})` : ""}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAttributeType("weight")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      enabledAttributes.weight
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface text-neutral-muted border border-neutral-border hover:border-primary/40"
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Weight {weightValues.length > 0 ? `(${weightValues.length})` : ""}</span>
                  </button>
                </div>

                {/* Color Values Section */}
                {enabledAttributes.color && (
                  <div className="p-3.5 rounded-xl bg-surface border border-neutral-border/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-primary" />
                        <span className="font-heading font-semibold text-xs text-neutral-dark">
                          Color Options
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-muted">
                        e.g. Pastel Blue, Natural Wood, Mint Green
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAttributeValue("color", colorInput);
                          }
                        }}
                        placeholder="Type color and press Enter (or click preset below)..."
                        className="flex-1 bg-neutral-bg/50 border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddAttributeValue("color", colorInput)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-2xs"
                      >
                        + Add Color
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-neutral-muted tracking-wider mr-1">
                        Popular Colors:
                      </span>
                      {COLOR_PRESETS.map((cp) => {
                        const isAdded = colorValues.includes(cp);
                        const hex = getColorHex(cp);
                        return (
                          <button
                            key={cp}
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleAddAttributeValue("color", cp)}
                            className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                              isAdded
                                ? "bg-neutral-border/40 text-neutral-muted border-transparent cursor-default"
                                : "bg-neutral-bg hover:bg-neutral-bg/80 border-neutral-border text-neutral-dark hover:border-primary/50 cursor-pointer"
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-neutral-border shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span>{cp}</span>
                            {isAdded && <Check className="w-2.5 h-2.5 text-neutral-muted ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Color Chips */}
                    {colorValues.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-border/50">
                        {colorValues.map((val) => (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-surface/40 text-neutral-dark border border-primary/20 text-xs font-medium"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-neutral-border shrink-0"
                              style={{ backgroundColor: getColorHex(val) }}
                            />
                            <span>{val}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttributeValue("color", val)}
                              className="text-neutral-muted hover:text-error ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Size Values Section */}
                {enabledAttributes.size && (
                  <div className="p-3.5 rounded-xl bg-surface border border-neutral-border/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-primary" />
                        <span className="font-heading font-semibold text-xs text-neutral-dark">
                          Size Options
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-muted">
                        e.g. Small, Medium, Large, Deluxe 48pc
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAttributeValue("size", sizeInput);
                          }
                        }}
                        placeholder="Type size and press Enter (or click preset below)..."
                        className="flex-1 bg-neutral-bg/50 border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddAttributeValue("size", sizeInput)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-2xs"
                      >
                        + Add Size
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-neutral-muted tracking-wider mr-1">
                        Popular Sizes:
                      </span>
                      {SIZE_PRESETS.map((sp) => {
                        const isAdded = sizeValues.includes(sp);
                        return (
                          <button
                            key={sp}
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleAddAttributeValue("size", sp)}
                            className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                              isAdded
                                ? "bg-neutral-border/40 text-neutral-muted border-transparent cursor-default"
                                : "bg-neutral-bg hover:bg-neutral-bg/80 border-neutral-border text-neutral-dark hover:border-primary/50 cursor-pointer"
                            }`}
                          >
                            <span>{sp}</span>
                            {isAdded && <Check className="w-2.5 h-2.5 text-neutral-muted inline ml-1" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Size Chips */}
                    {sizeValues.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-border/50">
                        {sizeValues.map((val) => (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-neutral-dark border border-neutral-border text-xs font-medium"
                          >
                            <span>{val}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttributeValue("size", val)}
                              className="text-neutral-muted hover:text-error ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Weight Values Section */}
                {enabledAttributes.weight && (
                  <div className="p-3.5 rounded-xl bg-surface border border-neutral-border/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-primary" />
                        <span className="font-heading font-semibold text-xs text-neutral-dark">
                          Weight Options
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-muted">
                        e.g. 100g, 250g, 500g, 1kg
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={weightInput}
                        onChange={(e) => setWeightInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAttributeValue("weight", weightInput);
                          }
                        }}
                        placeholder="Type weight (e.g. 500g) and press Enter..."
                        className="flex-1 bg-neutral-bg/50 border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddAttributeValue("weight", weightInput)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-2xs"
                      >
                        + Add Weight
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] uppercase font-bold text-neutral-muted tracking-wider mr-1">
                        Popular Weights:
                      </span>
                      {WEIGHT_PRESETS.map((wp) => {
                        const isAdded = weightValues.includes(wp);
                        return (
                          <button
                            key={wp}
                            type="button"
                            disabled={isAdded}
                            onClick={() => handleAddAttributeValue("weight", wp)}
                            className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                              isAdded
                                ? "bg-neutral-border/40 text-neutral-muted border-transparent cursor-default"
                                : "bg-neutral-bg hover:bg-neutral-bg/80 border-neutral-border text-neutral-dark hover:border-primary/50 cursor-pointer"
                            }`}
                          >
                            <span>{wp}</span>
                            {isAdded && <Check className="w-2.5 h-2.5 text-neutral-muted inline ml-1" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Weight Chips */}
                    {weightValues.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-border/50">
                        {weightValues.map((val) => (
                          <span
                            key={val}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface text-neutral-dark border border-neutral-border text-xs font-medium"
                          >
                            <span>{val}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttributeValue("weight", val)}
                              className="text-neutral-muted hover:text-error ml-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Generator Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-primary/20">
                  <div className="text-xs text-neutral-muted">
                    {(() => {
                      const counts: string[] = [];
                      if (enabledAttributes.color && colorValues.length) counts.push(`${colorValues.length} colors`);
                      if (enabledAttributes.size && sizeValues.length) counts.push(`${sizeValues.length} sizes`);
                      if (enabledAttributes.weight && weightValues.length) counts.push(`${weightValues.length} weights`);

                      if (counts.length === 0) {
                        return "Select at least one attribute to generate variants.";
                      }

                      const totalCombos =
                        (enabledAttributes.color && colorValues.length ? colorValues.length : 1) *
                        (enabledAttributes.size && sizeValues.length ? sizeValues.length : 1) *
                        (enabledAttributes.weight && weightValues.length ? weightValues.length : 1);

                      return (
                        <span>
                          Matrix calculation: <strong>{counts.join(" × ")}</strong> ={" "}
                          <strong className="text-primary">{totalCombos} combination{totalCombos > 1 ? "s" : ""}</strong>
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOptionBuilder(false)}
                      className="px-3.5 py-1.5 rounded-xl border border-neutral-border bg-surface text-xs text-neutral-muted hover:text-neutral-dark cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateCombinations}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Matrix</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Add Single Custom Variant Form */}
            {isAddingVariant && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary-surface/20 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-neutral-dark">
                    Add Single Custom Variant
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingVariant(false)}
                    className="text-neutral-muted hover:text-neutral-dark cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newVariantTitle}
                    onChange={(e) => setNewVariantTitle(e.target.value)}
                    placeholder="Title (e.g. Sky Blue • Deluxe)"
                    className="bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={newVariantSku}
                    onChange={(e) => setNewVariantSku(e.target.value)}
                    placeholder="SKU (e.g. MM-PR-BLU-DLX)"
                    className="bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary font-mono"
                  />
                  <input
                    type="text"
                    value={newVariantColor}
                    onChange={(e) => setNewVariantColor(e.target.value)}
                    placeholder="Color attribute (optional)"
                    className="bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={newVariantSize}
                    onChange={(e) => setNewVariantSize(e.target.value)}
                    placeholder="Size attribute (optional)"
                    className="bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={newVariantWeight}
                    onChange={(e) => setNewVariantWeight(e.target.value)}
                    placeholder="Weight attribute (optional)"
                    className="bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newVariantPrice}
                      onChange={(e) => setNewVariantPrice(e.target.value)}
                      placeholder="Price ৳"
                      className="w-1/2 bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      value={newVariantStock}
                      onChange={(e) => setNewVariantStock(e.target.value)}
                      placeholder="Stock"
                      className="w-1/2 bg-surface border border-neutral-border rounded-xl px-3 py-1.5 text-xs text-neutral-dark focus:outline-none focus:border-primary"
                    />
                  </div>
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
                    onClick={handleAddSingleCustomVariant}
                    className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-95 cursor-pointer shadow-2xs"
                  >
                    Save Custom Variant
                  </button>
                </div>
              </div>
            )}

            {/* Catalog Image Picker Modal/Drawer */}
            {catalogPickerVariantId && (
              <div className="p-4 rounded-xl border border-primary/40 bg-surface shadow-md space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <h4 className="font-heading font-bold text-xs text-neutral-dark">
                      Assign Image from 4 Product Photos:
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCatalogPickerVariantId(null)}
                    className="text-neutral-muted hover:text-neutral-dark cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {images.length === 0 ? (
                  <p className="text-xs text-neutral-muted">
                    No product photos uploaded yet in the Media section above. Please upload photos first or upload directly below.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={imgUrl + idx}
                        type="button"
                        onClick={() => handleSelectCatalogImage(catalogPickerVariantId, imgUrl)}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-neutral-border hover:border-primary transition-all p-0.5 cursor-pointer"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Slot ${idx + 1}`}
                          fill
                          sizes="120px"
                          className="object-cover rounded-lg group-hover:scale-105 transition-transform"
                          unoptimized={imgUrl.startsWith("http")}
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-neutral-dark/80 text-white text-[9px] font-bold">
                          Slot {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Variants Matrix Table & Bulk Operations */}
            {variants.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-border/80 bg-neutral-bg/30 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-neutral-border/80 flex items-center justify-center mx-auto text-neutral-muted shadow-2xs">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-neutral-dark">
                    No product variants configured yet
                  </p>
                  <p className="text-xs text-neutral-muted max-w-md mx-auto mt-1">
                    If this product comes in different colors, sizes, or weights, use the Option Builder above to quickly generate them.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOptionBuilder(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Option Builder</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingVariant(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface hover:bg-neutral-bg text-neutral-dark border border-neutral-border/80 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Single Variant</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Bulk Actions Bar (Essential for 5+ variants) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-neutral-bg/60 border border-neutral-border/80 text-xs">
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-neutral-muted shrink-0 ml-1" />
                    <input
                      type="text"
                      value={variantSearch}
                      onChange={(e) => setVariantSearch(e.target.value)}
                      placeholder={`Search ${variants.length} variants...`}
                      className="w-full bg-surface border border-neutral-border rounded-lg px-2.5 py-1 text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleBulkPrice(Number(sellPrice) || 1250)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark hover:border-primary/50 text-[11px] font-medium cursor-pointer"
                      title="Apply main selling price to all variants"
                    >
                      <span>Apply Price (৳{sellPrice || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBulkStock(Number(stock) || 20)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark hover:border-primary/50 text-[11px] font-medium cursor-pointer"
                      title="Apply main stock quantity to all variants"
                    >
                      <span>Apply Stock ({stock || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkAutoSku}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark hover:border-primary/50 text-[11px] font-medium cursor-pointer"
                      title="Regenerate all SKUs with standard format"
                    >
                      <RotateCcw className="w-3 h-3 text-neutral-muted" />
                      <span>Auto-SKUs</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearVariants}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-error hover:bg-error-surface border border-transparent hover:border-error/20 text-[11px] font-medium cursor-pointer"
                      title="Delete all variants"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>

                {/* High-Density Matrix Table */}
                <div className="border border-neutral-border/80 rounded-2xl overflow-hidden bg-surface shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-bg/80 border-b border-neutral-border/80 text-neutral-muted font-heading font-semibold text-[11px] uppercase tracking-wider">
                          <th className="py-2.5 px-3 w-14 text-center">Photo</th>
                          <th className="py-2.5 px-3 min-w-[200px]">Variant Details</th>
                          <th className="py-2.5 px-3 w-36">SKU</th>
                          <th className="py-2.5 px-3 w-28">Price (৳)</th>
                          <th className="py-2.5 px-3 w-24">Regular ৳</th>
                          <th className="py-2.5 px-3 w-24">Stock</th>
                          <th className="py-2.5 px-2.5 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-border/60">
                        {variants
                          .filter((v) => {
                            if (!variantSearch.trim()) return true;
                            const q = variantSearch.toLowerCase();
                            return (
                              v.title.toLowerCase().includes(q) ||
                              v.sku.toLowerCase().includes(q) ||
                              Object.values(v.attributes || {}).some((val) =>
                                String(val).toLowerCase().includes(q)
                              )
                            );
                          })
                          .map((v, idx) => {
                            const variantImage = v.images?.[0];
                            const isUploadingThis = uploadingVariantId === v.id;
                            const hasColor = v.attributes?.color || v.attributes?.Color;
                            const hasSize = v.attributes?.size || v.attributes?.Size;
                            const hasWeight = v.attributes?.weight || v.attributes?.Weight;

                            return (
                              <tr
                                key={v.id || idx}
                                className="hover:bg-neutral-bg/40 transition-colors group"
                              >
                                {/* 1. Dedicated Variant Photo Slot */}
                                <td className="py-2.5 px-3 text-center align-middle">
                                  <input
                                    type="file"
                                    id={`variant-upload-${v.id}`}
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(e) => handleVariantImageUpload(v.id!, e.target.files)}
                                  />

                                  {variantImage ? (
                                    <div className="relative w-11 h-11 mx-auto rounded-xl overflow-hidden border border-neutral-border shadow-2xs group/img">
                                      <Image
                                        src={variantImage}
                                        alt={v.title}
                                        fill
                                        sizes="44px"
                                        className="object-cover"
                                        unoptimized={variantImage.startsWith("http")}
                                      />
                                      <div className="absolute inset-0 bg-neutral-dark/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.getElementById(`variant-upload-${v.id}`) as HTMLInputElement;
                                            if (input) input.click();
                                          }}
                                          className="text-[9px] text-white font-bold hover:underline cursor-pointer"
                                          title="Change photo"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveVariantImage(v.id!)}
                                          className="text-[9px] text-red-300 font-bold hover:underline cursor-pointer"
                                          title="Remove photo"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="relative flex flex-col items-center">
                                      <button
                                        type="button"
                                        disabled={isUploadingThis}
                                        onClick={() => {
                                          // If we have catalog photos, open the picker or trigger upload
                                          if (images.length > 0) {
                                            setCatalogPickerVariantId(v.id!);
                                          } else {
                                            const input = document.getElementById(`variant-upload-${v.id}`) as HTMLInputElement;
                                            if (input) input.click();
                                          }
                                        }}
                                        className="w-11 h-11 rounded-xl border border-dashed border-neutral-border hover:border-primary/80 bg-neutral-bg/50 hover:bg-primary-surface/20 flex flex-col items-center justify-center text-neutral-muted hover:text-primary transition-all cursor-pointer shadow-2xs"
                                        title={images.length > 0 ? "Assign catalog image or upload new" : "Upload variant image"}
                                      >
                                        {isUploadingThis ? (
                                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                                        ) : (
                                          <>
                                            <Camera className="w-3.5 h-3.5" />
                                            <span className="text-[8px] font-bold mt-0.5">+Photo</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </td>

                                {/* 2. Variant Title & Attribute Badges */}
                                <td className="py-2.5 px-3 align-middle">
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={v.title}
                                      onChange={(e) => handleVariantFieldChange(v.id!, "title", e.target.value)}
                                      className="font-heading font-semibold text-xs text-neutral-dark bg-transparent border-b border-transparent hover:border-neutral-border focus:border-primary focus:outline-none w-full"
                                    />

                                    {/* Attribute Badges */}
                                    <div className="flex flex-wrap items-center gap-1">
                                      {hasColor && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-bg text-[10px] font-medium text-neutral-dark border border-neutral-border/60">
                                          <span
                                            className="w-2 h-2 rounded-full border border-neutral-border"
                                            style={{ backgroundColor: getColorHex(hasColor) }}
                                          />
                                          <span>{hasColor}</span>
                                        </span>
                                      )}

                                      {hasSize && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-bg text-[10px] font-medium text-neutral-dark border border-neutral-border/60">
                                          <Ruler className="w-2.5 h-2.5 text-neutral-muted" />
                                          <span>{hasSize}</span>
                                        </span>
                                      )}

                                      {hasWeight && (
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neutral-bg text-[10px] font-medium text-neutral-dark border border-neutral-border/60">
                                          <Scale className="w-2.5 h-2.5 text-neutral-muted" />
                                          <span>{hasWeight}</span>
                                        </span>
                                      )}

                                      {variantImage && (
                                        <span className="px-1.5 py-0.5 rounded bg-primary-surface/40 text-primary text-[9px] font-bold">
                                          ✓ Custom Photo
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* 3. SKU */}
                                <td className="py-2.5 px-3 align-middle">
                                  <input
                                    type="text"
                                    value={v.sku}
                                    onChange={(e) => handleVariantFieldChange(v.id!, "sku", e.target.value)}
                                    className="font-mono text-xs bg-neutral-bg/50 border border-neutral-border/70 rounded-lg px-2 py-1 text-neutral-dark w-full focus:outline-none focus:border-primary"
                                  />
                                </td>

                                {/* 4. Price ৳ */}
                                <td className="py-2.5 px-3 align-middle">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 font-sans text-neutral-muted text-[11px]">
                                      ৳
                                    </span>
                                    <input
                                      type="number"
                                      min="0"
                                      value={v.price}
                                      onChange={(e) =>
                                        handleVariantFieldChange(v.id!, "price", Number(e.target.value))
                                      }
                                      className="font-sans font-bold text-xs bg-neutral-bg/50 border border-neutral-border/70 rounded-lg pl-5 pr-2 py-1 text-neutral-dark w-full focus:outline-none focus:border-primary"
                                    />
                                  </div>
                                </td>

                                {/* 5. Regular Price (Optional) */}
                                <td className="py-2.5 px-3 align-middle">
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.compareAtPrice ?? ""}
                                    placeholder="—"
                                    onChange={(e) =>
                                      handleVariantFieldChange(
                                        v.id!,
                                        "compareAtPrice",
                                        e.target.value ? Number(e.target.value) : null
                                      )
                                    }
                                    className="font-sans text-xs bg-neutral-bg/50 border border-neutral-border/70 rounded-lg px-2 py-1 text-neutral-dark w-full focus:outline-none focus:border-primary"
                                  />
                                </td>

                                {/* 6. Stock */}
                                <td className="py-2.5 px-3 align-middle">
                                  <input
                                    type="number"
                                    min="0"
                                    value={v.stock}
                                    onChange={(e) =>
                                      handleVariantFieldChange(v.id!, "stock", Number(e.target.value))
                                    }
                                    className={`font-sans font-semibold text-xs bg-neutral-bg/50 border rounded-lg px-2 py-1 w-full focus:outline-none focus:border-primary ${
                                      v.stock <= 0
                                        ? "border-error/40 text-error"
                                        : "border-neutral-border/70 text-neutral-dark"
                                    }`}
                                  />
                                </td>

                                {/* 7. Delete Action */}
                                <td className="py-2.5 px-2.5 text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(v.id)}
                                    className="p-1 rounded-lg text-neutral-muted hover:text-error hover:bg-error-surface transition-colors cursor-pointer"
                                    title="Delete variant"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-3 bg-neutral-bg/40 border-t border-neutral-border/60 flex flex-wrap items-center justify-between text-xs text-neutral-muted gap-2">
                    <div className="flex items-center gap-3">
                      <span>
                        Total: <strong>{variants.length}</strong> variant{variants.length > 1 ? "s" : ""}
                      </span>
                      <span>•</span>
                      <span>
                        Photos Uploaded:{" "}
                        <strong className="text-primary">
                          {variants.filter((v) => v.images?.[0]).length} / {variants.length}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Total Stock:{" "}
                        <strong className="text-neutral-dark">
                          {variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)} units
                        </strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowOptionBuilder(true)}
                      className="text-primary hover:underline font-semibold cursor-pointer text-xs"
                    >
                      + Add / Reconfigure Options
                    </button>
                  </div>
                </div>
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

            {/* Product Image Box & Details with Variant Preview Support */}
            {(() => {
              const activePreviewVariant = previewActiveVariantId
                ? variants.find((v) => v.id === previewActiveVariantId)
                : variants[0] || null;

              const previewDisplayImage =
                activePreviewVariant?.images && activePreviewVariant.images.length > 0
                  ? activePreviewVariant.images[0]
                  : images[0];

              const previewDisplayPrice = activePreviewVariant
                ? Number(activePreviewVariant.price) || 0
                : previewSellPrice;

              const previewDisplayCompare = activePreviewVariant
                ? (activePreviewVariant.compareAtPrice ? Number(activePreviewVariant.compareAtPrice) : null)
                : previewRegularPrice;

              const previewVariantDiscount =
                previewDisplayCompare && previewDisplayCompare > previewDisplayPrice
                  ? Math.round(
                      ((previewDisplayCompare - previewDisplayPrice) / previewDisplayCompare) * 100
                    )
                  : discountPct;

              const previewOutOfStock = activePreviewVariant
                ? Number(activePreviewVariant.stock) <= 0
                : isOutOfStock;

              return (
                <>
                  {/* Product Image Box */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-bg relative border border-neutral-border/60 flex items-center justify-center">
                    {previewDisplayImage ? (
                      <Image
                        src={previewDisplayImage}
                        alt={title || "Product preview"}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                        unoptimized={previewDisplayImage.startsWith("http")}
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

                    {/* Variant Photo Active Tag */}
                    {activePreviewVariant?.images && activePreviewVariant.images.length > 0 && (
                      <div className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary text-white backdrop-blur-xs flex items-center gap-1 shadow-xs z-10">
                        <Camera className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[120px]">{activePreviewVariant.title}</span>
                      </div>
                    )}

                    {/* Video Included Indicator */}
                    {videoUrl.trim() && (
                      <div className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-dark/85 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs z-10">
                        <Play className="w-2.5 h-2.5 fill-white text-white" />
                        <span>Video Available</span>
                      </div>
                    )}

                    {/* Photo Count Indicator */}
                    {activePreviewVariant?.images && activePreviewVariant.images.length > 0 ? (
                      activePreviewVariant.images.length > 1 ? (
                        <div className="absolute bottom-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface/90 text-neutral-dark backdrop-blur-xs border border-neutral-border/60 shadow-xs z-10">
                          1 of {activePreviewVariant.images.length} Variant
                        </div>
                      ) : null
                    ) : images.length > 0 ? (
                      <div className="absolute bottom-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface/90 text-neutral-dark backdrop-blur-xs border border-neutral-border/60 shadow-xs z-10">
                        1 of {images.length} Catalog
                      </div>
                    ) : null}
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
                        {formatCurrency(previewDisplayPrice)}
                      </span>
                      {previewDisplayCompare && previewDisplayCompare > previewDisplayPrice && (
                        <>
                          <span className="font-sans text-xs text-neutral-muted line-through">
                            {formatCurrency(previewDisplayCompare)}
                          </span>
                          {previewVariantDiscount && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-warning-light text-warning">
                              -{previewVariantDiscount}%
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Mini Variant Switcher for live store simulation */}
                    {variants.length > 0 && (
                      <div className="pt-2 border-t border-neutral-border/60 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-neutral-dark">
                            Store Variants ({variants.length})
                          </span>
                          <span className="text-neutral-muted text-[10px]">
                            {previewActiveVariantId ? "Previewing selection" : "Default variant"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-neutral-bg/60 rounded-lg border border-neutral-border/50">
                          {variants.map((v, idx) => {
                            const isSel = (activePreviewVariant?.id === v.id);
                            const colorVal = v.attributes?.color;
                            const colorHex = colorVal ? getColorHex(colorVal) : null;
                            const hasImage = Boolean(v.images && v.images.length > 0);

                            return (
                              <button
                                key={v.id || idx}
                                type="button"
                                onClick={() => setPreviewActiveVariantId(v.id ?? null)}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border ${
                                  isSel
                                    ? "border-primary bg-surface text-primary font-bold shadow-xs ring-1 ring-primary/40"
                                    : "border-neutral-border/70 bg-surface/70 text-neutral-dark hover:border-primary/40"
                                }`}
                              >
                                {colorHex && (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                                    style={{ backgroundColor: colorHex }}
                                  />
                                )}
                                <span>{v.title}</span>
                                {hasImage && (
                                  <Camera className="w-2.5 h-2.5 text-primary shrink-0 opacity-80" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                          previewOutOfStock ? "text-error" : "text-success"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {previewOutOfStock
                            ? "Out of Stock"
                            : activePreviewVariant
                            ? `In Stock (${activePreviewVariant.stock} available)`
                            : "In Stock"}
                        </span>
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
                </>
              );
            })()}

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
