export type ProductBadgeVariant = "Bestseller" | "New" | "-15%" | "-20%" | "Sale" | "Exclusive";

export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: ProductBadgeVariant;
  isOutOfStock?: boolean;
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
