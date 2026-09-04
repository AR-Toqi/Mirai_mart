import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Promo Codes — Mirai Mart Admin",
};

export default function AdminPromosPage() {
  return (
    <AdminSectionPlaceholder
      title="Promotions & Coupon Codes CMS"
      description="Create percentage or fixed-amount discounts, free shipping coupons, and usage caps."
      featurePhase="Phase 5 — Feature 15"
      upcomingFeatures={[
        "Coupon code creation (percentage, fixed discount, free shipping)",
        "Minimum order subtotal threshold rules",
        "Usage cap limits and redemption tracking",
        "Expiration dates and active status toggling",
      ]}
    />
  );
}
