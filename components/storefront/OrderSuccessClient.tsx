"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Copy,
  Package,
  Truck,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
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

  const whatsAppSupportUrl = (() => {
    const cleanNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
    ).replace(/[^\d+]/g, "");

    const message = [
      "👋 Hello Mirai Mart! I just placed an order:",
      "",
      `🧾 *Order Number:* ${orderNumber}`,
      orderData?.customer_email
        ? `📧 *Email:* ${orderData.customer_email}`
        : null,
      orderData?.total_amount
        ? `💰 *Total Amount:* ৳ ${orderData.total_amount.toLocaleString()}`
        : null,
      "",
      "Could you please confirm receipt and estimate the delivery date? Thank you! ✨",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* 1. Celebratory Success Banner */}
      <div className="rounded-3xl border border-success/30 bg-surface p-8 sm:p-12 text-center shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-surface/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-surface/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success-surface text-success shadow-xs">
          <CheckCircle2 size={44} className="stroke-[2.2]" />
          <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-secondary animate-bounce" />
        </div>

        <span className="inline-block rounded-full bg-primary-surface/80 border border-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tertiary mb-3">
          Order Successfully Placed
        </span>

        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-dark">
          Thank You for Your Order! 🎉
        </h1>

        <p className="mt-2 text-sm text-neutral-muted max-w-lg mx-auto leading-relaxed">
          We've received your order details and payment verification. Our team will verify your transaction with bKash/Nagad and dispatch your parcel swiftly.
        </p>

        {/* Order Number Box with 1-Click Copy */}
        <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-neutral-bg border border-neutral-border p-2.5 sm:px-4 sm:py-2">
          <span className="text-xs text-neutral-muted">Order Tracking ID:</span>
          <span className="font-mono text-base font-extrabold text-primary">
            {orderNumber}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderNumber}
            className="flex items-center gap-1 text-xs font-bold text-neutral-dark bg-surface hover:bg-neutral-bg border border-neutral-border px-2.5 py-1 rounded-md transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <CheckCircle2 size={12} className="text-success" />
                <span className="text-success text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} className="text-neutral-muted" />
                <span className="text-[11px]">Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Fulfillment Stepper Timeline */}
        <div className="mt-10 pt-8 border-t border-neutral-border/60">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {/* Step 1: Received */}
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success text-white font-bold text-xs shadow-2xs">
                ✓
              </div>
              <p className="font-heading font-bold text-xs text-neutral-dark">
                Order Received
              </p>
              <span className="text-[10px] text-success font-medium">Completed</span>
            </div>

            {/* Step 2: Payment Verification */}
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-surface text-tertiary font-bold text-xs shadow-2xs animate-pulse">
                <Clock size={16} />
              </div>
              <p className="font-heading font-bold text-xs text-neutral-dark">
                Verifying TrxID
              </p>
              <span className="text-[10px] text-tertiary font-medium">In Progress</span>
            </div>

            {/* Step 3: Packing */}
            <div className="space-y-2 opacity-60">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-bg border border-neutral-border text-neutral-muted font-bold text-xs">
                <Package size={16} />
              </div>
              <p className="font-heading font-bold text-xs text-neutral-dark">
                Packed & Dispatched
              </p>
              <span className="text-[10px] text-neutral-muted">Next Step</span>
            </div>

            {/* Step 4: Out for Delivery */}
            <div className="space-y-2 opacity-60">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-bg border border-neutral-border text-neutral-muted font-bold text-xs">
                <Truck size={16} />
              </div>
              <p className="font-heading font-bold text-xs text-neutral-dark">
                Delivered
              </p>
              <span className="text-[10px] text-neutral-muted">Expected 1-3 Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Order Information Cards */}
      {orderData && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping & Delivery Address */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-dark font-heading font-bold text-sm border-b border-neutral-border/60 pb-2.5">
              <MapPin size={16} className="text-primary" />
              <span>Delivery Address</span>
            </div>

            <div className="text-xs space-y-1 text-neutral-muted">
              <p className="font-bold text-neutral-dark text-sm">
                {orderData.shipping_address?.fullName}
              </p>
              <p>{orderData.shipping_address?.phone}</p>
              <p>{orderData.shipping_address?.email}</p>
              <p className="text-neutral-dark pt-1">
                {orderData.shipping_address?.addressLine1},{" "}
                {orderData.shipping_address?.city}
              </p>
              <p className="text-[11px] font-semibold text-primary">
                Zone:{" "}
                {orderData.shipping_address?.deliveryZone === "inside_dhaka"
                  ? "Inside Dhaka (ঢাকা সিটি)"
                  : "Outside Dhaka (ঢাকার বাইরে)"}
              </p>
            </div>
          </div>

          {/* Payment & Invoice Overview */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-neutral-dark font-heading font-bold text-sm border-b border-neutral-border/60 pb-2.5">
              <CreditCard size={16} className="text-primary" />
              <span>Payment Details</span>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-muted">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-neutral-dark uppercase">
                  {orderData.payment_method?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-neutral-dark">
                  {formatCurrency(orderData.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold text-neutral-dark">
                  {orderData.shipping_fee === 0 ? "FREE" : formatCurrency(orderData.shipping_fee)}
                </span>
              </div>
              {orderData.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount Applied:</span>
                  <span className="font-bold">
                    -{formatCurrency(orderData.discount_amount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-neutral-border/60 text-sm font-bold text-neutral-dark">
                <span>Total Amount:</span>
                <span className="text-primary font-heading text-base">
                  {formatCurrency(orderData.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Next Actions & Support */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/category/all"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99]"
        >
          <ShoppingBag size={16} />
          <span>Continue Shopping</span>
        </Link>

        <a
          href={whatsAppSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a] active:scale-[0.99]"
        >
          <MessageCircle size={16} />
          <span>Get WhatsApp Confirmation</span>
        </a>
      </div>
    </div>
  );
}
