"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Printer,
  ShoppingBag,
  MessageCircle,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Gift,
  Phone,
  Mail,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
  BadgePercent,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import { OrderTrackingTimeline } from "@/components/storefront/OrderTrackingTimeline";
import type { OrderRecord, OrderItemRecord } from "@/lib/db/types";

interface OrderSuccessClientProps {
  orderNumber: string;
  orderData?: (OrderRecord & { items?: OrderItemRecord[] }) | null;
}

export function OrderSuccessClient({
  orderNumber,
  orderData,
}: OrderSuccessClientProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyOrderNumber() {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrintInvoice() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  const whatsAppSupportUrl = (() => {
    const cleanNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
    ).replace(/[^\d+]/g, "");

    const itemsCount = orderData?.items?.length || 1;
    const totalFormatted = orderData?.total_amount
      ? `৳ ${orderData.total_amount.toLocaleString()}`
      : "";

    const message = [
      "👋 Hello Mirai Mart! I just placed an order:",
      "",
      `🧾 *Order ID:* ${orderNumber}`,
      orderData?.shipping_address?.fullName
        ? `👤 *Name:* ${orderData.shipping_address.fullName}`
        : null,
      orderData?.shipping_address?.phone
        ? `📱 *Phone:* ${orderData.shipping_address.phone}`
        : null,
      totalFormatted ? `💰 *Total Amount:* ${totalFormatted}` : null,
      `📦 *Items:* ${itemsCount} product(s)`,
      "",
      "Could you please confirm receipt and verify my payment? Thank you! ✨",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
  })();

  // Parse MFS notes if available
  const notesStr = orderData?.notes || "";
  const isBkash = orderData?.payment_method?.includes("bkash") || notesStr.toLowerCase().includes("bkash");
  const isNagad = orderData?.payment_method?.includes("nagad") || notesStr.toLowerCase().includes("nagad");
  const isFullPayment = orderData?.payment_method?.startsWith("full_payment") || orderData?.payment_status === "paid";

  // Calculate Advance & Due balance
  const totalAmount = orderData?.total_amount || 0;
  const shippingFee = orderData?.shipping_fee || 0;
  const advanceAmount = isFullPayment ? totalAmount : shippingFee;
  const dueOnDelivery = isFullPayment ? 0 : Math.max(0, totalAmount - advanceAmount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* 1. Celebratory Success Banner (Screen only) */}
      <div className="rounded-3xl border border-success/30 bg-surface p-6 sm:p-10 text-center shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0 print:text-left">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-surface/40 rounded-full blur-2xl pointer-events-none print:hidden" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-surface/40 rounded-full blur-2xl pointer-events-none print:hidden" />

        <div className="relative mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-success-surface text-success shadow-xs print:hidden">
          <CheckCircle2 size={40} className="stroke-[2.2]" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-secondary animate-bounce" />
        </div>

        <div className="print:hidden">
          <span className="inline-block rounded-full bg-primary-surface/80 border border-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tertiary mb-2.5">
            Order Successfully Placed
          </span>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-dark">
            Thank You for Your Order! 🎉
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-neutral-muted max-w-lg mx-auto leading-relaxed">
            We have received your order details. Our team is verifying your bKash/Nagad payment and preparing your items for delivery.
          </p>
        </div>

        {/* Print-Only Header */}
        <div className="hidden print:block border-b-2 border-neutral-dark pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-heading text-2xl font-black text-primary">MIRAI MART</h1>
              <p className="text-xs text-neutral-muted">Smart Parenting, Happy Kids — Dhaka, Bangladesh</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-sm">OFFICIAL INVOICE</p>
              <p className="font-mono text-neutral-dark font-bold">{orderNumber}</p>
              <p className="text-neutral-muted">
                Date: {orderData?.created_at ? new Date(orderData.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Number Box with 1-Click Copy & Print Button */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-neutral-bg border border-neutral-border px-3.5 py-2">
            <span className="text-xs text-neutral-muted">Order ID:</span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-primary">
              {orderNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="flex items-center gap-1 text-xs font-bold text-neutral-dark bg-surface hover:bg-neutral-bg border border-neutral-border px-2 py-0.5 rounded-md transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={11} className="text-success" />
                  <span className="text-success text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} className="text-neutral-muted" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-surface hover:bg-neutral-bg border border-neutral-border px-3.5 py-2 text-xs font-bold text-neutral-dark shadow-2xs transition-all cursor-pointer"
          >
            <Printer size={14} className="text-primary" />
            <span>Print Receipt / PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Live Fulfillment Milestone Tracker */}
      <div className="mt-6 print:hidden">
        <OrderTrackingTimeline
          status={orderData?.status || "pending"}
          paymentStatus={orderData?.payment_status || "unpaid"}
          carrier={orderData?.carrier}
          trackingNumber={orderData?.tracking_number}
          deliveryZone={orderData?.shipping_address?.deliveryZone}
          createdAt={orderData?.created_at}
        />
      </div>

      {/* 3. Itemized Receipt & Order Line Items */}
      <div className="mt-6 rounded-2xl border border-neutral-border bg-surface p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-neutral-dark">
              Order Summary & Items
            </h3>
          </div>
          <span className="text-xs font-bold text-neutral-muted">
            {orderData?.items?.length || 0} {(orderData?.items?.length || 0) === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Items List */}
        {orderData?.items && orderData.items.length > 0 ? (
          <div className="divide-y divide-neutral-border/60">
            {orderData.items.map((item, index) => (
              <div
                key={item.id || index}
                className="py-3.5 flex items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-14 w-14 rounded-xl border border-neutral-border/80 bg-neutral-bg flex items-center justify-center overflow-hidden shrink-0">
                    <Package size={22} className="text-neutral-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-xs sm:text-sm text-neutral-dark truncate">
                      {item.product_title}
                    </p>
                    {item.variant_title && item.variant_title !== "Default" && (
                      <p className="text-[11px] text-neutral-muted">
                        Variant: {item.variant_title}
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-muted mt-0.5">
                      Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-heading font-bold text-xs sm:text-sm text-neutral-dark">
                    {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-neutral-muted">
            Order confirmed. Full item details stored with ID: {orderNumber}
          </div>
        )}

        {/* Gift Wrapping Card if selected */}
        {orderData?.gift_options?.is_gift && (
          <div className="mt-4 rounded-xl bg-secondary-surface/40 border border-secondary/30 p-3.5 flex items-start gap-2.5 text-xs text-neutral-dark">
            <Gift size={16} className="text-secondary-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Premium Gift Wrapping Included (+৳ 50)</p>
              {orderData.gift_options.message && (
                <p className="text-[11px] text-neutral-muted italic mt-0.5">
                  &ldquo;{orderData.gift_options.message}&rdquo;
                </p>
              )}
            </div>
          </div>
        )}

        {/* Financial Calculation Breakdown */}
        {orderData && (
          <div className="mt-5 pt-4 border-t border-neutral-border/60 space-y-2 text-xs text-neutral-muted">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-bold text-neutral-dark">
                {formatCurrency(orderData.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee ({orderData.shipping_address?.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}):</span>
              <span className="font-bold text-neutral-dark">
                {orderData.shipping_fee === 0 ? (
                  <span className="text-success font-extrabold uppercase">FREE</span>
                ) : (
                  formatCurrency(orderData.shipping_fee)
                )}
              </span>
            </div>

            {orderData.discount_amount > 0 && (
              <div className="flex justify-between text-success">
                <span className="flex items-center gap-1">
                  <BadgePercent size={13} />
                  Discount Applied:
                </span>
                <span className="font-bold">
                  -{formatCurrency(orderData.discount_amount)}
                </span>
              </div>
            )}

            {orderData.gift_options?.wrap_fee ? (
              <div className="flex justify-between">
                <span>Gift Wrapping:</span>
                <span className="font-bold text-neutral-dark">
                  {formatCurrency(orderData.gift_options.wrap_fee)}
                </span>
              </div>
            ) : null}

            <div className="flex justify-between pt-3 border-t border-neutral-border/60 text-sm font-bold text-neutral-dark">
              <span>Grand Total:</span>
              <span className="text-primary font-heading text-base font-extrabold">
                {formatCurrency(orderData.total_amount)}
              </span>
            </div>

            {/* Advance Paid vs Balance Due on Delivery Badge */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl bg-success-surface/50 border border-success/30 p-3 text-xs">
                <span className="text-neutral-muted block text-[11px]">
                  {isFullPayment ? "Full Amount Paid (MFS):" : "Advance Shipping Paid (MFS):"}
                </span>
                <span className="font-heading font-extrabold text-sm text-success">
                  {formatCurrency(advanceAmount)}
                </span>
                <span className="text-[10px] text-success block mt-0.5">
                  ✓ Verified by bKash/Nagad
                </span>
              </div>

              <div className="rounded-xl bg-neutral-bg border border-neutral-border p-3 text-xs">
                <span className="text-neutral-muted block text-[11px]">
                  Cash Due on Doorstep Delivery:
                </span>
                <span className="font-heading font-extrabold text-sm text-neutral-dark">
                  {dueOnDelivery === 0 ? "৳ 0 (Fully Paid)" : formatCurrency(dueOnDelivery)}
                </span>
                <span className="text-[10px] text-neutral-muted block mt-0.5">
                  {dueOnDelivery === 0 ? "No payment due at doorstep" : "Pay to delivery agent upon parcel handover"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Delivery & Customer Contact Info */}
      {orderData && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-dark font-heading font-bold text-sm border-b border-neutral-border/60 pb-2.5">
              <MapPin size={16} className="text-primary" />
              <span>Delivery Information</span>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-muted">
              <p className="font-bold text-neutral-dark text-sm">
                {orderData.shipping_address?.fullName}
              </p>
              <div className="flex items-center gap-1.5 text-neutral-dark">
                <Phone size={13} className="text-primary" />
                <span>{orderData.shipping_address?.phone}</span>
              </div>
              {orderData.shipping_address?.email && (
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-neutral-muted" />
                  <span>{orderData.shipping_address.email}</span>
                </div>
              )}
              <p className="text-neutral-dark pt-1 font-medium">
                {orderData.shipping_address?.addressLine1},{" "}
                {orderData.shipping_address?.city}
              </p>
              <span className="inline-block rounded-md bg-primary-surface text-tertiary px-2 py-0.5 text-[11px] font-bold">
                Zone:{" "}
                {orderData.shipping_address?.deliveryZone === "inside_dhaka"
                  ? "Inside Dhaka Metro (৳ 80)"
                  : "Outside Dhaka Nationwide (৳ 120)"}
              </span>
            </div>
          </div>

          {/* Payment & Support Info */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-dark font-heading font-bold text-sm border-b border-neutral-border/60 pb-2.5">
              <CreditCard size={16} className="text-primary" />
              <span>Payment & Verification</span>
            </div>

            <div className="text-xs space-y-2 text-neutral-muted">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-bold text-neutral-dark uppercase">
                  {isBkash ? "bKash MFS" : isNagad ? "Nagad MFS" : orderData.payment_method?.replace("_", " ")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-neutral-dark">
                  {isFullPayment ? "100% Full Payment" : "Advance Shipping + Cash on Delivery"}
                </span>
              </div>

              {notesStr && (
                <div className="rounded-lg bg-neutral-bg p-2.5 border border-neutral-border/80 text-[11px]">
                  <span className="text-neutral-muted block mb-0.5 font-bold">Verification Note:</span>
                  <span className="text-neutral-dark font-mono break-all">{notesStr}</span>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-border/60 flex items-center justify-between text-[11px]">
                <span className="text-neutral-muted">Need to modify address?</span>
                <a
                  href={whatsAppSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <MessageCircle size={12} />
                  <span>WhatsApp Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CTAs & Next Steps (Screen only) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 print:hidden">
        <Link
          href="/category/all"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
        >
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
        </Link>

        <Link
          href="/track-order"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface border border-neutral-border hover:bg-neutral-bg px-6 py-3.5 font-sans text-sm font-bold text-neutral-dark shadow-2xs transition-all active:scale-[0.99]"
        >
          <FileText size={16} className="text-primary" />
          <span>Track Any Order</span>
        </Link>

        <a
          href={whatsAppSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a] active:scale-[0.99]"
        >
          <MessageCircle size={16} />
          <span>WhatsApp Assistance</span>
        </a>
      </div>
    </div>
  );
}
