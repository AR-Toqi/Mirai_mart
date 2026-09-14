"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Package,
  Clock,
  Settings,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  Printer,
  Eye,
  Trash2,
  ChevronDown,
  ArrowUpRight,
  X,
} from "lucide-react";
import type {
  AdminOrderListItem,
  AdminOrderStatus,
  AdminOrdersResponse,
} from "@/actions/admin";
import {
  updateAdminOrderStatusAction,
  bulkUpdateAdminOrderStatusAction,
} from "@/actions/admin";
import { AdminOrderDetailModal } from "./AdminOrderDetailModal";
import { AdminPackingSlipModal } from "./AdminPackingSlipModal";

// Authentic bKash Brand Logo
function BkashLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="11.22 10.7 458.08 209.58"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="bKash"
    >
      <path d="M327.99 110.75l12.99 58.4 85.01-43.04z" fill="#D12053" />
      <path d="M352.16 23.48L328 110.76l98.01 15.35z" fill="#E2136E" />
      <path d="M248.31 10.7l101.38 12.11-23.97 86.76z" fill="#D12053" />
      <path d="M247.52 27.76h11.29l31.67 40.5z" fill="#9E1638" />
      <path d="M428.69 125.55l-29.46-40.77 47.66-8.53z" fill="#D12053" />
      <path d="M423.77 137.5l3.04-9.07-74.39 37.74z" fill="#E2136E" />
      <path d="M325.91 113.05l15.52 69.77-46.06 37.46z" fill="#9E1638" />
      <path d="M442.25 96.97l27.05-.46-19.55-19.89z" fill="#E2136E" />
      <path
        d="M255.13 94.18v7.53c-2.76-4.35-10.52-7.22-14.8-6.62s-11 4.14-14.65 12C221.68 98.82 214 94 208.27 94h-17.78v8.84h11.58c5.12 0 10.46-.52 15.24 3.83a11.76 11.76 0 0 1 3.46 6.7c1.47 6.86-1.54 15.09-9.51 15.29a24.63 24.63 0 0 1-7.49-.87l-.61.63a66.48 66.48 0 0 1 4.91 8.17 25.21 25.21 0 0 0 12.56-6.82 24.09 24.09 0 0 0 5.05-7.12 24.26 24.26 0 0 0 4.49 7.12 22.36 22.36 0 0 0 11.32 6.82 69.8 69.8 0 0 1 4.42-8.17l-.54-.63a20.07 20.07 0 0 1-6.74.87c-8.25-.23-9.76-8.69-8.48-15.29 1.11-5.62 6.11-11.15 11-11.56 5.49-.45 12.19 4.18 13.55 9.85a41.85 41.85 0 0 1 1 9.47v51.49a35 35 0 0 1 3.94-.38 33.7 33.7 0 0 1 4 .38V94.18z"
        fill="#231F20"
      />
      <path
        d="M42.34 64.29c13.91-1.39 35.27 16.56 37 20.48l1.32-.21V74.25c-9.77-5.17-23.41-15.79-41.5-14.49-20.07 1.44-27.92 13.24-27.94 34V172.67a26.39 26.39 0 0 1 3.77-.41 36.5 36.5 0 0 1 4.27.41v-69.79h53.36v5.73c-29.29.54-42 16.87-42 30.9 0 17.1 17.66 33.17 48.68 33.17h1.37V94H20l-.1-.18a20.61 20.61 0 0 1-.61-4.66C19.18 75.87 28 65.69 42.34 64.29z"
        fill="#E2136E"
      />
    </svg>
  );
}

// Authentic Nagad Brand Logo
function NagadLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="-.002 -.001 300.21 131.033"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nagad"
    >
      <g fill="#ED1C24">
        <path d="m193.564 50.855h-52.413c-1.038 0-1.557.779-1.557 1.557v4.152c0 1.038.779 1.556 1.557 1.556h39.18v21.796c-1.038-1.557-2.335-3.114-3.632-4.67-4.67-4.67-9.6-7.006-14.79-7.006-4.152 0-7.525 2.076-10.38 5.708-2.334 3.114-3.632 6.747-3.632 10.12s.52 7.784 3.114 11.935c3.114 4.93 8.303 6.487 12.974 6.487 5.967 0 10.897-4.151 10.897-9.6 0-3.114-1.556-5.709-4.41-7.525l-2.855-1.557v4.67c-.26 1.298-2.335 3.114-4.67 3.114-2.076 0-3.892-.778-5.19-2.075-.778-.779-1.297-2.336-1.038-3.374 0-1.556.52-2.854 1.557-4.151 1.298-1.557 2.595-2.335 4.67-2.335 5.19 0 9.601 2.335 13.234 7.524 2.854 4.411 4.41 8.563 4.41 13.233v10.898l7.785 4.67c.26.26.519.26.778.26 1.038 0 1.557-.778 1.557-1.557v-56.305h3.114c1.038 0 1.557-.778 1.557-1.557v-4.151c0-1.038-.779-1.817-1.817-1.817z" />
        <path d="m298.391 50.855h-66.425c-1.038 0-1.557.779-1.557 1.557v7.265c-6.486-6.746-12.195-10.12-17.384-10.12-4.93 0-9.082 1.039-12.714 3.893-3.374 2.595-5.45 5.968-5.45 9.86 0 11.676 12.974 11.417 16.347 9.86.52-.26 1.298-.779 2.076-.779 2.595 0 3.633 2.076 3.633 3.893 0 2.594-3.892 4.93-8.563 4.93-2.594 0-4.151-.779-5.19-2.336l-2.075-3.113-1.297 3.632c-.26.779-.779 1.816-.779 3.114 0 2.595 1.298 5.19 3.892 7.525 2.336 2.075 5.19 3.113 8.303 3.113 4.93 0 9.082-1.816 11.677-5.449 2.335-2.854 3.373-6.227 3.373-10.12 0-2.075-.779-4.41-2.595-7.005-2.076-3.114-4.67-4.67-7.525-4.67-1.037 0-2.335.26-3.632.778-.52.26-1.557.519-1.817.519-.518 0-1.297-.26-1.816-1.038-.519-.519-1.038-1.297-1.038-2.595 0-2.854 2.595-5.708 7.266-5.708h.259c3.114 0 6.227 1.557 9.082 4.411 2.335 2.335 4.151 4.67 5.708 7.265v41.256l7.784 4.67c.26.26.519.26.778.26 1.038 0 1.557-.778 1.557-1.557v-55.786h11.936v36.067l9.341 3.892h.519c.778 0 1.557-.52 1.557-1.557v-.26c1.557-10.638 6.227-17.903 14.011-22.314v2.076c0 1.556 0 5.448.26 7.524 0 1.298 0 2.076.26 2.854 0 4.152.518 10.38 1.816 15.05 2.594 8.822 7.005 10.898 10.119 10.898h.26c1.816 0 3.373-.52 4.41-1.557.52-.52 1.298-1.557 1.298-3.373 0-1.557-.26-2.855-.779-3.892l-.778-1.298-1.557.26c-1.557.519-2.335.519-2.335.26h-.26c-.519 0-.519 0-.778-.26-.519-.26-1.557-1.038-2.335-3.892-.52-2.076-.779-4.93-.779-6.487 0-11.676 2.336-20.498 6.228-22.315h.26c.518-.26 1.037-.778 1.037-1.557 0-.26 0-.519-.26-.778v-.26c-1.816-3.632-5.708-6.227-10.897-7.524h-1.038c-4.152.778-9.082 3.632-15.309 8.822-1.557 1.297-3.114 2.595-4.411 3.892v-14.271h36.326c1.038 0 1.557-.778 1.557-1.557v-4.151c.26-1.038-.52-1.817-1.557-1.817z" />
      </g>
      <path
        d="m68.499 21.016-11.417-21.017c-18.941 8.561-31.915 27.504-31.915 49.559 0 11.157 3.373 21.536 9.082 30.099-.52-2.855-.52-5.709-.52-8.822.261-22.575 14.531-41.775 34.771-49.819z"
        fill="#F7941D"
      />
    </svg>
  );
}

const VALID_ORDER_STATUSES: AdminOrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

interface AdminOrdersClientProps {
  initialData: AdminOrdersResponse;
}

export function AdminOrdersClient({ initialData }: AdminOrdersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial status from searchParams (?status=pending)
  const statusParam = searchParams.get("status") as AdminOrderStatus | null;
  const initialStatus =
    statusParam && VALID_ORDER_STATUSES.includes(statusParam)
      ? statusParam
      : "all";

  const [orders, setOrders] = useState<AdminOrderListItem[]>(initialData.orders);
  const [metrics] = useState(initialData.metrics);
  const [activeStatus, setActiveStatus] = useState<"all" | AdminOrderStatus>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Multi-selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Filter drawer/popover state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [deliveryZoneFilter, setDeliveryZoneFilter] = useState<string>("all");

  // Interaction modals
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<AdminOrderListItem | null>(null);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<AdminOrderListItem | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      refunded: orders.filter((o) => o.status === "refunded").length,
    };
  }, [orders]);

  // Synchronize activeStatus and reset pagination when URL changes (e.g. browser back/forward or external navigation)
  useEffect(() => {
    const currentStatusParam = searchParams.get("status") as AdminOrderStatus | null;
    if (currentStatusParam && VALID_ORDER_STATUSES.includes(currentStatusParam)) {
      setActiveStatus(currentStatusParam);
    } else {
      setActiveStatus("all");
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Handle status tab click with URL query sync via router.replace
  const handleStatusTabChange = (statusKey: "all" | AdminOrderStatus) => {
    setActiveStatus(statusKey);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (statusKey === "all") {
      params.delete("status");
    } else {
      params.set("status", statusKey);
    }
    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status Filter
      if (activeStatus !== "all" && order.status !== activeStatus) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customer.name.toLowerCase().includes(query);
        const matchesPhone = order.customer.phone.toLowerCase().includes(query);
        const matchesProduct = order.products.some((p) =>
          p.title.toLowerCase().includes(query)
        );
        if (!matchesNumber && !matchesName && !matchesPhone && !matchesProduct) {
          return false;
        }
      }

      // Payment Filter
      if (paymentFilter !== "all" && order.paymentMethod !== paymentFilter) {
        return false;
      }

      // Delivery Zone Filter
      if (
        deliveryZoneFilter !== "all" &&
        order.shippingAddress.deliveryZone !== deliveryZoneFilter
      ) {
        return false;
      }

      return true;
    });
  }, [orders, activeStatus, searchQuery, paymentFilter, deliveryZoneFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const displayedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);

  // Copy order number handler
  const handleCopyOrderNumber = (e: React.MouseEvent, orderNumber: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Checkbox multi-select handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(displayedOrders.map((o) => o.id));
      setSelectedOrderIds(allIds);
    } else {
      setSelectedOrderIds(new Set());
    }
  };

  const handleToggleSelectOrder = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Bulk status update
  const handleBulkStatusChange = async (status: AdminOrderStatus) => {
    const ids = Array.from(selectedOrderIds);
    if (ids.length === 0) return;

    await bulkUpdateAdminOrderStatusAction(ids, status);
    setOrders((prev) =>
      prev.map((o) => (ids.includes(o.id) ? { ...o, status } : o))
    );
    setSelectedOrderIds(new Set());
  };

  // CSV Export
  const handleExportCSV = () => {
    const dataToExport = selectedOrderIds.size > 0
      ? orders.filter((o) => selectedOrderIds.has(o.id))
      : filteredOrders;

    const headers = [
      "Order Number",
      "Customer Name",
      "Phone",
      "Email",
      "Delivery Address",
      "Total Amount (BDT)",
      "Payment Method",
      "Status",
      "Date",
      "Time",
      "Carrier",
      "Tracking Number",
    ];

    const rows = dataToExport.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.customer.name.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email}"`,
      `"${o.shippingAddress.addressLine1}, ${o.shippingAddress.city}"`,
      o.totalAmount,
      `"${o.paymentMethodLabel}"`,
      `"${o.status.toUpperCase()}"`,
      `"${o.date}"`,
      `"${o.time}"`,
      `"${o.carrier || ""}"`,
      `"${o.trackingNumber || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `MiraiMart_Orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Component
  const renderStatusPill = (st: AdminOrderStatus) => {
    switch (st) {
      case "pending":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF6E7] text-[#D97706] border border-[#FDE68A]/60">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]/60">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]/60">
            Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60">
            Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]/60">
            Cancelled
          </span>
        );
      case "refunded":
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]/60">
            Refunded
          </span>
        );
      default:
        return (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-neutral-bg text-neutral-dark">
            {st}
          </span>
        );
    }
  };

  // Payment Method Pill & Logo Helper
  const renderPaymentCell = (method: "cod" | "bkash" | "nagad" | "card") => {
    switch (method) {
      case "cod":
        return (
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-dark">
            <Banknote className="w-4 h-4 text-primary" />
            <span>Cash on Delivery</span>
          </div>
        );
      case "bkash":
        return (
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-dark">
            <BkashLogo className="h-4 w-4 shrink-0" />
            <span>Bkash</span>
          </div>
        );
      case "nagad":
        return (
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-dark">
            <NagadLogo className="h-4 w-4 shrink-0" />
            <span>Nagad</span>
          </div>
        );
      case "card":
        return (
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-dark">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>Card Payment</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* 1. Page Title & Subtitle */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-neutral-dark tracking-tight">
          Orders
        </h1>
        <p className="text-xs text-neutral-muted mt-1">
          Track and manage all customer orders from your store.
        </p>
      </div>

      {/* 2. 7 Summary Metric Cards Grid (mirroring order_screen.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.totalOrders.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.totalOrders.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.pending.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.pending.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 3: Processing */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Processing</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.processing.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.processing.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 4: Shipped */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Shipped</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.shipped.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.shipped.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 5: Delivered */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Delivered</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.delivered.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.delivered.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 6: Cancelled */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Cancelled</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.cancelled.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-rose-600 font-semibold flex items-center">
                ↑ {metrics.cancelled.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>

        {/* Card 7: Refunded */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-muted">Refunded</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="font-heading font-bold text-2xl text-neutral-dark">
              {metrics.refunded.count}
            </p>
            <p className="text-[11px] text-neutral-muted mt-1 flex items-center gap-1">
              <span className="text-success font-semibold flex items-center">
                ↑ {metrics.refunded.changePct}%
              </span>
              <span>vs last 7 days</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Orders Container: Filter Tabs, Toolbar, and Table */}
      <div className="bg-surface border border-neutral-border rounded-2xl shadow-xs overflow-hidden">
        {/* Toolbar Header Row (single row matching order_screen.png) */}
        <div className="p-4 sm:p-5 border-b border-neutral-border flex items-center justify-between gap-3 sm:gap-4">
          {/* Status Tabs (exact match to order_screen.png) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-w-0 flex-1 sm:flex-initial">
            {[
              { key: "all", label: `All (${counts.all})` },
              { key: "pending", label: `Pending (${counts.pending})` },
              { key: "processing", label: `Processing (${counts.processing})` },
              { key: "shipped", label: `Shipped (${counts.shipped})` },
              { key: "delivered", label: `Delivered (${counts.delivered})` },
              { key: "cancelled", label: `Cancelled (${counts.cancelled})` },
              { key: "refunded", label: `Refunded (${counts.refunded})` },
            ].map((tab) => {
              const isActive = activeStatus === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    handleStatusTabChange(tab.key as "all" | AdminOrderStatus)
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Expandable Search, Filter, Export */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Expandable Search Input */}
            <div
              className={`relative flex items-center transition-all duration-300 ease-in-out ${
                isSearchFocused || searchQuery.length > 0
                  ? "w-44 sm:w-56 md:w-60 shadow-xs"
                  : "w-9 sm:w-32 md:w-36"
              }`}
            >
              <Search
                onClick={() => {
                  searchInputRef.current?.focus();
                  setIsSearchFocused(true);
                }}
                className={`absolute left-3 w-3.5 h-3.5 text-neutral-muted cursor-pointer transition-colors ${
                  isSearchFocused ? "text-primary" : "hover:text-neutral-dark"
                }`}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  isSearchFocused || searchQuery.length > 0
                    ? "Search order, customer, product..."
                    : "Search..."
                }
                className={`w-full pl-8.5 pr-8 py-1.5 bg-neutral-bg border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-muted transition-all duration-300 focus:outline-none ${
                  isSearchFocused
                    ? "bg-surface ring-2 ring-primary/20 border-primary"
                    : "hover:bg-surface hover:border-neutral-border/80 cursor-pointer sm:cursor-text"
                } ${
                  !isSearchFocused && searchQuery.length === 0
                    ? "max-sm:placeholder-transparent max-sm:cursor-pointer"
                    : ""
                }`}
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                    setCurrentPage(1);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 p-0.5 rounded-md text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer shadow-2xs ${
                  paymentFilter !== "all" || deliveryZoneFilter !== "all"
                    ? "border-primary bg-primary-surface/30 text-primary"
                    : "border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-dark"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
                {(paymentFilter !== "all" || deliveryZoneFilter !== "all") && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>

              {/* Filter Popover */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 p-4 bg-surface border border-neutral-border rounded-2xl shadow-xl z-30 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-border pb-2">
                    <span className="font-bold text-neutral-dark">
                      Filter Orders
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentFilter("all");
                        setDeliveryZoneFilter("all");
                      }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-muted text-[11px] uppercase mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-border bg-neutral-bg text-xs text-neutral-dark focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Payment Methods</option>
                      <option value="cod">Cash on Delivery</option>
                      <option value="bkash">Bkash</option>
                      <option value="nagad">Nagad</option>
                      <option value="card">Card Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-muted text-[11px] uppercase mb-1">
                      Delivery Zone
                    </label>
                    <select
                      value={deliveryZoneFilter}
                      onChange={(e) => setDeliveryZoneFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-neutral-border bg-neutral-bg text-xs text-neutral-dark focus:outline-none focus:border-primary"
                    >
                      <option value="all">All Delivery Zones</option>
                      <option value="inside_dhaka">Inside Dhaka</option>
                      <option value="outside_dhaka">Outside Dhaka</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-1.5 bg-primary text-white rounded-xl text-xs font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Selection Floating Bar */}
        {selectedOrderIds.size > 0 && (
          <div className="bg-primary-surface/40 border-b border-primary/20 px-6 py-2.5 flex items-center justify-between text-xs">
            <span className="font-semibold text-primary">
              {selectedOrderIds.size} order{selectedOrderIds.size > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatusChange("processing")}
                className="px-3 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark font-medium hover:border-primary transition-colors cursor-pointer"
              >
                Mark Processing
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("shipped")}
                className="px-3 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark font-medium hover:border-primary transition-colors cursor-pointer"
              >
                Mark Shipped
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("delivered")}
                className="px-3 py-1 rounded-lg bg-surface border border-neutral-border text-neutral-dark font-medium hover:border-primary transition-colors cursor-pointer"
              >
                Mark Delivered
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Export Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderIds(new Set())}
                className="text-neutral-muted hover:text-neutral-dark text-xs ml-2 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 4. Orders Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-bg/60 border-b border-neutral-border text-[11px] font-bold text-neutral-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      displayedOrders.length > 0 &&
                      displayedOrders.every((o) => selectedOrderIds.has(o.id))
                    }
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                </th>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Products</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-muted">
                    <Package className="w-8 h-8 mx-auto text-neutral-muted/50 mb-2" />
                    <p className="font-semibold text-sm">No orders found</p>
                    <p className="text-xs text-neutral-muted mt-0.5">
                      Try clearing filters or checking other status tabs.
                    </p>
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => {
                  const isChecked = selectedOrderIds.has(order.id);
                  const isCopied = copiedId === order.orderNumber;
                  const isMenuOpen = activeActionMenuId === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderForDetail(order)}
                      className={`hover:bg-neutral-bg/40 transition-colors cursor-pointer ${
                        isChecked ? "bg-primary-surface/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => handleToggleSelectOrder(e, order.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                      </td>

                      {/* Order ID & Copy */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-primary font-mono text-xs">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOrderNumber(e, order.orderNumber)}
                            className="p-1 rounded-md text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors cursor-pointer"
                            title="Copy Order ID"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-primary/30 to-primary-light/40 border border-neutral-border shrink-0 flex items-center justify-center font-bold text-[11px] text-primary">
                            {order.customer.avatarUrl ? (
                              <Image
                                src={order.customer.avatarUrl}
                                alt={order.customer.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              order.customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-dark">
                              {order.customer.name}
                            </p>
                            <p className="text-[11px] text-neutral-muted">
                              {order.customer.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Products thumbnails + count badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center -space-x-1.5">
                            {order.products.slice(0, 3).map((prod, idx) => (
                              <div
                                key={prod.id || idx}
                                className="relative w-8 h-8 rounded-lg overflow-hidden border border-neutral-border bg-surface shrink-0 shadow-2xs"
                              >
                                <Image
                                  src={prod.imageUrl || "/images/prod-robocode.svg"}
                                  alt={prod.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          {order.products.length > 3 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-bg text-neutral-muted border border-neutral-border">
                              +{order.products.length - 3}
                            </span>
                          )}
                          <span className="text-xs text-neutral-muted ml-1 whitespace-nowrap">
                            {order.totalItems} item{order.totalItems > 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount in Taka */}
                      <td className="py-3.5 px-4 font-bold text-neutral-dark text-xs">
                        ৳{order.totalAmount.toLocaleString()}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        {renderPaymentCell(order.paymentMethod)}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4">
                        {renderStatusPill(order.status)}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-neutral-dark text-xs whitespace-nowrap">
                          {order.date}
                        </p>
                        <p className="text-[11px] text-neutral-muted">
                          {order.time}
                        </p>
                      </td>

                      {/* Actions Menu */}
                      <td
                        className="py-3.5 px-4 text-center relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setActiveActionMenuId(isMenuOpen ? null : order.id)
                          }
                          className="p-1.5 rounded-xl text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <div className="absolute right-4 mt-1 w-48 bg-surface border border-neutral-border rounded-xl shadow-xl z-20 py-1.5 text-xs text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForDetail(order);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-neutral-bg flex items-center gap-2 text-neutral-dark cursor-pointer font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              <span>View Order Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForSlip(order);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 hover:bg-neutral-bg flex items-center gap-2 text-neutral-dark cursor-pointer font-medium"
                            >
                              <Printer className="w-3.5 h-3.5 text-primary" />
                              <span>Print Packing Slip</span>
                            </button>
                            <div className="border-t border-neutral-border/60 my-1" />
                            <div className="px-3.5 py-1 text-[10px] font-bold uppercase text-neutral-muted">
                              Change Status
                            </div>
                            {(["processing", "shipped", "delivered"] as AdminOrderStatus[]).map(
                              (s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={async () => {
                                    await updateAdminOrderStatusAction(order.id, s);
                                    setOrders((prev) =>
                                      prev.map((o) =>
                                        o.id === order.id ? { ...o, status: s } : o
                                      )
                                    );
                                    setActiveActionMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 hover:bg-neutral-bg flex items-center gap-2 text-neutral-dark capitalize cursor-pointer"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span>Mark as {s}</span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-muted">
          <div>
            Showing{" "}
            <span className="font-semibold text-neutral-dark">
              {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ordersPerPage + 1}
            </span>
            –
            <span className="font-semibold text-neutral-dark">
              {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-dark">
              {filteredOrders.length}
            </span>{" "}
            orders
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-dark disabled:opacity-30 disabled:hover:bg-surface transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-neutral-border text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-1 text-neutral-muted">...</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface border border-neutral-border text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-dark disabled:opacity-30 disabled:hover:bg-surface transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AdminOrderDetailModal
        order={selectedOrderForDetail}
        isOpen={Boolean(selectedOrderForDetail)}
        onClose={() => setSelectedOrderForDetail(null)}
        onOrderUpdated={(updated) => {
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          );
        }}
      />

      {/* Standalone Packing Slip Modal */}
      {selectedOrderForSlip && (
        <AdminPackingSlipModal
          order={selectedOrderForSlip}
          isOpen={Boolean(selectedOrderForSlip)}
          onClose={() => setSelectedOrderForSlip(null)}
        />
      )}
    </div>
  );
}
