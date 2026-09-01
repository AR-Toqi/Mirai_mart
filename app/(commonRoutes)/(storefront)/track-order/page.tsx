import type { Metadata } from "next";
import { TrackOrderClient } from "@/components/storefront/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Mirai Mart",
  description:
    "Check real-time fulfillment and courier delivery status for your Mirai Mart orders with your Order ID.",
};

interface TrackOrderPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const resolvedParams = await searchParams;
  const initialOrderNumber = resolvedParams?.order || "";

  return (
    <main className="min-h-[calc(100vh-200px)] bg-neutral-bg">
      <TrackOrderClient initialOrderNumber={initialOrderNumber} />
    </main>
  );
}
