"use server";

import { db } from "@/lib/db";
import { products, productVariants, productImages, categories } from "@/lib/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { z } from "zod";
import type { CartItem } from "@/lib/store/features/cart-slice";

// Zod validation for incoming guest cart items
const guestCartInputSchema = z.array(
  z.object({
    id: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  })
);

export type GuestCartInput = z.infer<typeof guestCartInputSchema>;

export interface CartAdjustmentNotice {
  productId: string;
  productName: string;
  requestedQuantity: number;
  adjustedQuantity: number;
  reason: "CAPPED_BY_STOCK" | "OUT_OF_STOCK" | "UNAVAILABLE" | "PRICE_UPDATED";
  message: string;
}

export interface MergedCartResponse {
  success: boolean;
  items: CartItem[];
  adjustments: CartAdjustmentNotice[];
  error?: string;
}

/**
 * Senior Developer Standard:
 * Authoritative Server-Side Cart Merge & Stock Cap Engine.
 * 
 * Rules:
 * 1. Client prices and stock are NEVER trusted.
 * 2. Only ACTIVE and Admin-APPROVED products are allowed.
 * 3. Quantities are deterministically combined for duplicate lines.
 * 4. Quantities are strictly capped by live warehouse variant stock.
 * 5. Out-of-stock or deactivated products are safely discarded with clear notices.
 */
export async function verifyAndMergeGuestCart(
  rawGuestItems: GuestCartInput
): Promise<MergedCartResponse> {
  try {
    // 1. Zod input validation
    const validation = guestCartInputSchema.safeParse(rawGuestItems);
    if (!validation.success) {
      return {
        success: false,
        items: [],
        adjustments: [],
        error: "Invalid cart payload structure.",
      };
    }

    const guestItems = validation.data;
    if (guestItems.length === 0) {
      return {
        success: true,
        items: [],
        adjustments: [],
      };
    }

    // 2. Deterministically aggregate duplicate lines from client
    // e.g. [{id: 'A', quantity: 2}, {id: 'A', quantity: 1}] -> Map(A -> 3)
    const aggregatedRequestMap = new Map<string, number>();
    for (const item of guestItems) {
      const current = aggregatedRequestMap.get(item.id) || 0;
      aggregatedRequestMap.set(item.id, current + item.quantity);
    }

    const uniqueProductIds = Array.from(aggregatedRequestMap.keys());

    // 3. Fetch canonical product data from PostgreSQL
    const liveProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        currency: products.currency,
        status: products.status,
        isApproved: products.isApproved,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(inArray(products.id, uniqueProductIds));

    // 4. Fetch live variant stock quantities for these products
    const liveVariants = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        stockQuantity: productVariants.stockQuantity,
        isActive: productVariants.isActive,
      })
      .from(productVariants)
      .where(
        and(
          inArray(productVariants.productId, uniqueProductIds),
          eq(productVariants.isActive, true)
        )
      );

    // Group variants by productId to calculate total available stock across active variants
    const productStockMap = new Map<string, number>();
    for (const v of liveVariants) {
      const currentStock = productStockMap.get(v.productId) || 0;
      productStockMap.set(v.productId, currentStock + Math.max(0, v.stockQuantity));
    }

    // 5. Fetch primary images
    const images = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .where(
        and(
          inArray(productImages.productId, uniqueProductIds),
          eq(productImages.sortOrder, 0)
        )
      );

    const imageMap = new Map<string, string>();
    for (const img of images) {
      if (!imageMap.has(img.productId)) {
        imageMap.set(img.productId, img.url);
      }
    }

    const fallbackImage =
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80";

    const verifiedItems: CartItem[] = [];
    const adjustments: CartAdjustmentNotice[] = [];

    // 6. Process each requested product against authoritative server state
    for (const [productId, requestedQuantity] of aggregatedRequestMap.entries()) {
      const prod = liveProducts.find((p) => p.id === productId);

      // Check existence, active status and admin approval
      if (!prod || prod.status !== "ACTIVE" || !prod.isApproved) {
        adjustments.push({
          productId,
          productName: prod?.name || `Item ${productId.slice(0, 8)}`,
          requestedQuantity,
          adjustedQuantity: 0,
          reason: "UNAVAILABLE",
          message: `"${prod?.name || "One of your saved items"}" is no longer available and was removed from your cart.`,
        });
        continue;
      }

      // Check available stock
      const availableStock = productStockMap.get(prod.id) ?? 0;

      if (availableStock <= 0) {
        adjustments.push({
          productId: prod.id,
          productName: prod.name,
          requestedQuantity,
          adjustedQuantity: 0,
          reason: "OUT_OF_STOCK",
          message: `"${prod.name}" is currently out of stock and was removed from your cart.`,
        });
        continue;
      }

      // Cap quantity if requested amount exceeds live warehouse stock
      let finalQuantity = requestedQuantity;
      if (requestedQuantity > availableStock) {
        finalQuantity = availableStock;
        adjustments.push({
          productId: prod.id,
          productName: prod.name,
          requestedQuantity,
          adjustedQuantity: availableStock,
          reason: "CAPPED_BY_STOCK",
          message: `"${prod.name}" quantity was adjusted to ${availableStock} due to current stock limits.`,
        });
      }

      verifiedItems.push({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        currency: prod.currency,
        imageUrl: imageMap.get(prod.id) || fallbackImage,
        categoryName: prod.categoryName || undefined,
        quantity: finalQuantity,
        maxStock: availableStock,
      });
    }

    return {
      success: true,
      items: verifiedItems,
      adjustments,
    };
  } catch (err) {
    console.error("Error in verifyAndMergeGuestCart:", err);
    return {
      success: false,
      items: [],
      adjustments: [],
      error: "An internal server error occurred while syncing your cart.",
    };
  }
}
