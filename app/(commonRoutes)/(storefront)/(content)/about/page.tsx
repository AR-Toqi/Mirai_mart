import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";

export const metadata: Metadata = {
  title: "About Us | Mirai Mart",
  description:
    "Mirai Mart curates educational toys, creative gifts, home decor, and gadgets.",
};

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Mirai Mart"
      lead="Bringing joy, learning, and innovation to every home."
    >
      <div className="space-y-4 text-sm leading-relaxed text-neutral-muted">
        <p>
          Mirai Mart is a curated store for educational toys, creative gifts,
          modern home decor, and digital gadgets.
        </p>
        <p>
          We pick each product with care. We want families to find safe,
          thoughtful items by age, occasion, and interest.
        </p>
        <p>
          Every order ships with the same goal: to bring a little more joy and
          discovery to your home.
        </p>
      </div>
    </StaticPageLayout>
  );
}
