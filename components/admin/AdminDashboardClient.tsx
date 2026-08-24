"use client";

import React from "react";
import posthog from "posthog-js";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserRoleBadge } from "@/components/auth/UserRoleBadge";
import {
  ShieldAlertIcon,
  TrendingUpIcon,
  ShoppingBagIcon,
  AlertTriangleIcon,
  TagIcon,
  ArrowRightIcon,
  LogOutIcon,
  HomeIcon,
} from "lucide-react";

export function AdminDashboardClient() {
  const { role, profile, user, signOut } = useAuth();

  // Role Gate: Strictly 'admin' or 'store-manager' allowed
  const isAuthorized = role === "admin" || role === "store-manager";

  if (!isAuthorized) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans">
        <div className="bg-error-surface border border-error/20 rounded-2xl p-8 shadow-sm">
          <ShieldAlertIcon className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="font-heading font-bold text-2xl text-neutral-dark">
            Admin Access Denied
          </h2>
          <p className="text-sm text-neutral-muted mt-2 leading-relaxed">
            Your current role is{" "}
            <span className="font-semibold text-neutral-dark">
              {role ? role.toUpperCase() : "CUSTOMER"}
            </span>
            . This dashboard requires <span className="font-semibold text-error">ADMIN</span> or{" "}
            <span className="font-semibold text-warning-foreground">STORE-MANAGER</span> privileges.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/account"
              className="px-5 py-2.5 bg-primary text-white font-medium text-xs rounded-md shadow-xs"
            >
              Return to Customer Account
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Admin Topbar */}
      <header className="bg-neutral-dark text-white border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              Mirai Mart Admin
            </span>
            <UserRoleBadge role={role} size="sm" />
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-white/70 hidden sm:inline">
              Logged in as <strong className="text-white">{profile?.fullName || user?.email}</strong>
            </span>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              type="button"
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-md bg-error/20 hover:bg-error/30 text-error-light flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOutIcon className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-surface border border-neutral-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-sans text-neutral-muted">
              <span>Total Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-success-surface text-success flex items-center justify-center">
                <TrendingUpIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading font-bold text-2xl text-neutral-dark mt-2">
              ৳ 148,200
            </p>
            <span className="text-[11px] font-sans font-semibold text-success mt-1 inline-block">
              ↑ 18.4% vs last week
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-surface border border-neutral-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-sans text-neutral-muted">
              <span>Orders Today</span>
              <div className="w-8 h-8 rounded-lg bg-primary-surface text-primary flex items-center justify-center">
                <ShoppingBagIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading font-bold text-2xl text-neutral-dark mt-2">
              28
            </p>
            <span className="text-[11px] font-sans font-semibold text-primary mt-1 inline-block">
              12 awaiting packing
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-surface border border-neutral-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-sans text-neutral-muted">
              <span>Low Stock Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-error-surface text-error flex items-center justify-center">
                <AlertTriangleIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading font-bold text-2xl text-error mt-2">
              3 items
            </p>
            <span className="text-[11px] font-sans text-neutral-muted mt-1 inline-block">
              &lt; 5 units remaining
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-surface border border-neutral-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-sans text-neutral-muted">
              <span>Active Promotions</span>
              <div className="w-8 h-8 rounded-lg bg-warning-surface text-warning-foreground flex items-center justify-center">
                <TagIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="font-heading font-bold text-2xl text-neutral-dark mt-2">
              4 Codes
            </p>
            <span className="text-[11px] font-sans font-semibold text-neutral-dark mt-1 inline-block">
              MIRAI10 (10% off) active
            </span>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="mt-8 bg-surface border border-neutral-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-border mb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-neutral-dark">
                Recent Store Orders
              </h2>
              <p className="font-sans text-xs text-neutral-muted">
                Live order fulfillment stream
              </p>
            </div>
            <span className="text-xs font-sans text-neutral-muted">
              Auto-sync enabled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-neutral-border text-neutral-muted font-semibold">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Customer</th>
                  <th className="pb-3 px-3">Items</th>
                  <th className="pb-3 px-3">Total</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border text-neutral-dark">
                <tr className="hover:bg-neutral-bg/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-primary">#MM-10521</td>
                  <td className="py-3 px-3">Nafis Rahman (Gulshan, Dhaka)</td>
                  <td className="py-3 px-3">Montessori Wooden Block Set (x1)</td>
                  <td className="py-3 px-3 font-bold">৳ 2,990</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-warning-surface text-warning-foreground font-semibold text-[10px]">
                      Pending Packing
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      className="px-2.5 py-1 rounded bg-primary text-white text-[11px] font-medium hover:bg-tertiary transition-colors cursor-pointer"
                      onClick={() => posthog.capture("admin_order_fulfilled", { order_id: "MM-10521", role })}
                    >
                      Fulfill
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-bg/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-primary">#MM-10520</td>
                  <td className="py-3 px-3">Tanjina Ahmed (Dhanmondi)</td>
                  <td className="py-3 px-3">Smart Digital Clock + Lamp (x1)</td>
                  <td className="py-3 px-3 font-bold">৳ 4,120</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[10px]">
                      Packed
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="px-2.5 py-1 rounded border border-neutral-border hover:bg-neutral-bg text-[11px] font-medium transition-colors cursor-pointer">
                      Assign Courier
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-neutral-bg/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-primary">#MM-10519</td>
                  <td className="py-3 px-3">Arif Hossain (Uttara)</td>
                  <td className="py-3 px-3">Newborn Gift Combo Basket (x1)</td>
                  <td className="py-3 px-3 font-bold">৳ 5,490</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-success-light text-success font-semibold text-[10px]">
                      Shipped
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="px-2.5 py-1 rounded border border-neutral-border hover:bg-neutral-bg text-[11px] font-medium transition-colors cursor-pointer">
                      View Slip
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
