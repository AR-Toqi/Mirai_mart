export type ProductBadgeVariant = "Bestseller" | "New" | "-15%" | "-20%" | "Sale" | "Exclusive";

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
  attributes?: Record<string, string>; // e.g. { "Color": "Natural Beechwood", "Edition": "Deluxe" }
  images?: string[];
  isDefault?: boolean;
}

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
  images?: string[];
  badge?: ProductBadgeVariant;
  isOutOfStock?: boolean;
  ageRange?: string; // e.g. "0-1", "1-3", "3-5", "5-8", "8+"
  tags?: string[]; // e.g. ["Montessori", "STEM", "Sensory", "Creative"]
  description?: string;
  curatorNotes?: string;
  features?: string[];
  specs?: Record<string, string | number | string[]>;
  safetyCertifications?: string[];
  inBoxItems?: string[];
  variants?: ProductVariant[];
  sku?: string;
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


