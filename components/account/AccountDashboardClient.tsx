"use client";

import React, { useEffect, useState } from "react";
import posthog from "posthog-js";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import {
  LayoutDashboardIcon,
  PackageIcon,
  HeartIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  UserIcon,
  LockIcon,
  BellIcon,
  HelpCircleIcon,
  MailIcon,
  LogOutIcon,
  CalendarIcon,
  ShoppingBagIcon,
  TagIcon,
  HomeIcon,
  BriefcaseIcon,
  MoreVerticalIcon,
  PlusIcon,
  ChevronRightIcon,
  GiftIcon,
  ArrowRightIcon,
} from "lucide-react";

type NavTab =
  | "dashboard"
  | "orders"
  | "wishlist"
  | "reviews"
  | "addresses"
  | "payments"
  | "profile"
  | "password"
  | "notifications";

export function AccountDashboardClient() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");

  function handleTabChange(tab: NavTab) {
    setActiveTab(tab);
    posthog.capture("account_tab_viewed", { tab });
  }

  // Strict Auth Guard: redirect to /login if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-sans text-sm text-neutral-muted">
          Loading your account...
        </p>
      </div>
    );
  }

  // Derive user initials & name
  const fullName = profile?.fullName || user?.email?.split("@")[0] || "Abdullah Ragib";
  const firstName = fullName.split(" ")[0];
  const email = profile?.email || user?.email || "abdullah.ragib@example.com";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const recentOrders = [
    {
      id: "MM-1256",
      title: "RoboCode Companion",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop",
      status: "Delivered",
      statusVariant: "delivered",
      date: "May 20, 2024",
      price: "৳2,350",
    },
    {
      id: "MM-1255",
      title: "Montessori Pastel Blocks",
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&h=100&fit=crop",
      status: "Shipped",
      statusVariant: "shipped",
      date: "May 18, 2024",
      price: "৳950",
    },
    {
      id: "MM-1254",
      title: "Interactive Learner Pad",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=100&h=100&fit=crop",
      status: "In Transit",
      statusVariant: "transit",
      date: "May 16, 2024",
      price: "৳1,400",
    },
    {
      id: "MM-1253",
      title: "Interactive Smart Globe",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=100&h=100&fit=crop",
      status: "Delivered",
      statusVariant: "delivered",
      date: "May 12, 2024",
      price: "৳1,450",
    },
    {
      id: "MM-1252",
      title: "Brainy Puzzle Set",
      image: "https://images.unsplash.com/photo-1618842676087-59ee79a70bc9?w=100&h=100&fit=crop",
      status: "Cancelled",
      statusVariant: "cancelled",
      date: "May 10, 2024",
      price: "৳890",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRightIcon className="w-3.5 h-3.5" />
        <span className="text-neutral-dark font-medium">My Account</span>
      </nav>

      {/* Main Grid: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT SIDEBAR (Col 1-4) ================= */}
        <aside className="lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1b6b93] text-white font-heading font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-heading font-bold text-[15px] text-neutral-dark truncate leading-tight">
                {fullName}
              </h3>
              <p className="text-xs text-neutral-muted truncate mt-0.5">
                {email}
              </p>
              <button
                type="button"
                onClick={() => handleTabChange("profile")}
                className="text-xs text-primary font-medium hover:underline mt-1 inline-block cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs space-y-6">
            {/* Group 1: ACCOUNT */}
            <div>
              <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider px-3 mb-2">
                Account
              </p>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleTabChange("dashboard")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <LayoutDashboardIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("orders")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <PackageIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("wishlist")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "wishlist"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <HeartIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Wishlist</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("reviews")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "reviews"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <StarIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Reviews</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("addresses")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "addresses"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <MapPinIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Saved Addresses</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("payments")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "payments"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <CreditCardIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Payment Methods</span>
                </button>
              </div>
            </div>

            {/* Group 2: SETTINGS */}
            <div>
              <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider px-3 mb-2">
                Settings
              </p>
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleTabChange("profile")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Profile Information</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("password")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "password"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <LockIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("notifications")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === "notifications"
                      ? "bg-primary-surface/50 text-primary font-semibold"
                      : "text-neutral-dark hover:bg-neutral-bg"
                  }`}
                >
                  <BellIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Notification Preferences</span>
                </button>
              </div>
            </div>

            {/* Group 3: SUPPORT */}
            <div>
              <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-wider px-3 mb-2">
                Support
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/help"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-dark hover:bg-neutral-bg transition-colors"
                >
                  <HelpCircleIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Help Center</span>
                </Link>

                <Link
                  href="/contact"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-dark hover:bg-neutral-bg transition-colors"
                >
                  <MailIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Contact Us</span>
                </Link>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-dark hover:bg-error-surface hover:text-error transition-colors cursor-pointer"
                >
                  <LogOutIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT MAIN CONTENT (Col 5-12) ================= */}
        <main className="lg:col-span-9 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                My Account
              </h1>
              <p className="text-xs sm:text-sm text-neutral-muted mt-0.5">
                Welcome back, {firstName}! Here&apos;s what&apos;s happening with your account.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-muted shrink-0">
              <span>Member since</span>
              <CalendarIcon className="w-3.5 h-3.5 text-neutral-dark" />
              <span className="font-medium text-neutral-dark">May 12, 2024</span>
            </div>
          </div>

          {/* 4 Stat Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total Orders */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-surface/70 text-primary flex items-center justify-center shrink-0">
                <ShoppingBagIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs text-neutral-muted font-medium">Total Orders</p>
                <p className="font-heading font-bold text-2xl text-neutral-dark leading-tight">
                  12
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange("orders")}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                >
                  <span>View all orders</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 2: In Progress */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success-surface text-success flex items-center justify-center shrink-0">
                <PackageIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs text-neutral-muted font-medium">In Progress</p>
                <p className="font-heading font-bold text-2xl text-neutral-dark leading-tight">
                  2
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange("orders")}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                >
                  <span>Track orders</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 3: Wishlist Items */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning-surface text-warning flex items-center justify-center shrink-0">
                <HeartIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs text-neutral-muted font-medium">Wishlist Items</p>
                <p className="font-heading font-bold text-2xl text-neutral-dark leading-tight">
                  18
                </p>
                <button
                  type="button"
                  onClick={() => handleTabChange("wishlist")}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                >
                  <span>View wishlist</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* KPI 4: Available Points */}
            <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-surface/70 text-primary flex items-center justify-center shrink-0">
                <TagIcon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs text-neutral-muted font-medium">Available Points</p>
                <p className="font-heading font-bold text-2xl text-neutral-dark leading-tight">
                  750
                </p>
                <button
                  type="button"
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                >
                  <span>View rewards</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Lower Two-Column Sub-grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sub-Column (Recent Orders + Benefits Banner) - Col 1-7 */}
            <div className="lg:col-span-7 space-y-6">
              {/* Recent Orders Card */}
              <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
                  <h2 className="font-heading font-bold text-base text-neutral-dark">
                    Recent Orders
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleTabChange("orders")}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all orders</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-neutral-border">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-bg/50 px-1 rounded-lg transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden relative bg-neutral-bg shrink-0 border border-neutral-border">
                          <Image
                            src={order.image}
                            alt={order.title}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />

                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-neutral-muted">
                            Order #{order.id}
                          </p>
                          <p className="font-bold text-xs text-neutral-dark truncate">
                            {order.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-right">
                        {order.statusVariant === "delivered" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#e6f8ee] text-[#15803d] font-semibold text-[11px]">
                            Delivered
                          </span>
                        )}
                        {order.statusVariant === "shipped" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[11px]">
                            Shipped
                          </span>
                        )}
                        {order.statusVariant === "transit" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-semibold text-[11px]">
                            In Transit
                          </span>
                        )}
                        {order.statusVariant === "cancelled" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] font-semibold text-[11px]">
                            Cancelled
                          </span>
                        )}

                        <span className="text-xs text-neutral-muted hidden sm:inline">
                          {order.date}
                        </span>

                        <span className="font-bold text-xs text-neutral-dark min-w-[55px]">
                          {order.price}
                        </span>

                        <ChevronRightIcon className="w-4 h-4 text-neutral-muted group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusive Member Benefits Banner */}
              <div className="bg-[#e8f6fa] border border-[#cbe8f2] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#bde6f3] text-primary flex items-center justify-center shrink-0">
                    <GiftIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-neutral-dark">
                      Exclusive member benefits!
                    </h4>
                    <p className="text-xs text-neutral-muted mt-0.5">
                      You&apos;re earning points on every purchase. Redeem your points for exciting discounts.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 px-5 py-2 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-xs rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  View Rewards
                </button>
              </div>
            </div>

            {/* Right Sub-Column (Saved Addresses + Payment Methods) - Col 8-12 */}
            <div className="lg:col-span-5 space-y-6">
              {/* Saved Addresses Card */}
              <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-neutral-border mb-3.5">
                  <h2 className="font-heading font-bold text-base text-neutral-dark">
                    Saved Addresses
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleTabChange("addresses")}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Addresses</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Address 1: Home */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-neutral-border bg-white hover:bg-neutral-bg/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary-surface/60 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <HomeIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-dark">Home</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[10px]">
                          Default
                        </span>
                      </div>
                      <p className="text-neutral-muted mt-1 leading-relaxed">
                        House 12, Road 5, Block D
                        <br />
                        Banasree, Dhaka 1219, Bangladesh
                      </p>
                      <p className="text-neutral-muted mt-0.5">
                        Phone: 01612-345678
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Address options"
                      className="text-neutral-muted hover:text-neutral-dark p-1 cursor-pointer"
                    >
                      <MoreVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Address 2: Office */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl border border-neutral-border bg-white hover:bg-neutral-bg/40 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-neutral-bg text-neutral-dark flex items-center justify-center shrink-0 mt-0.5">
                      <BriefcaseIcon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-dark">Office</span>
                      </div>
                      <p className="text-neutral-muted mt-1 leading-relaxed">
                        Mirpur DOHS, Avenue 3, Road 12
                        <br />
                        Dhaka 1216, Bangladesh
                      </p>
                      <p className="text-neutral-muted mt-0.5">
                        Phone: 01798-765432
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Address options"
                      className="text-neutral-muted hover:text-neutral-dark p-1 cursor-pointer"
                    >
                      <MoreVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-neutral-border mb-3.5">
                  <h2 className="font-heading font-bold text-base text-neutral-dark">
                    Payment Methods
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleTabChange("payments")}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Cards</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Card 1: VISA */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-border bg-white hover:bg-neutral-bg/40 transition-colors text-xs">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-[#1a1f71] text-white font-bold italic rounded text-[11px] tracking-wider">
                        VISA
                      </div>
                      <div>
                        <span className="font-bold text-neutral-dark tracking-widest">
                          •••• 4242
                        </span>
                        <p className="text-[11px] text-neutral-muted">
                          Expires 12/26
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[10px]">
                        Default
                      </span>
                      <button
                        type="button"
                        aria-label="Card options"
                        className="text-neutral-muted hover:text-neutral-dark p-1 cursor-pointer"
                      >
                        <MoreVerticalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Mastercard */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-border bg-white hover:bg-neutral-bg/40 transition-colors text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-1 items-center px-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#eb001b]" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] opacity-80" />
                      </div>
                      <div>
                        <span className="font-bold text-neutral-dark tracking-widest">
                          •••• 8888
                        </span>
                        <p className="text-[11px] text-neutral-muted">
                          Expires 09/25
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Card options"
                      className="text-neutral-muted hover:text-neutral-dark p-1 cursor-pointer"
                    >
                      <MoreVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add New Card Action */}
                  <button
                    type="button"
                    className="w-full mt-2 py-2.5 flex items-center justify-center gap-1.5 text-xs text-primary font-semibold hover:bg-primary-surface/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add New Card</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Trust Strip */}
      <div className="mt-12">
        <TrustStrip />
      </div>
    </div>
  );
}
