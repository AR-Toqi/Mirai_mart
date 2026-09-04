"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Bell,
  ChevronDown,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface AdminTopBarProps {
  title?: string;
  subtitle?: string;
}

export function AdminTopBar({
  title = "Dashboard 👋",
  subtitle = "Here's what's happening with your store today.",
}: AdminTopBarProps) {
  const { profile, user, role } = useAuth();
  const [selectedRange, setSelectedRange] = useState("May 12 – May 18, 2024");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const adminName = profile?.fullName || "AR Toqi";
  const adminRole = role ? role.toUpperCase() : "ADMIN";

  const notifications = [
    {
      id: "n1",
      title: "New order placed",
      desc: "Order #MM-1256 for ৳2,350 was received",
      time: "10m ago",
      icon: ShoppingBag,
      iconColor: "text-primary bg-primary/10",
    },
    {
      id: "n2",
      title: "Low stock alert",
      desc: "Montessori Pastel Blocks has 3 units left",
      time: "45m ago",
      icon: AlertTriangle,
      iconColor: "text-warning bg-warning/10",
    },
    {
      id: "n3",
      title: "Review submitted",
      desc: "A verified buyer left a 5-star review",
      time: "2h ago",
      icon: CheckCircle2,
      iconColor: "text-success bg-success/10",
    },
  ];

  return (
    <header className="h-20 bg-surface border-b border-neutral-border px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-neutral-dark tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-neutral-muted font-normal mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Controls: Date Picker, Notifications, Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date Range Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors shadow-2xs cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-muted" />
          </button>

          {isDateMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-surface border border-neutral-border rounded-xl shadow-lg py-1.5 z-50 text-xs">
              {[
                "Today (Live)",
                "May 12 – May 18, 2024",
                "Last 7 Days",
                "Last 30 Days",
                "This Month",
              ].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => {
                    setSelectedRange(range);
                    setIsDateMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-neutral-bg transition-colors flex items-center justify-between ${
                    selectedRange === range
                      ? "text-primary font-bold bg-primary/5"
                      : "text-neutral-dark"
                  }`}
                >
                  <span>{range}</span>
                  {selectedRange === range && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg flex items-center justify-center text-neutral-muted hover:text-neutral-dark transition-colors shadow-2xs cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-surface">
              3
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-neutral-border rounded-2xl shadow-xl p-3 z-50 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-border/60 px-1">
                <span className="font-heading font-bold text-sm text-neutral-dark">
                  Store Notifications
                </span>
                <span className="text-[11px] font-semibold text-primary cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>

              <div className="space-y-1.5">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-2 rounded-xl hover:bg-neutral-bg transition-colors flex items-start gap-3 text-left cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${n.iconColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-dark leading-snug">
                          {n.title}
                        </p>
                        <p className="text-[11px] text-neutral-muted truncate">
                          {n.desc}
                        </p>
                        <span className="text-[10px] text-neutral-muted/70 mt-0.5 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-neutral-border bg-surface hover:bg-neutral-bg transition-colors shadow-2xs cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary-surface shrink-0 border border-primary/20">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt={adminName}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-neutral-dark leading-tight">
                {adminName}
              </p>
              <p className="text-[10px] text-neutral-muted font-medium">
                {adminRole}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-muted" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-neutral-border rounded-xl shadow-lg p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-neutral-border/60 mb-1">
                <p className="font-bold text-neutral-dark">{adminName}</p>
                <p className="text-[11px] text-neutral-muted truncate">
                  {user?.email || "admin@miraimart.com"}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-success bg-success-surface px-2 py-0.5 rounded-full border border-success/20">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  Verified Admin
                </span>
              </div>
              <a
                href="/admin/settings"
                className="block px-3 py-2 rounded-lg hover:bg-neutral-bg text-neutral-dark font-medium transition-colors"
              >
                Store Settings
              </a>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg hover:bg-neutral-bg text-neutral-dark font-medium transition-colors"
              >
                Customer Storefront
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
