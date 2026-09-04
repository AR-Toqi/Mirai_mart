import React from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { CategoryNavBar } from "@/components/layout/CategoryNavBar";
import { Footer } from "@/components/layout/Footer";
import { getAdminStorefrontContentAction } from "@/actions/admin";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRes = await getAdminStorefrontContentAction();
  const announcement = contentRes?.content?.announcement;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg">
      {/* 1. Storefront Announcement Bar */}
      <AnnouncementBar announcement={announcement} />

      {/* 2. Main Storefront Header */}
      <Header />

      {/* 3. Category Navigation Bar */}
      <CategoryNavBar />

      {/* 4. Customer Account Page Content */}
      <div className="flex-1">{children}</div>

      {/* 5. Storefront Footer */}
      <Footer />
    </div>
  );
}
