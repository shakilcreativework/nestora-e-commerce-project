"use server";

import { db } from "@/lib/db";
import { products, productVariants, orders, orderItems, users, coupons } from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-guard";
import { z } from "zod";

// Zod schema for checkout submission
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  address: z.string().min(5, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  stateProvince: z.string().min(2, "State or Province is required"),
  postalCode: z.string().min(3, "Postal or ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  shippingMethod: z.enum(["STANDARD", "EXPRESS"]),
  customerNote: z.string().optional(),
  couponCode: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(), // product id
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface ValidatedCouponResult {
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number; // in cents
}

/**
 * Senior Developer Standard:
 * Authoritative Coupon Validation.
 * Validates active status, expiry, usage limit, and minimum order spend.
 */
export async function validateCoupon(
  rawCode: string,
  subtotalCents: number
): Promise<{ success: boolean; coupon?: ValidatedCouponResult; error?: string }> {
  try {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, error: "Please enter a coupon code." };
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (!coupon) {
      return { success: false, error: "Invalid coupon code. Please check and try again." };
    }

    if (!coupon.isActive) {
      return { success: false, error: "This coupon is no longer active." };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { success: false, error: "This coupon has expired." };
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, error: "This coupon has reached its maximum redemption limit." };
    }

    if (subtotalCents < coupon.minOrderAmount) {
      const minDollars = (coupon.minOrderAmount / 100).toFixed(2);
      return {
        success: false,
        error: `Minimum order amount of $${minDollars} is required to use this coupon.`,
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((subtotalCents * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      // FIXED
      discountAmount = Math.min(coupon.discountValue, subtotalCents);
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    };
  } catch (err) {
    console.error("Error validating coupon:", err);
    return { success: false, error: "Failed to validate coupon." };
  }
}

export interface ServerCalculationResult {
  items: {
    productId: string;
    productName: string;
    sku: string;
    unitPrice: number; // in cents
    quantity: number;
    lineTotal: number; // in cents
    availableStock: number;
  }[];
  subtotal: number; // cents
  discountAmount: number; // cents
  couponCode?: string;
  shippingAmount: number; // cents
  taxAmount: number; // cents
  totalAmount: number; // cents
  currency: string;
}

/**
 * Senior Developer Standard:
 * Calculate checkout totals strictly server-side using PostgreSQL source of truth.
 * Client prices are NEVER trusted.
 */
export async function calculateCheckout(
  items: { id: string; quantity: number }[],
  shippingMethod: "STANDARD" | "EXPRESS" = "STANDARD",
  couponCode?: string
): Promise<{ success: boolean; data?: ServerCalculationResult; error?: string }> {
  try {
    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    const productIds = items.map((i) => i.id);

    // 1. Fetch live products from PostgreSQL
    const liveProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        currency: products.currency,
        status: products.status,
        isApproved: products.isApproved,
      })
      .from(products)
      .where(inArray(products.id, productIds));

    // 2. Fetch primary variants for stock checking
    const liveVariants = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        stockQuantity: productVariants.stockQuantity,
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds));

    const variantMap = new Map<string, typeof liveVariants[0]>();
    for (const v of liveVariants) {
      if (!variantMap.has(v.productId)) {
        variantMap.set(v.productId, v);
      }
    }

    let subtotal = 0;
    const verifiedItems: ServerCalculationResult["items"] = [];

    for (const reqItem of items) {
      const prod = liveProducts.find((p) => p.id === reqItem.id);
      if (!prod || prod.status !== "ACTIVE" || !prod.isApproved) {
        return {
          success: false,
          error: `Item "${prod?.name || reqItem.id}" is currently unavailable or inactive.`,
        };
      }

      const variant = variantMap.get(prod.id);
      const availableStock = variant?.stockQuantity ?? 50;
      if (reqItem.quantity > availableStock) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Only ${availableStock} available.`,
        };
      }

      const unitPrice = prod.price; // in cents
      const lineTotal = unitPrice * reqItem.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: prod.id,
        productName: prod.name,
        sku: variant?.sku || `SKU-${prod.id.slice(0, 8)}`,
        unitPrice,
        quantity: reqItem.quantity,
        lineTotal,
        availableStock,
      });
    }

    // 3. Coupon validation & discount calculation
    let discountAmount = 0;
    let appliedCouponCode: string | undefined = undefined;

    if (couponCode && couponCode.trim()) {
      const couponRes = await validateCoupon(couponCode, subtotal);
      if (couponRes.success && couponRes.coupon) {
        discountAmount = couponRes.coupon.discountAmount;
        appliedCouponCode = couponRes.coupon.code;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // 4. Shipping Rule (NESTORA-050):
    // Standard shipping is FREE for orders $150+ (15000 cents), otherwise $15 (1500 cents).
    // Express courier is $25 (2500 cents).
    let shippingAmount = 0;
    if (shippingMethod === "EXPRESS") {
      shippingAmount = 2500;
    } else {
      shippingAmount = discountedSubtotal >= 15000 ? 0 : 1500;
    }

    // 5. Tax calculation (Estimated 8% on discounted goods)
    const taxAmount = Math.round(discountedSubtotal * 0.08);

    // 6. Final grand total
    const totalAmount = discountedSubtotal + shippingAmount + taxAmount;

    return {
      success: true,
      data: {
        items: verifiedItems,
        subtotal,
        discountAmount,
        couponCode: appliedCouponCode,
        shippingAmount,
        taxAmount,
        totalAmount,
        currency: "USD",
      },
    };
  } catch (err) {
    console.error("Error in calculateCheckout:", err);
    return { success: false, error: "Internal server error during pricing calculation." };
  }
}

/**
 * Senior Developer Standard:
 * Atomic Order Creation with immutable snapshotting, coupon tracking, and stock adjustment inside transaction.
 */
export async function placeOrder(rawInput: CheckoutInput): Promise<{
  success: boolean;
  orderNumber?: string;
  totalAmount?: number;
  currency?: string;
  error?: string;
}> {
  try {
    // 1. Zod Validation
    const validation = checkoutSchema.safeParse(rawInput);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid order information";
      return { success: false, error: firstError };
    }

    const input = validation.data;

    // 2. Authoritative Price & Stock Calculation
    const calc = await calculateCheckout(input.items, input.shippingMethod, input.couponCode);
    if (!calc.success || !calc.data) {
      return { success: false, error: calc.error || "Failed to calculate order totals." };
    }

    const { items, subtotal, discountAmount, couponCode: verifiedCoupon, shippingAmount, taxAmount, totalAmount, currency } = calc.data;

    // 3. Determine User ID (Logged-in customer or guest customer record)
    const currentUser = await getCurrentUser();
    let orderUserId = currentUser?.id;

    if (!orderUserId) {
      // Check if user already exists with this email
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0) {
        orderUserId = existingUser[0].id;
      } else {
        // Create customer record for guest checkout
        const newUserId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await db.insert(users).values({
          id: newUserId,
          name: input.fullName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          role: "CUSTOMER",
          emailVerified: false,
          isBlocked: false,
        });
        orderUserId = newUserId;
      }
    }

    // 4. Generate unique order number (e.g., ORD-20261023-4821)
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${today}-${randomSuffix}`;

    // 5. Transactional Execution
    await db.transaction(async (tx) => {
      // A. Create Order Snapshot
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          userId: orderUserId!,
          status: "CONFIRMED", // Test sandbox sets order to confirmed
          paymentStatus: "PAID", // Test mode marked as paid
          currency,
          subtotal,
          discountAmount,
          couponCode: verifiedCoupon || null,
          shippingAmount,
          totalAmount,
          shippingAddressSnapshot: {
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            address: input.address,
            apartment: input.apartment || null,
            city: input.city,
            stateProvince: input.stateProvince,
            postalCode: input.postalCode,
            country: input.country,
            shippingMethod: input.shippingMethod,
          },
          customerNote: input.customerNote || null,
          paidAt: new Date(),
        })
        .returning({ id: orders.id });

      // B. Create Immutable Order Item Snapshots and adjust stock
      for (const item of items) {
        // Find variant ID
        const [variant] = await tx
          .select({
            id: productVariants.id,
            stockQuantity: productVariants.stockQuantity,
          })
          .from(productVariants)
          .where(eq(productVariants.productId, item.productId))
          .limit(1);

        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          variantId: variant?.id || null,
          productNameSnapshot: item.productName,
          skuSnapshot: item.sku,
          variantSnapshot: "Standard Edition",
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        });

        // Transactionally decrement stock (NESTORA-055)
        if (variant) {
          const updatedStock = Math.max(0, variant.stockQuantity - item.quantity);
          await tx
            .update(productVariants)
            .set({ stockQuantity: updatedStock, updatedAt: new Date() })
            .where(eq(productVariants.id, variant.id));
        }
      }

      // C. Atomically increment coupon usage if applied
      if (verifiedCoupon) {
        await tx
          .update(coupons)
          .set({
            usageCount: sql`${coupons.usageCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(coupons.code, verifiedCoupon));
      }
    });

    return {
      success: true,
      orderNumber,
      totalAmount,
      currency,
    };
  } catch (err) {
    console.error("Order placement transaction error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while securing your order. Please try again.",
    };
  }
}
