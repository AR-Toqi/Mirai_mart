"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Users,
  ShoppingBag,
  Repeat,
  Coins,
  Search,
  Download,
  Eye,
  MessageCircle,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import type { AdminCustomer, CustomerKpiMetrics } from "@/types/customers";
import { cleanPhoneNumberForWhatsApp } from "@/lib/utils";
import { CustomerDetailModal } from "./CustomerDetailModal";

type Props = {
  initialCustomers: AdminCustomer[];
  initialMetrics: CustomerKpiMetrics;
};

type FilterTab = "all" | "registered" | "guest" | "repeat" | "active";
type SortOption = "recent" | "ltv_desc" | "orders_desc" | "name_asc";

/**
 * Returns initials from a customer name (e.g. "Hasan Mahmud" -> "HM")
 */
function getInitials(name: string): string {
  if (!name) return "MM";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminCustomersClient({
  initialCustomers,
  initialMetrics,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial state from URL query parameters
  const tabParam = searchParams.get("tab") as FilterTab | null;
  const initialTab: FilterTab =
    tabParam && ["all", "registered", "guest", "repeat", "active"].includes(tabParam)
      ? tabParam
      : "all";

  const initialSearch = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") as SortOption | null;
  const initialSort: SortOption =
    sortParam && ["recent", "ltv_desc", "orders_desc", "name_asc"].includes(sortParam)
      ? sortParam
      : "recent";

  const [customers, setCustomers] = useState<AdminCustomer[]>(initialCustomers);
  const [metrics, setMetrics] = useState<CustomerKpiMetrics>(initialMetrics);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const pageSize = 12;

  // Sync prop updates
  useEffect(() => {
    setCustomers(initialCustomers);
    setMetrics(initialMetrics);
  }, [initialCustomers, initialMetrics]);

  // Filter and search logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      // 1. Tab filtering
      if (activeTab === "registered" && cust.accountType !== "registered") {
        return false;
      }
      if (activeTab === "guest" && cust.accountType !== "guest") {
        return false;
      }
      if (activeTab === "repeat" && cust.totalOrders < 2) {
        return false;
      }
      if (activeTab === "active" && cust.totalOrders < 1) {
        return false;
      }

      // 2. Keyword search across name, email, and phone
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = cust.name.toLowerCase().includes(q);
        const emailMatch = cust.email.toLowerCase().includes(q);
        const phoneMatch = cust.phone.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !phoneMatch) {
          return false;
        }
      }

      return true;
    });
  }, [customers, activeTab, searchQuery]);

  // Sorting logic
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      switch (sortBy) {
        case "ltv_desc":
          return b.lifetimeSpend - a.lifetimeSpend;
        case "orders_desc":
          return b.totalOrders - a.totalOrders;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "recent":
        default: {
          const dateA = a.rawLastOrderDate || a.rawRegisteredAt;
          const dateB = b.rawLastOrderDate || b.rawRegisteredAt;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }
      }
    });
  }, [filteredCustomers, sortBy]);

  // Reset pagination when filter or search changes locally
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, sortBy]);

  // Synchronize state when URL query params change (e.g. browser back/forward)
  useEffect(() => {
    const tab = searchParams.get("tab") as FilterTab | null;
    if (tab && ["all", "registered", "guest", "repeat", "active"].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("all");
    }

    const search = searchParams.get("search");
    if (search !== null) {
      setSearchQuery(search);
    }

    const sort = searchParams.get("sort") as SortOption | null;
    if (sort && ["recent", "ltv_desc", "orders_desc", "name_asc"].includes(sort)) {
      setSortBy(sort);
    }

    setCurrentPage(1);
  }, [searchParams]);

  // Handle Tab Change with URL query sync
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  // Handle Sort Change with URL query sync
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "recent") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / pageSize));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, currentPage, pageSize]);

  // Selected customer for modal inspection
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customers.find((c) => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      "Customer Name",
      "Email Address",
      "Phone Number",
      "Account Type",
      "Role",
      "Total Orders",
      "Lifetime Spend (BDT)",
      "Last Active",
      "Registered Date",
    ];

    const rows = sortedCustomers.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.accountType,
      c.role,
      c.totalOrders,
      c.lifetimeSpend,
      `"${c.lastOrderDate || "Never"}"`,
      `"${c.registeredAt}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `mirai-mart-customers-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-2">
            {metrics.totalCustomers.toLocaleString()}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-muted">
            <span className="font-semibold text-primary">{metrics.registeredCount} registered</span>
            <span>•</span>
            <span>{metrics.guestCount} guest buyers</span>
          </div>
        </div>

        {/* Active Buyers */}
        <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Active Buyers
            </span>
            <div className="w-9 h-9 rounded-xl bg-success-surface text-success flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-2">
            {metrics.activeBuyers.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-muted mt-1">
            {metrics.totalCustomers > 0
              ? `${Math.round((metrics.activeBuyers / metrics.totalCustomers) * 100)}% conversion rate`
              : "Placed ≥ 1 order"}
          </p>
        </div>

        {/* Repeat Shoppers */}
        <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Repeat Shoppers
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-surface text-secondary-foreground flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-2">
            {metrics.repeatShoppers.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-muted mt-1">
            {metrics.activeBuyers > 0
              ? `${Math.round((metrics.repeatShoppers / metrics.activeBuyers) * 100)}% repeat purchase rate`
              : "Placed ≥ 2 orders"}
          </p>
        </div>

        {/* Average Customer Spend */}
        <div className="p-5 rounded-2xl border border-neutral-border bg-surface shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">
              Avg. Customer Spend
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-surface text-tertiary flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark mt-2">
            ৳{metrics.averageSpend.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-muted mt-1">
            Net spend per purchasing customer
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-neutral-border bg-surface shadow-xs overflow-hidden">
        {/* Toolbar: Search, Filter Tabs, Sort, and CSV Export */}
        <div className="p-4 sm:p-5 border-b border-neutral-border space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name, email, or phone..."
                className="w-full pl-10 pr-9 py-2 bg-neutral-bg border border-neutral-border rounded-xl text-xs text-neutral-dark placeholder:text-neutral-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-dark cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Export Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-border bg-neutral-bg text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-muted shrink-0" />
                <span className="text-neutral-muted hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="bg-transparent font-medium text-neutral-dark focus:outline-none cursor-pointer text-xs"
                >
                  <option value="recent">Most Recent Activity</option>
                  <option value="ltv_desc">Highest Spend (LTV)</option>
                  <option value="orders_desc">Most Orders</option>
                  <option value="name_asc">Name (A-Z)</option>
                </select>
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-neutral-bg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/40"
              }`}
            >
              All Customers ({metrics.totalCustomers})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("registered")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "registered"
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-neutral-bg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/40"
              }`}
            >
              Registered ({metrics.registeredCount})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("guest")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "guest"
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-neutral-bg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/40"
              }`}
            >
              Guest Buyers ({metrics.guestCount})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("repeat")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "repeat"
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-neutral-bg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/40"
              }`}
            >
              Repeat Buyers ({metrics.repeatShoppers})
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("active")}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                activeTab === "active"
                  ? "bg-primary text-white font-semibold shadow-xs"
                  : "bg-neutral-bg text-neutral-muted hover:text-neutral-dark hover:bg-neutral-border/40"
              }`}
            >
              Active Buyers ({metrics.activeBuyers})
            </button>
          </div>
        </div>

        {/* Customer Data Table */}
        {paginatedCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-border bg-neutral-bg/40 text-neutral-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 sm:px-6 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Account Type</th>
                  <th className="py-3 px-4 font-semibold">Orders</th>
                  <th className="py-3 px-4 font-semibold">Lifetime Spend (LTV)</th>
                  <th className="py-3 px-4 font-semibold">Last Active</th>
                  <th className="py-3 px-4 font-semibold">Customer Since</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/60">
                {paginatedCustomers.map((cust) => {
                  const rawPhone = cleanPhoneNumberForWhatsApp(cust.phone);
                  const waUrl = rawPhone
                    ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                        `Hello ${cust.name}, this is Mirai Mart support.`
                      )}`
                    : null;

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-neutral-bg/50 transition-colors group"
                    >
                      {/* Customer Info (Avatar, Name, Email) */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-surface border border-primary/20 shrink-0 flex items-center justify-center">
                            {cust.avatarUrl ? (
                              <Image
                                src={cust.avatarUrl}
                                alt={cust.name}
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            ) : (
                              <span className="font-heading font-bold text-xs text-primary">
                                {getInitials(cust.name)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedCustomerId(cust.id)}
                              className="font-bold text-neutral-dark hover:text-primary transition-colors text-left truncate block cursor-pointer"
                            >
                              {cust.name}
                            </button>
                            <p className="text-[11px] text-neutral-muted truncate max-w-[180px] sm:max-w-[220px]">
                              {cust.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-3.5 px-4">
                        <span className="text-neutral-dark font-medium whitespace-nowrap">
                          {cust.phone}
                        </span>
                      </td>

                      {/* Account Type & Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {cust.accountType === "registered" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-surface text-primary border border-primary/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-bg text-neutral-muted border border-neutral-border">
                              <User className="w-2.5 h-2.5" />
                              Guest
                            </span>
                          )}

                          {cust.role === "admin" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-surface text-secondary-foreground border border-secondary/40">
                              ADMIN
                            </span>
                          )}
                          {cust.role === "store-manager" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-surface text-tertiary border border-tertiary/30">
                              MANAGER
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Orders Count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-neutral-dark px-2.5 py-0.5 rounded-full bg-neutral-bg border border-neutral-border/80">
                          {cust.totalOrders} {cust.totalOrders === 1 ? "order" : "orders"}
                        </span>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-sans font-bold text-neutral-dark text-sm">
                          ৳{cust.lifetimeSpend.toLocaleString()}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-muted">
                        {cust.lastOrderDate || "Never"}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-muted">
                        {cust.registeredAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`WhatsApp ${cust.name}`}
                              className="w-8 h-8 rounded-lg border border-neutral-border hover:border-[#25D366]/40 hover:bg-[#25D366]/10 text-neutral-muted hover:text-[#25D366] flex items-center justify-center transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedCustomerId(cust.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-border bg-surface hover:bg-primary-surface hover:text-primary text-neutral-dark font-medium transition-colors cursor-pointer shadow-2xs"
                            title="View Customer Profile & Orders"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline text-[11px]">View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-bg flex items-center justify-center mx-auto text-neutral-muted">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-dark">
              No matching customers found
            </h3>
            <p className="text-xs text-neutral-muted max-w-sm mx-auto">
              We couldn't find any customers matching &ldquo;{searchQuery}&rdquo;. Try clearing your search query or selecting a different status tab.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-tertiary transition-colors cursor-pointer shadow-xs"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        )}

        {/* Table Pagination Footer */}
        {sortedCustomers.length > 0 && (
          <div className="p-4 border-t border-neutral-border bg-neutral-bg/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-muted">
            <p>
              Showing{" "}
              <span className="font-semibold text-neutral-dark">
                {Math.min(sortedCustomers.length, (currentPage - 1) * pageSize + 1)}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-neutral-dark">
                {Math.min(sortedCustomers.length, currentPage * pageSize)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-neutral-dark">
                {sortedCustomers.length}
              </span>{" "}
              customers
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-neutral-border bg-surface hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-primary text-white shadow-xs"
                          : "border border-neutral-border bg-surface hover:bg-neutral-bg text-neutral-dark"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-neutral-border bg-surface hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Detail Inspection Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomerId(null)}
      />
    </div>
  );
}
