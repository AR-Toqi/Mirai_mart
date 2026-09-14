"use client";

import React from "react";
import Image from "next/image";
import { Printer, X, CheckCircle2 } from "lucide-react";
import type { AdminOrderListItem } from "@/actions/admin";

interface AdminPackingSlipModalProps {
  order: AdminOrderListItem;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPackingSlipModal({
  order,
  isOpen,
  onClose,
}: AdminPackingSlipModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-dark/60 backdrop-blur-xs font-sans overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-surface rounded-2xl border border-neutral-border shadow-2xl w-full max-w-3xl overflow-hidden my-auto flex flex-col">
        {/* Actions Bar (hidden on print) */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between bg-neutral-bg/60 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-base text-neutral-dark">
              Print Official Invoice & Packing Slip
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-opacity cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-muted hover:text-neutral-dark hover:bg-surface border border-neutral-border transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body (A4 Styled) */}
        <div className="p-8 sm:p-10 bg-white text-neutral-dark text-xs space-y-6 print:p-0 print:space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between border-b border-neutral-border pb-6">
            <div>
              <Image
                src="/mirai-mart_logo.png"
                alt="Mirai Mart"
                width={150}
                height={45}
                className="h-10 w-auto object-contain"
              />
              <p className="text-[11px] text-neutral-muted mt-2">
                Mirai Mart E-Commerce Ltd.
                <br />
                Road 11, Sector 4, Uttara, Dhaka-1230
                <br />
                support@miraimart.com | +880 1700 000000
              </p>
            </div>
            <div className="text-right">
              <h2 className="font-heading font-extrabold text-2xl text-neutral-dark tracking-tight uppercase">
                Invoice
              </h2>
              <p className="font-mono font-bold text-sm text-primary mt-1">
                {order.orderNumber}
              </p>
              <p className="text-[11px] text-neutral-muted mt-1">
                Date: {order.date} • {order.time}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-bg border border-neutral-border uppercase">
                Payment: {order.paymentMethodLabel}
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-neutral-bg/60 border border-neutral-border">
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-muted mb-1.5">
                Ship & Deliver To
              </h3>
              <p className="font-bold text-sm text-neutral-dark">
                {order.customer.name}
              </p>
              <p className="text-neutral-muted mt-0.5">
                {order.customer.phone}
              </p>
              <p className="text-neutral-dark mt-1 font-medium">
                {order.shippingAddress.addressLine1}
              </p>
              <p className="text-neutral-muted">
                {order.shippingAddress.city}
                {order.shippingAddress.postalCode
                  ? ` - ${order.shippingAddress.postalCode}`
                  : ""}
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-surface text-primary uppercase">
                {order.shippingAddress.deliveryZone === "outside_dhaka"
                  ? "Outside Dhaka Zone"
                  : "Inside Dhaka Zone"}
              </span>
            </div>

            <div className="text-right flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-neutral-muted mb-1.5">
                  Fulfillment & Logistics
                </h3>
                <p className="font-medium text-neutral-dark">
                  Carrier:{" "}
                  <span className="font-bold text-primary">
                    {order.carrier || "Standard Dispatch"}
                  </span>
                </p>
                <p className="font-mono text-xs text-neutral-dark mt-0.5">
                  Tracking #:{" "}
                  <span className="font-bold">
                    {order.trackingNumber || "Pending Assignment"}
                  </span>
                </p>
                <p className="text-[11px] text-neutral-muted mt-1">
                  Status:{" "}
                  <span className="font-bold capitalize text-neutral-dark">
                    {order.status}
                  </span>
                </p>
              </div>

              {/* Barcode Mock */}
              <div className="mt-4 pt-2 border-t border-neutral-border/60 flex flex-col items-end">
                <div className="h-7 w-36 bg-[repeating-linear-gradient(90deg,#191c1e,#191c1e_2px,transparent_2px,transparent_4px)] rounded-xs" />
                <span className="font-mono text-[9px] text-neutral-muted tracking-widest mt-1">
                  *{order.orderNumber}*
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl border border-neutral-border overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-bg border-b border-neutral-border text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">Item & Specification</th>
                  <th className="py-2.5 px-4 text-center">SKU</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border text-xs">
                {order.products.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-neutral-bg/30">
                    <td className="py-3 px-4 text-center text-neutral-muted font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-neutral-dark">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-[11px] text-neutral-muted">
                          Edition: {item.variantTitle}
                        </p>
                      )}
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

          {/* Financial Calculation & COD Due Breakdown */}
          <div className="flex justify-between items-start pt-2">
            <div className="max-w-xs space-y-2">
              <div className="flex items-center gap-1.5 text-success font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Mirai Mart Authenticity</span>
              </div>
              <p className="text-[11px] text-neutral-muted leading-relaxed">
                Thank you for choosing Mirai Mart! Please inspect parcel condition
                upon delivery. For returns or exchanges, contact us within 7 days
                with this invoice.
              </p>
              {order.notes && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800">
                  <span className="font-bold">Order Note:</span> {order.notes}
                </div>
              )}
            </div>

            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-muted">
                <span>Subtotal:</span>
                <span className="font-medium text-neutral-dark">
                  ৳{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-neutral-muted">
                <span>Delivery Charge:</span>
                <span className="font-medium text-neutral-dark">
                  ৳{order.shippingFee.toLocaleString()}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-error font-medium">
                  <span>Discount:</span>
                  <span>-৳{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-neutral-dark pt-2 border-t border-neutral-border">
                <span>Grand Total:</span>
                <span className="text-primary font-heading font-extrabold text-base">
                  ৳{order.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Advance vs Due Breakdown */}
              <div className="p-3 rounded-xl bg-neutral-bg border border-neutral-border space-y-1 mt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-neutral-muted">Advance Paid:</span>
                  <span className="font-bold text-success">
                    ৳{order.advancePaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-neutral-border/60">
                  <span className="font-bold text-neutral-dark">
                    Cash Due on Delivery:
                  </span>
                  <span className="font-bold font-mono text-sm text-error">
                    ৳{order.balanceOnDelivery.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Strip */}
          <div className="pt-8 flex justify-between items-end text-[11px] text-neutral-muted border-t border-dashed border-neutral-border">
            <div>
              <p>Customer Signature</p>
              <div className="w-36 border-b border-neutral-dark/40 mt-6" />
            </div>
            <div className="text-right">
              <p>Authorized Mirai Mart Dispatcher</p>
              <div className="w-44 border-b border-neutral-dark/40 mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
