/**
 * Mirai Mart Central Business Constants & Helpers
 */

export const FREE_SHIPPING_THRESHOLD = 999; // ৳ 999 free shipping across Bangladesh
export const GIFT_WRAP_PRICE = 99; // ৳ 99 gift wrap add-on
export const MAX_COMPARE_ITEMS = 4; // Max 4 products compared side-by-side
export const DEFAULT_PAGE_SIZE = 12; // Products per PLP page

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
