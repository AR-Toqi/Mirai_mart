import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/storefront/StaticPageLayout";

export const metadata: Metadata = {
  title: "Our Story | Mirai Mart",
  description: "Why Mirai Mart curates products that help families play and learn.",
};

export default function StoryPage() {
  return (
    <StaticPageLayout
      title="Our Story"
      lead="Why we build a store around play, learning, and discovery."
    >
      <div className="space-y-4 text-sm leading-relaxed text-neutral-muted">
        <p>
          Mirai Mart began with a simple idea: shopping for a thoughtful gift
          should feel easy and joyful.
        </p>
        <p>
          We saw that great products were often hard to find. So we set out to
          curate items that help children learn and homes feel brighter.
        </p>
        <p>
          Today we keep that focus. We choose products we would give to our own
          families, and we share why we love each one.
        </p>
      </div>
    </StaticPageLayout>
  );
}
