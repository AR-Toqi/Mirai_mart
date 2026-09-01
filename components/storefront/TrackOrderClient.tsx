"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { trackOrderLookupAction } from "@/actions/orders";
import { OrderTrackingTimeline } from "@/components/storefront/OrderTrackingTimeline";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import type { OrderRecord, OrderItemRecord } from "@/lib/db/types";

interface TrackOrderClientProps {
  initialOrderNumber?: string;
}

export function TrackOrderClient({
  initialOrderNumber = "",
}: TrackOrderClientProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<
    (OrderRecord & { items?: OrderItemRecord[] }) | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanOrderNumber = orderNumber.trim();
    const cleanPhoneOrEmail = phoneOrEmail.trim();

    if (!cleanOrderNumber) {
      setError("Please enter your Order Number (e.g. MM-749215).");
      return;
    }

    if (!cleanPhoneOrEmail) {
      setError("Please enter your Mobile Number or Email used during checkout.");
      return;
    }

    startTransition(async () => {
      const res = await trackOrderLookupAction(cleanOrderNumber, cleanPhoneOrEmail);
      if (res.success && res.order) {
        setOrderData(res.order);
        setError(null);
      } else {
        setOrderData(null);
        setError(
          res.error ||
            "No order found matching this Order Number and contact detail. Please double check and try again."
        );
      }
    });
  }

  const whatsAppSupportUrl = (() => {
    const cleanNumber = (
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
    ).replace(/[^\d+]/g, "");

    const message = [
      "👋 Hello Mirai Mart! I would like to track my order:",
      "",
      orderNumber ? `🧾 *Order ID:* ${orderNumber.trim()}` : null,
      phoneOrEmail ? `📱 *Phone / Email:* ${phoneOrEmail.trim()}` : null,
      "",
      "Could you please give me an update on my delivery status? Thank you! ✨",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber.replace("+", "")}?text=${encodeURIComponent(message)}`;
  })();

  const faqs = [
    {
      q: "Where can I find my Order ID?",
      a: "Your Order ID (e.g. MM-749215) is displayed on your Order Confirmation screen immediately after checkout, and was also sent via SMS/Email.",
    },
    {
      q: "How long does delivery take?",
      a: "Inside Dhaka deliveries usually arrive within 24–48 hours. Outside Dhaka shipments are delivered in 2–4 business days via our courier partners (Steadfast / Pathao / RedX).",
    },
    {
      q: "Can I inspect the parcel before paying Cash on Delivery?",
      a: "Yes! You can verify the outer package condition and items with our 7-day replacement guarantee.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* 1. Header Hero */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-surface border border-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tertiary mb-3">
          <Truck size={14} />
          Live Parcel Tracking
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-dark">
          Track Your Order
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-muted leading-relaxed">
          Enter your Order Number and phone number or email to view real-time fulfillment status and delivery dates.
        </p>
      </div>

      {/* 2. Search Box Card */}
      <div className="mt-8 rounded-3xl border border-neutral-border bg-surface p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Number Input */}
            <div>
              <label
                htmlFor="orderNumber"
                className="block font-heading text-xs font-bold text-neutral-dark mb-1.5"
              >
                Order Number <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g. MM-749215"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3 text-sm font-mono font-bold text-neutral-dark uppercase placeholder:normal-case placeholder:font-sans placeholder:text-neutral-muted/70 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone or Email Input */}
            <div>
              <label
                htmlFor="phoneOrEmail"
                className="block font-heading text-xs font-bold text-neutral-dark mb-1.5"
              >
                Mobile Number or Email <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  id="phoneOrEmail"
                  type="text"
                  placeholder="e.g. 017XXXXXXXX or name@email.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-border bg-neutral-bg px-4 py-3 text-sm text-neutral-dark placeholder:text-neutral-muted/70 focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-error-surface/80 border border-error/30 p-3.5 flex items-start gap-2.5 text-xs text-error">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-neutral-muted flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success" />
              Encrypted lookup matching your checkout contact info
            </span>

            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-sans text-sm font-bold text-white shadow-xs transition-all hover:bg-tertiary active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Looking Up Order...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Track Parcel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Live Tracking Results (If found) */}
      {orderData && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          {/* Milestone Stepper */}
          <OrderTrackingTimeline
            status={orderData.status}
            paymentStatus={orderData.payment_status}
            carrier={orderData.carrier}
            trackingNumber={orderData.tracking_number}
            deliveryZone={orderData.shipping_address?.deliveryZone}
            createdAt={orderData.created_at}
          />

          {/* Order Details Summary Card */}
          <div className="rounded-2xl border border-neutral-border bg-surface p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-border/60 pb-3 mb-4">
              <div>
                <span className="text-xs text-neutral-muted block">Order ID</span>
                <span className="font-mono font-extrabold text-lg text-primary">
                  {orderData.order_number}
                </span>
              </div>
              <div className="text-left sm:text-right text-xs text-neutral-muted">
                <span>Placed on: </span>
                <span className="font-bold text-neutral-dark">
                  {orderData.created_at
                    ? new Date(orderData.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently"}
                </span>
              </div>
            </div>

            {/* Line Items List */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="divide-y divide-neutral-border/50 mb-4">
                {orderData.items.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="py-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-lg bg-neutral-bg border border-neutral-border flex items-center justify-center shrink-0">
                        <Package size={18} className="text-neutral-muted" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-neutral-dark">
                          {item.product_title}
                        </p>
                        {item.variant_title && item.variant_title !== "Default" && (
                          <p className="text-[11px] text-neutral-muted">
                            Variant: {item.variant_title}
                          </p>
                        )}
                        <p className="text-[11px] text-neutral-muted">
                          Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>

                    <div className="font-heading font-bold text-neutral-dark">
                      {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Financial Summary */}
            <div className="pt-3 border-t border-neutral-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-neutral-muted block">Delivery Address:</span>
                <span className="font-bold text-neutral-dark">
                  {orderData.shipping_address?.addressLine1},{" "}
                  {orderData.shipping_address?.city}
                </span>
              </div>

              <div className="text-right">
                <span className="text-neutral-muted block">Total Order Amount:</span>
                <span className="font-heading text-base font-extrabold text-primary">
                  {formatCurrency(orderData.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WhatsApp Help CTA & FAQs */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Support Card */}
        <div className="md:col-span-5 rounded-2xl border border-neutral-border bg-surface p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-success-surface text-success flex items-center justify-center">
              <MessageCircle size={22} />
            </div>
            <h3 className="font-heading text-lg font-bold text-neutral-dark">
              Need Instant Help?
            </h3>
            <p className="text-xs text-neutral-muted leading-relaxed">
              Our customer care team is available on WhatsApp 7 days a week to answer delivery queries, update addresses, or assist with returns.
            </p>
          </div>

          <a
            href={whatsAppSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-sans text-xs font-bold text-white shadow-xs transition-all hover:bg-[#20bd5a]"
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* FAQs */}
        <div className="md:col-span-7 rounded-2xl border border-neutral-border bg-surface p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-neutral-dark font-heading font-bold text-base mb-2">
            <HelpCircle size={18} className="text-primary" />
            <h3>Frequently Asked Questions</h3>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-border/80 bg-neutral-bg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="font-heading font-bold text-xs text-neutral-dark">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-neutral-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 text-xs text-neutral-muted leading-relaxed border-t border-neutral-border/40 pt-2 bg-surface">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
