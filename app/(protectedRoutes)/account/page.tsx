import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountDashboardClient } from "@/components/account/AccountDashboardClient";
import { createInsforgeServer } from "@/lib/insforge-server";
import { mapOrderRecordToCustomerOrder } from "@/lib/mappers/order.mapper";
import type { CustomerOrder } from "@/components/account/OrderDetailModal";

export const metadata: Metadata = {
  title: "My Account — Mirai Mart",
  description: "Manage your profile, view orders, and track shipments on Mirai Mart.",
};

export default async function AccountPage() {
  let initialOrders: CustomerOrder[] = [];

  try {
    const insforge = await createInsforgeServer();
    const { data: authData } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    if (user?.id || user?.email) {
      let query = insforge.database
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });

      if (user.id && user.email) {
        query = query.or(`user_id.eq.${user.id},customer_email.eq.${user.email}`);
      } else if (user.id) {
        query = query.eq("user_id", user.id);
      } else if (user.email) {
        query = query.eq("customer_email", user.email);
      }

      const { data: dbOrders, error } = await query;

      if (!error && dbOrders && dbOrders.length > 0) {
        initialOrders = dbOrders.map((d: any) => mapOrderRecordToCustomerOrder(d));
      }
    }
  } catch (err) {
    console.warn("[AccountPage] Error fetching user orders from InsForge:", err);
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-neutral-muted">
          Loading account...
        </div>
      }
    >
      <AccountDashboardClient initialOrders={initialOrders} />
    </Suspense>
  );
}
