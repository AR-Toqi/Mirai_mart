import type { Metadata } from "next";
import { AdminSectionPlaceholder } from "@/components/admin/AdminSectionPlaceholder";

export const metadata: Metadata = {
  title: "Order Fulfillment — Mirai Mart Admin",
};

export default function AdminOrdersPage() {
  return (
    <AdminSectionPlaceholder
      title="Order Fulfillment & RMA Management"
      description="Track customer orders, assign carrier tracking numbers, and process customer returns."
      featurePhase="Phase 5 — Feature 14"
      upcomingFeatures={[
        "Fulfillment queue with multi-status filtering (Pending, Shipped, Delivered, Refunded)",
        "Carrier assignment (FedEx, DHL, USPS, Pathao, Steadfast)",
        "Printable packing slip & customer invoice generator",
        "1-click refund & inventory restock handlers",
      ]}
    />
  );
}
