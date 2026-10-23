"use server";

import { db } from "@/lib/db";
import {
  productVariants,
  products,
  categories,
  productImages,
  inventoryAuditLogs,
  inventoryAdjustmentReasonEnum,
} from "@/lib/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string;
  sku: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  stockStatus: "HEALTHY" | "LOW_STOCK" | "OUT_OF_STOCK";
  imageUrl: string | null;
  updatedAt: Date;
}

export interface InventoryAuditLogItem {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  sku: string;
  previousQuantity: number;
  newQuantity: number;
  changeAmount: number;
  reason: "RESTOCK" | "DAMAGED" | "AUDIT_RECONCILIATION" | "CUSTOMER_RETURN" | "CORRECTION";
  note: string | null;
  performedBy: string;
  createdAt: Date;
}

export interface InventoryTelemetry {
  totalSkus: number;
  healthyCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalUnitsInStock: number;
}

// 1. Fetch Inventory Data (All variants joined with product & category)
export async function getInventoryData(): Promise<{
  items: InventoryItem[];
  telemetry: InventoryTelemetry;
}> {
  await requireAdmin("/admin/inventory");

  const rows = await db
    .select({
      variantId: productVariants.id,
      variantName: productVariants.name,
      variantSku: productVariants.sku,
      stockQuantity: productVariants.stockQuantity,
      priceOverride: productVariants.priceOverride,
      variantUpdatedAt: productVariants.updatedAt,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      productPrice: products.price,
      categoryName: categories.name,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(productVariants.stockQuantity), desc(productVariants.updatedAt));

  // Fetch primary product images
  const images = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
    })
    .from(productImages)
    .where(eq(productImages.sortOrder, 0));

  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (!imageMap.has(img.productId)) {
      imageMap.set(img.productId, img.url);
    }
  }

  let healthyCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalUnitsInStock = 0;

  const items: InventoryItem[] = rows.map((r) => {
    let stockStatus: "HEALTHY" | "LOW_STOCK" | "OUT_OF_STOCK" = "HEALTHY";
    if (r.stockQuantity === 0) {
      stockStatus = "OUT_OF_STOCK";
      outOfStockCount++;
    } else if (r.stockQuantity <= 10) {
      stockStatus = "LOW_STOCK";
      lowStockCount++;
    } else {
      healthyCount++;
    }

    totalUnitsInStock += r.stockQuantity;

    return {
      id: r.variantId,
      productId: r.productId,
      productName: r.productName,
      productSlug: r.productSlug,
      variantName: r.variantName,
      sku: r.variantSku,
      categoryName: r.categoryName || "Uncategorized",
      price: r.priceOverride ?? r.productPrice,
      stockQuantity: r.stockQuantity,
      stockStatus,
      imageUrl: imageMap.get(r.productId) || null,
      updatedAt: r.variantUpdatedAt,
    };
  });

  return {
    items,
    telemetry: {
      totalSkus: items.length,
      healthyCount,
      lowStockCount,
      outOfStockCount,
      totalUnitsInStock,
    },
  };
}

// 2. Fetch Recent Audit Logs
export async function getInventoryAuditLogs(limit: number = 50): Promise<InventoryAuditLogItem[]> {
  await requireAdmin("/admin/inventory");

  const rows = await db
    .select({
      id: inventoryAuditLogs.id,
      variantId: inventoryAuditLogs.variantId,
      previousQuantity: inventoryAuditLogs.previousQuantity,
      newQuantity: inventoryAuditLogs.newQuantity,
      changeAmount: inventoryAuditLogs.changeAmount,
      reason: inventoryAuditLogs.reason,
      note: inventoryAuditLogs.note,
      performedBy: inventoryAuditLogs.performedBy,
      createdAt: inventoryAuditLogs.createdAt,
      variantName: productVariants.name,
      sku: productVariants.sku,
      productName: products.name,
    })
    .from(inventoryAuditLogs)
    .innerJoin(productVariants, eq(inventoryAuditLogs.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .orderBy(desc(inventoryAuditLogs.createdAt))
    .limit(limit);

  return rows as InventoryAuditLogItem[];
}

// 3. Adjust Stock Schema & Action
const adjustStockSchema = z.object({
  variantId: z.string().uuid("Invalid variant ID"),
  actionType: z.enum(["ADD", "DEDUCT", "SET"]),
  amount: z.number().int().min(0, "Amount must be a non-negative integer"),
  reason: z.enum([
    "RESTOCK",
    "DAMAGED",
    "AUDIT_RECONCILIATION",
    "CUSTOMER_RETURN",
    "CORRECTION",
  ]),
  note: z.string().max(255).optional(),
});

export type AdjustStockInput = z.infer<typeof adjustStockSchema>;

export async function adjustVariantStock(rawInput: AdjustStockInput) {
  const adminUser = await requireAdmin("/admin/inventory");

  const validation = adjustStockSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { variantId, actionType, amount, reason, note } = validation.data;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Fetch current variant
      const [variant] = await tx
        .select({
          id: productVariants.id,
          stockQuantity: productVariants.stockQuantity,
          productId: productVariants.productId,
        })
        .from(productVariants)
        .where(eq(productVariants.id, variantId))
        .limit(1);

      if (!variant) {
        throw new Error("Variant not found");
      }

      const previousQuantity = variant.stockQuantity;
      let newQuantity = previousQuantity;
      let changeAmount = 0;

      if (actionType === "ADD") {
        newQuantity = previousQuantity + amount;
        changeAmount = amount;
      } else if (actionType === "DEDUCT") {
        newQuantity = Math.max(0, previousQuantity - amount);
        changeAmount = -(previousQuantity - newQuantity);
      } else if (actionType === "SET") {
        newQuantity = amount;
        changeAmount = newQuantity - previousQuantity;
      }

      // 2. Update stock quantity
      await tx
        .update(productVariants)
        .set({
          stockQuantity: newQuantity,
          updatedAt: new Date(),
        })
        .where(eq(productVariants.id, variantId));

      // 3. Insert audit log
      const [log] = await tx
        .insert(inventoryAuditLogs)
        .values({
          variantId,
          previousQuantity,
          newQuantity,
          changeAmount,
          reason,
          note: note?.trim() || null,
          performedBy: adminUser.name || "Admin",
        })
        .returning({ id: inventoryAuditLogs.id });

      // 4. Fetch product slug for revalidation
      const [product] = await tx
        .select({ slug: products.slug })
        .from(products)
        .where(eq(products.id, variant.productId))
        .limit(1);

      return {
        previousQuantity,
        newQuantity,
        changeAmount,
        productSlug: product?.slug,
      };
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/shop");
    if (result.productSlug) {
      revalidatePath(`/product/${result.productSlug}`);
    }

    return {
      success: true,
      previousQuantity: result.previousQuantity,
      newQuantity: result.newQuantity,
      changeAmount: result.changeAmount,
    };
  } catch (err: unknown) {
    console.error("Error adjusting variant stock:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to adjust stock",
    };
  }
}
