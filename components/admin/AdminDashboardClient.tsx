"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  Package,
  BadgePercent,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import type { AdminDashboardMetrics } from "@/actions/admin";

interface AdminDashboardClientProps {
  initialMetrics: AdminDashboardMetrics;
}

export function AdminDashboardClient({
  initialMetrics,
}: AdminDashboardClientProps) {
  const [metrics] = useState<AdminDashboardMetrics>(initialMetrics);

  // Timeframe toggle state for Sales Overview
  const [timeframe, setTimeframe] = useState("This Week");
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(3); // Default May 15 active

  // Pagination for Recent Orders
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 5;
  const totalOrderPages = Math.ceil(metrics.recentOrders.length / ordersPerPage);
  const displayedOrders = metrics.recentOrders.slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage
  );

  // Pagination for New Customers
  const [customersPage, setCustomersPage] = useState(1);
  const customersPerPage = 5;
  const totalCustomerPages = Math.ceil(metrics.newCustomers.length / customersPerPage);
  const displayedCustomers = metrics.newCustomers.slice(
    (customersPage - 1) * customersPerPage,
    customersPage * customersPerPage
  );

  // Currency Formatter
  const formatTaka = (amount: number) => `৳${amount.toLocaleString()}`;

  // SVG Coordinates for 7-day Sales Overview curve (viewBox 0 0 500 200)
  // Data points normalized to 0-100K range
  const getY = (val: number) => 180 - (val / 100000) * 150;
  const pointsThisWeek = metrics.salesOverview.thisWeek.map((val, i) => ({
    x: 35 + i * 72,
    y: getY(val),
    val,
    date: metrics.salesOverview.dates[i],
  }));

  const pointsLastWeek = metrics.salesOverview.lastWeek.map((val, i) => ({
    x: 35 + i * 72,
    y: getY(val),
  }));

  // Create smooth bezier path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cpX1 = prev.x + (pt.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (pt.x - prev.x) / 2;
      const cpY2 = pt.y;
      return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${pt.x},${pt.y}`;
    }, "");
  };

  const pathThisWeek = makeSmoothPath(pointsThisWeek);
  const pathLastWeek = makeSmoothPath(pointsLastWeek);

  return (
    <div className="space-y-6 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* Row 1: 5 KPI Stat Cards                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-muted">Total Sales</p>
              <h3 className="font-sans font-bold text-2xl text-neutral-dark mt-1">
                {formatTaka(metrics.kpis.totalSales)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-success font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {metrics.kpis.salesGrowthPct}%</span>
            <span className="text-neutral-muted font-normal">vs last 7 days</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-muted">Orders</p>
              <h3 className="font-sans font-bold text-2xl text-neutral-dark mt-1">
                {metrics.kpis.ordersCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-success font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {metrics.kpis.ordersGrowthPct}%</span>
            <span className="text-neutral-muted font-normal">vs last 7 days</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-muted">Customers</p>
              <h3 className="font-sans font-bold text-2xl text-neutral-dark mt-1">
                {metrics.kpis.customersCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-success font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {metrics.kpis.customersGrowthPct}%</span>
            <span className="text-neutral-muted font-normal">vs last 7 days</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-muted">Products</p>
              <h3 className="font-sans font-bold text-2xl text-neutral-dark mt-1">
                {metrics.kpis.productsCount.toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-success font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {metrics.kpis.productsGrowthPct}%</span>
            <span className="text-neutral-muted font-normal">vs last 7 days</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-muted">Total Revenue</p>
              <h3 className="font-sans font-bold text-2xl text-neutral-dark mt-1">
                {formatTaka(metrics.kpis.totalRevenue)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <BadgePercent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-success font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ {metrics.kpis.revenueGrowthPct}%</span>
            <span className="text-neutral-muted font-normal">vs last 7 days</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Row 2: Sales Overview Chart, Top Selling Products, Channels   */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview (Chart) - 5 cols */}
        <div className="lg:col-span-5 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-neutral-dark">
                  Sales Overview
                </h3>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-neutral-dark font-medium">
                    <span className="w-3 h-0.5 bg-primary rounded-full inline-block" />
                    <span>This Week</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-muted font-medium">
                    <span className="w-3 h-0.5 border-b border-dashed border-primary-light inline-block" />
                    <span>Last Week</span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setTimeframe((prev) =>
                        prev === "This Week" ? "Last 30 Days" : "This Week"
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-border text-xs text-neutral-dark font-medium hover:bg-neutral-bg cursor-pointer"
                  >
                    <span>{timeframe}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-muted" />
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="relative mt-6 pt-4">
              <svg
                viewBox="0 0 500 210"
                className="w-full h-56 overflow-visible select-none"
              >
                {/* Horizontal Guide Lines */}
                {[0, 20000, 40000, 60000, 80000, 100000].map((level) => {
                  const y = getY(level);
                  return (
                    <g key={level}>
                      <line
                        x1="30"
                        y1={y}
                        x2="490"
                        y2={y}
                        stroke="#E7E8EB"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y={y + 4}
                        fill="#6E797F"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {level === 0 ? "৳0" : `৳${level / 1000}K`}
                      </text>
                    </g>
                  );
                })}

                {/* Last Week Dashed Curve */}
                <path
                  d={pathLastWeek}
                  fill="none"
                  stroke="#71D7F6"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />

                {/* This Week Solid Curve */}
                <path
                  d={pathThisWeek}
                  fill="none"
                  stroke="#0A98C3"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points on This Week */}
                {pointsThisWeek.map((pt, idx) => {
                  const isSelected = activeTooltipIndex === idx;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onClick={() => setActiveTooltipIndex(idx)}
                      onMouseEnter={() => setActiveTooltipIndex(idx)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? "#0A98C3" : "#FFFFFF"}
                        stroke="#0A98C3"
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all"
                      />
                      {isSelected && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={12}
                          fill="#0A98C3"
                          fillOpacity="0.2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Active Hover Tooltip */}
                {activeTooltipIndex !== null && pointsThisWeek[activeTooltipIndex] && (
                  <g>
                    <rect
                      x={pointsThisWeek[activeTooltipIndex].x - 42}
                      y={pointsThisWeek[activeTooltipIndex].y - 48}
                      width="84"
                      height="38"
                      rx="8"
                      fill="#191C1E"
                    />
                    <text
                      x={pointsThisWeek[activeTooltipIndex].x}
                      y={pointsThisWeek[activeTooltipIndex].y - 32}
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {formatTaka(pointsThisWeek[activeTooltipIndex].val)}
                    </text>
                    <text
                      x={pointsThisWeek[activeTooltipIndex].x}
                      y={pointsThisWeek[activeTooltipIndex].y - 18}
                      fill="#A1A1AA"
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {pointsThisWeek[activeTooltipIndex].date}, 2024
                    </text>
                  </g>
                )}

                {/* X-Axis Date Labels */}
                {pointsThisWeek.map((pt, idx) => (
                  <text
                    key={idx}
                    x={pt.x}
                    y="202"
                    fill="#6E797F"
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {pt.date}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Top Selling Products - 4 cols */}
        <div className="lg:col-span-4 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-border/50">
              <h3 className="font-heading font-bold text-lg text-neutral-dark">
                Top Selling Products
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-neutral-border/40 mt-1">
              {metrics.topSellingProducts.map((p) => {
                const rankBadges: Record<number, string> = {
                  1: "bg-amber-100 text-amber-800",
                  2: "bg-blue-100 text-blue-700",
                  3: "bg-slate-100 text-slate-700",
                  4: "bg-teal-100 text-teal-700",
                  5: "bg-orange-100 text-orange-700",
                };

                return (
                  <div
                    key={p.rank}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          rankBadges[p.rank] || "bg-neutral-100 text-neutral-dark"
                        }`}
                      >
                        {p.rank}
                      </span>
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-bg shrink-0 border border-neutral-border/60">
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-dark truncate">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-neutral-muted">
                          {p.soldCount.toLocaleString()} sold
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-dark shrink-0">
                      {formatTaka(p.revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales by Channel (Donut Chart) - 3 cols */}
        <div className="lg:col-span-3 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-dark">
              Sales by Channel
            </h3>

            {/* Circular Donut Diagram */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="170" height="170" viewBox="0 0 170 170" className="rotate-[-90deg]">
                {/* 
                  Radius 62 -> Circumference = 2 * PI * 62 ≈ 389.5
                  Website 60% = 233.7
                  Facebook 20% = 77.9
                  Instagram 12% = 46.7
                  Others 8% = 31.2
                */}
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="none"
                  stroke="#0A98C3"
                  strokeWidth="20"
                  strokeDasharray="233.7 389.5"
                  strokeDashoffset="0"
                />
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="20"
                  strokeDasharray="77.9 389.5"
                  strokeDashoffset="-233.7"
                />
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="20"
                  strokeDasharray="46.7 389.5"
                  strokeDashoffset="-311.6"
                />
                <circle
                  cx="85"
                  cy="85"
                  r="62"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="20"
                  strokeDasharray="31.2 389.5"
                  strokeDashoffset="-358.3"
                />
              </svg>

              {/* Centered Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-sans font-bold text-base text-neutral-dark leading-tight">
                  {formatTaka(metrics.kpis.totalSales)}
                </span>
                <span className="text-[10px] text-neutral-muted font-medium">
                  Total Sales
                </span>
              </div>
            </div>

            {/* Channel Breakdown Legend */}
            <div className="space-y-2 mt-2">
              {metrics.salesByChannel.map((ch) => (
                <div
                  key={ch.channel}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: ch.color }}
                    />
                    <span className="text-neutral-muted">{ch.channel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-neutral-dark">
                    <span>{ch.percentage}%</span>
                    <span className="text-neutral-muted/70 text-[11px]">
                      ({formatTaka(ch.amount)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Row 3: Recent Orders, New Customers, Inventory Summary       */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table - 5 cols */}
        <div className="lg:col-span-5 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-border/50">
              <h3 className="font-heading font-bold text-lg text-neutral-dark">
                Recent Orders
              </h3>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all orders
              </Link>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-muted font-medium border-b border-neutral-border/40">
                    <th className="py-2.5 font-medium">Order ID</th>
                    <th className="py-2.5 font-medium">Customer</th>
                    <th className="py-2.5 font-medium">Date</th>
                    <th className="py-2.5 font-medium">Amount</th>
                    <th className="py-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border/40 font-sans">
                  {displayedOrders.map((ord) => {
                    const statusPills: Record<string, string> = {
                      Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
                      Shipped: "bg-blue-50 text-blue-700 border border-blue-200/60",
                      "In Transit": "bg-amber-50 text-amber-700 border border-amber-200/60",
                      Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/60",
                      Pending: "bg-slate-50 text-slate-700 border border-slate-200/60",
                    };

                    return (
                      <tr key={ord.id} className="hover:bg-neutral-bg/60 transition-colors">
                        <td className="py-3 font-semibold text-primary">
                          <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                            {ord.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-surface text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                              {ord.customerName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-neutral-dark truncate max-w-[100px]">
                              {ord.customerName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-neutral-muted whitespace-nowrap">
                          {ord.date}
                        </td>
                        <td className="py-3 font-bold text-neutral-dark">
                          {formatTaka(ord.amount)}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              statusPills[ord.status] || "bg-neutral-100 text-neutral-dark"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination */}
          <div className="pt-3 border-t border-neutral-border/50 flex items-center justify-between text-xs text-neutral-muted">
            <span>
              Page {ordersPage} of {totalOrderPages || 1}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={ordersPage <= 1}
                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-neutral-border hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={ordersPage >= totalOrderPages}
                onClick={() => setOrdersPage((p) => Math.min(totalOrderPages, p + 1))}
                className="p-1 rounded-md border border-neutral-border hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* New Customers List - 4 cols */}
        <div className="lg:col-span-4 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-border/50">
              <h3 className="font-heading font-bold text-lg text-neutral-dark">
                New Customers
              </h3>
              <Link
                href="/admin/customers"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-neutral-border/40 mt-1">
              {displayedCustomers.map((c) => (
                <div
                  key={c.id}
                  className="py-3 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.avatarBg}`}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-dark truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-neutral-muted truncate">
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-neutral-muted shrink-0 whitespace-nowrap">
                    {c.joinDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customers Pagination */}
          <div className="pt-3 border-t border-neutral-border/50 flex items-center justify-between text-xs text-neutral-muted">
            <span>
              Page {customersPage} of {totalCustomerPages || 1}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={customersPage <= 1}
                onClick={() => setCustomersPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-neutral-border hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={customersPage >= totalCustomerPages}
                onClick={() => setCustomersPage((p) => Math.min(totalCustomerPages, p + 1))}
                className="p-1 rounded-md border border-neutral-border hover:bg-neutral-bg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Summary - 3 cols */}
        <div className="lg:col-span-3 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-dark">
              Inventory Summary
            </h3>

            {/* Circular Gauge */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
                {/* Background Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r="52"
                  fill="none"
                  stroke="#E7E8EB"
                  strokeWidth="12"
                />
                {/* Active In-Stock Arc */}
                <circle
                  cx="70"
                  cy="70"
                  r="52"
                  fill="none"
                  stroke="#0A98C3"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(metrics.inventorySummary.inStockPercentage / 100) * 326.7} 326.7`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-sans font-bold text-xl text-neutral-dark">
                  {metrics.inventorySummary.inStockPercentage}%
                </span>
                <span className="text-[10px] text-neutral-muted font-medium">
                  In Stock
                </span>
              </div>
            </div>

            {/* Inventory Metrics Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-muted">Total Products</span>
                <span className="font-bold text-neutral-dark">
                  {metrics.inventorySummary.totalProducts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-muted">In Stock</span>
                <span className="font-bold text-success">
                  {metrics.inventorySummary.inStock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-muted">Low Stock</span>
                <span className="font-bold text-warning">
                  {metrics.inventorySummary.lowStock}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-muted">Out of Stock</span>
                <span className="font-bold text-error">
                  {metrics.inventorySummary.outOfStock}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Manage Inventory */}
          <div className="mt-5">
            <Link
              href="/admin/products"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-border hover:border-primary text-xs font-semibold text-neutral-dark hover:text-primary hover:bg-primary-surface/20 transition-all shadow-2xs group"
            >
              <Package className="w-3.5 h-3.5 text-primary" />
              <span>Manage Inventory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Storefront Highlights / Active Banner Quick-Card              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-primary/10 via-surface to-secondary/15 border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-base text-neutral-dark">
                Website Content & Announcement Bar
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-success-surface text-success text-[10px] font-bold border border-success/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live on Storefront
              </span>
            </div>
            <p className="text-xs text-neutral-muted mt-1 leading-relaxed max-w-2xl">
              Control the homepage Hero Banner image, Baloo 2 headlines, and the top Sunny Yellow
              promotional announcement bar with active promo codes.
            </p>
          </div>
        </div>

        <Link
          href="/admin/content"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-tertiary transition-all shadow-sm flex items-center gap-2"
        >
          <span>Edit Website Content</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
