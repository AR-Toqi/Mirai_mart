"use client";

import React, { useEffect, useState, useMemo } from "react";
import posthog from "posthog-js";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { OrderDetailModal, type CustomerOrder } from "@/components/account/OrderDetailModal";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency, cn } from "@/lib/utils";
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
  SearchIcon,
  EyeIcon,
  TruckIcon,
  RotateCcwIcon,
  CheckIcon,
  Trash2Icon,
  XIcon,
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

const VALID_TABS: NavTab[] = [
  "dashboard",
  "orders",
  "wishlist",
  "reviews",
  "addresses",
  "payments",
  "profile",
  "password",
  "notifications",
];

interface AddressItem {
  id: string;
  type: "home" | "office" | "other";
  label: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

interface AccountDashboardClientProps {
  initialOrders?: CustomerOrder[];
}

export function AccountDashboardClient({ initialOrders = [] }: AccountDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab") as NavTab | null;
  const initialTab: NavTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "dashboard";

  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth();
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);

  // Live Orders state with initial props
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);

  // Keep orders state synced if initialOrders changes
  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  // Selected Order for detail modal
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Orders Tab filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "01712-345678",
    email: "",
  });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccessToast, setPasswordSuccessToast] = useState(false);

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    orderSms: true,
    orderEmail: true,
    whatsappUpdates: true,
    promoOffers: false,
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: "addr-1",
      type: "home",
      label: "Home",
      isDefault: true,
      fullName: "Abdullah Ragib",
      phone: "01612-345678",
      address: "House 12, Road 5, Block D, Banasree",
      city: "Dhaka 1219",
    },
    {
      id: "addr-2",
      type: "office",
      label: "Office",
      isDefault: false,
      fullName: "Abdullah Ragib",
      phone: "01798-765432",
      address: "Mirpur DOHS, Avenue 3, Road 12",
      city: "Dhaka 1216",
    },
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState<Omit<AddressItem, "id">>({
    type: "home",
    label: "Home",
    isDefault: false,
    fullName: "",
    phone: "",
    address: "",
    city: "Dhaka",
  });

  // Fallback sample orders for demo/preview when no live orders exist yet
  const fallbackOrders: CustomerOrder[] = useMemo(
    () => [
      {
        id: "MM-1256",
        createdAt: "May 20, 2024",
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "bKash",
        transactionId: "BK992817420",
        deliveryZone: "inside_dhaka",
        carrier: "Steadfast Courier",
        trackingNumber: "ST-88492019",
        subtotal: 2350,
        shippingFee: 80,
        discountAmount: 80,
        advancePaid: 80,
        totalAmount: 2350,
        shippingAddress: {
          fullName: "Abdullah Ragib",
          phone: "01612-345678",
          address: "House 12, Road 5, Block D, Banasree",
          city: "Dhaka",
          notes: "Please call before arrival.",
        },
        items: [
          {
            id: "item-1",
            productTitle: "RoboCode Companion STEM Kit",
            variantTitle: "Explorer Edition",
            quantity: 1,
            unitPrice: 2350,
            imageUrl: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&h=100&fit=crop",
          },
        ],
      },
      {
        id: "MM-1255",
        createdAt: "May 18, 2024",
        status: "shipped",
        paymentStatus: "partial",
        paymentMethod: "Nagad",
        transactionId: "NG88201934",
        deliveryZone: "inside_dhaka",
        carrier: "Pathao Logistics",
        trackingNumber: "PT-7738201",
        subtotal: 950,
        shippingFee: 80,
        advancePaid: 80,
        totalAmount: 1030,
        shippingAddress: {
          fullName: "Abdullah Ragib",
          phone: "01612-345678",
          address: "House 12, Road 5, Block D, Banasree",
          city: "Dhaka",
        },
        items: [
          {
            id: "item-2",
            productTitle: "Montessori Pastel Wooden Building Blocks",
            variantTitle: "Pastel Rainbow 48pc",
            quantity: 1,
            unitPrice: 950,
            imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&h=100&fit=crop",
          },
        ],
      },
    ],
    []
  );

  // Active customer orders (live orders from DB if present; otherwise fallback demo orders if previewing)
  const customerOrders: CustomerOrder[] = useMemo(() => {
    if (orders && orders.length > 0) {
      return orders;
    }
    // If user is authenticated and genuinely has 0 orders, we respect the empty state.
    // If not authenticated or in local mock mode, we show fallback orders for preview.
    if (isAuthenticated) {
      return [];
    }
    return fallbackOrders;
  }, [orders, isAuthenticated, fallbackOrders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return customerOrders.filter((order) => {
      const matchesStatus =
        orderStatusFilter === "all"
          ? true
          : orderStatusFilter === "active"
          ? ["pending", "packed", "shipped"].includes(order.status)
          : order.status === orderStatusFilter;

      const matchesSearch =
        orderSearchQuery.trim() === "" ||
        order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.productTitle.toLowerCase().includes(orderSearchQuery.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });
  }, [customerOrders, orderStatusFilter, orderSearchQuery]);

  // Sync profile form
  useEffect(() => {
    if (profile || user) {
      setProfileForm({
        fullName: profile?.fullName || user?.email?.split("@")[0] || "Abdullah Ragib",
        phone: "01612-345678",
        email: profile?.email || user?.email || "abdullah.ragib@example.com",
      });
    }
  }, [profile, user]);

  // Sync state if URL query parameter changes (e.g. Back/Forward navigation)
  useEffect(() => {
    const currentParam = searchParams.get("tab") as NavTab | null;
    if (currentParam && VALID_TABS.includes(currentParam)) {
      setActiveTab(currentParam);
    } else if (!currentParam) {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  function handleTabChange(tab: NavTab) {
    setActiveTab(tab);

    const params = new URLSearchParams(searchParams.toString());
    if (tab === "dashboard") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });

    posthog.capture("account_tab_viewed", { tab });
  }

  function handleViewOrderDetails(order: CustomerOrder) {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  }

  function handleBuyAgain(order: CustomerOrder) {
    order.items.forEach((item) => {
      addItem(
        {
          productId: item.id,
          productTitle: item.productTitle,
          productSlug: "montessori-pastel-blocks",
          variantTitle: item.variantTitle,
          price: item.unitPrice,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
        },
        { openDrawer: true }
      );
    });
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSuccessToast(true);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccessToast(false), 3000);
  }

  function handleAddNewAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddressForm.fullName || !newAddressForm.address || !newAddressForm.phone) return;

    const newAddr: AddressItem = {
      id: `addr-${Date.now()}`,
      ...newAddressForm,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setIsAddressModalOpen(false);
    setNewAddressForm({
      type: "home",
      label: "Home",
      isDefault: false,
      fullName: "",
      phone: "",
      address: "",
      city: "Dhaka",
    });
  }

  function handleDeleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  // Strict Auth Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 font-sans">
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
                  <PackageIcon className="w-4 h-4" />
                  <span>Orders</span>
                  <span className="ml-auto text-[10px] bg-primary-surface text-primary px-2 py-0.5 rounded-full font-bold">
                    {customerOrders.length}
                  </span>
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
                  href="/track-order"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-dark hover:bg-neutral-bg transition-colors"
                >
                  <TruckIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Public Order Tracker</span>
                </Link>

                <Link
                  href="/help"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-dark hover:bg-neutral-bg transition-colors"
                >
                  <HelpCircleIcon className="w-4 h-4 text-neutral-muted" />
                  <span>Help Center</span>
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
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
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
                      {customerOrders.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTabChange("orders")}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                    >
                      <span>View all</span>
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
                      {customerOrders.filter((o) => ["pending", "packed", "shipped"].includes(o.status)).length}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderStatusFilter("active");
                        handleTabChange("orders");
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                    >
                      <span>Track now</span>
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
                      6
                    </p>
                    <button
                      type="button"
                      onClick={() => handleTabChange("wishlist")}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-0.5 cursor-pointer"
                    >
                      <span>View list</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* KPI 4: Reward Points */}
                <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-surface/70 text-primary flex items-center justify-center shrink-0">
                    <TagIcon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-muted font-medium">Mirai Points</p>
                    <p className="font-heading font-bold text-2xl text-neutral-dark leading-tight">
                      750
                    </p>
                    <span className="text-[11px] font-semibold text-success flex items-center gap-0.5 mt-0.5">
                      ৳ 75 Value
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower Subgrid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Recent Orders Overview (Col 1-7) */}
                <div className="lg:col-span-7 space-y-6">
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
                        <span>View all ({customerOrders.length})</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {customerOrders.length === 0 ? (
                      <div className="py-8 text-center">
                        <PackageIcon className="w-9 h-9 text-neutral-muted/40 mx-auto mb-2" />
                        <p className="font-heading font-bold text-xs text-neutral-dark">
                          No recent orders
                        </p>
                        <p className="text-[11px] text-neutral-muted mt-0.5">
                          When you place an order, it will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-border">
                        {customerOrders.slice(0, 4).map((order) => (
                          <div
                            key={order.id}
                            onClick={() => handleViewOrderDetails(order)}
                            className="py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-bg/60 px-2 rounded-xl transition-colors cursor-pointer group"
                          >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-lg overflow-hidden relative bg-neutral-bg shrink-0 border border-neutral-border">
                              <Image
                                src={order.items[0]?.imageUrl || ""}
                                alt={order.items[0]?.productTitle || "Product"}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] text-neutral-muted">
                                Order #{order.id} • {order.createdAt}
                              </p>
                              <p className="font-bold text-xs text-neutral-dark truncate">
                                {order.items[0]?.productTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-right">
                            {order.status === "delivered" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#e6f8ee] text-[#15803d] font-semibold text-[11px]">
                                Delivered
                              </span>
                            )}
                            {order.status === "shipped" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[11px]">
                                Shipped
                              </span>
                            )}
                            {order.status === "packed" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-semibold text-[11px]">
                                Packed
                              </span>
                            )}
                            {order.status === "cancelled" && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] font-semibold text-[11px]">
                                Cancelled
                              </span>
                            )}

                            <span className="font-heading font-bold text-xs text-neutral-dark min-w-[55px]">
                              {formatCurrency(order.totalAmount)}
                            </span>

                            <ChevronRightIcon className="w-4 h-4 text-neutral-muted group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
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
                          You&apos;re earning points on every purchase. Redeem points for coupons at checkout.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange("orders")}
                      className="shrink-0 px-5 py-2 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      Shop More
                    </button>
                  </div>
                </div>

                {/* Saved Addresses & Payment Methods (Col 8-12) */}
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
                        <span>Manage</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {addresses.slice(0, 2).map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-start gap-3 p-3 rounded-xl border border-neutral-border bg-white hover:bg-neutral-bg/40 transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary-surface/60 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            {addr.type === "home" ? <HomeIcon className="w-4 h-4" /> : <BriefcaseIcon className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-dark">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-primary-surface text-primary font-semibold text-[10px]">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-muted mt-1 leading-relaxed">
                              {addr.address}, {addr.city}
                            </p>
                            <p className="text-neutral-muted mt-0.5 font-mono text-[11px]">
                              {addr.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                    Order History
                  </h1>
                  <p className="text-xs text-neutral-muted mt-0.5">
                    View detailed receipts, tracking milestones, and re-order with 1 click.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <SearchIcon className="w-4 h-4 text-neutral-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order # or item..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-surface border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "All Orders" },
                  { id: "active", label: "In Progress" },
                  { id: "delivered", label: "Delivered" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                      orderStatusFilter === tab.id
                        ? "bg-primary text-white shadow-xs"
                        : "bg-surface border border-neutral-border text-neutral-dark hover:bg-neutral-bg"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Orders List Container */}
              {customerOrders.length === 0 ? (
                <div className="bg-surface border border-neutral-border rounded-3xl p-12 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-primary-surface/60 text-primary flex items-center justify-center mx-auto mb-4">
                    <PackageIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-neutral-dark">
                    No orders placed yet
                  </h3>
                  <p className="text-xs text-neutral-muted mt-1.5 max-w-md mx-auto leading-relaxed">
                    You haven&apos;t placed any orders yet. Discover our curated educational toys, creative developmental sets, and digital gadgets today!
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-tertiary text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102 cursor-pointer"
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>Start Shopping</span>
                    </Link>
                  </div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-surface border border-neutral-border rounded-3xl p-10 text-center shadow-xs">
                  <PackageIcon className="w-12 h-12 text-neutral-muted/40 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-base text-neutral-dark">
                    No orders match your filter
                  </h3>
                  <p className="text-xs text-neutral-muted mt-1 max-w-sm mx-auto">
                    Try switching filters or search for another order number.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-surface border border-neutral-border rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
                    >
                      {/* Order Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-border gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center shrink-0">
                            <PackageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-extrabold text-base text-neutral-dark">
                                Order #{order.id}
                              </span>
                              {order.status === "delivered" && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#e6f8ee] text-[#15803d] font-bold text-[10px]">
                                  Delivered
                                </span>
                              )}
                              {order.status === "shipped" && (
                                <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-bold text-[10px]">
                                  Shipped ({order.carrier})
                                </span>
                              )}
                              {order.status === "packed" && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-bold text-[10px]">
                                  Packed
                                </span>
                              )}
                              {order.status === "cancelled" && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#b91c1c] font-bold text-[10px]">
                                  Cancelled
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-muted mt-0.5">
                              Placed on {order.createdAt} • Delivery: {order.deliveryZone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}
                            </p>
                          </div>
                        </div>

                        {/* Order Total & Actions */}
                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                          <div className="text-right sm:mr-3">
                            <p className="text-[11px] text-neutral-muted">Total Paid / Due</p>
                            <p className="font-heading font-bold text-base text-neutral-dark">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleViewOrderDetails(order)}
                            className="px-4 py-2 bg-primary hover:bg-tertiary text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>

                          {order.status !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => handleBuyAgain(order)}
                              title="Re-order all items"
                              className="px-3.5 py-2 bg-secondary hover:bg-secondary-light text-neutral-dark text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcwIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Buy Again</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items Thumbnails Row */}
                      <div className="pt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-x-auto py-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-2.5 bg-neutral-bg/60 p-1.5 pr-3 rounded-xl border border-neutral-border/60 shrink-0">
                              <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white shrink-0 border border-neutral-border">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.productTitle}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-neutral-dark line-clamp-1 max-w-[160px]">
                                  {item.productTitle}
                                </p>
                                <p className="text-[10px] text-neutral-muted">
                                  Qty: {item.quantity} • {formatCurrency(item.unitPrice)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.trackingNumber && (
                          <Link
                            href={`/track-order?orderNumber=${order.id}`}
                            className="text-xs text-primary font-bold hover:underline shrink-0 flex items-center gap-1"
                          >
                            <TruckIcon className="w-3.5 h-3.5" />
                            <span>Live Track</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  My Saved Wishlist
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Items you have bookmarked for later.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: "w-1",
                    title: "RoboCode Companion STEM Kit",
                    category: "Digital Gadgets",
                    price: 2350,
                    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop",
                  },
                  {
                    id: "w-2",
                    title: "Montessori Pastel Wooden Blocks",
                    category: "Educational Toys",
                    price: 950,
                    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
                  },
                ].map((item) => (
                  <div key={item.id} className="bg-surface border border-neutral-border rounded-2xl p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-full aspect-square rounded-xl bg-neutral-bg border border-neutral-border overflow-hidden relative mb-3">
                        <Image src={item.image} alt={item.title} fill sizes="200px" className="object-cover" />
                      </div>
                      <p className="text-[11px] text-primary font-bold uppercase">{item.category}</p>
                      <h3 className="font-heading font-bold text-sm text-neutral-dark line-clamp-1 mt-0.5">
                        {item.title}
                      </h3>
                      <p className="font-sans font-bold text-base text-neutral-dark mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addItem(
                            {
                              productId: item.id,
                              productTitle: item.title,
                              productSlug: "robocode-companion",
                              price: item.price,
                              imageUrl: item.image,
                              quantity: 1,
                            },
                            { openDrawer: true }
                          )
                        }
                        className="flex-1 py-2 bg-primary hover:bg-tertiary text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Move to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  My Product Reviews
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Verified reviews and ratings you have shared with the Mirai Mart community.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-surface border border-neutral-border rounded-3xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={5} />
                      <span className="px-2 py-0.5 rounded-full bg-success-surface text-success text-[10px] font-bold">
                        ✓ Verified Purchase
                      </span>
                    </div>
                    <span className="text-xs text-neutral-muted">May 21, 2024</span>
                  </div>
                  <div className="pt-3">
                    <h4 className="font-heading font-bold text-sm text-neutral-dark">
                      &ldquo;Incredible build quality and my 4-year old is obsessed!&rdquo;
                    </h4>
                    <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                      Ordered the Montessori Wooden Blocks and they arrived the next day in Dhaka. Natural smooth beechwood finish with zero sharp edges.
                    </p>
                    <p className="text-[11px] text-primary font-bold mt-2">
                      Product: Montessori Pastel Wooden Building Blocks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAVED ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                    Saved Addresses
                  </h1>
                  <p className="text-xs text-neutral-muted mt-0.5">
                    Manage delivery addresses for instant 1-click checkout.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-tertiary text-white font-sans font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-surface/60 text-primary flex items-center justify-center">
                            {addr.type === "home" ? <HomeIcon className="w-4 h-4" /> : <BriefcaseIcon className="w-4 h-4" />}
                          </div>
                          <span className="font-heading font-bold text-sm text-neutral-dark">
                            {addr.label}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-bold text-[10px]">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-xs text-neutral-dark">
                        {addr.fullName}
                      </p>
                      <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                        {addr.address}, {addr.city}
                      </p>
                      <p className="text-xs text-neutral-muted mt-0.5 font-mono">
                        Phone: {addr.phone}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-neutral-muted hover:text-error flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2Icon className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT METHODS */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  Payment Methods
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Saved cards and MFS accounts for doorstep advance settlement.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 bg-[#1a1f71] text-white font-bold italic rounded text-xs">
                      VISA
                    </div>
                    <div>
                      <p className="font-bold text-xs text-neutral-dark tracking-wider">•••• 4242</p>
                      <p className="text-[11px] text-neutral-muted">Expires 12/26</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-surface text-primary font-bold text-[10px]">
                    Default
                  </span>
                </div>

                <div className="bg-surface border border-neutral-border rounded-2xl p-5 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 bg-[#E2136E] text-white font-bold rounded text-xs">
                      bKash
                    </div>
                    <div>
                      <p className="font-bold text-xs text-neutral-dark font-mono">01612-345678</p>
                      <p className="text-[11px] text-neutral-muted">Personal Account</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE INFORMATION */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  Profile Information
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Update your contact info and personal preferences.
                </p>
              </div>

              {profileSavedToast && (
                <div className="p-3.5 bg-success-surface border border-success/30 rounded-xl text-xs font-semibold text-[#15803d] flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="bg-surface border border-neutral-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg/60 border border-neutral-border rounded-xl text-neutral-muted cursor-not-allowed"
                  />
                  <p className="text-[10px] text-neutral-muted mt-1">
                    Email is linked to your InsForge Auth credentials.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    Contact Phone Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-tertiary text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: CHANGE PASSWORD */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  Change Password
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Update your account password for enhanced security.
                </p>
              </div>

              {passwordSuccessToast && (
                <div className="p-3.5 bg-success-surface border border-success/30 rounded-xl text-xs font-semibold text-[#15803d] flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="bg-surface border border-neutral-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-dark mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                    placeholder="Re-type new password"
                    className="w-full px-4 py-2.5 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-tertiary text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neutral-dark">
                  Notification Preferences
                </h1>
                <p className="text-xs text-neutral-muted mt-0.5">
                  Control where and how you receive order and delivery updates.
                </p>
              </div>

              <div className="bg-surface border border-neutral-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs max-w-2xl">
                {[
                  {
                    key: "orderSms" as const,
                    title: "Order Dispatch SMS Alerts",
                    desc: "Receive immediate SMS updates when parcel is handed over to courier.",
                  },
                  {
                    key: "orderEmail" as const,
                    title: "Invoice & Receipt Email",
                    desc: "Get digital PDF invoices and order confirmations sent to your email.",
                  },
                  {
                    key: "whatsappUpdates" as const,
                    title: "WhatsApp Delivery Tracking",
                    desc: "Receive real-time courier tracking links on WhatsApp.",
                  },
                  {
                    key: "promoOffers" as const,
                    title: "Promotional Coupons & Deals",
                    desc: "Stay notified about exclusive flash sales and coupon drops.",
                  },
                ].map((pref) => (
                  <label
                    key={pref.key}
                    className="flex items-start justify-between gap-4 p-3 rounded-2xl hover:bg-neutral-bg/60 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-heading font-bold text-sm text-neutral-dark">
                        {pref.title}
                      </p>
                      <p className="text-xs text-neutral-muted mt-0.5">
                        {pref.desc}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[pref.key]}
                      onChange={(e) =>
                        setNotifications({ ...notifications, [pref.key]: e.target.checked })
                      }
                      className="rounded text-primary focus:ring-primary h-5 w-5 mt-0.5 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-dark/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNewAddress}
            className="bg-surface border border-neutral-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
              <h3 className="font-heading font-bold text-base text-neutral-dark">
                Add New Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-neutral-muted hover:text-neutral-dark"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-dark mb-1">
                Address Label (e.g. Home, Office, Grandparents)
              </label>
              <input
                type="text"
                value={newAddressForm.label}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, label: e.target.value })}
                required
                placeholder="Home"
                className="w-full px-3.5 py-2 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-dark mb-1">
                Recipient Full Name
              </label>
              <input
                type="text"
                value={newAddressForm.fullName}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })}
                required
                placeholder="Full Name"
                className="w-full px-3.5 py-2 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-dark mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={newAddressForm.phone}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                required
                placeholder="017XX-XXXXXX"
                className="w-full px-3.5 py-2 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-dark mb-1">
                Full Street Address
              </label>
              <textarea
                value={newAddressForm.address}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                required
                rows={2}
                placeholder="House, Road, Block/Sector, Area..."
                className="w-full px-3.5 py-2 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-dark mb-1">
                City / District
              </label>
              <input
                type="text"
                value={newAddressForm.city}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                required
                placeholder="Dhaka"
                className="w-full px-3.5 py-2 text-xs bg-neutral-bg border border-neutral-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-muted hover:text-neutral-dark rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-tertiary text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Trust Strip */}
      <div className="mt-12">
        <TrustStrip />
      </div>
    </div>
  );
}
