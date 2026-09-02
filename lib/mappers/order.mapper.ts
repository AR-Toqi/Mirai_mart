import type { OrderRecord, OrderItemRecord, OrderStatus, PaymentStatus } from "@/lib/db/types";
import type { CustomerOrder, CustomerOrderItem } from "@/components/account/OrderDetailModal";

/**
 * Format ISO string or date into human-readable format e.g. "May 20, 2024"
 */
export function formatOrderDate(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Transform raw InsForge database order records into the UI CustomerOrder format
 */
export function mapOrderRecordToCustomerOrder(
  order: OrderRecord & { items?: OrderItemRecord[] }
): CustomerOrder {
  // Format items
  const mappedItems: CustomerOrderItem[] = (order.items || []).map((item) => {
    return {
      id: item.id || `item-${Math.random().toString(36).substring(7)}`,
      productTitle: item.product_title || "Product Item",
      variantTitle: item.variant_title !== "Default" ? item.variant_title : undefined,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unit_price) || 0,
      imageUrl:
        (item as any).image_url ||
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop",
    };
  });

  const address = order.shipping_address || ({} as any);
  const deliveryZone =
    address.deliveryZone === "outside_dhaka" ? "outside_dhaka" : "inside_dhaka";

  // Derive payment method provider (e.g. bkash, nagad, cod)
  let paymentMethod = "bKash";
  if (order.payment_method?.includes("nagad")) {
    paymentMethod = "Nagad";
  } else if (order.payment_method?.includes("cod")) {
    paymentMethod = "Cash on Delivery";
  } else if (order.payment_method?.includes("bkash")) {
    paymentMethod = "bKash";
  }

  // Parse transaction ID or notes if stored
  let transactionId = "";
  if (order.notes && order.notes.includes("TrxID:")) {
    const match = order.notes.match(/TrxID:\s*([^\s|]+)/);
    if (match) transactionId = match[1];
  }

  // Determine advance paid
  let advancePaid = 0;
  if (order.payment_status === "paid") {
    advancePaid = Number(order.total_amount) || 0;
  } else {
    advancePaid = Number(order.shipping_fee) || (deliveryZone === "inside_dhaka" ? 80 : 120);
  }

  return {
    id: order.order_number,
    createdAt: formatOrderDate(order.created_at),
    status: (order.status as OrderStatus) || "pending",
    paymentStatus: (order.payment_status as PaymentStatus | "partial") || "unpaid",
    paymentMethod,
    transactionId: transactionId || undefined,
    deliveryZone,
    carrier: order.carrier || "Steadfast Courier",
    trackingNumber: order.tracking_number || undefined,
    subtotal: Number(order.subtotal) || 0,
    shippingFee: Number(order.shipping_fee) || 0,
    discountAmount: Number(order.discount_amount) || 0,
    advancePaid,
    totalAmount: Number(order.total_amount) || 0,
    shippingAddress: {
      fullName: address.fullName || "Valued Customer",
      phone: address.phone || "",
      address:
        address.addressLine1 ||
        (address as Record<string, any>).address ||
        "Dhaka, Bangladesh",
      city: address.city || "Dhaka",
      notes:
        (address as Record<string, any>).notes ||
        (order.gift_options?.message ? `Gift: ${order.gift_options.message}` : undefined),
    },
    items: mappedItems,
  };
}
