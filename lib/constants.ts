/**
 * Mirai Mart Central Business Constants & Helpers
 */

export const FREE_SHIPPING_THRESHOLD = 3000; // ৳ 3000 free shipping across Bangladesh
export const SHIPPING_RATES = {
  inside_dhaka: 80, // ৳ 80 delivery fee Inside Dhaka
  outside_dhaka: 120, // ৳ 120 delivery fee Outside Dhaka
} as const;
export const STANDARD_SHIPPING_FEE = 80; // Default standard shipping
export const GIFT_WRAP_PRICE = 99; // ৳ 99 gift wrap add-on
export const MAX_COMPARE_ITEMS = 4; // Max 4 products compared side-by-side
export const DEFAULT_PAGE_SIZE = 12; // Products per PLP page

export const DEFAULT_BKASH_NUMBER =
  process.env.NEXT_PUBLIC_BKASH_NUMBER || "01931105403";
export const DEFAULT_NAGAD_NUMBER =
  process.env.NEXT_PUBLIC_NAGAD_NUMBER || "01931105403";

export const VALID_PROMO_CODES: Record<
  string,
  { type: "percentage" | "fixed_amount" | "free_shipping"; value: number; minSubtotal: number; description: string }
> = {
  MIRAI10: {
    type: "percentage",
    value: 10,
    minSubtotal: 500,
    description: "10% off on orders above ৳ 500",
  },
  WELCOME50: {
    type: "fixed_amount",
    value: 50,
    minSubtotal: 300,
    description: "৳ 50 off on orders above ৳ 300",
  },
  FREESHIP: {
    type: "free_shipping",
    value: 0,
    minSubtotal: 0,
    description: "Free delivery on any order",
  },
};

export const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+8801700000000";

/**
 * Generates an instant 1-click WhatsApp order link with structured message
 */
export function generateWhatsAppOrderLink(params: {
  productTitle: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSlug: string;
  sku?: string;
}): string {
  const cleanNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  ).replace(/[^\d+]/g, "");

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://miraimart.com";

  const productUrl = `${origin}/product/${params.productSlug}`;

  const message = [
    "👋 Hello Mirai Mart! I would like to place an order:",
    "",
    `🛍️ *Product:* ${params.productTitle}`,
    params.variantTitle && params.variantTitle !== "Default"
      ? `🎨 *Variant:* ${params.variantTitle}`
      : null,
    params.sku ? `🏷️ *SKU:* ${params.sku}` : null,
    `🔢 *Quantity:* ${params.quantity}`,
    `💵 *Unit Price:* ৳ ${params.unitPrice.toLocaleString()}`,
    `💰 *Total Amount:* ৳ ${params.totalPrice.toLocaleString()}`,
    "",
    `🔗 *Product Link:* ${productUrl}`,
    "",
    "Please confirm availability and delivery details! 🚚✨",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
