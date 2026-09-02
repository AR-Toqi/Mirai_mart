"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Sparkles,
  Package,
  Star,
  ThumbsUp,
  Award,
  FileText,
  MessageSquareQuote,
} from "lucide-react";
import { RatingStars } from "@/components/shared/RatingStars";
import { WriteReviewForm } from "./WriteReviewForm";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import type { Product, ProductReview, ReviewEligibility } from "@/types";

type TabKey = "description" | "reviews";

type Props = {
  product: Product;
  reviews?: ProductReview[];
  eligibility?: ReviewEligibility;
};

export function PDPTabs({
  product,
  reviews = MOCK_REVIEWS,
  eligibility = {
    isAuthenticated: false,
    hasPurchased: false,
    hasAlreadyReviewed: false,
  },
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  useEffect(() => {
    function handleHash() {
      if (typeof window !== "undefined" && window.location.hash === "#reviews") {
        setActiveTab("reviews");
      }
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  const [reviewList, setReviewList] = useState<ProductReview[]>(reviews);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  function handleVoteHelpful(reviewId: string, current: number) {
    if (helpfulVotes[reviewId] !== undefined) return;
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: current + 1 }));
  }

  function handleReviewSubmitted(newReview: ProductReview) {
    setReviewList((prev) => [newReview, ...prev]);
  }

  // Calculate live dynamic rating breakdown distribution
  const totalReviews = reviewList.length;
  const averageRating =
    totalReviews > 0
      ? reviewList.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : product.rating;

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviewList.filter((r) => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div id="reviews" className="rounded-2xl border border-neutral-border bg-surface shadow-xs overflow-hidden">
      {/* Tab Navigation Strip - Only Product Description & Customer Reviews */}
      <div className="flex border-b border-neutral-border overflow-x-auto scrollbar-none bg-neutral-bg/60">
        {[
          { id: "description", label: "Product Description", icon: FileText },
          {
            id: "reviews",
            label: `Customer Reviews (${totalReviews})`,
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
              className={`flex items-center gap-2 whitespace-nowrap px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 ${
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
        {/* 1. Product Description Tab */}
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

            {/* Key Features & Highlights */}
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

            {/* Product Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-2">
                <h4 className="font-heading text-sm font-bold text-neutral-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Product Specifications
                </h4>
                <div className="divide-y divide-neutral-border rounded-xl border border-neutral-border overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm ${
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
              </div>
            )}
          </div>
        )}

        {/* 2. Customer Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-8">
            {/* Purchase Verification & Review Submission Box */}
            <WriteReviewForm
              productId={product.id}
              productSlug={product.slug}
              productTitle={product.title}
              eligibility={eligibility}
              onReviewSubmitted={handleReviewSubmitted}
            />

            {/* Rating Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-neutral-border bg-neutral-bg/40 p-6">
              {/* Overall Rating Score */}
              <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-border pb-6 md:pb-0 md:pr-6 text-center">
                <span className="font-heading text-4xl sm:text-5xl font-extrabold text-neutral-dark">
                  {averageRating.toFixed(1)}
                </span>
                <div className="my-2">
                  <RatingStars rating={averageRating} />
                </div>
                <span className="text-xs font-semibold text-neutral-muted">
                  Based on {totalReviews} verified {totalReviews === 1 ? "review" : "reviews"}
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
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-base font-bold text-neutral-dark">
                  Verified Customer Testimonials
                </h4>
                <span className="text-xs font-semibold text-neutral-muted">
                  Showing {reviewList.length} verified experiences
                </span>
              </div>

              {reviewList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-border p-8 text-center bg-neutral-bg/30">
                  <MessageSquareQuote className="h-8 w-8 text-neutral-muted mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-dark">No reviews yet</p>
                  <p className="text-xs text-neutral-muted mt-1 max-w-sm mx-auto">
                    Be the first verified customer to share your thoughts on {product.title}.
                  </p>
                </div>
              ) : (
                reviewList.map((rev) => {
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
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
