import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { CategoryNavBar } from "@/components/layout/CategoryNavBar";
import { Footer } from "@/components/layout/Footer";

import { HeroBanner } from "@/components/storefront/HeroBanner";
import { CategoryCircles } from "@/components/storefront/CategoryCircles";
import { TrustStrip } from "@/components/storefront/TrustStrip";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { PromoBanner } from "@/components/storefront/PromoBanner";
import { TopPicks } from "@/components/storefront/TopPicks";
import { BrandStrip } from "@/components/storefront/BrandStrip";
import { NewsletterBanner } from "@/components/storefront/NewsletterBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC]">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Sticky Header */}
      <Header />

      {/* 3. Category Navigation Bar */}
      <CategoryNavBar />

      {/* 4. Main Storefront Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14 lg:space-y-16">
        {/* Hero Section */}
        <HeroBanner />

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

      {/* 5. Storefront Footer */}
      <Footer />
    </div>
  );
}
