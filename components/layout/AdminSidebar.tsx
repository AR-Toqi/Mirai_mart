"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Tag,
  LayoutTemplate,
  Settings,
  Store,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Promo Codes",
    href: "/admin/promos",
    icon: Tag,
  },
  {
    label: "Website Content",
    href: "/admin/content",
    icon: LayoutTemplate,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (err) {
      console.error("[AdminSidebar] SignOut Error:", err);
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-surface border-r border-neutral-border flex flex-col justify-between shrink-0 min-h-screen sticky top-0 font-sans z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center border-b border-neutral-border/50">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/mirai-mart_logo.png"
              alt="Mirai Mart Admin"
              width={140}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin" || pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                    : "text-neutral-muted hover:text-neutral-dark hover:bg-neutral-bg"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary" : "text-neutral-muted"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-surface text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Visit Store & Sign Out */}
      <div className="p-4 border-t border-neutral-border/60 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-neutral-dark font-medium hover:bg-neutral-bg transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Store className="w-4 h-4 text-primary" />
            <span>Visit Store</span>
          </div>
          <ExternalLink className="w-4 h-4 text-neutral-muted group-hover:text-primary transition-colors" />
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-surface transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 text-error" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
