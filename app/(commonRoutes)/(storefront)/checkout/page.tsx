import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/storefront/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Mirai Mart",
  description:
    "Confirm your delivery details and place your order for educational toys, gift combos, and smart gadgets with fast delivery across Bangladesh.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] bg-neutral-bg">
      <CheckoutPageClient />
    </main>
  );
}
