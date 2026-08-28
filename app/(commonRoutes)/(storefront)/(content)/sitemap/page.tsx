import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";
import { NAV_DEPARTMENTS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Sitemap | Mirai Mart",
  description: "Every page on Mirai Mart in one place.",
};

const groups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/category/all" },
      ...NAV_DEPARTMENTS.map((department) => ({
        label: department.name,
        href: department.href,
      })),
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Your Order", href: "/track-order" },
    ],
  },
  {
    title: "About Mirai Mart",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <StaticPageLayout title="Sitemap" lead="Every page on Mirai Mart in one place.">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="font-heading text-lg font-semibold text-neutral-dark">
              {group.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-muted">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </StaticPageLayout>
  );
}
