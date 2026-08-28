"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Package,
  Ruler,
  Star,
  Clock,
  MapPin,
  ThumbsUp,
  Award,
} from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { MOCK_REVIEWS, type ProductReview } from "@/lib/mock-data";
import type { Product } from "@/types";

type TabKey = "description" | "specs" | "safety" | "shipping" | "reviews";

type Props = {
  product: Product;
  reviews?: ProductReview[];
};

export function PDPTabs({ product, reviews = MOCK_REVIEWS }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  function handleVoteHelpful(reviewId: string, current: number) {
    if (helpfulVotes[reviewId] !== undefined) return;
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: current + 1 }));
  }

  // Calculate rating breakdown distribution
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div id="reviews" className="rounded-2xl border border-neutral-border bg-surface shadow-xs overflow-hidden">
      {/* Tab Navigation Strip */}
      <div className="flex border-b border-neutral-border overflow-x-auto scrollbar-none bg-neutral-bg/60">
        {[
          { id: "description", label: "Description & Highlights", icon: Sparkles },
          { id: "specs", label: "Tech Specs & Dimensions", icon: Ruler },
          { id: "safety", label: "Safety & Certifications", icon: ShieldCheck },
          { id: "shipping", label: "Delivery & Returns", icon: Truck },
          {
            id: "reviews",
            label: `Customer Reviews (${product.reviewCount})`,
            icon: Star,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 sm:px-6 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                isActive
                  ? "border-primary bg-surface text-primary"
                  : "border-transparent text-neutral-muted hover:text-neutral-dark hover:bg-surface/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-neutral-muted"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="p-6 sm:p-8">
        {/* 1. Description Tab */}
        {activeTab === "description" && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark mb-3">
                About {product.title}
              </h3>
              <p className="text-sm font-sans text-neutral-dark/85 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="rounded-xl border border-neutral-border bg-neutral-bg/40 p-5">
                <h4 className="font-heading text-sm font-bold text-neutral-dark uppercase tracking-wider mb-3.5 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Key Highlights & Developmental Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-sans text-neutral-dark">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's In The Box */}
            {product.inBoxItems && product.inBoxItems.length > 0 && (
              <div>
                <h4 className="font-heading text-sm font-bold text-neutral-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-tertiary" />
                  What's In The Box
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.inBoxItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-lg border border-neutral-border bg-surface p-3 text-xs font-medium text-neutral-dark shadow-2xs"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-surface text-[10px] font-bold text-primary">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Specs Tab */}
        {activeTab === "specs" && (
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark mb-4">
              Detailed Specifications
            </h3>
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className="divide-y divide-neutral-border rounded-xl border border-neutral-border overflow-hidden">
                {Object.entries(product.specs).map(([key, value], index) => (
                  <div
                    key={key}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm ${
                      index % 2 === 0 ? "bg-surface" : "bg-neutral-bg/40"
                    }`}
                  >
                    <span className="font-bold text-neutral-dark sm:col-span-1">
                      {key}
                    </span>
                    <span className="text-neutral-muted sm:col-span-2 font-sans">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-muted">
                Specifications for this product are verified upon batch production.
              </p>
            )}
          </div>
        )}

        {/* 3. Safety Tab */}
        {activeTab === "safety" && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark mb-2">
                Child Safety, Quality & Lab Certifications
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-muted">
                At Mirai Mart, every product undergoes rigorous toxicological and mechanical safety audits before being curated.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.safetyCertifications && product.safetyCertifications.length > 0 ? (
                product.safetyCertifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-surface p-4"
                  >
                    <ShieldCheck className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-dark">{cert}</h4>
                      <p className="text-[11px] text-neutral-muted mt-0.5">
                        Independently verified non-hazardous to oral contact, skin, and eyes.
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success-surface p-4 col-span-2">
                  <ShieldCheck className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-dark">100% Non-Toxic & Child-Safe Standards</h4>
                    <p className="text-[11px] text-neutral-muted mt-0.5">
                      Complies with international EN71 and ASTM safety requirements.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Age Suitability Advisory */}
            <div className="rounded-xl border border-primary/20 bg-primary-surface/20 p-4">
              <h4 className="text-xs font-bold text-tertiary mb-1">
                Recommended Age Advisory: {product.ageRange ? `${product.ageRange} Years` : "All Ages"}
              </h4>
              <p className="text-[11px] text-neutral-muted leading-relaxed">
                Designed to stimulate cognitive growth and sensory exploration without fine small-part choking hazards when used in accordance with parent guidelines.
              </p>
            </div>
          </div>
        )}

        {/* 4. Shipping Tab */}
        {activeTab === "shipping" && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-dark mb-2">
                Fast Nationwide Delivery & 30-Day Guarantee
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-muted">
                Orders placed before 2:00 PM are dispatched on the same business day from our central Dhaka hub.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-border bg-surface p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                  <MapPin className="h-4 w-4" />
                  Inside Dhaka City
                </div>
                <div className="text-base font-bold text-neutral-dark">24–48 Hours</div>
                <div className="text-xs text-neutral-muted mt-1">Delivery Charge: ৳ 60</div>
              </div>

              <div className="rounded-xl border border-neutral-border bg-surface p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-primary font-bold text-xs mb-2">
                  <Truck className="h-4 w-4" />
                  Outside Dhaka
                </div>
                <div className="text-base font-bold text-neutral-dark">2–4 Business Days</div>
                <div className="text-xs text-neutral-muted mt-1">Delivery Charge: ৳ 120</div>
              </div>

              <div className="rounded-xl border border-success/30 bg-success-surface p-4 shadow-2xs">
                <div className="flex items-center gap-2 text-success font-bold text-xs mb-2">
                  <RotateCcw className="h-4 w-4" />
                  Hassle-Free Returns
                </div>
                <div className="text-base font-bold text-neutral-dark">30 Days Return</div>
                <div className="text-xs text-neutral-muted mt-1">Instant replacement or full refund</div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-border bg-neutral-bg p-4 text-xs text-neutral-muted space-y-1.5">
              <p className="font-bold text-neutral-dark">
                🚚 Free Delivery on Orders Over ৳ 999
              </p>
              <p>
                We accept Cash on Delivery (COD), bKash, Nagad, and all major cards. Inspect your parcel at your doorstep upon delivery.
              </p>
            </div>
          </div>
        )}

        {/* 5. Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-8">
            {/* Rating Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-neutral-border bg-neutral-bg/40 p-6">
              {/* Overall Rating Score */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-border pb-6 md:pb-0 md:pr-6 text-center">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-neutral-dark">
                  {product.rating.toFixed(1)}
                </span>
                <div className="my-2">
                  <RatingStars rating={product.rating} />
                </div>
                <span className="text-xs font-semibold text-neutral-muted">
                  Based on {product.reviewCount} verified reviews
                </span>
              </div>

              {/* Star Distribution Bars */}
              <div className="md:col-span-2 flex flex-col justify-center gap-2">
                {ratingCounts.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-neutral-dark font-medium">
                      {item.stars} Stars
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-neutral-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-secondary transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-neutral-muted">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-4">
              <h4 className="font-heading text-base font-bold text-neutral-dark">
                Verified Customer Testimonials
              </h4>

              {reviews.map((rev) => {
                const votedCount = helpfulVotes[rev.id] ?? rev.helpfulCount;
                return (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-neutral-border bg-surface p-5 shadow-2xs transition-all hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans text-sm font-bold text-neutral-dark">
                            {rev.author}
                          </span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-muted">
                          <RatingStars rating={rev.rating} />
                          <span>•</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    <h5 className="font-sans text-sm font-bold text-neutral-dark mt-3 mb-1.5">
                      {rev.title}
                    </h5>
                    <p className="text-xs sm:text-sm font-sans text-neutral-dark/85 leading-relaxed">
                      {rev.comment}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-neutral-border/60 pt-3 text-xs text-neutral-muted">
                      <button
                        type="button"
                        onClick={() => handleVoteHelpful(rev.id, rev.helpfulCount)}
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-muted transition-colors hover:text-primary active:scale-95"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Helpful ({votedCount})</span>
                      </button>
                      <span className="text-[11px]">Mirai Mart Verified Review</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
