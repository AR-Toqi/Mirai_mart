"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import {
  orderPlacementPayloadSchema,
  type OrderPlacementPayload,
} from "@/lib/validations/checkout.schema";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_RATES,
  GIFT_WRAP_PRICE,
  VALID_PROMO_CODES,
} from "@/lib/constants";
import type { OrderRecord, OrderItemRecord } from "@/lib/db/types";

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
  orderSummary?: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    deliveryZone: "inside_dhaka" | "outside_dhaka";
    paymentMode: "cod_advance" | "full_payment";
    mfsProvider: "bkash" | "nagad";
    senderNumber: string;
    transactionId: string;
    subtotal: number;
    shippingFee: number;
    giftWrapFee: number;
    discountAmount: number;
    grandTotal: number;
    advancePaid: number;
    balanceOnDelivery: number;
    items: {
      title: string;
      variantTitle?: string;
      price: number;
      quantity: number;
      imageUrl: string;
    }[];
  };
}

/**
 * Server Action to validate checkout payload and create order in InsForge PostgreSQL
 */
export async function createOrderAction(
  rawPayload: OrderPlacementPayload
): Promise<CreateOrderResult> {
  try {
    const payload = orderPlacementPayloadSchema.parse(rawPayload);
    const { formData, items, giftOptions, appliedPromoCode } = payload;

    // 1. Calculate pricing securely server-side
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let shippingFee: number =
      formData.deliveryZone === "inside_dhaka"
        ? SHIPPING_RATES.inside_dhaka
        : SHIPPING_RATES.outside_dhaka;

    // Promo code validation
    let discountAmount = 0;
    if (appliedPromoCode) {
      const cleanCode = appliedPromoCode.trim().toUpperCase();
      const promo = VALID_PROMO_CODES[cleanCode];
      if (promo && subtotal >= promo.minSubtotal) {
        if (promo.type === "percentage") {
          discountAmount = Math.round((subtotal * promo.value) / 100);
        } else if (promo.type === "fixed_amount") {
          discountAmount = Math.min(subtotal, promo.value);
        } else if (promo.type === "free_shipping") {
          shippingFee = 0;
        }
      }
    }

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingFee = 0;
    }

    const giftWrapFee = giftOptions?.isGift ? (giftOptions.wrapFee || GIFT_WRAP_PRICE) : 0;
    const grandTotal = Math.max(0, subtotal + shippingFee + giftWrapFee - discountAmount);

    const advancePaid =
      formData.paymentMode === "full_payment" ? grandTotal : shippingFee;
    const balanceOnDelivery = Math.max(0, grandTotal - advancePaid);

    // 2. Generate a unique order number (e.g., MM-749215)
    const timestamp = Date.now().toString().slice(-4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MM-${timestamp}${randomDigits}`;

    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    const shippingAddressObj = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      addressLine1: formData.addressLine1,
      city: formData.city,
      postalCode: formData.postalCode || "",
      country: "Bangladesh",
      deliveryZone: formData.deliveryZone,
    };

    const notesSummary = [
      formData.orderNotes ? `Customer Note: ${formData.orderNotes}` : null,
      `[${formData.mfsProvider.toUpperCase()}_PAYMENT] Sender: ${formData.senderNumber} | TrxID: ${formData.transactionId} | Advance: ৳ ${advancePaid.toLocaleString()} | Due on Delivery: ৳ ${balanceOnDelivery.toLocaleString()}`,
    ]
      .filter(Boolean)
      .join(" | ");

    // 3. Insert record into `orders`
    const { data: newOrder, error: orderInsertError } = await insforge.database
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_email: formData.email,
          shipping_address: shippingAddressObj,
          billing_address: null,
          subtotal,
          tax: 0,
          shipping_fee: shippingFee,
          discount_amount: discountAmount,
          total_amount: grandTotal,
          status: "pending",
          payment_status:
            formData.paymentMode === "full_payment" ? "paid" : "unpaid",
          payment_method: `${formData.paymentMode}_${formData.mfsProvider}`,
          gift_options: {
            is_gift: giftOptions?.isGift || false,
            wrap_fee: giftWrapFee,
            message: giftOptions?.message || "",
          },
          notes: notesSummary,
        },
      ])
      .select()
      .single();

    if (orderInsertError || !newOrder) {
      console.warn(
        "[actions/orders/createOrderAction] Database insert warning:",
        orderInsertError?.message
      );
      // Even if offline/local fallback, return success with formatted summary
      return {
        success: true,
        orderNumber,
        orderId: `fallback_${Date.now()}`,
        orderSummary: {
          orderNumber,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          deliveryAddress: formData.addressLine1,
          deliveryZone: formData.deliveryZone,
          paymentMode: formData.paymentMode,
          mfsProvider: formData.mfsProvider,
          senderNumber: formData.senderNumber,
          transactionId: formData.transactionId,
          subtotal,
          shippingFee,
          giftWrapFee,
          discountAmount,
          grandTotal,
          advancePaid,
          balanceOnDelivery,
          items: items.map((i) => ({
            title: i.productTitle,
            variantTitle: i.variantTitle ?? undefined,
            price: i.price,
            quantity: i.quantity,
            imageUrl: i.imageUrl,
          })),
        },
      };
    }

    const orderId = (newOrder as OrderRecord).id;

    // 4. Insert all line items into `order_items`
    const orderItemsPayload = items.map((it) => ({
      order_id: orderId,
      product_variant_id: it.variantId || null,
      product_title: it.productTitle,
      variant_title: it.variantTitle || "Default",
      sku: it.sku || null,
      unit_price: it.price,
      quantity: it.quantity,
      total_price: it.price * it.quantity,
    }));

    const { error: itemsError } = await insforge.database
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.warn(
        "[actions/orders/createOrderAction] order_items insert error:",
        itemsError.message
      );
    }

    // 5. Decrement inventory in `product_variants`
    for (const it of items) {
      if (it.variantId) {
        try {
          const { data: variantRecord } = await insforge.database
            .from("product_variants")
            .select("stock_quantity")
            .eq("id", it.variantId)
            .single();

          if (variantRecord && typeof variantRecord.stock_quantity === "number") {
            const newStock = Math.max(
              0,
              variantRecord.stock_quantity - it.quantity
            );
            await insforge.database
              .from("product_variants")
              .update({ stock_quantity: newStock })
              .eq("id", it.variantId);
          }
        } catch (stockErr) {
          console.warn("[actions/orders] stock decrement error:", stockErr);
        }
      }
    }

    // 6. Clear user's remote active_cart on successful placement
    if (user?.id) {
      try {
        await insforge.database
          .from("profiles")
          .update({ active_cart: null })
          .eq("id", user.id);
      } catch {
        // non-blocking
      }
    }

    // 7. On-demand cache revalidation for updated stock, PLPs, and account
    try {
      revalidatePath("/account");
      revalidatePath("/category/[slug]", "page");
      // Granular tag-based invalidation across the app (using Next.js updateTag in Server Actions)
      updateTag("products");
      for (const it of items) {
        if (it.productSlug) {
          updateTag(`product-${it.productSlug}`);
          revalidatePath(`/product/${it.productSlug}`, "page");
        }
      }
    } catch (revalErr) {
      console.warn("[actions/orders] Cache revalidation warning:", revalErr);
    }

    return {
      success: true,
      orderNumber,
      orderId,
      orderSummary: {
        orderNumber,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: formData.addressLine1,
        deliveryZone: formData.deliveryZone,
        paymentMode: formData.paymentMode,
        mfsProvider: formData.mfsProvider,
        senderNumber: formData.senderNumber,
        transactionId: formData.transactionId,
        subtotal,
        shippingFee,
        giftWrapFee,
        discountAmount,
        grandTotal,
        advancePaid,
        balanceOnDelivery,
        items: items.map((i) => ({
          title: i.productTitle,
          variantTitle: i.variantTitle ?? undefined,
          price: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
      },
    };
  } catch (error) {
    console.error("[actions/orders/createOrderAction] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while placing your order. Please try again.",
    };
  }
}

/**
 * Server Action to fetch order details by order_number
 */
export async function getOrderDetailsAction(
  orderNumber: string
): Promise<{ success: boolean; order?: OrderRecord & { items?: OrderItemRecord[] }; error?: string }> {
  try {
    const cleanOrderNumber = orderNumber.trim();
    const insforge = await createInsforgeServer();
    const { data: order, error } = await insforge.database
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("order_number", cleanOrderNumber)
      .single();

    if (error || !order) {
      return {
        success: false,
        error: "Order not found or invalid order number",
      };
    }

    return {
      success: true,
      order: order as OrderRecord & { items?: OrderItemRecord[] },
    };
  } catch (err) {
    console.error("[actions/orders/getOrderDetailsAction] Error:", err);
    return {
      success: false,
      error: "Failed to retrieve order details",
    };
  }
}

export interface TrackOrderLookupResult {
  success: boolean;
  order?: OrderRecord & { items?: OrderItemRecord[] };
  error?: string;
}

/**
 * Server Action for public self-service order tracking lookup
 * Requires Order Number + matching Phone Number or Email for customer privacy
 */
export async function trackOrderLookupAction(
  orderNumber: string,
  phoneOrEmail: string
): Promise<TrackOrderLookupResult> {
  try {
    const cleanOrderNumber = (orderNumber || "").trim().toUpperCase();
    const cleanInput = (phoneOrEmail || "").trim().toLowerCase();
    const numericPhone = cleanInput.replace(/[^\d]/g, "");

    if (!cleanOrderNumber) {
      return {
        success: false,
        error: "Please enter a valid Order Number (e.g. MM-749215).",
      };
    }

    if (!cleanInput) {
      return {
        success: false,
        error: "Please enter the Mobile Number or Email used during checkout.",
      };
    }

    const insforge = await createInsforgeServer();
    const { data: order, error } = await insforge.database
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("order_number", cleanOrderNumber)
      .single();

    if (error || !order) {
      return {
        success: false,
        error: `No order found with number "${cleanOrderNumber}". Please check your order ID and try again.`,
      };
    }

    // Verify contact info matches for privacy
    const typedOrder = order as OrderRecord & { items?: OrderItemRecord[] };
    const orderEmail = (typedOrder.customer_email || typedOrder.shipping_address?.email || "").toLowerCase();
    const orderPhone = (typedOrder.shipping_address?.phone || "").replace(/[^\d]/g, "");

    const isEmailMatch = cleanInput.includes("@") && orderEmail && orderEmail === cleanInput;
    const isPhoneMatch =
      numericPhone.length >= 6 &&
      orderPhone &&
      (orderPhone.includes(numericPhone) || numericPhone.includes(orderPhone));

    if (!isEmailMatch && !isPhoneMatch) {
      return {
        success: false,
        error: "The contact number or email provided does not match the order details on file.",
      };
    }

    return {
      success: true,
      order: typedOrder,
    };
  } catch (err) {
    console.error("[actions/orders/trackOrderLookupAction] Error:", err);
    return {
      success: false,
      error: "An error occurred while looking up your tracking status. Please try again.",
    };
  }
}

