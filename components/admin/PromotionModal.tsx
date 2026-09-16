"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Tag,
  Percent,
  Coins,
  Truck,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { PromotionRecord } from "@/lib/db/types";
import {
  createAdminPromotionAction,
  updateAdminPromotionAction,
  type CreatePromotionInput,
} from "@/actions/promotions";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: PromotionRecord | null;
  onSuccess: (promo: PromotionRecord) => void;
}

export function PromotionModal({
  isOpen,
  onClose,
  promotion,
  onSuccess,
}: PromotionModalProps) {
  const isEditing = Boolean(promotion?.id);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed_amount" | "free_shipping"
  >("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(500);
  const [isCapped, setIsCapped] = useState<boolean>(false);
  const [maxUses, setMaxUses] = useState<number | null>(null);
  const [startsAt, setStartsAt] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when editing or opening
  useEffect(() => {
    if (promotion) {
      setCode(promotion.code);
      setDescription(promotion.description || "");
      setDiscountType(promotion.discount_type);
      setDiscountValue(Number(promotion.discount_value) || 0);
      setMinOrderValue(Number(promotion.min_order_value) || 0);
      setIsCapped(Boolean(promotion.max_uses && promotion.max_uses > 0));
      setMaxUses(promotion.max_uses ?? null);
      setStartsAt(
        promotion.starts_at ? promotion.starts_at.slice(0, 10) : ""
      );
      setExpiresAt(
        promotion.expires_at ? promotion.expires_at.slice(0, 10) : ""
      );
      setIsActive(promotion.is_active);
    } else {
      setCode("");
      setDescription("");
      setDiscountType("percentage");
      setDiscountValue(10);
      setMinOrderValue(500);
      setIsCapped(false);
      setMaxUses(null);
      setStartsAt(new Date().toISOString().slice(0, 10));
      setExpiresAt("");
      setIsActive(true);
    }
    setErrorMsg(null);
  }, [promotion, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg("Please provide a promo code.");
      return;
    }

    if (!/^[A-Z0-9_-]+$/.test(cleanCode)) {
      setErrorMsg("Code can only contain uppercase letters, numbers, hyphens, and underscores.");
      return;
    }

    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      setErrorMsg("Percentage discount must be between 1% and 100%.");
      return;
    }

    if (discountType === "fixed_amount" && discountValue <= 0) {
      setErrorMsg("Fixed discount amount must be greater than ৳ 0.");
      return;
    }

    if (expiresAt && startsAt && new Date(expiresAt) < new Date(startsAt)) {
      setErrorMsg("Expiration date cannot be earlier than the start date.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreatePromotionInput = {
        code: cleanCode,
        description: description.trim() || null,
        discount_type: discountType,
        discount_value: discountType === "free_shipping" ? 0 : discountValue,
        min_order_value: minOrderValue >= 0 ? minOrderValue : 0,
        max_uses: isCapped && maxUses && maxUses > 0 ? maxUses : null,
        starts_at: startsAt ? new Date(`${startsAt}T00:00:00.000Z`).toISOString() : null,
        expires_at: expiresAt ? new Date(`${expiresAt}T23:59:59.999Z`).toISOString() : null,
        is_active: isActive,
      };

      if (isEditing && promotion) {
        const res = await updateAdminPromotionAction(promotion.id, payload);
        if (res.success && res.promotion) {
          onSuccess(res.promotion);
          onClose();
        } else {
          setErrorMsg(res.error || "Failed to update promotion.");
        }
      } else {
        const res = await createAdminPromotionAction(payload);
        if (res.success && res.promotion) {
          onSuccess(res.promotion);
          onClose();
        } else {
          setErrorMsg(res.error || "Failed to create promotion.");
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-dark/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface border border-neutral-border rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-border flex items-center justify-between bg-neutral-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                {isEditing ? "Edit Promo Code" : "Create New Promo Code"}
              </h2>
              <p className="text-xs text-neutral-muted">
                {isEditing
                  ? `Update restrictions and discount rules for ${promotion?.code}`
                  : "Configure coupon parameters, threshold rules, and usage ceilings."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-error-surface border border-error/30 text-error flex items-start gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Live Voucher Preview */}
          <div>
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block mb-2">
              Live Voucher Preview
            </span>
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-linear-to-br from-primary-surface/40 via-surface to-secondary-surface/30 p-4 sm:p-5 relative overflow-hidden shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-neutral-dark text-white text-[10px] font-bold tracking-widest uppercase">
                      VOUCHER
                    </span>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      Mirai Mart Storefront
                    </span>
                  </div>
                  <div className="font-heading font-bold text-2xl text-neutral-dark tracking-wide">
                    {code.trim().toUpperCase() || "CODEPREVIEW"}
                  </div>
                  <p className="text-xs text-neutral-muted line-clamp-1">
                    {description.trim() ||
                      (discountType === "percentage"
                        ? `Enjoy ${discountValue}% off your curated cart.`
                        : discountType === "fixed_amount"
                        ? `Save ৳ ${discountValue} on your purchase.`
                        : "Free delivery across Bangladesh.")}
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-neutral-border sm:pl-5 space-y-1">
                  <div className="font-heading font-bold text-2xl sm:text-3xl text-primary">
                    {discountType === "percentage" && `${discountValue}% OFF`}
                    {discountType === "fixed_amount" && `৳ ${discountValue} OFF`}
                    {discountType === "free_shipping" && "FREE DELIVERY"}
                  </div>
                  <div className="text-[11px] text-neutral-muted font-medium">
                    {minOrderValue > 0
                      ? `Min. order ৳ ${minOrderValue.toLocaleString()}`
                      : "No minimum spend"}
                  </div>
                  <div className="text-[10px] text-neutral-muted/80">
                    {expiresAt
                      ? `Valid until ${new Date(expiresAt).toLocaleDateString()}`
                      : "No expiration date"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: Code & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="coupon-code"
                className="block text-xs font-bold text-neutral-dark mb-1"
              >
                Coupon Code <span className="text-error">*</span>
              </label>
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs font-bold uppercase tracking-wider focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
                required
              />
              <p className="text-[10px] text-neutral-muted mt-1">
                Uppercase alphanumeric, dashes, or underscores.
              </p>
            </div>

            <div>
              <label
                htmlFor="coupon-description"
                className="block text-xs font-bold text-neutral-dark mb-1"
              >
                Description / Tagline
              </label>
              <input
                id="coupon-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 20% off all educational toys"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
              />
              <p className="text-[10px] text-neutral-muted mt-1">
                Customer-facing promo highlight shown on cart receipt.
              </p>
            </div>
          </div>

          {/* Discount Type Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-neutral-dark mb-2">
              Discount Model <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType("percentage")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  discountType === "percentage"
                    ? "border-primary bg-primary-surface/30 ring-2 ring-primary/10"
                    : "border-neutral-border hover:bg-neutral-bg/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Percent
                    className={`w-4 h-4 ${
                      discountType === "percentage"
                        ? "text-primary"
                        : "text-neutral-muted"
                    }`}
                  />
                  {discountType === "percentage" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-dark block">
                    Percentage
                  </span>
                  <span className="text-[10px] text-neutral-muted">
                    % off eligible items
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("fixed_amount")}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  discountType === "fixed_amount"
                    ? "border-primary bg-primary-surface/30 ring-2 ring-primary/10"
                    : "border-neutral-border hover:bg-neutral-bg/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Coins
                    className={`w-4 h-4 ${
                      discountType === "fixed_amount"
                        ? "text-primary"
                        : "text-neutral-muted"
                    }`}
                  />
                  {discountType === "fixed_amount" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-dark block">
                    Fixed Amount
                  </span>
                  <span className="text-[10px] text-neutral-muted">
                    Flat ৳ deduction
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDiscountType("free_shipping");
                  setDiscountValue(0);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  discountType === "free_shipping"
                    ? "border-primary bg-primary-surface/30 ring-2 ring-primary/10"
                    : "border-neutral-border hover:bg-neutral-bg/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck
                    className={`w-4 h-4 ${
                      discountType === "free_shipping"
                        ? "text-primary"
                        : "text-neutral-muted"
                    }`}
                  />
                  {discountType === "free_shipping" && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-xs text-neutral-dark block">
                    Free Shipping
                  </span>
                  <span className="text-[10px] text-neutral-muted">
                    Waive delivery fee
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Discount Value & Minimum Order Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="discount-value"
                className="block text-xs font-bold text-neutral-dark mb-1"
              >
                {discountType === "percentage"
                  ? "Discount Percentage (%)"
                  : discountType === "fixed_amount"
                  ? "Discount Amount (৳)"
                  : "Discount Value"}
              </label>
              <div className="relative">
                <input
                  id="discount-value"
                  type="number"
                  disabled={discountType === "free_shipping"}
                  value={discountType === "free_shipping" ? 0 : discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  min={1}
                  max={discountType === "percentage" ? 100 : undefined}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs font-bold focus:outline-none ring-2 ring-primary/20 border-primary transition-all disabled:opacity-50 disabled:bg-neutral-bg"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-neutral-muted">
                  {discountType === "percentage"
                    ? "%"
                    : discountType === "fixed_amount"
                    ? "৳"
                    : "Free"}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="min-order-value"
                className="block text-xs font-bold text-neutral-dark mb-1"
              >
                Minimum Order Subtotal (৳)
              </label>
              <div className="relative">
                <input
                  id="min-order-value"
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  min={0}
                  step={50}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-border bg-surface text-neutral-dark text-xs font-bold focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-neutral-muted">
                  ৳
                </span>
              </div>
              <p className="text-[10px] text-neutral-muted mt-1">
                Enter 0 to allow on any cart size.
              </p>
            </div>
          </div>

          {/* Usage Cap Ceiling */}
          <div className="p-4 rounded-xl bg-neutral-bg/60 border border-neutral-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-neutral-dark">
                  Redemption Usage Cap
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-neutral-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCapped}
                  onChange={(e) => {
                    setIsCapped(e.target.checked);
                    if (!e.target.checked) setMaxUses(null);
                    else if (!maxUses) setMaxUses(100);
                  }}
                  className="rounded border-neutral-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Set usage limit</span>
              </label>
            </div>

            {isCapped && (
              <div>
                <label
                  htmlFor="max-uses"
                  className="block text-[11px] font-bold text-neutral-muted mb-1"
                >
                  Maximum Total Redemptions
                </label>
                <input
                  id="max-uses"
                  type="number"
                  value={maxUses ?? 100}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  min={1}
                  className="w-full sm:w-48 px-3 py-1.5 rounded-lg border border-neutral-border bg-surface text-xs font-bold text-neutral-dark"
                />
                <p className="text-[10px] text-neutral-muted mt-1">
                  Once reached, this coupon will automatically stop accepting redemptions.
                </p>
              </div>
            )}
          </div>

          {/* Date Range Restrictions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="starts-at"
                className="block text-xs font-bold text-neutral-dark mb-1 flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Start Date</span>
              </label>
              <input
                id="starts-at"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-border bg-surface text-xs text-neutral-dark focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="expires-at"
                className="block text-xs font-bold text-neutral-dark mb-1 flex items-center gap-1"
              >
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Expiration Date</span>
              </label>
              <input
                id="expires-at"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-border bg-surface text-xs text-neutral-dark focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
              />
              <p className="text-[10px] text-neutral-muted mt-1">
                Leave empty for no expiry (perpetual).
              </p>
            </div>
          </div>

          {/* Active Status Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-border bg-surface">
            <div>
              <span className="text-xs font-bold text-neutral-dark block">
                Coupon Status
              </span>
              <span className="text-[11px] text-neutral-muted">
                {isActive
                  ? "Coupon is active and ready to be redeemed on storefront."
                  : "Coupon is disabled and cannot be redeemed."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isActive ? "bg-success" : "bg-neutral-border"
              }`}
              aria-label="Toggle active status"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-border flex items-center justify-end gap-3 bg-neutral-bg/40">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-tertiary text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isEditing ? "Save Changes" : "Create Coupon"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
