import type { Metadata } from "next";
import { CheckoutClient } from "@/components/storefront/CheckoutClient";

export const metadata: Metadata = {
  title: "Secure Checkout | Mirai Mart",
  description:
    "Complete your order with cash on delivery and mobile banking verification. Fast delivery across Bangladesh.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] bg-neutral-bg">
      <CheckoutClient />
    </main>
  );
}
