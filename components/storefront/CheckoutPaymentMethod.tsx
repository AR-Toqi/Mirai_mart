"use client";

import React, { useState } from "react";
import { Copy, Check, CheckCircle2 } from "lucide-react";
import {
  DEFAULT_BKASH_NUMBER,
  DEFAULT_NAGAD_NUMBER,
} from "@/lib/constants";

interface CheckoutPaymentMethodProps {
  paymentMode: "cod_advance" | "full_payment";
  onPaymentModeChange: (mode: "cod_advance" | "full_payment") => void;
  mfsProvider: "bkash" | "nagad";
  onMfsProviderChange: (provider: "bkash" | "nagad") => void;
  shippingFee: number;
  grandTotal: number;
  senderNumber: string;
  onSenderNumberChange: (value: string) => void;
  transactionId: string;
  onTransactionIdChange: (value: string) => void;
  errors?: Record<string, string>;
}

function BkashLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="11.22 10.7 458.08 209.58"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash"
    >
      {/* Official bKash Origami Bird */}
      <path d="M327.99 110.75l12.99 58.4 85.01-43.04z" fill="#D12053" />
      <path d="M352.16 23.48L328 110.76l98.01 15.35z" fill="#E2136E" />
      <path d="M248.31 10.7l101.38 12.11-23.97 86.76z" fill="#D12053" />
      <path d="M247.52 27.76h11.29l31.67 40.5z" fill="#9E1638" />
      <path d="M428.69 125.55l-29.46-40.77 47.66-8.53z" fill="#D12053" />
      <path d="M423.77 137.5l3.04-9.07-74.39 37.74z" fill="#E2136E" />
      <path d="M325.91 113.05l15.52 69.77-46.06 37.46z" fill="#9E1638" />
      <path d="M442.25 96.97l27.05-.46-19.55-19.89z" fill="#E2136E" />
      {/* Official bKash Wordmark */}
      <path
        d="M255.13 94.18v7.53c-2.76-4.35-10.52-7.22-14.8-6.62s-11 4.14-14.65 12C221.68 98.82 214 94 208.27 94h-17.78v8.84h11.58c5.12 0 10.46-.52 15.24 3.83a11.76 11.76 0 0 1 3.46 6.7c1.47 6.86-1.54 15.09-9.51 15.29a24.63 24.63 0 0 1-7.49-.87l-.61.63a66.48 66.48 0 0 1 4.91 8.17 25.21 25.21 0 0 0 12.56-6.82 24.09 24.09 0 0 0 5.05-7.12 24.26 24.26 0 0 0 4.49 7.12 22.36 22.36 0 0 0 11.32 6.82 69.8 69.8 0 0 1 4.42-8.17l-.54-.63a20.07 20.07 0 0 1-6.74.87c-8.25-.23-9.76-8.69-8.48-15.29 1.11-5.62 6.11-11.15 11-11.56 5.49-.45 12.19 4.18 13.55 9.85a41.85 41.85 0 0 1 1 9.47v51.49a35 35 0 0 1 3.94-.38 33.7 33.7 0 0 1 4 .38V94.18z"
        fill="#231F20"
      />
      <path
        d="M42.34 64.29c13.91-1.39 35.27 16.56 37 20.48l1.32-.21V74.25c-9.77-5.17-23.41-15.79-41.5-14.49-20.07 1.44-27.92 13.24-27.94 34V172.67a26.39 26.39 0 0 1 3.77-.41 36.5 36.5 0 0 1 4.27.41v-69.79h53.36v5.73c-29.29.54-42 16.87-42 30.9 0 17.1 17.66 33.17 48.68 33.17h1.37V94H20l-.1-.18a20.61 20.61 0 0 1-.61-4.66C19.18 75.87 28 65.69 42.34 64.29zM41.09 140c0-12.34 13.67-24.17 31.53-26.74v56.09C53 166 41.09 150.6 41.09 140z"
        fill="#E2136E"
      />
      <path
        d="M82.75 94v8.85h54.88v5.73c-29.29.54-42 16.87-42 30.9 0 17.1 17.67 33.17 48.67 33.17h1.36v-58.32h.85c9.85-.27 15.74 6 16.05 14.05a13.34 13.34 0 0 1-8.69 13.09l.06 1.19 7.48-.22c4.18-5.29 6.89-11.19 6.62-17.56-.46-11.11-7.88-16.4-22.37-16.2v-5.75h34.75v69.79a28.1 28.1 0 0 1 3.93-.41 34.62 34.62 0 0 1 4.1.41V94zm23.35 46c0-12.34 13.68-24.17 31.53-26.74v56.1C118 166 106.1 150.6 106.1 140z"
        fill="#231F20"
      />
    </svg>
  );
}

function NagadLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="-.002 -.001 300.21 131.033"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nagad"
    >
      <g fill="#ED1C24">
        <path d="m193.564 50.855h-52.413c-1.038 0-1.557.779-1.557 1.557v4.152c0 1.038.779 1.556 1.557 1.556h39.18v21.796c-1.038-1.557-2.335-3.114-3.632-4.67-4.67-4.67-9.6-7.006-14.79-7.006-4.152 0-7.525 2.076-10.38 5.708-2.334 3.114-3.632 6.747-3.632 10.12s.52 7.784 3.114 11.935c3.114 4.93 8.303 6.487 12.974 6.487 5.967 0 10.897-4.151 10.897-9.6 0-3.114-1.556-5.709-4.41-7.525l-2.855-1.557v4.67c-.26 1.298-2.335 3.114-4.67 3.114-2.076 0-3.892-.778-5.19-2.075-.778-.779-1.297-2.336-1.038-3.374 0-1.556.52-2.854 1.557-4.151 1.298-1.557 2.595-2.335 4.67-2.335 5.19 0 9.601 2.335 13.234 7.524 2.854 4.411 4.41 8.563 4.41 13.233v10.898l7.785 4.67c.26.26.519.26.778.26 1.038 0 1.557-.778 1.557-1.557v-56.305h3.114c1.038 0 1.557-.778 1.557-1.557v-4.151c0-1.038-.779-1.817-1.817-1.817z" />
        <path d="m298.391 50.855h-66.425c-1.038 0-1.557.779-1.557 1.557v7.265c-6.486-6.746-12.195-10.12-17.384-10.12-4.93 0-9.082 1.039-12.714 3.893-3.374 2.595-5.45 5.968-5.45 9.86 0 11.676 12.974 11.417 16.347 9.86.52-.26 1.298-.779 2.076-.779 2.595 0 3.633 2.076 3.633 3.893 0 2.594-3.892 4.93-8.563 4.93-2.594 0-4.151-.779-5.19-2.336l-2.075-3.113-1.297 3.632c-.26.779-.779 1.816-.779 3.114 0 2.595 1.298 5.19 3.892 7.525 2.336 2.075 5.19 3.113 8.303 3.113 4.93 0 9.082-1.816 11.677-5.449 2.335-2.854 3.373-6.227 3.373-10.12 0-2.075-.779-4.41-2.595-7.005-2.076-3.114-4.67-4.67-7.525-4.67-1.037 0-2.335.26-3.632.778-.52.26-1.557.519-1.817.519-.518 0-1.297-.26-1.816-1.038-.519-.519-1.038-1.297-1.038-2.595 0-2.854 2.595-5.708 7.266-5.708h.259c3.114 0 6.227 1.557 9.082 4.411 2.335 2.335 4.151 4.67 5.708 7.265v41.256l7.784 4.67c.26.26.519.26.778.26 1.038 0 1.557-.778 1.557-1.557v-55.786h11.936v36.067l9.341 3.892h.519c.778 0 1.557-.52 1.557-1.557v-.26c1.557-10.638 6.227-17.903 14.011-22.314v2.076c0 1.556 0 5.448.26 7.524 0 1.298 0 2.076.26 2.854 0 4.152.518 10.38 1.816 15.05 2.594 8.822 7.005 10.898 10.119 10.898h.26c1.816 0 3.373-.52 4.41-1.557.52-.52 1.298-1.557 1.298-3.373 0-1.557-.26-2.855-.779-3.892l-.778-1.298-1.557.26c-1.557.519-2.335.519-2.335.26h-.26c-.519 0-.519 0-.778-.26-.519-.26-1.557-1.038-2.335-3.892-.52-2.076-.779-4.93-.779-6.487 0-11.676 2.336-20.498 6.228-22.315h.26c.518-.26 1.037-.778 1.037-1.557 0-.26 0-.519-.26-.778v-.26c-1.816-3.632-5.708-6.227-10.897-7.524h-1.038c-4.152.778-9.082 3.632-15.309 8.822-1.557 1.297-3.114 2.595-4.411 3.892v-14.271h36.326c1.038 0 1.557-.778 1.557-1.557v-4.151c.26-1.038-.52-1.817-1.557-1.817zm-175.922 19.201c0 1.817 0 3.373-.26 4.93a58.206 58.206 0 0 1 -5.189 20.239c-1.038 2.595-2.335 4.93-3.892 7.265-10.898 17.125-30.099 28.542-51.894 28.542-9.341 0-18.163-2.076-25.948-5.708-20.756-9.6-35.288-30.877-35.288-55.268 0-24.13 14.012-44.888 33.991-54.748-1.557 2.075-3.114 4.151-4.411 6.486 0 .26-.26.26-.26.52-.778.778-1.556 1.297-2.335 2.075-1.038.779-1.816 1.816-2.854 2.595l-.519.519-.519.519c-.26.26-.519.778-1.038 1.038-.519.778-1.297 1.556-1.816 2.335a45.542 45.542 0 0 0 -6.227 10.898c-.26.26-.26.778-.52 1.038-.259.519-.259 1.037-.518 1.297 0 .26-.26.519-.26.778-.26.779-.519 1.298-.778 2.076-.26.52-.26 1.038-.519 1.297 0 .26-.26.52-.26.779 0 .519-.259 1.038-.259 1.557l-.778 4.67c0 .52 0 .779-.26 1.298v6.227c0 16.606 7.525 31.656 19.72 41.256 9.341 7.525 21.017 12.195 33.731 12.195 11.677 0 22.315-3.632 31.137-10.12 6.487-4.67 11.676-10.638 15.568-17.643.52-1.038 1.038-1.817 1.557-2.855 3.114-6.486 4.93-13.492 4.93-21.017v-1.816c0-1.816 0-3.373-.26-5.19l.26.26c.779.778 1.557 1.297 2.335 2.076.779-1.298 1.557-2.336 2.336-3.633.519 2.335.778 4.67 1.038 7.265.259 2.336.259 4.152.259 5.968z" />
      </g>
      <path
        d="m68.499 21.016-11.417-21.017c-18.941 8.561-31.915 27.504-31.915 49.559 0 11.157 3.373 21.536 9.082 30.099-.52-2.855-.52-5.709-.52-8.822.261-22.575 14.531-41.775 34.771-49.819z"
        fill="#F7941D"
      />
      <path
        d="m77.58 31.395c4.67-1.297 9.86-1.816 14.79-1.816 3.114 0 6.487.259 9.341.778l-.26-9.341-.518-18.682c-2.076-.26-4.411-.519-6.746-.519-10.38 0-19.98 3.373-27.764 8.822l6.227 11.417c-11.157 3.892-20.238 11.676-25.947 21.796-2.854 4.93-4.93 10.638-5.708 16.606 1.557-3.114 3.373-5.968 5.449-8.563 7.524-9.86 18.422-17.384 31.136-20.498z"
        fill="#ED1C24"
      />
      <g fill="#F7941D">
        <path d="m104.825 20.757.519 13.233c-4.411-1.298-8.822-2.076-13.752-2.076-9.082 0-17.644 2.595-25.169 7.006-9.34 5.708-16.606 14.79-20.239 25.428 3.633-4.93 8.044-9.341 13.233-12.714 7.525-4.93 16.607-7.784 26.207-7.784 7.265 0 14.011 1.556 20.239 4.41a41.05 41.05 0 0 1 12.454 8.563l7.266-10.898 9.34-14.27c-8.302-6.747-18.681-10.898-30.098-10.898z" />
        <path d="m116.501 63.829v1.816c0 10.898-4.41 19.98-4.93 21.017s-1.038 1.817-1.557 2.855c-3.892 7.005-9.081 12.973-15.568 17.644-8.822 6.227-19.46 10.12-31.137 10.12-12.714 0-24.65-4.412-33.731-12.196-11.936-9.86-19.72-24.65-19.72-41.256v-6.227c0-.52 0-.779.26-1.298l.778-4.67c0-.52.26-1.038.26-1.557 0-.26.259-.52.259-.779.26-.519.26-1.037.519-1.297.26-.778.519-1.557.778-2.076 0-.26.26-.519.26-.778.26-.52.26-1.038.519-1.297s.26-.779.519-1.038c1.557-3.892 3.892-7.525 6.227-10.898.519-.779 1.297-1.557 1.816-2.335.26-.26.52-.779 1.038-1.038.26-.26.26-.52.52-.52.259-.259.259-.518.518-.518.779-1.038 1.816-1.817 2.854-2.595.779-.778 1.557-1.297 2.336-2.076 0 .26-.26.26-.26.52s-.26.518-.26.518c-3.113 6.228-5.189 13.752-5.967 21.536-.26 2.076-.26 4.152-.26 6.487 0 28.023 16.347 50.597 36.586 50.597h2.076c2.854 0 5.708-.519 8.562-1.038 13.752-3.632 23.872-16.346 23.872-31.136v-.779c-.26-8.822-3.892-16.865-9.86-22.314 4.151 0 8.303.778 12.195 1.816 7.525 1.816 14.27 5.449 20.239 10.12l.26.259c-.26 1.038 0 2.854 0 4.41z" />
        <path d="m116.501 63.829v1.816c0 11.417-5.19 21.277-5.19 21.277-.518 1.038-1.037 1.816-1.556 2.854-3.892 7.006-9.341 12.974-15.828 17.644-9.081 6.746-19.98 10.12-31.396 10.12-12.455 0-24.39-4.411-33.99-12.196-12.457-10.119-19.721-25.428-19.721-41.514s7.264-31.396 19.72-41.516l.518-.519c0 .26-.26.26-.26.52s-.259.259-.259.518c-12.195 10.12-19.2 24.91-19.2 40.997s7.005 30.877 19.46 41.256c9.34 7.784 21.536 11.936 33.731 11.936 11.157 0 22.055-3.374 31.137-10.12 6.486-4.67 11.676-10.638 15.568-17.644.519-1.038 1.038-1.816 1.297-2.854 0 0 5.19-9.6 5.19-21.017v-1.817c0-1.816 0-3.373-.26-5.189v-.26l.26.26.26.26c.518 2.075.518 3.632.518 5.189z" />
      </g>
    </svg>
  );
}

export function CheckoutPaymentMethod({
  paymentMode,
  onPaymentModeChange,
  mfsProvider,
  onMfsProviderChange,
  shippingFee,
  grandTotal,
  senderNumber,
  onSenderNumberChange,
  transactionId,
  onTransactionIdChange,
  errors = {},
}: CheckoutPaymentMethodProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const bkashNumber =
    process.env.NEXT_PUBLIC_BKASH_NUMBER || DEFAULT_BKASH_NUMBER;
  const nagadNumber =
    process.env.NEXT_PUBLIC_NAGAD_NUMBER || DEFAULT_NAGAD_NUMBER;

  const currentNumber = mfsProvider === "bkash" ? bkashNumber : nagadNumber;
  const amountToPay = paymentMode === "cod_advance" ? shippingFee : grandTotal;
  const balanceOnDelivery = Math.max(0, grandTotal - amountToPay);

  function handleCopy(text: string, fieldId: string) {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      {/* 1. Payment Mode Radio Selector */}
      <div className="space-y-3">
        <label className="block font-heading text-base font-bold text-neutral-dark">
          পেমেন্ট মাধ্যম নির্বাচন করুন (Payment Method)
        </label>

        <div className="space-y-2.5">
          {/* Option A: COD Advance Delivery Fee */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              paymentMode === "cod_advance"
                ? "border-primary bg-primary-surface/20 shadow-2xs"
                : "border-neutral-border bg-surface hover:bg-neutral-bg/60"
            }`}
          >
            <input
              type="radio"
              name="paymentMode"
              value="cod_advance"
              checked={paymentMode === "cod_advance"}
              onChange={() => onPaymentModeChange("cod_advance")}
              className="h-4 w-4 accent-primary text-primary focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-sans font-bold text-sm text-neutral-dark">
                Cash On Delivery (Advance Delivery Charge Only)
              </span>
              <p className="text-xs text-neutral-muted mt-0.5">
                {shippingFee === 0
                  ? "ফ্রি ডেলিভারি! অগ্রিম ৳ 0, সম্পূর্ণ টাকা ডেলিভারিতে ক্যাশ দিন।"
                  : `শুধুমাত্র ডেলিভারি চার্জ (৳ ${shippingFee}) অগ্রিম পরিশোধ করুন, বাকি টাকা ডেলিভারিতে ক্যাশ দিন।`}
              </p>
            </div>
          </label>

          {/* Option B: Full Payment */}
          <label
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
              paymentMode === "full_payment"
                ? "border-primary bg-primary-surface/20 shadow-2xs"
                : "border-neutral-border bg-surface hover:bg-neutral-bg/60"
            }`}
          >
            <input
              type="radio"
              name="paymentMode"
              value="full_payment"
              checked={paymentMode === "full_payment"}
              onChange={() => onPaymentModeChange("full_payment")}
              className="h-4 w-4 accent-primary text-primary focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-sans font-bold text-sm text-neutral-dark">
                Full Payment (বিকাশ / নগদ সম্পূর্ণ পেমেন্ট)
              </span>
              <p className="text-xs text-neutral-muted mt-0.5">
                সম্পূর্ণ অর্ডার বিল (৳ {grandTotal.toLocaleString()}) অগ্রিম পরিশোধ করুন।
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Interactive MFS Instructions Card */}
      <div className="rounded-2xl border border-neutral-border overflow-hidden bg-surface shadow-xs transition-all">
        {/* Brand Primary Header Banner */}
        <div className="bg-primary px-5 py-4 text-white text-center sm:text-left">
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight">
            কিভাবে অর্ডার কনফার্ম করবেন?
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-white/90 leading-relaxed">
            {paymentMode === "cod_advance" ? (
              <>
                শুধুমাত্র ডেলিভারি চার্জ{" "}
                <span className="inline-block bg-tertiary border border-white/20 font-bold px-2 py-0.5 rounded text-white text-xs mx-1 shadow-2xs">
                  {amountToPay} TK
                </span>{" "}
                সেন্ড মানি করুন। সম্পন্ন হলে প্রেরক নাম্বার ও ট্রানজেকশন আইডি নিচের বক্সে লিখুন।
              </>
            ) : (
              <>
                সম্পূর্ণ বিল{" "}
                <span className="inline-block bg-tertiary border border-white/20 font-bold px-2 py-0.5 rounded text-white text-xs mx-1 shadow-2xs">
                  {amountToPay.toLocaleString()} TK
                </span>{" "}
                সেন্ড মানি করুন। সম্পন্ন হলে প্রেরক নাম্বার ও ট্রানজেকশন আইডি নিচের বক্সে লিখুন।
              </>
            )}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* bKash / Nagad Switcher Tabs with Accurate Branded Logos */}
          <div className="grid grid-cols-2 gap-3">
            {/* bKash Tab */}
            <button
              type="button"
              onClick={() => onMfsProviderChange("bkash")}
              className={`relative flex items-center justify-center p-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer h-14 ${
                mfsProvider === "bkash"
                  ? "border-[#E2136E] bg-[#FDF2F7] ring-2 ring-[#E2136E]/20 shadow-xs"
                  : "border-neutral-border bg-surface hover:bg-neutral-bg/60"
              }`}
            >
              <BkashLogo className="h-6 sm:h-7 w-auto max-w-[110px]" />

              {mfsProvider === "bkash" && (
                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E2136E] text-white shadow-2xs">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Nagad Tab */}
            <button
              type="button"
              onClick={() => onMfsProviderChange("nagad")}
              className={`relative flex items-center justify-center p-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer h-14 ${
                mfsProvider === "nagad"
                  ? "border-[#F7941D] bg-[#FFF8EE] ring-2 ring-[#F7941D]/20 shadow-xs"
                  : "border-neutral-border bg-surface hover:bg-neutral-bg/60"
              }`}
            >
              <NagadLogo className="h-6 sm:h-7 w-auto max-w-[110px]" />

              {mfsProvider === "nagad" && (
                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F7941D] text-white shadow-2xs">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          </div>

          {/* Account Details & Amount Box */}
          <div className="rounded-xl border border-neutral-border/80 divide-y divide-neutral-border/60 bg-surface overflow-hidden">
            {/* Number Row with 1-click Copy */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-surface hover:bg-neutral-bg/30 transition-colors">
              <div>
                <span className="block text-[11px] font-bold tracking-wider text-neutral-muted uppercase">
                  {mfsProvider === "bkash" ? "BKASH (PERSONAL)" : "NAGAD (PERSONAL)"}
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-neutral-dark tracking-wide">
                  {currentNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(currentNumber, "number")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-border bg-neutral-bg hover:bg-surface text-xs font-semibold text-neutral-dark transition-all cursor-pointer active:scale-95"
                title="Copy Number"
              >
                {copiedField === "number" ? (
                  <>
                    <CheckCircle2 size={13} className="text-success" />
                    <span className="text-success text-[11px] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-neutral-muted" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Amount Row with 1-click Copy */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-primary-surface/10 hover:bg-primary-surface/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-heading font-bold text-sm shadow-2xs">
                  ৳
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-neutral-muted">
                    {paymentMode === "cod_advance"
                      ? "এখন পরিশোধ করুন (অগ্রিম ডেলিভারি ফি)"
                      : "এখন পরিশোধ করুন (সম্পূর্ণ বিল)"}
                  </span>
                  <span className="font-heading text-lg sm:text-xl font-bold text-primary">
                    {amountToPay.toLocaleString()} TK
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(amountToPay.toString(), "amount")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-all cursor-pointer active:scale-95"
                title="Copy Amount"
              >
                {copiedField === "amount" ? (
                  <>
                    <CheckCircle2 size={13} className="text-success" />
                    <span className="text-success text-[11px] font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} className="text-neutral-muted" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Green Notice / Remainder Banner using Design System Semantic Tokens */}
          <div className="rounded-xl bg-success-surface border border-success/30 p-3.5 text-center sm:text-left transition-all">
            <p className="font-sans font-bold text-xs sm:text-sm text-success-foreground">
              {paymentMode === "cod_advance" ? (
                <>
                  বাকি{" "}
                  <span className="underline font-black text-neutral-dark">
                    {balanceOnDelivery.toLocaleString()} TK
                  </span>{" "}
                  ডেলিভারির সময় পরিশোধ করবেন।
                </>
              ) : (
                <>
                  ✨ সম্পূর্ণ বিল পরিশোধিত। পার্সেল ডেলিভারির সময় কোনো টাকা পরিশোধ করতে হবে না।
                </>
              )}
            </p>
          </div>

          {/* Form Inputs: Sender Phone & TrxID */}
          <div className="space-y-4 pt-1">
            {/* Sender Number Input */}
            <div>
              <label
                htmlFor="senderNumberInput"
                className="block font-sans text-xs font-bold text-neutral-dark mb-1.5"
              >
                প্রেরক নাম্বার * (Sender Mobile Number)
              </label>
              <input
                id="senderNumberInput"
                type="tel"
                value={senderNumber}
                onChange={(e) => onSenderNumberChange(e.target.value)}
                placeholder={`আপনার ${mfsProvider === "bkash" ? "বিকাশ" : "নগদ"} নাম্বার লিখুন (01XXXXXXXXX)`}
                className={`w-full rounded-md border bg-neutral-bg px-3.5 py-2.5 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:bg-surface focus:outline-none focus:ring-2 ${
                  errors.senderNumber
                    ? "border-error focus:ring-error/20"
                    : "border-neutral-border focus:border-primary focus:ring-primary/20"
                }`}
              />
              {errors.senderNumber && (
                <p className="mt-1 text-[11px] font-medium text-error">
                  {errors.senderNumber}
                </p>
              )}
            </div>

            {/* Transaction ID Input */}
            <div>
              <label
                htmlFor="transactionIdInput"
                className="block font-sans text-xs font-bold text-neutral-dark mb-1.5"
              >
                ট্রানজেকশন আইডি * (Transaction ID / TrxID)
              </label>
              <input
                id="transactionIdInput"
                type="text"
                value={transactionId}
                onChange={(e) => onTransactionIdChange(e.target.value.toUpperCase())}
                placeholder="ট্রানজেকশন আইডি লিখুন (e.g. BL9A84K2X)"
                className={`w-full rounded-md border bg-neutral-bg px-3.5 py-2.5 font-mono text-xs sm:text-sm uppercase text-neutral-dark placeholder:font-sans placeholder:normal-case placeholder:text-neutral-muted focus:bg-surface focus:outline-none focus:ring-2 ${
                  errors.transactionId
                    ? "border-error focus:ring-error/20"
                    : "border-neutral-border focus:border-primary focus:ring-primary/20"
                }`}
              />
              {errors.transactionId && (
                <p className="mt-1 text-[11px] font-medium text-error">
                  {errors.transactionId}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

