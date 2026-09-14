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
  Sliders,
  CheckCircle2,
} from "lucide-react";
import type { AdminDashboardMetrics } from "@/actions/admin";

interface AdminDashboardClientProps {
  initialMetrics: AdminDashboardMetrics;
}

type TimeframeKey = "7 Days" | "30 Days" | "12 Months";

export function AdminDashboardClient({
  initialMetrics,
}: AdminDashboardClientProps) {
  const [metrics] = useState<AdminDashboardMetrics>(initialMetrics);

  // Timeframe toggle state for Sales Overview
  const [timeframe, setTimeframe] = useState<TimeframeKey>("7 Days");
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(3);

  // Currency Formatter
  const formatTaka = (amount: number) => `৳${amount.toLocaleString()}`;

  // Timeframe datasets for broad Sales Overview
  const timeframeDatasets: Record<
    TimeframeKey,
    {
      periodLabel: string;
      previousLabel: string;
      dates: string[];
      current: number[];
      previous: number[];
      totalRevenue: number;
      growthPct: number;
      avgDaily: number;
      peakDay: string;
      peakAmount: number;
      orders: number;
      maxVal: number;
      gridLevels: number[];
    }
  > = {
    "7 Days": {
      periodLabel: "This Week",
      previousLabel: "Last Week",
      dates: metrics.salesOverview.dates,
      current: metrics.salesOverview.thisWeek,
      previous: metrics.salesOverview.lastWeek,
      totalRevenue: metrics.salesOverview.thisWeek.reduce((a, b) => a + b, 0),
      growthPct: 18.6,
      avgDaily: Math.round(
        metrics.salesOverview.thisWeek.reduce((a, b) => a + b, 0) /
          metrics.salesOverview.thisWeek.length
      ),
      peakDay: "May 17",
      peakAmount: 68000,
      orders: 1248,
      maxVal: 80000,
      gridLevels: [0, 20000, 40000, 60000, 80000],
    },
    "30 Days": {
      periodLabel: "Last 30 Days",
      previousLabel: "Prior 30 Days",
      dates: ["Apr 19", "Apr 22", "Apr 25", "Apr 28", "May 01", "May 04", "May 07", "May 10", "May 13", "May 16", "May 18"],
      current: [31000, 38000, 45000, 42000, 56000, 61000, 54000, 68000, 72000, 65340, 69000],
      previous: [24000, 28000, 32000, 39000, 41000, 45000, 49000, 52000, 58000, 55000, 58000],
      totalRevenue: 601340,
      growthPct: 22.4,
      avgDaily: 20045,
      peakDay: "May 13",
      peakAmount: 72000,
      orders: 4890,
      maxVal: 80000,
      gridLevels: [0, 20000, 40000, 60000, 80000],
    },
    "12 Months": {
      periodLabel: "Past 12 Months",
      previousLabel: "Prior Year",
      dates: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
      current: [180000, 210000, 245000, 220000, 280000, 340000, 410000, 290000, 310000, 350000, 380000, 420000],
      previous: [140000, 160000, 190000, 185000, 220000, 280000, 330000, 240000, 260000, 290000, 310000, 350000],
      totalRevenue: 3745000,
      growthPct: 28.2,
      avgDaily: 10260,
      peakDay: "May",
      peakAmount: 420000,
      orders: 14620,
      maxVal: 500000,
      gridLevels: [0, 125000, 250000, 375000, 500000],
    },
  };

  const activeDataset = timeframeDatasets[timeframe];

  // SVG Geometry for Broad Sales Overview Canvas (viewBox 0 0 960 250)
  const padLeft = 60;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;
  const plotWidth = 960 - padLeft - padRight;
  const plotHeight = 250 - padTop - padBottom;
  const baselineY = padTop + plotHeight;

  const getY = (val: number, maxVal: number) =>
    baselineY - (val / maxVal) * plotHeight;

  const getX = (index: number, total: number) =>
    padLeft + (index / Math.max(1, total - 1)) * plotWidth;

  const pointsCurrent = activeDataset.current.map((val, i, arr) => ({
    x: getX(i, arr.length),
    y: getY(val, activeDataset.maxVal),
    val,
    prevVal: activeDataset.previous[i] ?? 0,
    date: activeDataset.dates[i],
  }));

  const pointsPrevious = activeDataset.previous.map((val, i, arr) => ({
    x: getX(i, arr.length),
    y: getY(val, activeDataset.maxVal),
    val,
  }));

  // Create smooth bezier path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (!pts.length) return "";
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      const prev = arr[i - 1];
      const cpX1 = (prev.x + (pt.x - prev.x) / 2).toFixed(1);
      const cpY1 = prev.y.toFixed(1);
      const cpX2 = (prev.x + (pt.x - prev.x) / 2).toFixed(1);
      const cpY2 = pt.y.toFixed(1);
      return `${acc} C ${cpX1},${cpY1} ${cpX2},${cpY2} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }, "");
  };

  const pathCurrent = makeSmoothPath(pointsCurrent);
  const pathPrevious = makeSmoothPath(pointsPrevious);

  // Area under current curve
  const areaCurrent = pointsCurrent.length > 0
    ? `${pathCurrent} L ${pointsCurrent[pointsCurrent.length - 1].x.toFixed(1)},${baselineY} L ${pointsCurrent[0].x.toFixed(1)},${baselineY} Z`
    : "";

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
            <div className="w-11 h-11 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
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
            <div className="w-11 h-11 rounded-xl bg-success-surface text-success flex items-center justify-center shrink-0">
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
            <div className="w-11 h-11 rounded-xl bg-secondary-surface text-secondary-foreground flex items-center justify-center shrink-0">
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
            <div className="w-11 h-11 rounded-xl bg-warning-surface text-warning flex items-center justify-center shrink-0">
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
            <div className="w-11 h-11 rounded-xl bg-tertiary-surface text-tertiary flex items-center justify-center shrink-0">
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
      {/* Row 2: Broad Sales Overview Analytics Canvas (Full Width)     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs">
        {/* Header: Title & Timeframe Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-neutral-dark">
                Sales Overview
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                Revenue Trajectory
              </span>
            </div>
            <p className="text-xs text-neutral-muted mt-0.5">
              Visualizing revenue velocity, order performance, and comparative period growth.
            </p>
          </div>

          {/* Controls: Legend & Timeframe Tabs */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Legend */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-neutral-dark font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                <span>{activeDataset.periodLabel}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-muted font-medium">
                <span className="w-3 border-b-2 border-dashed border-slate-400 inline-block" />
                <span>{activeDataset.previousLabel}</span>
              </div>
            </div>

            {/* Timeframe Switcher Tabs */}
            <div className="flex items-center bg-neutral-bg p-1 rounded-xl border border-neutral-border">
              {(["7 Days", "30 Days", "12 Months"] as TimeframeKey[]).map((tf) => {
                const isActive = timeframe === tf;
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => {
                      setTimeframe(tf);
                      setActiveTooltipIndex(2);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary text-white shadow-xs"
                        : "text-neutral-muted hover:text-neutral-dark hover:bg-surface"
                    }`}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 px-4 rounded-xl bg-neutral-bg/60 border border-neutral-border/60 my-5">
          <div>
            <span className="text-[11px] font-medium text-neutral-muted">Period Revenue</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-heading font-bold text-base sm:text-lg text-neutral-dark">
                {formatTaka(activeDataset.totalRevenue)}
              </span>
              <span className="text-[11px] font-bold text-success">
                +{activeDataset.growthPct}%
              </span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-neutral-muted">Daily Average</span>
            <p className="font-heading font-bold text-base sm:text-lg text-neutral-dark mt-0.5">
              {formatTaka(activeDataset.avgDaily)}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-neutral-muted">
              Peak Day ({activeDataset.peakDay})
            </span>
            <p className="font-heading font-bold text-base sm:text-lg text-neutral-dark mt-0.5">
              {formatTaka(activeDataset.peakAmount)}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-medium text-neutral-muted">Orders Volume</span>
            <p className="font-heading font-bold text-base sm:text-lg text-neutral-dark mt-0.5">
              {activeDataset.orders.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Broad SVG Interactive Spline & Area Chart */}
        <div className="relative w-full overflow-x-auto pt-2">
          <svg
            viewBox="0 0 960 250"
            className="w-full h-64 sm:h-72 select-none min-w-[650px] overflow-visible"
          >
            <defs>
              {/* Soft Gradient Area Fill */}
              <linearGradient id="broadSalesArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                <stop offset="80%" stopColor="var(--color-primary)" stopOpacity="0.04" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
              </linearGradient>

              {/* Tooltip Shadow */}
              <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Horizontal Grid Guide Lines */}
            {activeDataset.gridLevels.map((level) => {
              const y = getY(level, activeDataset.maxVal);
              const label =
                level === 0
                  ? "৳0"
                  : level >= 100000
                  ? `৳${level / 1000}K`
                  : `৳${level / 1000}K`;

              return (
                <g key={level}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={960 - padRight}
                    y2={y}
                    stroke="var(--color-neutral-border)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    fill="var(--color-neutral-muted)"
                    fontSize="11"
                    fontWeight="500"
                    textAnchor="end"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Area Fill for Current Period */}
            {areaCurrent && (
              <path
                d={areaCurrent}
                fill="url(#broadSalesArea)"
                className="transition-all duration-300"
              />
            )}

            {/* Previous Period Dashed Curve */}
            {pathPrevious && (
              <path
                d={pathPrevious}
                fill="none"
                stroke="var(--color-neutral-muted)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
                className="transition-all duration-300"
                opacity="0.7"
              />
            )}

            {/* Current Period Solid Spline Curve */}
            {pathCurrent && (
              <path
                d={pathCurrent}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            )}

            {/* Hover Guide & Concentric Rings */}
            {activeTooltipIndex !== null && pointsCurrent[activeTooltipIndex] && (
              <g>
                {/* Vertical Crosshair Line */}
                <line
                  x1={pointsCurrent[activeTooltipIndex].x}
                  y1={padTop}
                  x2={pointsCurrent[activeTooltipIndex].x}
                  y2={baselineY}
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* Previous Period Node */}
                {pointsPrevious[activeTooltipIndex] && (
                  <circle
                    cx={pointsPrevious[activeTooltipIndex].x}
                    cy={pointsPrevious[activeTooltipIndex].y}
                    r="4.5"
                    fill="var(--color-neutral-muted)"
                    stroke="var(--color-surface)"
                    strokeWidth="2"
                  />
                )}

                {/* Current Period Pulsing Node */}
                <circle
                  cx={pointsCurrent[activeTooltipIndex].x}
                  cy={pointsCurrent[activeTooltipIndex].y}
                  r="12"
                  fill="var(--color-primary)"
                  fillOpacity="0.2"
                />
                <circle
                  cx={pointsCurrent[activeTooltipIndex].x}
                  cy={pointsCurrent[activeTooltipIndex].y}
                  r="6"
                  fill="var(--color-primary)"
                  stroke="var(--color-surface)"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* Data Points on Current Period Curve */}
            {pointsCurrent.map((pt, idx) => {
              const isSelected = activeTooltipIndex === idx;
              return (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? "var(--color-primary)" : "var(--color-surface)"}
                  stroke="var(--color-primary)"
                  strokeWidth={isSelected ? 2.5 : 2}
                  className="transition-all pointer-events-none"
                />
              );
            })}

            {/* Transparent Interactive Hover Columns */}
            {pointsCurrent.map((pt, idx) => {
              const colWidth = plotWidth / pointsCurrent.length;
              const colX = pt.x - colWidth / 2;
              return (
                <rect
                  key={idx}
                  x={colX}
                  y={padTop}
                  width={colWidth}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveTooltipIndex(idx)}
                  onClick={() => setActiveTooltipIndex(idx)}
                />
              );
            })}

            {/* Rich Floating Tooltip Card */}
            {activeTooltipIndex !== null && pointsCurrent[activeTooltipIndex] && (() => {
              const activePt = pointsCurrent[activeTooltipIndex];
              const tooltipWidth = 160;
              const tooltipHeight = 64;
              let tooltipX = activePt.x - tooltipWidth / 2;
              if (tooltipX < padLeft) tooltipX = padLeft;
              if (tooltipX + tooltipWidth > 960 - padRight) {
                tooltipX = 960 - padRight - tooltipWidth;
              }
              const tooltipY = Math.max(padTop + 2, activePt.y - tooltipHeight - 12);

              const diff = activePt.val - activePt.prevVal;
              const diffPct =
                activePt.prevVal > 0
                  ? `${diff >= 0 ? "+" : ""}${Math.round((diff / activePt.prevVal) * 100)}%`
                  : null;

              return (
                <g filter="url(#tooltipShadow)">
                  <rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipWidth}
                    height={tooltipHeight}
                    rx="10"
                    fill="var(--color-neutral-dark)"
                    stroke="var(--color-neutral-border)"
                    strokeWidth="1"
                  />
                  {/* Tooltip Header Date */}
                  <text
                    x={tooltipX + 12}
                    y={tooltipY + 18}
                    fill="var(--color-neutral-muted)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {activePt.date}, 2024
                  </text>
                  {/* Current Period Val */}
                  <circle cx={tooltipX + 16} cy={tooltipY + 34} r="3.5" fill="var(--color-primary)" />
                  <text
                    x={tooltipX + 26}
                    y={tooltipY + 38}
                    fill="var(--color-surface)"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {formatTaka(activePt.val)}
                  </text>
                  {diffPct && (
                    <text
                      x={tooltipX + tooltipWidth - 10}
                      y={tooltipY + 38}
                      fill={diff >= 0 ? "var(--color-success)" : "var(--color-error)"}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="end"
                    >
                      {diffPct}
                    </text>
                  )}
                  {/* Previous Period Val */}
                  <circle cx={tooltipX + 16} cy={tooltipY + 50} r="3" fill="var(--color-neutral-muted)" />
                  <text
                    x={tooltipX + 26}
                    y={tooltipY + 54}
                    fill="var(--color-neutral-muted)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    Prev: {formatTaka(activePt.prevVal)}
                  </text>
                </g>
              );
            })()}

            {/* X-Axis Date Labels */}
            {pointsCurrent.map((pt, idx) => (
              <text
                key={idx}
                x={pt.x}
                y="242"
                fill="var(--color-neutral-muted)"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {pt.date}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Row 3: Top Selling Products, Sales by Channel, Inventory Summary */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                  1: "bg-warning-surface text-warning-foreground border border-warning/30",
                  2: "bg-primary-surface text-primary border border-primary/20",
                  3: "bg-neutral-bg text-neutral-dark border border-neutral-border",
                  4: "bg-tertiary-surface text-tertiary border border-tertiary/20",
                  5: "bg-secondary-surface text-secondary-foreground border border-secondary/30",
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

        {/* Sales by Channel (Donut Chart) - 4 cols */}
        <div className="lg:col-span-4 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-neutral-dark">
              Sales by Channel
            </h3>

            {/* Circular Donut Diagram */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width="170" height="170" viewBox="0 0 170 170" className="rotate-[-90deg]">
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

        {/* Inventory Summary - 4 cols */}
        <div className="lg:col-span-4 bg-surface border border-neutral-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
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
                  stroke="var(--color-neutral-border)"
                  strokeWidth="12"
                />
                {/* Active In-Stock Arc */}
                <circle
                  cx="70"
                  cy="70"
                  r="52"
                  fill="none"
                  stroke="var(--color-primary)"
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
