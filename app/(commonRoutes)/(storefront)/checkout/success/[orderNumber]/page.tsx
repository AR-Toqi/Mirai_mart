import type { Metadata } from "next";
import { getOrderDetailsAction } from "@/actions/orders";
import { OrderSuccessClient } from "@/components/storefront/OrderSuccessClient";

interface SuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: SuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed ${orderNumber} | Mirai Mart`,
    description: `Thank you for your order ${orderNumber}. Your delivery is being processed.`,
  };
}

export default async function OrderSuccessPage({ params }: SuccessPageProps) {
  const { orderNumber } = await params;
  const result = await getOrderDetailsAction(orderNumber);

  return (
    <main className="min-h-[calc(100vh-200px)] bg-neutral-bg">
      <OrderSuccessClient
        orderNumber={orderNumber}
        orderData={result.success && result.order ? result.order : null}
      />
    </main>
  );
}
