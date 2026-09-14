"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  Package,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Send,
  ExternalLink,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import type { AdminOrderListItem, AdminOrderStatus } from "@/actions/admin";
import {
  updateAdminOrderStatusAction,
  updateAdminOrderTrackingAction,
  processAdminOrderRefundAction,
} from "@/actions/admin";
import { AdminPackingSlipModal } from "./AdminPackingSlipModal";

interface AdminOrderDetailModalProps {
  order: AdminOrderListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: AdminOrderListItem) => void;
}

const CARRIERS = [
  "Pathao",
  "Steadfast",
  "RedX",
  "Paperfly",
  "eCourier",
  "DHL Express",
  "FedEx",
];

export function AdminOrderDetailModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}: AdminOrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const [currentOrder, setCurrentOrder] = useState<AdminOrderListItem>(order);
  const [selectedCarrier, setSelectedCarrier] = useState(
    order.carrier || "Steadfast"
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isPackingSlipOpen, setIsPackingSlipOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // RMA Refund state
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [restockInventory, setRestockInventory] = useState(true);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setCurrentOrder(order);
    setSelectedCarrier(order.carrier || "Steadfast");
    setTrackingNumber(order.trackingNumber || "");
  }, [order]);

  const handleStatusChange = async (newStatus: AdminOrderStatus) => {
    setIsUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const res = await updateAdminOrderStatusAction(currentOrder.id, newStatus);
      if (res.success) {
        const updated = { ...currentOrder, status: newStatus };
        setCurrentOrder(updated);
        onOrderUpdated(updated);
        setStatusMessage(`Status successfully updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage(res.error || "Failed to update status");
      }
    } catch {
      setStatusMessage("An unexpected error occurred");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsUpdatingTracking(true);
    setStatusMessage(null);
    try {
      const res = await updateAdminOrderTrackingAction(
        currentOrder.id,
        selectedCarrier,
        trackingNumber
      );
      if (res.success) {
        const updated = {
          ...currentOrder,
          carrier: selectedCarrier,
          trackingNumber: trackingNumber.trim(),
          status: currentOrder.status === "pending" || currentOrder.status === "processing" ? "shipped" : currentOrder.status,
        };
        setCurrentOrder(updated);
        onOrderUpdated(updated);
        setStatusMessage("Fulfillment carrier & tracking updated successfully!");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage(res.error || "Failed to update tracking");
      }
    } catch {
      setStatusMessage("An unexpected error occurred");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleProcessRefund = async () => {
    setIsProcessingRefund(true);
    setStatusMessage(null);
    try {
      const res = await processAdminOrderRefundAction(
        currentOrder.id,
        refundReason,
        restockInventory
      );
      if (res.success) {
        const updated = {
          ...currentOrder,
          status: "refunded" as AdminOrderStatus,
          paymentStatus: "refunded" as const,
          notes: refundReason
            ? `[Refund]: ${refundReason}`
            : currentOrder.notes,
        };
        setCurrentOrder(updated);
        onOrderUpdated(updated);
        setIsRefundModalOpen(false);
        setStatusMessage("Refund processed and status set to REFUNDED");
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage(res.error || "Failed to process refund. Please try again.");
      }
    } catch {
      setStatusMessage("An unexpected error occurred while processing the refund.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  // Status badge helper
  const renderStatusBadge = (st: AdminOrderStatus) => {
    switch (st) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-warning-surface text-warning-foreground border-warning/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-primary-surface text-primary border-primary/20">
            <Package className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-secondary-surface text-secondary-foreground border-secondary/40">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-success-surface text-success border-success/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-error-surface text-error border-error/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-error-light text-error-foreground border-error/20">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refunded</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-dark/60 backdrop-blur-xs font-sans overflow-y-auto">
        <div className="bg-surface rounded-2xl border border-neutral-border shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
          {/* Top Bar Header */}
          <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between bg-neutral-bg/60 shrink-0">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-heading font-bold text-xl text-neutral-dark">
                    Order {currentOrder.orderNumber}
                  </h2>
                  {renderStatusBadge(currentOrder.status)}
                </div>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Placed on {currentOrder.date} at {currentOrder.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsPackingSlipOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Print Packing Slip</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Notification message */}
          {statusMessage && (
            <div className="px-6 py-2 bg-primary-surface/40 text-primary border-b border-primary/20 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-neutral-bg border border-neutral-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-muted">
                    Quick Status Update
                  </h3>
                  <p className="text-xs text-neutral-dark mt-0.5">
                    Move order along the fulfillment pipeline
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      "pending",
                      "processing",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ] as AdminOrderStatus[]
                  ).map((st) => {
                    const isActive = currentOrder.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-white shadow-xs"
                            : "bg-surface border border-neutral-border text-neutral-dark hover:border-primary/40 hover:bg-primary-surface/20"
                        }`}
                      >
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2-Column Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Customer & Shipping Details */}
              <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-border pb-3">
                  <h3 className="font-heading font-bold text-sm text-neutral-dark flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Customer & Shipping
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-surface text-primary uppercase">
                    {currentOrder.shippingAddress.deliveryZone === "outside_dhaka"
                      ? "Outside Dhaka"
                      : "Inside Dhaka"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-neutral-muted text-[11px]">Recipient:</p>
                    <p className="font-bold text-neutral-dark text-sm">
                      {currentOrder.customer.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark">
                    <Phone className="w-3.5 h-3.5 text-neutral-muted" />
                    <a
                      href={`tel:${currentOrder.customer.phone}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {currentOrder.customer.phone}
                    </a>
                  </div>
                  {currentOrder.customer.email && (
                    <div className="flex items-center gap-2 text-neutral-dark">
                      <Mail className="w-3.5 h-3.5 text-neutral-muted" />
                      <a
                        href={`mailto:${currentOrder.customer.email}`}
                        className="font-medium hover:text-primary transition-colors truncate"
                      >
                        {currentOrder.customer.email}
                      </a>
                    </div>
                  )}
                  <div className="pt-2 border-t border-neutral-border/60">
                    <p className="text-neutral-muted text-[11px]">
                      Delivery Address:
                    </p>
                    <p className="font-medium text-neutral-dark mt-0.5">
                      {currentOrder.shippingAddress.addressLine1}
                    </p>
                    <p className="text-neutral-muted">
                      {currentOrder.shippingAddress.city}
                      {currentOrder.shippingAddress.postalCode
                        ? ` - ${currentOrder.shippingAddress.postalCode}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Financial Ledger */}
              <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-border pb-3">
                  <h3 className="font-heading font-bold text-sm text-neutral-dark flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Payment & Accounting
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      currentOrder.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : currentOrder.paymentStatus === "refunded"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {currentOrder.paymentStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-muted">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-neutral-dark">
                      {currentOrder.paymentMethodLabel}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-muted">
                    <span>Subtotal:</span>
                    <span className="font-medium text-neutral-dark">
                      ৳{currentOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-muted">
                    <span>Delivery Charge:</span>
                    <span className="font-medium text-neutral-dark">
                      ৳{currentOrder.shippingFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-dark pt-1.5 border-t border-neutral-border/60">
                    <span>Total Order Value:</span>
                    <span className="text-primary text-sm font-heading font-bold">
                      ৳{currentOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Cash Collection Ledger */}
                  <div className="p-2.5 rounded-xl bg-neutral-bg border border-neutral-border mt-2 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-muted">Deposit Paid:</span>
                      <span className="font-bold text-success">
                        ৳{currentOrder.advancePaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-1 border-t border-neutral-border/60">
                      <span className="text-neutral-dark">
                        Collect on Delivery (COD):
                      </span>
                      <span className="text-error font-mono">
                        ৳{currentOrder.balanceOnDelivery.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carrier Tracking & Fulfillment Assignment */}
            <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs space-y-3">
              <h3 className="font-heading font-bold text-sm text-neutral-dark flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Carrier Fulfillment & Tracking
              </h3>

              <form
                onSubmit={handleSaveTracking}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3"
              >
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-muted mb-1">
                    Carrier Service
                  </label>
                  <select
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {CARRIERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-muted mb-1">
                    Tracking / Consignment ID
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. PTH-884920, SF-331092"
                    className="w-full px-3 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                  />
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="submit"
                    disabled={isUpdatingTracking}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdatingTracking ? "Saving..." : "Save Tracking"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Line Items Table */}
            <div className="rounded-2xl border border-neutral-border bg-surface shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 bg-neutral-bg/60 border-b border-neutral-border flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm text-neutral-dark">
                  Ordered Products ({currentOrder.totalItems} items)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-bg/40 border-b border-neutral-border text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                      <th className="py-2.5 px-4">Item</th>
                      <th className="py-2.5 px-4 text-center">SKU</th>
                      <th className="py-2.5 px-4 text-right">Unit Price</th>
                      <th className="py-2.5 px-4 text-center">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-border">
                    {currentOrder.products.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-bg/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-neutral-border bg-neutral-bg shrink-0">
                              <Image
                                src={item.imageUrl || "/images/prod-robocode.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-neutral-dark">
                                {item.title}
                              </p>
                              {item.variantTitle && (
                                <p className="text-[11px] text-neutral-muted">
                                  {item.variantTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-[11px] text-neutral-muted">
                          {item.sku || "—"}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          ৳{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-neutral-dark">
                          ৳{item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RMA & Customer Service Actions */}
            <div className="p-4 rounded-xl bg-neutral-bg/60 border border-neutral-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-neutral-dark">
                  Returns & RMA Management
                </h4>
                <p className="text-[11px] text-neutral-muted">
                  Issue customer returns or cancel order with inventory restock
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error-surface border border-error/30 transition-colors cursor-pointer"
              >
                Process RMA / Refund
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      <AdminPackingSlipModal
        order={currentOrder}
        isOpen={isPackingSlipOpen}
        onClose={() => setIsPackingSlipOpen(false)}
      />

      {/* RMA Refund Dialog */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-dark/70 backdrop-blur-xs font-sans">
          <div className="bg-surface rounded-2xl border border-neutral-border p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-error">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-heading font-bold text-lg text-neutral-dark">
                Process Return & Refund
              </h3>
            </div>
            <p className="text-xs text-neutral-muted">
              You are about to issue a refund for Order{" "}
              <span className="font-bold text-neutral-dark">
                {currentOrder.orderNumber}
              </span>{" "}
              (৳{currentOrder.totalAmount.toLocaleString()}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-dark mb-1">
                Reason for Refund / Return
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g. Item defective, customer requested return within 7 days, parcel damaged in courier."
                rows={3}
                className="w-full px-3 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs text-neutral-dark focus:outline-none focus:ring-2 focus:ring-error/20 focus:border-error"
              />
            </div>

            <label className="flex items-center gap-2.5 text-xs text-neutral-dark cursor-pointer">
              <input
                type="checkbox"
                checked={restockInventory}
                onChange={(e) => setRestockInventory(e.target.checked)}
                className="rounded text-primary focus:ring-primary h-4 w-4"
              />
              <span>Restock all item quantities to product inventory</span>
            </label>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-border">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-muted hover:text-neutral-dark transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingRefund}
                onClick={handleProcessRefund}
                className="px-4 py-2 bg-error hover:bg-error/90 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isProcessingRefund ? "Processing..." : "Confirm & Issue Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
