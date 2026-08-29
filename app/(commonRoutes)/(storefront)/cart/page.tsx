import type { Metadata } from "next";
import { CartPageClient } from "@/components/storefront/CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Bag | Mirai Mart",
  description:
    "Review your selected educational toys, creative gift combos, and smart gadgets. Enjoy fast delivery across Bangladesh.",
};

export default function CartPage() {
  return (
    <main className="min-h-[calc(100vh-200px)] bg-neutral-bg">
      <CartPageClient />
    </main>
  );
}
