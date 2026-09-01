"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  AlertTriangle,
  RotateCcw,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@/lib/db/types";

interface OrderTrackingTimelineProps {
  status: OrderStatus;
  paymentStatus?: PaymentStatus | "partial";
  carrier?: string | null;
  trackingNumber?: string | null;
  deliveryZone?: string;
  createdAt?: string;
  className?: string;
}

interface StepInfo {
  key: OrderStatus;
  title: string;
  description: string;
  icon: React.ElementType;
}

const ORDER_STEPS: StepInfo[] = [
  {
    key: "pending",
    title: "Order Placed",
    description: "Verifying payment & details",
    icon: Clock,
  },
  {
    key: "packed",
    title: "Quality Check & Packed",
    description: "Boxed and sealed for transit",
    icon: Package,
  },
  {
    key: "shipped",
    title: "In Transit / Dispatched",
    description: "Handed over to courier",
    icon: Truck,
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Parcel received by customer",
    icon: CheckCircle2,
  },
];

function getStatusStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "packed":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
}

export function OrderTrackingTimeline({
  status,
  paymentStatus,
  carrier,
  trackingNumber,
  deliveryZone,
  createdAt,
  className = "",
}: OrderTrackingTimelineProps) {
  const [copiedTracking, setCopiedTracking] = useState(false);

  const isCancelled = status === "cancelled";
  const isRefunded = status === "refunded";
  const currentStepIdx = getStatusStepIndex(status);

  // Calculate estimated delivery date
  const orderDate = createdAt ? new Date(createdAt) : new Date();
  const isInsideDhaka = deliveryZone === "inside_dhaka";
  
  const minDeliveryDays = isInsideDhaka ? 1 : 2;
  const maxDeliveryDays = isInsideDhaka ? 2 : 4;

  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + minDeliveryDays);

  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + maxDeliveryDays);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const estimatedDeliveryText = `${formatDate(minDate)} – ${formatDate(maxDate)}`;

  function handleCopyTracking() {
    if (!trackingNumber || !navigator?.clipboard) return;
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  }

  return (
    <div className={`rounded-2xl border border-neutral-border bg-surface p-5 sm:p-7 shadow-xs ${className}`}>
      {/* 1. Header & Quick Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark">
              Fulfillment Status
            </h3>
            {isCancelled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-error-surface border border-error/30 px-2.5 py-0.5 text-xs font-bold text-error">
                <AlertTriangle size={12} />
                Cancelled
              </span>
            )}
            {isRefunded && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 border border-purple-300 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                <RotateCcw size={12} />
                Refunded
              </span>
            )}
            {!isCancelled && !isRefunded && status === "delivered" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success-surface border border-success/30 px-2.5 py-0.5 text-xs font-bold text-success">
                <CheckCircle2 size={12} />
                Delivered
              </span>
            )}
            {!isCancelled && !isRefunded && status !== "delivered" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-surface border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-tertiary">
                <Clock size={12} className="animate-pulse" />
                {status === "pending"
                  ? "Processing Order"
                  : status === "packed"
                  ? "Ready for Courier"
                  : "Out for Delivery"}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-muted mt-1">
            {isInsideDhaka
              ? "Inside Dhaka Metro (1–2 Days Delivery)"
              : "Outside Dhaka Nationwide (2–4 Days Delivery)"}
          </p>
        </div>

        {/* Estimated Delivery Box */}
        {!isCancelled && !isRefunded && (
          <div className="flex items-center gap-2.5 bg-neutral-bg border border-neutral-border/80 rounded-xl px-3.5 py-2 text-xs">
            <Calendar size={15} className="text-primary shrink-0" />
            <div>
              <span className="text-[11px] text-neutral-muted block leading-none mb-0.5">
                {status === "delivered" ? "Delivered on:" : "Estimated Delivery:"}
              </span>
              <span className="font-bold text-neutral-dark font-sans">
                {status === "delivered" ? formatDate(orderDate) : estimatedDeliveryText}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Cancelled or Refunded Banner */}
      {isCancelled && (
        <div className="mt-6 rounded-xl bg-error-surface/60 border border-error/30 p-4 text-xs text-neutral-dark flex items-start gap-3">
          <AlertTriangle size={18} className="text-error shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-error">This order has been cancelled.</p>
            <p className="text-neutral-muted">
              If this was a mistake or you have questions regarding advance payment refunds, please contact our 24/7 WhatsApp support team.
            </p>
          </div>
        </div>
      )}

      {isRefunded && (
        <div className="mt-6 rounded-xl bg-purple-50 border border-purple-200 p-4 text-xs text-neutral-dark flex items-start gap-3">
          <RotateCcw size={18} className="text-purple-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-purple-800">Order Payment Refunded</p>
            <p className="text-neutral-muted">
              The payment for this order has been refunded back to your source bKash/Nagad wallet or bank account.
            </p>
          </div>
        </div>
      )}

      {/* 3. Milestone Stepper Timeline */}
      {!isCancelled && !isRefunded && (
        <div className="mt-8 pt-2">
          {/* Desktop/Tablet Horizontal Stepper */}
          <div className="hidden sm:grid grid-cols-4 gap-2 relative">
            {/* Background connecting line */}
            <div className="absolute top-5 left-1/8 right-1/8 h-1 bg-neutral-border z-0" />
            
            {/* Active connecting line fill */}
            <div
              className="absolute top-5 left-1/8 h-1 bg-primary transition-all duration-700 z-0"
              style={{
                width:
                  currentStepIdx === 0
                    ? "0%"
                    : currentStepIdx === 1
                    ? "33%"
                    : currentStepIdx === 2
                    ? "66%"
                    : "75%",
              }}
            />

            {ORDER_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;
              const isUpcoming = currentStepIdx < idx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                  {/* Step Circle */}
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-success text-white shadow-xs"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary-surface shadow-md"
                        : "bg-surface border-2 border-neutral-border text-neutral-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={18} className="stroke-[3]" />
                    ) : (
                      <StepIcon size={18} className={isCurrent ? "animate-pulse" : ""} />
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="mt-3 space-y-0.5">
                    <p
                      className={`font-heading text-xs font-bold ${
                        isCurrent
                          ? "text-primary text-sm font-extrabold"
                          : isCompleted
                          ? "text-neutral-dark"
                          : "text-neutral-muted"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-neutral-muted max-w-[130px] leading-tight">
                      {step.description}
                    </p>
                    {isCompleted && (
                      <span className="inline-block text-[10px] font-bold text-success pt-0.5">
                        ✓ Completed
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-block text-[10px] font-bold text-primary pt-0.5 animate-pulse">
                        ● In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Stepper */}
          <div className="sm:hidden space-y-4 relative pl-3">
            <div className="absolute top-4 bottom-4 left-7 w-0.5 bg-neutral-border" />

            {ORDER_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx;

              return (
                <div key={step.key} className="flex items-start gap-4 relative z-10">
                  <div
                    className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? "bg-success text-white shadow-xs"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary-surface shadow-xs"
                        : "bg-surface border-2 border-neutral-border text-neutral-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={14} className="stroke-[3]" />
                    ) : (
                      <StepIcon size={14} />
                    )}
                  </div>

                  <div className="pt-0.5">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-heading text-xs font-bold ${
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                            ? "text-neutral-dark"
                            : "text-neutral-muted"
                        }`}
                      >
                        {step.title}
                      </p>
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-success">✓</span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-primary animate-pulse">
                          ● Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-muted mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Courier & Tracking ID Card (If dispatched) */}
      {carrier || trackingNumber ? (
        <div className="mt-6 pt-5 border-t border-neutral-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-primary-surface/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-surface text-tertiary flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div className="text-xs">
              <span className="text-neutral-muted block">Courier Partner</span>
              <span className="font-bold text-neutral-dark font-heading">
                {carrier || "Steadfast Courier / Pathao Express"}
              </span>
            </div>
          </div>

          {trackingNumber && (
            <div className="flex items-center gap-2 bg-surface border border-neutral-border px-3 py-1.5 rounded-lg text-xs">
              <span className="text-neutral-muted">Consignment ID:</span>
              <span className="font-mono font-bold text-primary">{trackingNumber}</span>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="text-neutral-muted hover:text-neutral-dark transition-colors ml-1 cursor-pointer"
                title="Copy tracking ID"
              >
                {copiedTracking ? (
                  <Check size={13} className="text-success" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* 5. Trust Guarantee Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-border/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-muted">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          <span>7-Day Replacement Guarantee & Verified Genuine Toys</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-primary" />
          <span>Dispatched from Dhaka Hub</span>
        </div>
      </div>
    </div>
  );
}
