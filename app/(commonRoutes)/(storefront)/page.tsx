import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryCircles } from "@/components/storefront/CategoryCircles";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { PromoBanner } from "@/components/storefront/PromoBanner";
import { TopPicks } from "@/components/storefront/TopPicks";
import { BrandStrip } from "@/components/storefront/BrandStrip";
import { NewsletterBanner } from "@/components/storefront/NewsletterBanner";
import { getAdminStorefrontContentAction } from "@/actions/admin";

/**
 * ISR: Homepage is pre-rendered and revalidated every 30 minutes,
 * or on-demand when marketing banners / products are mutated.
 */
export const revalidate = 1800;

export default async function HomePage() {
  const contentRes = await getAdminStorefrontContentAction();
  const heroContent = contentRes?.content?.hero;

  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14 lg:space-y-16">
      {/* Hero Section */}
      <HeroBanner content={heroContent} />

      {/* 8-Circle Category Grid */}
      <CategoryCircles />

      {/* 4-Card Trust Value Strip */}
      <TrustStrip />

      {/* Featured Products Rail (5 Products) */}
      <FeaturedProducts />

      {/* Summer Fun Promotional Banner */}
      <PromoBanner />

      {/* Top Picks for You (5 Products) */}
      <TopPicks />

      {/* Brand Authenticity Strip */}
      <BrandStrip />

      {/* Newsletter Subscription Banner */}
      <NewsletterBanner />
    </main>
  );
}
