"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronDown,
  LogIn,
} from "lucide-react";
import posthog from "posthog-js";
import {
  submitProductReviewAction,
  checkReviewEligibilityAction,
} from "@/actions/reviews";
import { useAuth } from "@/components/providers/AuthProvider";
import type { ProductReview, ReviewEligibility } from "@/types";

interface Props {
  productId: string;
  productSlug: string;
  productTitle: string;
  eligibility: ReviewEligibility;
  onReviewSubmitted?: (newReview: ProductReview) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Disappointing",
  2: "Needs Improvement",
  3: "Average",
  4: "Very Good",
  5: "Exceptional / Loved It!",
};

export function WriteReviewForm({
  productId,
  productSlug,
  productTitle,
  eligibility,
  onReviewSubmitted,
}: Props) {
  const {
    isAuthenticated: clientIsAuth,
    user: clientUser,
    isLoading: authLoading,
  } = useAuth();
  const [activeEligibility, setActiveEligibility] =
    useState<ReviewEligibility>(eligibility);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReview, setSubmittedReview] = useState<ProductReview | null>(
    eligibility.existingReview || null
  );

  // Reactively verify purchase eligibility whenever client auth is established or changes
  useEffect(() => {
    if (authLoading) return;

    if (clientIsAuth && clientUser?.id) {
      let isMounted = true;
      setIsCheckingEligibility(true);

      checkReviewEligibilityAction(productId, productTitle)
        .then((res) => {
          if (isMounted) {
            setActiveEligibility(res);
            if (res.existingReview) {
              setSubmittedReview(res.existingReview);
            }
          }
        })
        .catch((err) => {
          console.warn("[WriteReviewForm] Check eligibility error:", err);
        })
        .finally(() => {
          if (isMounted) setIsCheckingEligibility(false);
        });

      return () => {
        isMounted = false;
      };
    } else if (!clientIsAuth) {
      setActiveEligibility({
        isAuthenticated: false,
        hasPurchased: false,
        hasAlreadyReviewed: false,
      });
    }
  }, [
    clientIsAuth,
    clientUser?.id,
    clientUser?.email,
    productId,
    productTitle,
    authLoading,
  ]);

  // Loading state while auth is hydrating or eligibility is being verified for logged in user
  if (
    authLoading ||
    (clientIsAuth && isCheckingEligibility && !activeEligibility.isAuthenticated)
  ) {
    return (
      <div
        id="write-review-section"
        className="rounded-2xl border border-neutral-border bg-surface p-6 text-center shadow-2xs"
      >
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-muted">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Verifying purchase eligibility...</span>
        </div>
      </div>
    );
  }

  // 1. Not Authenticated: Prompt customer to sign in first to give review
  if (!clientIsAuth && !activeEligibility.isAuthenticated) {
    return (
      <div
        id="write-review-section"
        className="rounded-2xl border border-primary/25 bg-primary-surface/20 p-6 sm:p-7 text-center shadow-2xs"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xs mb-3.5">
          <Lock className="h-6 w-6" />
        </div>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary mb-2 border border-primary/20">
          Sign In Required
        </span>
        <h4 className="font-heading text-base sm:text-lg font-bold text-neutral-dark mb-1.5">
          Please Sign In First to Write a Review
        </h4>
        <p className="text-xs sm:text-sm font-sans text-neutral-muted max-w-md mx-auto mb-5 leading-relaxed">
          To maintain genuine authenticity and trust, reviews on Mirai Mart are
          reserved strictly for customers who have purchased this product.
          Please sign in to verify your purchase.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/login?redirect=/product/${encodeURIComponent(
              productSlug
            )}#reviews`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-tertiary active:scale-95 shadow-xs"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In First to Give Review</span>
          </Link>
          <Link
            href={`/register?redirect=/product/${encodeURIComponent(
              productSlug
            )}#reviews`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-bold text-neutral-dark hover:bg-neutral-bg transition-colors"
          >
            <span>Create an Account</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Authenticated but Has Not Purchased This Product: "Purchase First" Alert
  if (!activeEligibility.hasPurchased) {
    return (
      <div
        id="write-review-section"
        className="rounded-2xl border border-warning/40 bg-warning-surface p-5 sm:p-6 shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning text-white shadow-xs mt-0.5">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-heading text-sm sm:text-base font-bold text-neutral-dark">
                  Purchase This Item First to Leave a Review
                </span>
                <span className="rounded-full bg-warning-light px-2.5 py-0.5 text-[10px] font-bold text-warning-foreground border border-warning/30">
                  Purchase Required
                </span>
              </div>
              <p className="text-xs sm:text-sm font-sans text-neutral-muted max-w-xl leading-relaxed">
                You haven&apos;t purchased{" "}
                <strong className="text-neutral-dark">
                  &ldquo;{productTitle}&rdquo;
                </strong>{" "}
                with this account yet. Only customers who have ordered and
                received this item can share a review. Once you place an order,
                you can return here to leave your verified feedback!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-tertiary transition-colors shadow-xs cursor-pointer active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Purchase Now</span>
            </button>
            <Link
              href="/account?tab=orders"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-border bg-surface px-3.5 py-2 text-xs font-bold text-neutral-dark hover:bg-neutral-bg transition-colors"
            >
              <span>Check My Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. User Already Submitted a Review
  if (submittedReview || activeEligibility.hasAlreadyReviewed) {
    const activeExisting = submittedReview || activeEligibility.existingReview;
    return (
      <div className="rounded-xl border border-success/30 bg-success-light/30 p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-white mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading text-sm sm:text-base font-bold text-neutral-dark">
                Thank you for your verified review!
              </span>
              <span className="rounded-full bg-success-light px-2.5 py-0.5 text-[10px] font-bold text-success border border-success/20">
                Verified Buyer
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans text-neutral-dark/80 mb-3">
              Your feedback is live and helps other parents and families make
              confident, educated choices.
            </p>

            {activeExisting && (
              <div className="rounded-lg border border-neutral-border/60 bg-surface p-3.5 text-xs font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < activeExisting.rating
                            ? "fill-secondary text-secondary"
                            : "text-neutral-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-neutral-dark">
                    {activeExisting.title}
                  </span>
                </div>
                <p className="text-neutral-muted italic line-clamp-2">
                  "{activeExisting.comment}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated & Verified Buyer — Allowed to Write Review
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || title.trim().length < 3) {
      setErrorMessage("Please enter a headline with at least 3 characters.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMessage(
        "Please provide more detail in your review (minimum 10 characters)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitProductReviewAction({
        productId,
        productSlug,
        productTitle,
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      if (!res.success || !res.review) {
        setErrorMessage(
          res.error || "Failed to submit review. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      try {
        posthog.capture("review_submitted", {
          productId,
          productSlug,
          rating,
          isVerified: true,
        });
      } catch (err) {
        console.warn("[PostHog] review_submitted error:", err);
      }

      setSubmittedReview(res.review);
      if (onReviewSubmitted) {
        onReviewSubmitted(res.review);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-surface shadow-2xs overflow-hidden transition-all">
      {/* Toggle Bar / Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 cursor-pointer bg-primary-surface/30 hover:bg-primary-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading text-sm sm:text-base font-bold text-neutral-dark">
                Write a Verified Review
              </h4>
              <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success border border-success/30">
                Verified Buyer
              </span>
            </div>
            <p className="text-xs text-neutral-muted">
              Logged in as{" "}
              <strong className="text-neutral-dark">
                {activeEligibility.customerName ||
                  clientUser?.email?.split("@")[0] ||
                  "Valued Customer"}
              </strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-border bg-surface px-3 py-1.5 text-xs font-bold text-neutral-dark hover:border-primary transition-all"
        >
          <span>{isOpen ? "Close" : "Review Product"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expandable Form Body */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 border-t border-neutral-border">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 p-3 text-xs font-bold text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-neutral-dark uppercase tracking-wider mb-2">
              Your Overall Rating *
            </label>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const activeStar = (hoverRating ?? rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      className="p-1 text-secondary transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`Rate ${starVal} out of 5 stars`}
                    >
                      <Star
                        className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors ${
                          activeStar
                            ? "fill-secondary text-secondary"
                            : "text-neutral-border"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs sm:text-sm font-bold text-primary">
                {RATING_LABELS[hoverRating ?? rating]}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label
              htmlFor="review-title"
              className="block text-xs font-bold text-neutral-dark uppercase tracking-wider mb-1.5"
            >
              Review Headline *
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional quality and very engaging for my toddler!"
              maxLength={150}
              required
              className="w-full rounded-xl border border-neutral-border bg-neutral-bg/30 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
          </div>

          {/* Review Commentary */}
          <div>
            <label
              htmlFor="review-comment"
              className="block text-xs font-bold text-neutral-dark uppercase tracking-wider mb-1.5"
            >
              Detailed Experience *
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you and your family love most about this product? How is the build quality, feel, and durability?"
              maxLength={2000}
              required
              className="w-full rounded-xl border border-neutral-border bg-neutral-bg/30 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-dark placeholder:text-neutral-muted focus:border-primary focus:bg-surface focus:outline-none transition-all"
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-neutral-muted">
              <span>Minimum 10 characters</span>
              <span>{comment.length} / 2000</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-neutral-border bg-surface px-4 py-2.5 text-xs font-bold text-neutral-dark hover:bg-neutral-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-primary-light active:scale-95 disabled:opacity-60 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Review...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish Verified Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
