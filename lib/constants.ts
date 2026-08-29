/**
 * Mirai Mart Central Business Constants & Helpers
 */

export const FREE_SHIPPING_THRESHOLD = 999; // ৳ 999 free shipping across Bangladesh
export const STANDARD_SHIPPING_FEE = 60; // ৳ 60 standard shipping if subtotal < ৳ 999
export const GIFT_WRAP_PRICE = 99; // ৳ 99 gift wrap add-on
export const MAX_COMPARE_ITEMS = 4; // Max 4 products compared side-by-side
export const DEFAULT_PAGE_SIZE = 12; // Products per PLP page

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

export interface WhatsAppCartItem {
  productTitle: string;
  variantTitle?: string;
  quantity: number;
  price: number;
}

export interface WhatsAppCartOrderParams {
  items: WhatsAppCartItem[];
  giftOptions: { isGift: boolean; message: string };
  appliedPromo: { code: string } | null;
  grandTotal: number;
  shippingFee: number;
  customer?: {
    name: string;
    phone: string;
    address: string;
    city?: string;
  };
  paymentMethod?: string;
  note?: string;
}

/**
 * Builds a 1-click WhatsApp order link for a multi-item cart or checkout.
 * Shared by the cart page and the checkout page.
 */
export function generateWhatsAppCartOrderLink(params: WhatsAppCartOrderParams): string {
  const cleanNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  ).replace(/[^\d+]/g, "");

  const itemListText = params.items
    .map(
      (it, idx) =>
        `${idx + 1}. *${it.productTitle}* ${
          it.variantTitle && it.variantTitle !== "Default" ? `(${it.variantTitle})` : ""
        } x ${it.quantity} = ৳ ${(it.price * it.quantity).toLocaleString()}`
    )
    .join("\n");

  const { customer } = params;

  const message = [
    "👋 Hello Mirai Mart! I want to place an order for my cart:",
    "",
    itemListText,
    "",
    customer ? `👤 *Name:* ${customer.name}` : null,
    customer ? `📞 *Phone:* ${customer.phone}` : null,
    customer
      ? `📍 *Delivery Address:* ${customer.address}${customer.city ? `, ${customer.city}` : ""}`
      : null,
    params.paymentMethod ? `💳 *Payment:* ${params.paymentMethod}` : null,
    params.note ? `📝 *Note:* ${params.note}` : null,
    params.giftOptions.isGift ? `🎁 *Gift Wrapping:* Yes (৳ ${GIFT_WRAP_PRICE})` : null,
    params.giftOptions.isGift && params.giftOptions.message
      ? `💌 *Gift Note:* "${params.giftOptions.message}"`
      : null,
    params.appliedPromo ? `🏷️ *Promo Applied:* ${params.appliedPromo.code}` : null,
    `💰 *Grand Total:* ৳ ${params.grandTotal.toLocaleString()}`,
    `🚚 *Delivery:* ${params.shippingFee === 0 ? "FREE" : `৳ ${params.shippingFee}`}`,
    "",
    "Please confirm my order and send payment instructions! ✨",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
