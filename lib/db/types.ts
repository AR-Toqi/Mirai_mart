import type { UserRole } from "@/types/auth";

export interface ProfileRecord {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  addresses: AddressRecord[];
  created_at: string;
  updated_at: string;
}

export interface AddressRecord {
  id?: string;
  label?: string;
  fullName: string;
  email?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon_name: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: CategoryRecord[];
}

export interface ProductRecord {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  description: string;
  curator_notes: string | null;
  age_range: string;
  specs: Record<string, unknown>;
  badge: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: CategoryRecord;
  variants?: ProductVariantRecord[];
}

export interface ProductVariantRecord {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  images: string[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | "pending"
  | "packed"
  | "shipped"
  | "delivered"
  | "refunded"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export interface GiftOptions {
  is_gift?: boolean;
  wrap_fee?: number;
  message?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_email: string;
  shipping_address: AddressRecord;
  billing_address: AddressRecord | null;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  tracking_number: string | null;
  carrier: string | null;
  gift_options: GiftOptions;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_variant_id: string | null;
  product_title: string;
  variant_title: string;
  sku: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export interface ReviewRecord {
  id: string;
  product_id: string;
  user_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromotionRecord {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount" | "free_shipping";
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
