"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  User,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import type { AdminCustomer, CustomerOrderLedgerItem } from "@/types/customers";
import { cleanPhoneNumberForWhatsApp } from "@/lib/utils";
import { getAdminCustomerDetailAction } from "@/actions/customers";

type Props = {
  customer: AdminCustomer | null;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Returns initials from a customer name (e.g. "Hasan Mahmud" -> "HM")
 */
function getInitials(name: string): string {
  if (!name) return "MM";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function CustomerDetailModal({ customer, isOpen, onClose }: Props) {
  const [orders, setOrders] = useState<CustomerOrderLedgerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch full chronological order ledger whenever modal is opened
  useEffect(() => {
    if (!isOpen || !customer) {
      setOrders([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getAdminCustomerDetailAction(customer.id || customer.email)
      .then((res) => {
        if (isMounted && res.success && res.customer) {
          setOrders(res.customer.orders);
        }
      })
      .catch((err) => {
        console.error("[CustomerDetailModal] Error loading orders:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, customer]);

  // Handle ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const rawPhone = cleanPhoneNumberForWhatsApp(customer.phone);
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello ${customer.name}, this is Mirai Mart customer support regarding your account.`
  )}`;

  const handleCopy = (text: string, fieldName: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      });
    }
  };

  const renderOrderStatusBadge = (st: string) => {
    switch (st.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-warning-surface text-warning-foreground border-warning/30">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case "processing":
      case "packed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-primary-surface text-primary border-primary/20">
            <Package className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-secondary-surface text-secondary-foreground border-secondary/40">
            <Truck className="w-3 h-3" />
            <span>Shipped</span>
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-success-surface text-success border-success/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-error-surface text-error border-error/30">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-error-light text-error-foreground border-error/20">
            <RotateCcw className="w-3 h-3" />
            <span>Refunded</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-neutral-bg text-neutral-muted border-neutral-border">
            <span>{st}</span>
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-dark/60 backdrop-blur-xs font-sans overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl border border-neutral-border shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-neutral-border flex items-start justify-between bg-neutral-bg/60 shrink-0">
          <div className="flex items-center gap-4">
            {/* Avatar Circle */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary-surface border border-primary/20 shrink-0 flex items-center justify-center shadow-xs">
              {customer.avatarUrl ? (
                <Image
                  src={customer.avatarUrl}
                  alt={customer.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <span className="font-heading font-bold text-lg text-primary">
                  {getInitials(customer.name)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-dark">
                  {customer.name}
                </h2>

                {/* Account Type Badge */}
                {customer.accountType === "registered" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-surface text-primary border border-primary/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Registered Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-bg text-neutral-muted border border-neutral-border">
                    <User className="w-3 h-3" />
                    Guest Buyer
                  </span>
                )}

                {/* Role Badge (if staff) */}
                {customer.role === "admin" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-surface text-secondary-foreground border border-secondary/40">
                    <ShieldCheck className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
                {customer.role === "store-manager" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tertiary-surface text-tertiary border border-tertiary/30">
                    <ShieldCheck className="w-3 h-3" />
                    MANAGER
                  </span>
                )}
              </div>

              {/* Email & Phone with quick copy */}
              <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs text-neutral-muted flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopy(customer.email, "email")}
                  className="flex items-center gap-1 hover:text-neutral-dark transition-colors cursor-pointer group"
                  title="Click to copy email"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-muted group-hover:text-primary transition-colors" />
                  <span>{customer.email}</span>
                  {copiedField === "email" ? (
                    <Check className="w-3 h-3 text-success ml-0.5" />
                  ) : (
                    <Copy className="w-3 h-3 text-neutral-muted/50 group-hover:text-neutral-dark ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                {customer.phone && customer.phone !== "N/A" && (
                  <button
                    type="button"
                    onClick={() => handleCopy(customer.phone, "phone")}
                    className="flex items-center gap-1 hover:text-neutral-dark transition-colors cursor-pointer group"
                    title="Click to copy phone number"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-muted group-hover:text-primary transition-colors" />
                    <span>{customer.phone}</span>
                    {copiedField === "phone" ? (
                      <Check className="w-3 h-3 text-success ml-0.5" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-muted/50 group-hover:text-neutral-dark ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-neutral-border/50 text-neutral-muted hover:text-neutral-dark flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick CRM Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {rawPhone ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            ) : null}

            <a
              href={`mailto:${customer.email}?subject=Mirai%20Mart%20Support`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-surface text-primary hover:bg-primary/10 border border-primary/20 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send Direct Email</span>
            </a>

            {rawPhone ? (
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-neutral-dark hover:bg-secondary-light text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Customer</span>
              </a>
            ) : null}
          </div>

          {/* Key Metrics Cards Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-xl border border-neutral-border bg-neutral-bg/60">
              <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider block">
                Lifetime Spend (LTV)
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-primary mt-1">
                ৳{customer.lifetimeSpend.toLocaleString()}
              </p>
              <span className="text-[10px] text-neutral-muted mt-0.5 block">
                Total net purchased
              </span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-border bg-neutral-bg/60">
              <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider block">
                Total Orders
              </span>
              <p className="font-heading font-bold text-xl sm:text-2xl text-neutral-dark mt-1">
                {customer.totalOrders}
              </p>
              <span className="text-[10px] text-neutral-muted mt-0.5 block">
                {customer.totalOrders >= 2 ? "Repeat Customer" : customer.totalOrders === 1 ? "1 completed order" : "0 orders placed"}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-border bg-neutral-bg/60">
              <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider block">
                Last Active
              </span>
              <p className="font-sans font-bold text-sm sm:text-base text-neutral-dark mt-1 truncate">
                {customer.lastOrderDate || "No orders yet"}
              </p>
              <span className="text-[10px] text-neutral-muted mt-0.5 block">
                Latest order date
              </span>
            </div>

            <div className="p-4 rounded-xl border border-neutral-border bg-neutral-bg/60">
              <span className="text-[11px] font-semibold text-neutral-muted uppercase tracking-wider block">
                Customer Since
              </span>
              <p className="font-sans font-bold text-sm sm:text-base text-neutral-dark mt-1 truncate">
                {customer.registeredAt}
              </p>
              <span className="text-[10px] text-neutral-muted mt-0.5 block">
                Registration date
              </span>
            </div>
          </div>

          {/* Delivery & Shipping Addresses */}
          <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-base text-neutral-dark flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Delivery & Shipping Addresses
            </h3>

            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {customer.addresses.map((addr, idx) => (
                  <div
                    key={addr.id || `addr-${idx}`}
                    className="p-3.5 rounded-xl border border-neutral-border/80 bg-neutral-bg/40 text-xs space-y-1 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-dark">
                        {addr.fullName || customer.name}
                      </span>
                      {addr.deliveryZone && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-surface text-primary">
                          {addr.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-muted">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                    </p>
                    <p className="text-neutral-muted">
                      {addr.city}
                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                    </p>
                    {addr.phone && (
                      <p className="text-neutral-dark font-medium pt-1">
                        Phone: {addr.phone}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-neutral-border bg-neutral-bg/30 text-center text-xs text-neutral-muted">
                No delivery addresses recorded yet.
              </div>
            )}
          </div>

          {/* Chronological Order History Ledger */}
          <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-base text-neutral-dark">
                  Order History Ledger
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-surface text-primary">
                  {orders.length}
                </span>
              </div>

              <Link
                href={`/admin/orders?search=${encodeURIComponent(customer.email)}`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View in Orders Queue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-neutral-muted">
                Loading order history...
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-border text-neutral-muted uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3 font-semibold">Order Number</th>
                      <th className="py-2.5 px-3 font-semibold">Date</th>
                      <th className="py-2.5 px-3 font-semibold">Items</th>
                      <th className="py-2.5 px-3 font-semibold">Total Amount</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-border/60">
                    {orders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-neutral-bg/60 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <Link
                            href={`/admin/orders?search=${encodeURIComponent(ord.orderNumber)}`}
                            className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>{ord.orderNumber}</span>
                            <ExternalLink className="w-3 h-3 text-neutral-muted opacity-70" />
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-neutral-muted">
                          {ord.date}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-neutral-dark">
                            {ord.itemsCount} {ord.itemsCount === 1 ? "item" : "items"}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans font-bold text-neutral-dark">
                          ৳{ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          {renderOrderStatusBadge(ord.status)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-neutral-dark font-medium">
                            {ord.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-neutral-muted">
                No orders recorded for this customer yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-neutral-border bg-neutral-bg/60 flex items-center justify-between text-xs text-neutral-muted shrink-0">
          <span>Customer ID: {customer.id}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-dark font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
