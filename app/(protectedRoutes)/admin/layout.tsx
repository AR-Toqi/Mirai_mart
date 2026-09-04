import React from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopBar } from "@/components/layout/AdminTopBar";

export const metadata: Metadata = {
  title: "Admin Portal — Mirai Mart",
  description: "Mirai Mart e-commerce management, inventory, orders, and content control.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-neutral-bg font-sans antialiased text-neutral-dark">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <AdminTopBar />

        {/* Page Content View */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* Admin Clean Footer */}
        <footer className="px-8 py-5 border-t border-neutral-border bg-surface text-xs text-neutral-muted flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2024 Mirai Mart Admin. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-rose-500">❤️</span> for your business
          </p>
        </footer>
      </div>
    </div>
  );
}
