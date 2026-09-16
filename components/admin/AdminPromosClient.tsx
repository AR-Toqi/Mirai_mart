"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tag,
  Plus,
  Search,
  Check,
  Copy,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { PromotionRecord } from "@/lib/db/types";
import {
  toggleAdminPromotionStatusAction,
  deleteAdminPromotionAction,
} from "@/actions/promotions";
import { PromotionModal } from "./PromotionModal";
import Link from "next/link";

interface AdminPromosClientProps {
  initialPromotions: PromotionRecord[];
}

export function AdminPromosClient({
  initialPromotions,
}: AdminPromosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [promotions, setPromotions] = useState<PromotionRecord[]>(initialPromotions);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(() => {
    const param = searchParams.get("status");
    return param === "active" || param === "inactive" ? param : "all";
  });

  // Synchronize activeTab when URL searchParams change
  useEffect(() => {
    const param = searchParams.get("status");
    if (param === "active" || param === "inactive") {
      setActiveTab(param);
    } else {
      setActiveTab("all");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "all" | "active" | "inactive") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("status");
    } else {
      params.set("status", tab);
    }
    const query = params.toString();
    router.replace(`/admin/promos${query ? `?${query}` : ""}`, { scroll: false });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionRecord | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<PromotionRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyCode = async (code: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic update
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: nextStatus } : p))
    );

    const res = await toggleAdminPromotionStatusAction(id, nextStatus);
    if (!res.success) {
      // Revert on failure
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: currentStatus } : p))
      );
      showToast("error", res.error || "Failed to update promotion status.");
    } else {
      showToast(
        "success",
        `Promotion marked as ${nextStatus ? "Active" : "Inactive"}.`
      );
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deletingPromo) return;
    setIsDeleting(true);

    try {
      const res = await deleteAdminPromotionAction(deletingPromo.id);
      if (res.success) {
        setPromotions((prev) => prev.filter((p) => p.id !== deletingPromo.id));
        showToast("success", `Coupon "${deletingPromo.code}" deleted.`);
        setDeletingPromo(null);
      } else {
        showToast("error", res.error || "Failed to delete coupon.");
      }
    } catch {
      showToast("error", "An unexpected error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Modal save success
  const handleModalSuccess = (savedPromo: PromotionRecord) => {
    setPromotions((prev) => {
      const exists = prev.some((p) => p.id === savedPromo.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPromo.id ? savedPromo : p));
      }
      return [savedPromo, ...prev];
    });
    showToast(
      "success",
      `Promo code "${savedPromo.code}" saved successfully.`
    );
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalCount = promotions.length;
    const activeCount = promotions.filter((p) => p.is_active).length;
    const totalRedemptions = promotions.reduce(
      (acc, p) => acc + (p.used_count || 0),
      0
    );

    const now = new Date();
    const expiringSoonOrCapped = promotions.filter((p) => {
      if (!p.is_active) return false;
      if (p.max_uses && p.used_count >= p.max_uses * 0.9) return true;
      if (p.expires_at) {
        const expiry = new Date(p.expires_at);
        const daysLeft =
          (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysLeft >= 0 && daysLeft <= 14;
      }
      return false;
    }).length;

    return {
      totalCount,
      activeCount,
      totalRedemptions,
      expiringSoonOrCapped,
    };
  }, [promotions]);

  // Filtered List
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      // Tab filter
      if (activeTab === "active" && !p.is_active) return false;
      if (activeTab === "inactive" && p.is_active) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const codeMatch = p.code.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query) ?? false;
        if (!codeMatch && !descMatch) return false;
      }

      return true;
    });
  }, [promotions, activeTab, searchQuery]);

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-2 duration-200 ${
            toastMessage.type === "success"
              ? "bg-success-surface border-success/30 text-success"
              : "bg-error-surface border-error/30 text-error"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-error shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading font-bold text-2xl text-neutral-dark flex items-center gap-2">
            <span>Promo Codes & Coupons CMS</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Live Validation
            </span>
          </h1>
          <p className="text-xs text-neutral-muted mt-1">
            Create percentage or fixed-amount discounts, free shipping vouchers, minimum spend rules, and usage ceilings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs"
          >
            <span>Test on Cart</span>
            <ExternalLink className="w-3 h-3 text-neutral-muted" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setEditingPromo(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-tertiary text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Coupons */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block">
              Total Coupons
            </span>
            <div className="font-heading font-bold text-2xl text-neutral-dark mt-1">
              {kpis.totalCount}
            </div>
            <span className="text-[10px] text-neutral-muted">
              Configured in system
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center font-bold">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        {/* Active Codes */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block">
              Active Codes
            </span>
            <div className="font-heading font-bold text-2xl text-success mt-1">
              {kpis.activeCount}
            </div>
            <span className="text-[10px] text-success font-medium">
              Live on storefront
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success-surface text-success flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Total Redemptions */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block">
              Total Redemptions
            </span>
            <div className="font-heading font-bold text-2xl text-neutral-dark mt-1">
              {kpis.totalRedemptions.toLocaleString()}
            </div>
            <span className="text-[10px] text-neutral-muted">
              Successful orders placed
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-surface text-secondary-foreground flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Capped / Expiring Soon */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider block">
              Attention Required
            </span>
            <div className="font-heading font-bold text-2xl text-warning-foreground mt-1">
              {kpis.expiringSoonOrCapped}
            </div>
            <span className="text-[10px] text-warning-foreground font-medium">
              Near cap or expiring &lt;14d
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning-surface text-warning-foreground flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-bg border border-neutral-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-surface text-primary shadow-xs"
                : "text-neutral-muted hover:text-neutral-dark"
            }`}
          >
            All ({kpis.totalCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-surface text-success shadow-xs"
                : "text-neutral-muted hover:text-neutral-dark"
            }`}
          >
            Active ({kpis.activeCount})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("inactive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "inactive"
                ? "bg-surface text-neutral-dark shadow-xs"
                : "text-neutral-muted hover:text-neutral-dark"
            }`}
          >
            Inactive / Expired ({kpis.totalCount - kpis.activeCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-muted absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or description..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-neutral-border bg-surface text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none ring-2 ring-primary/20 border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-neutral-muted hover:text-neutral-dark"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Promotions Data Table */}
      <div className="bg-surface border border-neutral-border rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border bg-neutral-bg/50 text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Coupon Code</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Min. Subtotal</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border/60 text-xs">
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-muted">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <Tag className="w-8 h-8 text-neutral-border stroke-1" />
                      <p className="font-bold text-neutral-dark">No promo codes found</p>
                      <p className="text-[11px]">
                        {searchQuery
                          ? `No promotions match "${searchQuery}". Try a different keyword.`
                          : "Create your first promotional discount voucher to get started."}
                      </p>
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="mt-2 px-3 py-1.5 rounded-lg border border-neutral-border text-xs font-semibold hover:bg-neutral-bg text-primary"
                        >
                          Clear Search
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPromo(null);
                            setIsModalOpen(true);
                          }}
                          className="mt-2 px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-tertiary"
                        >
                          Create Promo Code
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((p) => {
                  const isExp = p.expires_at && new Date(p.expires_at) < new Date();
                  const isNearCap =
                    p.max_uses && p.used_count >= p.max_uses * 0.9;
                  const usagePct = p.max_uses
                    ? Math.min(100, Math.round((p.used_count / p.max_uses) * 100))
                    : null;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-bg/30 transition-colors group"
                    >
                      {/* Code & Description */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-neutral-dark px-2.5 py-0.5 rounded-md bg-neutral-bg border border-neutral-border tracking-wider">
                              {p.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(p.code)}
                              className="text-neutral-muted hover:text-primary transition-colors p-1 rounded-md hover:bg-neutral-border/50 cursor-pointer"
                              title="Copy code"
                            >
                              {copiedCode === p.code ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {p.description && (
                            <p className="text-[11px] text-neutral-muted line-clamp-1 max-w-xs">
                              {p.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Discount Type & Value */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-neutral-dark">
                            {p.discount_type === "percentage" &&
                              `${p.discount_value}% OFF`}
                            {p.discount_type === "fixed_amount" &&
                              `৳ ${Number(p.discount_value).toLocaleString()} OFF`}
                            {p.discount_type === "free_shipping" &&
                              "FREE DELIVERY"}
                          </span>
                          <span className="text-[10px] text-neutral-muted capitalize">
                            {p.discount_type.replace("_", " ")}
                          </span>
                        </div>
                      </td>

                      {/* Min Subtotal */}
                      <td className="py-3.5 px-4">
                        {p.min_order_value > 0 ? (
                          <span className="font-semibold text-neutral-dark">
                            ৳ {Number(p.min_order_value).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-neutral-muted text-[11px]">
                            None
                          </span>
                        )}
                      </td>

                      {/* Redemptions Progress */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-[140px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-neutral-dark">
                              {(p.used_count ?? 0).toLocaleString()}
                            </span>
                            <span className="text-neutral-muted">
                              {p.max_uses ? `/ ${p.max_uses}` : "uses"}
                            </span>
                          </div>
                          {usagePct !== null && (
                            <div className="w-full bg-neutral-border rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usagePct >= 100
                                    ? "bg-error"
                                    : usagePct >= 90
                                    ? "bg-warning-foreground"
                                    : "bg-primary"
                                }`}
                                style={{ width: `${usagePct}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Validity / Expiration */}
                      <td className="py-3.5 px-4">
                        {isExp ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-error-surface text-error border border-error/20 text-[10px] font-bold">
                            Expired
                          </span>
                        ) : p.expires_at ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-medium text-neutral-dark block">
                              Until {new Date(p.expires_at).toLocaleDateString()}
                            </span>
                            {p.starts_at && (
                              <span className="text-[10px] text-neutral-muted block">
                                From {new Date(p.starts_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-bg text-neutral-muted border border-neutral-border text-[10px] font-semibold">
                            No Expiry
                          </span>
                        )}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p.id, p.is_active)}
                          className={`w-10 h-5 inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                            p.is_active ? "bg-success" : "bg-neutral-border"
                          }`}
                          aria-label={`Toggle active for ${p.code}`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                              p.is_active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions (Edit & Delete) */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromo(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-neutral-border/60 hover:bg-neutral-bg text-neutral-muted hover:text-primary transition-colors cursor-pointer"
                            title="Edit promotion"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingPromo(p)}
                            className="p-1.5 rounded-lg border border-neutral-border/60 hover:bg-error-surface text-neutral-muted hover:text-error transition-colors cursor-pointer"
                            title="Delete promotion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        promotion={editingPromo}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deletingPromo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-dark/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-neutral-border rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-error-surface text-error flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-neutral-dark">
                Delete Coupon &quot;{deletingPromo.code}&quot;?
              </h3>
              <p className="text-xs text-neutral-muted mt-1">
                Are you sure you want to delete this coupon? Customers will no longer be able to redeem this code at checkout.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingPromo(null)}
                className="px-4 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-error hover:bg-error/90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
