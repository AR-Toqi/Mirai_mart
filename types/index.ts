export type ProductBadgeVariant = "Bestseller" | "New" | "-15%" | "-20%" | "Sale" | "Exclusive";

export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug?: string;
  subCategorySlug?: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: ProductBadgeVariant;
  isOutOfStock?: boolean;
  ageRange?: string; // e.g. "0-1", "1-3", "3-5", "5-8", "8+"
  tags?: string[]; // e.g. ["Montessori", "STEM", "Sensory", "Creative"]
  description?: string;
  curatorNotes?: string;
};

export type CategoryCircleItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  iconName?: string;
};

export type TrustItem = {
  icon: string;
  title: string;
  description: string;
};

export * from "./auth";
export * from "@/lib/db/types";

