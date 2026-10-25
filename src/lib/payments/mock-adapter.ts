import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  payments,
  productVariants,
  inventoryAuditLogs,
  coupons,
} from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export interface MockPaymentRequest {
  orderId: string;
  orderNumber: string;
  amount: number; // in cents
  currency?: string;
  cardNumber: string;
  cardholderName: string;
  idempotencyKey: string;
}

export interface MockPaymentResult {
  success: boolean;
  transactionId?: string;
  status: "PAID" | "FAILED" | "DUPLICATE_IDEMPOTENT";
  cardBrand: string;
  cardLast4: string;
  error?: string;
}

// Senior Standard: Predefined Sandbox Test Card Matrix
export const SANDBOX_TEST_CARDS = {
  SUCCESS_VISA: {
    number: "4242 4242 4242 4242",
    brand: "Visa",
    description: "Simulates instantaneous payment authorization & capture (Success)",
  },
  DECLINE_INSUFFICIENT_FUNDS: {
    number: "4000 0000 0000 0002",
    brand: "Visa",
    description: "Simulates bank rejection: Insufficient funds (Decline)",
  },
  DECLINE_EXPIRED: {
    number: "4000 0000 0000 0003",
    brand: "Visa",
    description: "Simulates bank rejection: Card expired (Decline)",
  },
  DECLINE_FRAUD_RISK: {
    number: "4000 0000 0000 0004",
    brand: "Visa",
    description: "Simulates gateway fraud/risk block (Decline)",
  },
} as const;

/**
 * Senior Developer Standard:
 * Isolated Mock Sandbox Payment Adapter with Idempotency Key Engine (NESTORA-053 & NESTORA-054)
 * 
 * Guarantees:
 * 1. Safe Sandbox Isolation: Clearly labeled test mode, zero storage of raw card numbers.
 * 2. Hard Idempotency: Duplicate calls with the same idempotency key return the initial result without deducting stock twice.
 * 3. Atomic Order Confirmation & Inventory Deduction: Only approved payments trigger stock adjustment in a DB transaction.
 */
export async function executeMockPayment(
  req: MockPaymentRequest
): Promise<MockPaymentResult> {
  try {
    const rawDigits = req.cardNumber.replace(/\s+/g, "");
    const cardLast4 = rawDigits.slice(-4) || "4242";
    const cardBrand = rawDigits.startsWith("4")
      ? "Visa"
      : rawDigits.startsWith("5")
      ? "MasterCard"
      : "Card";

    // 1. HARD IDEMPOTENCY CHECK (NESTORA-054)
    // Check if a payment with this idempotency key was already recorded
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.idempotencyKey, req.idempotencyKey))
      .limit(1);

    if (existingPayment.length > 0) {
      const prior = existingPayment[0];
      return {
        success: prior.status === "PAID",
        transactionId: prior.providerTransactionId,
        status: "DUPLICATE_IDEMPOTENT",
        cardBrand: prior.cardBrand || cardBrand,
        cardLast4: prior.cardLast4 || cardLast4,
        error: prior.errorMessage || undefined,
      };
    }

    // 2. Fetch the target order to confirm existence & pending status
    const [targetOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, req.orderId))
      .limit(1);

    if (!targetOrder) {
      return {
        success: false,
        status: "FAILED",
        cardBrand,
        cardLast4,
        error: `Order ${req.orderNumber} not found.`,
      };
    }

    // Guard against re-paying already paid orders
    if (targetOrder.paymentStatus === "PAID") {
      return {
        success: true,
        status: "PAID",
        cardBrand,
        cardLast4,
        error: "This order has already been paid.",
      };
    }

    // 3. MOCK GATEWAY SIMULATION
    let isApproved = true;
    let declineReason: string | null = null;

    if (rawDigits === "4000000000000002") {
      isApproved = false;
      declineReason = "Sandbox Payment Declined: Insufficient funds in test account.";
    } else if (rawDigits === "4000000000000003") {
      isApproved = false;
      declineReason = "Sandbox Payment Declined: Card expired.";
    } else if (rawDigits === "4000000000000004") {
      isApproved = false;
      declineReason = "Sandbox Payment Declined: High risk score flagged by gateway.";
    }

    const providerTransactionId = `txn_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 4. ATOMIC DATABASE TRANSACTION
    if (isApproved) {
      await db.transaction(async (tx) => {
        // A. Record Payment
        await tx.insert(payments).values({
          orderId: targetOrder.id,
          provider: "MOCK_SANDBOX",
          providerTransactionId,
          amount: req.amount,
          currency: req.currency || "USD",
          status: "PAID",
          paymentMethodType: "CARD",
          cardBrand,
          cardLast4,
          idempotencyKey: req.idempotencyKey,
          errorMessage: null,
        });

        // B. Confirm Order
        await tx
          .update(orders)
          .set({
            status: "CONFIRMED",
            paymentStatus: "PAID",
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(orders.id, targetOrder.id));

        // C. Fetch Order Items & Atomically Decrement Inventory
        const items = await tx
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, targetOrder.id));

        for (const item of items) {
          if (item.variantId) {
            // Fetch current stock
            const [variant] = await tx
              .select({ stockQuantity: productVariants.stockQuantity })
              .from(productVariants)
              .where(eq(productVariants.id, item.variantId));

            if (variant) {
              const previousQuantity = variant.stockQuantity;
              const newQuantity = Math.max(0, previousQuantity - item.quantity);

              await tx
                .update(productVariants)
                .set({
                  stockQuantity: newQuantity,
                  updatedAt: new Date(),
                })
                .where(eq(productVariants.id, item.variantId));

              // Record in Inventory Audit Trail
              await tx.insert(inventoryAuditLogs).values({
                variantId: item.variantId,
                previousQuantity,
                newQuantity,
                changeAmount: -item.quantity,
                reason: "RESTOCK", // fulfillment decrement
                note: `Fulfillment for Order #${targetOrder.orderNumber}`,
                performedBy: "Payment Engine",
              });
            }
          }
        }

        // D. Increment coupon usage count if applied
        if (targetOrder.couponCode) {
          await tx
            .update(coupons)
            .set({
              usageCount: sql`${coupons.usageCount} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(coupons.code, targetOrder.couponCode));
        }
      });

      return {
        success: true,
        transactionId: providerTransactionId,
        status: "PAID",
        cardBrand,
        cardLast4,
      };
    } else {
      // Failed payment path: Record failure, do not decrement inventory
      await db.transaction(async (tx) => {
        await tx.insert(payments).values({
          orderId: targetOrder.id,
          provider: "MOCK_SANDBOX",
          providerTransactionId,
          amount: req.amount,
          currency: req.currency || "USD",
          status: "FAILED",
          paymentMethodType: "CARD",
          cardBrand,
          cardLast4,
          idempotencyKey: req.idempotencyKey,
          errorMessage: declineReason,
        });

        await tx
          .update(orders)
          .set({
            status: "PAYMENT_FAILED",
            paymentStatus: "FAILED",
            updatedAt: new Date(),
          })
          .where(eq(orders.id, targetOrder.id));
      });

      return {
        success: false,
        transactionId: providerTransactionId,
        status: "FAILED",
        cardBrand,
        cardLast4,
        error: declineReason || "Payment was declined by mock sandbox gateway.",
      };
    }
  } catch (err) {
    console.error("Error executing mock payment:", err);
    return {
      success: false,
      status: "FAILED",
      cardBrand: "Card",
      cardLast4: "0000",
      error: "An unexpected error occurred during payment processing.",
    };
  }
}
