"use client";

import React, { useState } from "react";
import { ReviewsTable, AdminReviewRow } from "@/components/admin/reviews-table";
import { MessageSquare, CheckCircle2, Clock, XCircle, Star } from "lucide-react";

interface ReviewsViewProps {
  reviews: AdminReviewRow[];
}

export function ReviewsView({ reviews: initialReviews }: ReviewsViewProps) {
  const [reviews] = useState(initialReviews);

  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = reviews.filter((r) => r.status === "REJECTED").length;

  const averageRating =
    approvedCount > 0
      ? (
          reviews
            .filter((r) => r.status === "APPROVED")
            .reduce((sum, r) => sum + r.rating, 0) / approvedCount
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
              Community & Social Proof
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
            Review Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit customer ratings, verify genuine purchasers, and approve reviews for public storefront display.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Reviews
            </span>
            <MessageSquare className="w-4 h-4 text-muted-foreground/60" />
          </div>
          <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
          <p className="text-[11px] text-muted-foreground">Lifetime submissions</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Needs Review
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          <p className="text-[11px] text-muted-foreground">Pending moderation queue</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Approved & Live
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
          <p className="text-[11px] text-muted-foreground">Visible on storefront PDP</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Avg. Store Rating
            </span>
            <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{averageRating} ★</p>
          <p className="text-[11px] text-muted-foreground">Across approved reviews</p>
        </div>
      </div>

      {/* Main Reviews Table */}
      <ReviewsTable reviews={reviews} />
    </div>
  );
}
