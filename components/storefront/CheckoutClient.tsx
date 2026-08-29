"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Lock,
  MessageCircle,
  X,
  RotateCcw,
} from "lucide-react";
import posthog from "posthog-js";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { CheckoutPaymentMethod } from "@/components/storefront/CheckoutPaymentMethod";
import {
  checkoutFormSchema,
  type CheckoutFormData,
} from "@/lib/validations/checkout.schema";
import { createOrderAction } from "@/actions/orders";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_RATES,
  DEFAULT_WHATSAPP_NUMBER,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function CheckoutClient() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    rawSavings,
    giftOptions,
    appliedPromo,
    discountAmount,
    giftWrapFee,
    clearCart,
    updateQuantity,
    removeItem,
  } = useCart();

  // Form Field States
  const [fullName, setFullName] = useState(
    profile?.fullName || user?.user_metadata?.full_name || ""
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [email, setEmail] = useState(profile?.email || user?.email || "");
  const [orderNotes, setOrderNotes] = useState("");

  // Delivery Zone State (Inside Dhaka: ৳80, Outside Dhaka: ৳120)
  const [deliveryZone, setDeliveryZone] = useState<
    "inside_dhaka" | "outside_dhaka"
  >("inside_dhaka");

  // Sync profile details when auth session loads
  useEffect(() => {
    if (profile?.fullName && !fullName) {
      setFullName(profile.fullName);
    }
    if (profile?.phone && !phone) {
      setPhone(profile.phone);
    }
    if ((profile?.email || user?.email) && !email) {
      setEmail(profile?.email || user?.email || "");
    }
  }, [profile, user]);

  // Payment Method States
  const [paymentMode, setPaymentMode] = useState<"cod_advance" | "full_payment">(
    "cod_advance"
  );
  const [mfsProvider, setMfsProvider] = useState<"bkash" | "nagad">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate live shipping fee based on selected zone & free shipping eligibility (Threshold: ৳ 3,000)
  const baseShippingFee =
    deliveryZone === "inside_dhaka"
      ? SHIPPING_RATES.inside_dhaka
      : SHIPPING_RATES.outside_dhaka;

  const isFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ||
    appliedPromo?.discountType === "free_shipping";

  const effectiveShippingFee = isFreeShipping ? 0 : baseShippingFee;

  const grandTotal = Math.max(
    0,
    subtotal + effectiveShippingFee + giftWrapFee - discountAmount
  );

  const amountToPayAdvance =
    paymentMode === "cod_advance" ? effectiveShippingFee : grandTotal;
  const balanceOnDelivery = Math.max(0, grandTotal - amountToPayAdvance);

  // WhatsApp Checkout Shortcut
  const whatsAppCheckoutUrl = (() => {
    const cleanNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
    ).replace(/[^\d+]/g, "");

    const itemListText = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.productTitle}* ${
            it.variantTitle && it.variantTitle !== "Default"
              ? `(${it.variantTitle})`
              : ""
          } x ${it.quantity} = ৳ ${(it.price * it.quantity).toLocaleString()}`
      )
      .join("\n");

    const message = [
      "👋 Hello Mirai Mart! I would like to place an order:",
      "",
      `👤 *Customer:* ${fullName || "Customer"}`,
      `📞 *Phone:* ${phone || "N/A"}`,
      `📍 *Address:* ${addressLine1 || "N/A"} (${
        deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"
      })`,
      "",
      "🛒 *Items:*",
      itemListText,
      "",
      giftOptions.isGift ? `🎁 *Gift Wrapping:* Yes (৳ ${giftWrapFee})` : null,
      appliedPromo ? `🏷️ *Promo Applied:* ${appliedPromo.code}` : null,
      `🚚 *Delivery Fee:* ${effectiveShippingFee === 0 ? "FREE" : `৳ ${effectiveShippingFee}`}`,
      `💰 *Grand Total:* ৳ ${grandTotal.toLocaleString()}`,
      `💳 *Payment Mode:* ${
        paymentMode === "cod_advance"
          ? `COD (Advance ৳ ${amountToPayAdvance}, Balance on Delivery ৳ ${balanceOnDelivery})`
          : "Full Payment"
      } via ${mfsProvider.toUpperCase()} (TrxID: ${transactionId || "Pending"})`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  })();

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setFormErrors({});

    const validationResult = checkoutFormSchema.safeParse({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      deliveryZone,
      addressLine1: addressLine1.trim(),
      city: deliveryZone === "inside_dhaka" ? "Dhaka" : "Outside Dhaka",
      postalCode: "",
      orderNotes: orderNotes.trim() || undefined,
      paymentMode,
      mfsProvider,
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
      agreeTerms,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(fieldErrors);

      // Scroll to first error
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const el = document.getElementById(`${firstErrorField}Input`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
      }
      return;
    }

    if (items.length === 0) {
      setSubmitError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOrderAction({
        formData: validationResult.data,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productTitle: i.productTitle,
          variantTitle: i.variantTitle,
          productSlug: i.productSlug,
          sku: i.sku,
          price: i.price,
          compareAtPrice: i.compareAtPrice,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        giftOptions: {
          isGift: giftOptions.isGift,
          wrapFee: giftWrapFee,
          message: giftOptions.message,
        },
        appliedPromoCode: appliedPromo?.code,
      });

      if (!result.success || !result.orderNumber) {
        setSubmitError(result.error || "Failed to place order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Track order placement event in PostHog
      posthog.capture("order_placed", {
        orderNumber: result.orderNumber,
        grandTotal,
        itemCount,
        paymentMode,
        mfsProvider,
        deliveryZone,
      });

      // Clear client-side cart
      clearCart();

      // Navigate to order confirmation page
      router.push(`/checkout/success/${result.orderNumber}`);
    } catch (err) {
      console.error("[CheckoutClient] Order submission error:", err);
      setSubmitError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="rounded-3xl border border-neutral-border bg-surface p-10 sm:p-14 shadow-xs">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-surface/40 text-primary">
            <ShoppingBag size={40} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-dark">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-sm text-neutral-muted max-w-md mx-auto">
            You don't have any items ready for checkout. Explore our collection and add your favorite products!
          </p>
          <div className="mt-8">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-border/80 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-tertiary transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Shopping Bag</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-dark bg-success-surface border border-success/30 px-3.5 py-1.5 rounded-full w-fit">
          <Lock size={13} className="text-success" />
          <span>256-Bit SSL Encrypted & Secure Checkout</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Billing Details (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-neutral-border/80 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-dark tracking-tight">
                Billing Details
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullNameInput"
                    className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-1.5"
                  >
                    Full Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="fullNameInput"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন..."
                    className={`w-full rounded-full border bg-surface px-5 py-3 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:outline-none focus:ring-2 ${
                      formErrors.fullName
                        ? "border-error focus:ring-error/20"
                        : "border-neutral-border/90 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-[11px] font-medium text-error px-3">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    htmlFor="phoneInput"
                    className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-1.5"
                  >
                    Mobile Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="phoneInput"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="সঠিক মোবাইল নাম্বার লিখুন..."
                    className={`w-full rounded-full border bg-surface px-5 py-3 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:outline-none focus:ring-2 ${
                      formErrors.phone
                        ? "border-error focus:ring-error/20"
                        : "border-neutral-border/90 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-[11px] font-medium text-error px-3">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-2">
                    Delivery Zone <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Inside Dhaka */}
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        deliveryZone === "inside_dhaka"
                          ? "border-primary bg-primary-surface/30 shadow-xs ring-2 ring-primary/20"
                          : "border-neutral-border/90 bg-surface hover:bg-neutral-bg"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value="inside_dhaka"
                          checked={deliveryZone === "inside_dhaka"}
                          onChange={() => setDeliveryZone("inside_dhaka")}
                          className="h-4 w-4 accent-primary text-primary focus:ring-primary cursor-pointer"
                        />
                        <div>
                          <span className="font-sans font-bold text-xs sm:text-sm text-neutral-dark block">
                            Inside Dhaka (ঢাকা সিটি)
                          </span>
                          <span className="text-[11px] text-neutral-muted">
                            1–2 Days Delivery
                          </span>
                        </div>
                      </div>
                      <span className="font-heading font-bold text-sm text-primary">
                        {isFreeShipping ? "FREE" : `৳ ${SHIPPING_RATES.inside_dhaka}`}
                      </span>
                    </label>

                    {/* Outside Dhaka */}
                    <label
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        deliveryZone === "outside_dhaka"
                          ? "border-primary bg-primary-surface/30 shadow-xs ring-2 ring-primary/20"
                          : "border-neutral-border/90 bg-surface hover:bg-neutral-bg"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value="outside_dhaka"
                          checked={deliveryZone === "outside_dhaka"}
                          onChange={() => setDeliveryZone("outside_dhaka")}
                          className="h-4 w-4 accent-primary text-primary focus:ring-primary cursor-pointer"
                        />
                        <div>
                          <span className="font-sans font-bold text-xs sm:text-sm text-neutral-dark block">
                            Outside Dhaka (ঢাকার বাইরে)
                          </span>
                          <span className="text-[11px] text-neutral-muted">
                            2–4 Days Delivery
                          </span>
                        </div>
                      </div>
                      <span className="font-heading font-bold text-sm text-primary">
                        {isFreeShipping ? "FREE" : `৳ ${SHIPPING_RATES.outside_dhaka}`}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label
                    htmlFor="addressLine1Input"
                    className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-1.5"
                  >
                    Full Address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="addressLine1Input"
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="বাড়ি/মহল্লা/রাস্তা/এরিয়ার বিস্তারিত ঠিকানা লিখুন..."
                    className={`w-full rounded-full border bg-surface px-5 py-3 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:outline-none focus:ring-2 ${
                      formErrors.addressLine1
                        ? "border-error focus:ring-error/20"
                        : "border-neutral-border/90 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {formErrors.addressLine1 && (
                    <p className="mt-1 text-[11px] font-medium text-error px-3">
                      {formErrors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Email (Optional) */}
                <div>
                  <label
                    htmlFor="emailInput"
                    className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-1.5"
                  >
                    Email{" "}
                    <span className="text-neutral-muted text-xs font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="emailInput"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ইমেইল এড্রেস লিখুন (যদি থাকে)..."
                    className="w-full rounded-full border border-neutral-border/90 bg-surface px-5 py-3 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Special Instructions (Optional) */}
                <div>
                  <label
                    htmlFor="orderNotesInput"
                    className="block font-sans text-xs sm:text-sm font-medium text-neutral-dark mb-1.5"
                  >
                    Special Delivery Instructions{" "}
                    <span className="text-neutral-muted text-xs font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="orderNotesInput"
                    type="text"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="যেমন: কল দিয়ে আসবেন অথবা দুপুর ২টার পর ডেলিভারি দিন..."
                    className="w-full rounded-full border border-neutral-border/90 bg-surface px-5 py-3 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Trust Badge Indicators */}
              <div className="rounded-2xl border border-neutral-border/60 bg-neutral-bg/60 p-4 space-y-2.5 pt-4 text-xs text-neutral-muted">
                <div className="flex items-center gap-2 text-neutral-dark font-medium">
                  <ShieldCheck size={15} className="text-success shrink-0" />
                  <span>100% Genuine & Quality Inspected Products</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-dark font-medium">
                  <Truck size={15} className="text-primary shrink-0" />
                  <span>Fast Nationwide Delivery (Inside Dhaka 1–2d, Outside 2–4d)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-dark font-medium">
                  <RotateCcw size={15} className="text-tertiary shrink-0" />
                  <span>30-Day Easy Replacement Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Details & Payment Method (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Order Details Card */}
            <div className="rounded-3xl border border-neutral-border/80 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-dark text-center">
                Order Details
              </h2>

              {/* Table Header: Product & Subtotal */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-border/70 text-xs font-bold text-neutral-dark tracking-wide uppercase">
                <span>Product</span>
                <span>Subtotal</span>
              </div>

              {/* Line Items List */}
              <div className="space-y-4 divide-y divide-neutral-border/40 max-h-[320px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 pt-4 first:pt-0"
                  >
                    {/* Remove cross button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-muted hover:text-error transition-colors p-1 cursor-pointer shrink-0"
                      title="Remove item"
                    >
                      <X size={15} />
                    </button>

                    {/* Thumbnail Image Container */}
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-neutral-border/80 bg-white p-1 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.productTitle}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Product Title and Quantity Stepper */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-sans font-medium text-xs sm:text-sm text-neutral-dark line-clamp-2 leading-snug">
                        {item.productTitle}
                        {item.variantTitle && item.variantTitle !== "Default"
                          ? ` – ${item.variantTitle}`
                          : ""}
                      </h4>

                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-border rounded-md w-fit mt-2 overflow-hidden bg-surface">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="px-2.5 py-0.5 text-xs text-neutral-muted hover:bg-neutral-bg hover:text-neutral-dark transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-neutral-dark min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-neutral-muted hover:bg-neutral-bg hover:text-neutral-dark transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-right shrink-0">
                      <span className="font-heading font-bold text-sm sm:text-base text-neutral-dark">
                        {(item.price * item.quantity).toLocaleString()}৳
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown */}
              <div className="space-y-3 pt-4 border-t border-neutral-border/70 text-sm font-sans">
                <div className="flex justify-between items-center font-bold text-neutral-dark">
                  <span>Subtotal</span>
                  <span className="font-heading font-bold text-base text-primary">
                    {subtotal.toLocaleString()}৳
                  </span>
                </div>

                {rawSavings > 0 && (
                  <div className="flex justify-between items-center text-xs text-warning font-semibold">
                    <span>Catalog Savings</span>
                    <span>-{rawSavings.toLocaleString()}৳</span>
                  </div>
                )}

                {giftOptions.isGift && (
                  <div className="flex justify-between items-center text-xs text-neutral-dark font-medium">
                    <span>Gift Wrapping</span>
                    <span className="font-bold">+{giftWrapFee}৳</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-neutral-dark">
                  <span>Shipment</span>
                  <span className="text-neutral-dark font-medium">
                    {deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}:{" "}
                    <strong className="text-primary font-heading font-bold text-sm">
                      {effectiveShippingFee === 0
                        ? "FREE"
                        : `${effectiveShippingFee}৳`}
                    </strong>
                  </span>
                </div>

                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-success font-bold">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-{discountAmount.toLocaleString()}৳</span>
                  </div>
                )}

                {/* Grand Total Row */}
                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-border/80 text-neutral-dark">
                  <span className="font-heading font-bold text-base sm:text-lg">
                    Total
                  </span>
                  <span className="font-heading font-black text-2xl text-primary">
                    {grandTotal.toLocaleString()}৳
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card on the Right Side */}
            <div className="rounded-3xl border border-neutral-border/80 bg-surface p-6 sm:p-8 shadow-xs space-y-5">
              <CheckoutPaymentMethod
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                mfsProvider={mfsProvider}
                onMfsProviderChange={setMfsProvider}
                shippingFee={effectiveShippingFee}
                grandTotal={grandTotal}
                senderNumber={senderNumber}
                onSenderNumberChange={setSenderNumber}
                transactionId={transactionId}
                onTransactionIdChange={setTransactionId}
                errors={formErrors}
              />
            </div>

            {/* 3. Terms, Errors & Submit Actions on the Right Side */}
            <div className="space-y-4 pt-1">
              <label className="flex items-start gap-3 cursor-pointer px-1">
                <input
                  type="checkbox"
                  id="agreeTermsInput"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-border accent-primary cursor-pointer mt-0.5"
                />
                <span className="text-xs text-neutral-dark">
                  I have read and agree to the website{" "}
                  <strong className="text-primary hover:underline">
                    terms and conditions
                  </strong>{" "}
                  *
                </span>
              </label>
              {formErrors.agreeTerms && (
                <p className="text-[11px] font-medium text-error px-1">
                  {formErrors.agreeTerms}
                </p>
              )}

              {/* Submit Error Toast */}
              {submitError && (
                <div className="flex items-center gap-2 rounded-2xl bg-error-surface border border-error/30 p-4 text-xs text-error font-medium animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button (Brand Secondary Yellow Pill) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary-light py-4 px-6 font-sans text-base font-bold text-neutral-dark shadow-md transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-neutral-dark" />
                    <span>Processing Your Order...</span>
                  </>
                ) : (
                  <span>Place Order (৳ {grandTotal.toLocaleString()})</span>
                )}
              </button>

              {/* Alternative 1-Click WhatsApp Order */}
              <a
                href={whatsAppCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary-surface text-tertiary hover:bg-primary-light/40 py-3 px-4 font-sans text-xs font-bold shadow-xs transition-all active:scale-[0.99]"
              >
                <MessageCircle size={16} className="text-primary" />
                <span>Or Order Directly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
