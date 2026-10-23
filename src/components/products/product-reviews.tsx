"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitReview, ProductReviewSummary } from "@/lib/actions/reviews";
import {
  Star,
  ShieldCheck,
  Plus,
  MessageSquare,
  CheckCircle2,
  X,
  Loader2,
  Filter,
} from "lucide-react";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  reviewSummary: ProductReviewSummary;
  isLoggedIn: boolean;
}

export function ProductReviews({
  productId,
  productName,
  reviewSummary,
  isLoggedIn,
}: ProductReviewsProps) {
  const [reviewsList, setReviewsList] = useState(reviewSummary.reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number | "ALL">("ALL");

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const filteredReviews = reviewsList.filter((r) => {
    if (selectedFilter === "ALL") return true;
    return r.rating === selectedFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim() || !comment.trim()) {
      setFormError("Please fill in both the title and review message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitReview({
        productId,
        rating,
        title,
        comment,
      });

      if (!res.success) {
        setFormError(res.error || "Failed to submit review.");
        setIsSubmitting(false);
        return;
      }

      setFormSuccess(res.message || "Thank you! Your review has been submitted for editorial moderation.");
      setTitle("");
      setComment("");
      setRating(5);
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess(null);
      }, 2500);
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = reviewSummary.totalReviews;

  return (
    <div className="space-y-8 pt-4">
      {/* Top Ratings Overview & Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Average Score */}
        <div className="md:col-span-5 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-border/80 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-5xl font-bold text-foreground">
              {reviewSummary.averageRating}
            </span>
            <span className="text-muted-foreground text-sm font-medium">/ 5.0</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${
                  idx < Math.round(reviewSummary.averageRating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Based on {total} authentic customer {total === 1 ? "review" : "reviews"}
          </p>

          <div className="pt-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Write a Review
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all"
              >
                Sign in to Review
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Star Distribution Bars */}
        <div className="md:col-span-7 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviewSummary.distribution[stars as keyof typeof reviewSummary.distribution] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                  {stars} <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground font-mono text-[11px] shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground">
          Community Feedback ({filteredReviews.length})
        </h3>
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter("ALL")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === "ALL"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedFilter(star)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                selectedFilter === star
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed border-border text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No reviews yet for this filter</p>
            <p className="text-xs text-muted-foreground">
              Be the first to share your thoughts on this handcrafted creation.
            </p>
          </div>
        ) : (
          filteredReviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < r.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    {r.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">{r.title}</h4>
                </div>

                <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{r.comment}</p>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{r.authorName}</span>
                <span>Nestora Atelier Collector</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 z-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Write a Review</h3>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-foreground text-sm">{formSuccess}</h4>
                <p className="text-xs text-muted-foreground">Closing window in a moment...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                    {formError}
                  </div>
                )}

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-foreground ml-2">
                      {hoverRating || rating}.0 Stars
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Review Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sublime tactile quality and serene form"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Detailed Impression <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the craftsmanship, material finish, daily usage, and packaging..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    To preserve curated authenticity, reviews are verified by the NESTORA atelier team before appearing publicly.
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
