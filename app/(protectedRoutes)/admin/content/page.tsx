import type { Metadata } from "next";
import { getAdminStorefrontContentAction } from "@/actions/admin";
import { WebsiteContentManager } from "@/components/admin/WebsiteContentManager";

export const metadata: Metadata = {
  title: "Website Content — Mirai Mart Admin",
  description: "Manage homepage hero carousel, announcement bar, and promotional highlights.",
};

export default async function AdminWebsiteContentPage() {
  const contentResult = await getAdminStorefrontContentAction();

  return <WebsiteContentManager initialContent={contentResult.content} />;
}
