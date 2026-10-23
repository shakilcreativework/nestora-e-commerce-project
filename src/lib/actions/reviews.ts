"use server";

import { db } from "@/lib/db";
import { reviews, orders, orderItems, users, products } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const submitReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  comment: z.string().min(10, "Review must be at least 10 characters").max(2000, "Review is too long"),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

export async function submitReview(rawInput: SubmitReviewInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Please sign in to share your artisan review." };
    }

    const validation = submitReviewSchema.safeParse(rawInput);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Invalid review submission" };
    }

    const data = validation.data;

    // 1. Check if user already reviewed this product
    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.productId, data.productId), eq(reviews.userId, user.id)))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "You have already submitted a review for this product." };
    }

    // 2. Check if verified purchase (Order exists for this user containing this product)
    const verifiedOrder = await db
      .select({ id: orders.id })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(and(eq(orders.userId, user.id), eq(orderItems.productId, data.productId)))
      .limit(1);

    const isVerifiedPurchase = verifiedOrder.length > 0;

    // 3. Insert review as PENDING for editorial moderation
    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: data.productId,
        userId: user.id,
        rating: data.rating,
        title: data.title.trim(),
        comment: data.comment.trim(),
        isVerifiedPurchase,
        status: "PENDING", // Moderation rule: Admin must approve
      })
      .returning();

    // 4. Fetch product slug for revalidation
    const [product] = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.id, data.productId))
      .limit(1);

    if (product) {
      revalidatePath(`/product/${product.slug}`);
    }
    revalidatePath("/admin/reviews");
    revalidatePath("/admin");

    return {
      success: true,
      review: newReview,
      message: "Your review has been submitted and will appear once verified by our team.",
    };
  } catch (err) {
    console.error("Error submitting review:", err);
    return { success: false, error: "Failed to submit your review. Please try again." };
  }
}

export interface ProductReviewSummary {
  reviews: {
    id: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: Date;
    authorName: string;
  }[];
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export async function getProductReviews(productId: string): Promise<ProductReviewSummary> {
  try {
    const approvedReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        createdAt: reviews.createdAt,
        authorName: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.productId, productId), eq(reviews.status, "APPROVED")))
      .orderBy(desc(reviews.createdAt));

    const totalReviews = approvedReviews.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    let ratingSum = 0;
    for (const r of approvedReviews) {
      ratingSum += r.rating;
      if (r.rating in distribution) {
        distribution[r.rating as keyof typeof distribution] += 1;
      }
    }

    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 5.0;

    return {
      reviews: approvedReviews,
      averageRating,
      totalReviews,
      distribution,
    };
  } catch (err) {
    console.error("Error fetching product reviews:", err);
    return {
      reviews: [],
      averageRating: 5.0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
}
