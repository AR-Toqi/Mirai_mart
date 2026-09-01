"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  XIcon,
  PrinterIcon,
  CopyIcon,
  CheckIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  MessageCircleIcon,
  PackageIcon,
  ReceiptIcon,
} from "lucide-react";
import { OrderTrackingTimeline } from "@/components/storefront/OrderTrackingTimeline";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_WHATSAPP_NUMBER } from "@/lib/constants";
import type { OrderStatus, PaymentStatus } from "@/lib/db/types";

export interface CustomerOrderItem {
  id: string;
  productTitle: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface CustomerOrder {
  id: string; // e.g. "MM-1256" or "MM-849201"
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus | "partial";
  paymentMethod?: string; // "bkash" | "nagad" | "cod"
  transactionId?: string;
  deliveryZone: "inside_dhaka" | "outside_dhaka";
  carrier?: string;
  trackingNumber?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  advancePaid?: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: CustomerOrderItem[];
}

type Props = {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
};

export function OrderDetailModal({ order, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  function handleCopyOrderNumber() {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  const cashDue = Math.max(0, order.totalAmount - (order.advancePaid ?? 0));

  const cleanWhatsApp = DEFAULT_WHATSAPP_NUMBER.replace(/[^\d+]/g, "").replace("+", "");
  const whatsAppSupportUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `👋 Hello Mirai Mart! I need help with my Order #${order.id}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-dark/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-surface border border-neutral-border rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-border bg-neutral-bg/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0 shadow-2xs">
              <ReceiptIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-neutral-dark">
                  Order #{order.id}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  title="Copy Order Number"
                  className="text-neutral-muted hover:text-primary transition-colors cursor-pointer"
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-success" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-neutral-muted">
                Placed on {order.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Order Receipt"
              className="p-2 border border-neutral-border rounded-xl text-neutral-muted hover:text-neutral-dark hover:bg-surface transition-colors cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg rounded-xl transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Live Fulfillment Stepper */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="font-heading font-bold text-sm text-neutral-dark mb-4 flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-primary" />
              <span>Live Fulfillment Progression</span>
            </h4>
            <OrderTrackingTimeline
              status={order.status}
              paymentStatus={order.paymentStatus}
              carrier={order.carrier}
              trackingNumber={order.trackingNumber}
              deliveryZone={order.deliveryZone}
              createdAt={order.createdAt}
            />
          </div>

          {/* 2. Itemized Order Items */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-4 sm:p-5 shadow-2xs">
            <h4 className="font-heading font-bold text-sm text-neutral-dark mb-3 flex items-center gap-2">
              <PackageIcon className="w-4 h-4 text-primary" />
              <span>Items in this Order ({order.items.length})</span>
            </h4>
            <div className="divide-y divide-neutral-border">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-neutral-bg border border-neutral-border overflow-hidden relative shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.productTitle}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-xs sm:text-sm text-neutral-dark truncate">
                        {item.productTitle}
                      </p>
                      {item.variantTitle && (
                        <p className="text-[11px] text-neutral-muted">
                          Variant: {item.variantTitle}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-muted">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-xs sm:text-sm text-neutral-dark shrink-0">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Two-Column Grid: Delivery Details & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-2xs">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-dark mb-2.5 flex items-center gap-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-primary" />
                <span>Delivery Address</span>
              </h4>
              <p className="font-bold text-xs text-neutral-dark">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                {order.shippingAddress.address}, {order.shippingAddress.city}
              </p>
              <p className="text-xs text-neutral-muted mt-0.5">
                Phone: {order.shippingAddress.phone}
              </p>
              {order.shippingAddress.notes && (
                <p className="text-[11px] text-neutral-muted mt-1.5 italic bg-neutral-bg p-2 rounded-lg">
                  Note: &ldquo;{order.shippingAddress.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-2xs space-y-2 text-xs">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-dark mb-2.5 flex items-center gap-1.5">
                <CreditCardIcon className="w-3.5 h-3.5 text-primary" />
                <span>Payment & Balance</span>
              </h4>
              <div className="flex justify-between text-neutral-muted">
                <span>Subtotal</span>
                <span className="text-neutral-dark font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-muted">
                <span>Delivery Fee ({order.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"})</span>
                <span className="text-neutral-dark font-medium">{formatCurrency(order.shippingFee)}</span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              ) : null}

              <div className="border-t border-neutral-border pt-2 flex justify-between font-bold text-neutral-dark">
                <span>Total Amount</span>
                <span className="text-primary font-heading text-sm">{formatCurrency(order.totalAmount)}</span>
              </div>

              {order.advancePaid ? (
                <div className="flex justify-between text-success font-medium">
                  <span>Advance Paid ({order.paymentMethod?.toUpperCase() || "MFS"})</span>
                  <span>-{formatCurrency(order.advancePaid)}</span>
                </div>
              ) : null}

              <div className="bg-neutral-bg p-2 rounded-xl flex justify-between font-bold text-neutral-dark mt-1">
                <span>Due on Doorstep (COD)</span>
                <span className="text-neutral-dark">{formatCurrency(cashDue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-border bg-neutral-bg/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href={whatsAppSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#15803d] font-bold hover:underline"
          >
            <MessageCircleIcon className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
            <span>Need help with this order? Chat on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-neutral-dark hover:bg-neutral-dark/90 text-white font-sans font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
