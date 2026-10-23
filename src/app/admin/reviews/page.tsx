import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { reviews, products, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ReviewsView } from "@/components/admin/reviews-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Review Moderation Queue | NESTORA Admin",
  description: "Moderate customer product reviews, verify authentic buyers, and maintain community trust.",
};

export default async function AdminReviewsPage() {
  // 1. Strictly enforce Admin role
  await requireAdmin("/admin/reviews");

  // 2. Fetch all reviews joined with product and author info
  const allReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      isVerifiedPurchase: reviews.isVerifiedPurchase,
      status: reviews.status,
      adminNote: reviews.adminNote,
      createdAt: reviews.createdAt,
      productName: products.name,
      productSlug: products.slug,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .innerJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ReviewsView reviews={allReviews} />
    </div>
  );
}
