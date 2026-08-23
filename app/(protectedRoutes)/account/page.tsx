import type { Metadata } from "next";
import { AccountDashboardClient } from "@/components/account/AccountDashboardClient";

export const metadata: Metadata = {
  title: "My Account — Mirai Mart",
  description: "Manage your profile, view orders, and track shipments on Mirai Mart.",
};

export default function AccountPage() {
  return <AccountDashboardClient />;
}
