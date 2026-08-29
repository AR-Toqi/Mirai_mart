"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";
import {
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Gift,
  Tag,
  Truck,
  ShieldCheck,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { formatCurrency } from "@/lib/utils";
import { generateWhatsAppCartOrderLink } from "@/lib/constants";

type PaymentMethod = "Cash on Delivery" | "bKash / Nagad (Prepaid)";

type FormErrors = {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  items?: string;
};

export function CheckoutPageClient() {
  const {
    selectedItems,
    selectedCount,
    selectedSubtotal,
    rawSavings,
    giftOptions,
    appliedPromo,
    discountAmount,
    giftWrapFee,
    shippingFee,
    grandTotal,
    isHydrated,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!selectedItems || selectedItems.length === 0) {
      next.items = "Your order is empty. Add items before placing an order.";
    }
    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (phone.replace(/\D/g, "").length < 6) next.phone = "Please enter a valid phone number.";
    if (!address.trim()) next.address = "Please enter your delivery address.";
    if (!city.trim()) next.city = "Please enter your city or district.";
    return next;
  }

  function handlePlaceOrder() {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const whatsAppUrl = generateWhatsAppCartOrderLink({
      items: selectedItems,
      giftOptions,
      appliedPromo,
      grandTotal,
      shippingFee,
      customer: {
        name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
      },
      paymentMethod,
      note: note.trim() || undefined,
    });

    posthog.capture("order_placed", {
      itemCount: selectedCount,
      grandTotal,
      paymentMethod,
      hasPromo: Boolean(appliedPromo),
      isGift: giftOptions.isGift,
    });

    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    clearCart();
    setOrderPlaced(true);
  }

  // Order confirmation state
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-neutral-border bg-surface p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-surface text-success">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-dark">
            Your order is on its way to us!
          </h1>
          <p className="mt-3 text-sm text-neutral-muted max-w-md mx-auto leading-relaxed">
            We opened WhatsApp with your order details. Send the message to our team to confirm your order and receive payment instructions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/all"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/account"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary-surface px-8 py-3.5 font-sans text-sm font-bold text-tertiary shadow-xs transition-all hover:bg-primary-light"
            >
              <span>View My Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading skeleton while the cart hydrates from storage
  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 rounded-md bg-neutral-border/60 animate-pulse" />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 rounded-2xl bg-neutral-border/40 animate-pulse" />
          <div className="lg:col-span-5 h-72 rounded-2xl bg-neutral-border/40 animate-pulse" />
        </div>
      </div>
    );
  }

  // Empty selection state — nothing to check out
  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-neutral-border bg-surface p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-surface/40 text-primary">
            <ShoppingBag size={40} />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-dark">
            No items selected for checkout
          </h1>
          <p className="mt-3 text-sm text-neutral-muted max-w-md mx-auto leading-relaxed">
            Add products to your bag and select the ones you want, then return here to place your order.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
            >
              <span>Go to My Bag</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/category/all"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-8 py-3.5 font-sans text-sm font-bold text-neutral-dark shadow-xs transition-all hover:bg-secondary-light active:scale-[0.99]"
            >
              <span>Explore All Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-md border bg-surface px-3.5 py-2.5 text-sm text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/cart" className="hover:text-primary transition-colors">
          Shopping Cart
        </Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-neutral-dark">Checkout</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-neutral-muted mt-1">
            Confirm your delivery details to place your order for{" "}
            <strong className="text-neutral-dark">{selectedCount}</strong> item
            {selectedCount === 1 ? "" : "s"}.
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-tertiary transition-colors self-start sm:self-auto"
        >
          <ChevronLeft size={14} />
          <span>Back to Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Delivery details & payment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-neutral-border bg-surface p-6 shadow-2xs">
            <h2 className="font-heading text-lg font-bold text-neutral-dark mb-4">
              Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-xs font-bold text-neutral-dark mb-1.5">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Rahman"
                  className={`${inputBase} ${errors.fullName ? "border-error" : "border-neutral-border"}`}
                />
                {errors.fullName && <FieldError message={errors.fullName} />}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-neutral-dark mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01700000000"
                  className={`${inputBase} ${errors.phone ? "border-error" : "border-neutral-border"}`}
                />
                {errors.phone && <FieldError message={errors.phone} />}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-bold text-neutral-dark mb-1.5">
                  City / District
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka"
                  className={`${inputBase} ${errors.city ? "border-error" : "border-neutral-border"}`}
                />
                {errors.city && <FieldError message={errors.city} />}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-xs font-bold text-neutral-dark mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat, Road, Area"
                  rows={2}
                  className={`${inputBase} ${errors.address ? "border-error" : "border-neutral-border"}`}
                />
                {errors.address && <FieldError message={errors.address} />}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="note" className="block text-xs font-bold text-neutral-dark mb-1.5">
                  Order Note <span className="font-normal text-neutral-muted">(optional)</span>
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Delivery instructions, preferred time, etc."
                  rows={2}
                  className={`${inputBase} border-neutral-border`}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-6 shadow-2xs">
            <h2 className="font-heading text-lg font-bold text-neutral-dark mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              {(["Cash on Delivery", "bKash / Nagad (Prepaid)"] as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                    paymentMethod === method
                      ? "border-primary bg-primary-surface/30"
                      : "border-neutral-border hover:bg-neutral-bg"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-semibold text-neutral-dark">{method}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-neutral-muted">
              You confirm your order and complete payment through WhatsApp with our team.
            </p>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="sticky top-24 rounded-2xl border border-neutral-border bg-surface p-6 shadow-sm space-y-5">
            <h2 className="font-heading text-xl font-bold text-neutral-dark border-b border-neutral-border/60 pb-3">
              Order Summary
            </h2>

            {/* Selected items */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-border/60 bg-neutral-bg">
                    <Image
                      src={item.imageUrl}
                      alt={item.productTitle}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-bold text-xs text-neutral-dark line-clamp-1">
                      {item.productTitle}
                    </p>
                    {item.variantTitle && item.variantTitle !== "Default" && (
                      <p className="text-[11px] text-neutral-muted">{item.variantTitle}</p>
                    )}
                  </div>
                  <span className="font-heading font-bold text-xs text-neutral-dark shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-3 text-xs font-sans border-t border-neutral-border/60 pt-4">
              <div className="flex justify-between text-neutral-muted">
                <span>Items Subtotal ({selectedCount} items)</span>
                <span className="font-bold text-neutral-dark">{formatCurrency(selectedSubtotal)}</span>
              </div>

              {rawSavings > 0 && (
                <div className="flex justify-between text-warning">
                  <span>Catalog Discount Savings</span>
                  <span className="font-bold">-{formatCurrency(rawSavings)}</span>
                </div>
              )}

              {giftOptions.isGift && (
                <div className="flex justify-between text-neutral-dark">
                  <span className="flex items-center gap-1">
                    <Gift size={13} className="text-tertiary" />
                    Gift Wrapping &amp; Card
                  </span>
                  <span className="font-bold">+{formatCurrency(giftWrapFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-muted">
                <span className="flex items-center gap-1">
                  <Truck size={13} className="text-primary" />
                  Delivery across Bangladesh
                </span>
                <span className="font-bold text-neutral-dark">
                  {shippingFee === 0 ? (
                    <span className="text-success font-bold">FREE</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>

              {appliedPromo && discountAmount > 0 && (
                <div className="flex items-center justify-between text-success">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} />
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      {appliedPromo.code}
                    </span>
                  </span>
                  <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-neutral-border text-neutral-dark">
                <div>
                  <span className="font-heading font-bold text-base">Grand Total</span>
                  <p className="text-[10px] text-neutral-muted">Includes all applicable taxes</p>
                </div>
                <span className="font-heading font-bold text-2xl text-primary">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {errors.items && (
              <div className="flex items-center gap-1.5 rounded-lg bg-error-surface border border-error/20 p-2.5 text-[11px] font-medium text-error">
                <AlertCircle size={13} />
                <span>{errors.items}</span>
              </div>
            )}

            {/* Place order via WhatsApp */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-3.5 px-4 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a] active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>Place Order via WhatsApp</span>
            </button>

            {/* Trust strip */}
            <div className="rounded-xl bg-neutral-bg/60 border border-neutral-border/60 p-3.5 space-y-2 text-[11px] text-neutral-dark">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={14} className="text-success shrink-0" />
                <span>100% Genuine &amp; Safety Certified Products</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Truck size={14} className="text-tertiary shrink-0" />
                <span>Cash on Delivery (COD) Available Nationwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-error">
      <AlertCircle size={12} />
      <span>{message}</span>
    </p>
  );
}
