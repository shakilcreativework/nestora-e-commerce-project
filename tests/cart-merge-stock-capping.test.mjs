import test from "node:test";
import assert from "node:assert/strict";

/**
 * Senior Developer Standard:
 * Pure unit tests verifying NESTORA-042 cart merge, duplicate aggregation,
 * and live stock-capping business rules.
 */

function mergeAndCapCart(guestItems, liveDatabaseProducts) {
  if (!guestItems || guestItems.length === 0) {
    return { items: [], adjustments: [] };
  }

  // 1. Deterministically aggregate duplicate lines from client
  const aggregatedMap = new Map();
  for (const item of guestItems) {
    const current = aggregatedMap.get(item.id) || 0;
    aggregatedMap.set(item.id, current + item.quantity);
  }

  const items = [];
  const adjustments = [];

  // 2. Evaluate against authoritative database products & stock
  for (const [productId, requestedQuantity] of aggregatedMap.entries()) {
    const prod = liveDatabaseProducts.find((p) => p.id === productId);

    // Rule: Must exist, be ACTIVE, and be APPROVED
    if (!prod || prod.status !== "ACTIVE" || !prod.isApproved) {
      adjustments.push({
        productId,
        requestedQuantity,
        adjustedQuantity: 0,
        reason: "UNAVAILABLE",
      });
      continue;
    }

    // Rule: Out of stock
    const availableStock = prod.stockQuantity ?? 0;
    if (availableStock <= 0) {
      adjustments.push({
        productId: prod.id,
        requestedQuantity,
        adjustedQuantity: 0,
        reason: "OUT_OF_STOCK",
      });
      continue;
    }

    // Rule: Stock Capping
    let finalQuantity = requestedQuantity;
    if (requestedQuantity > availableStock) {
      finalQuantity = availableStock;
      adjustments.push({
        productId: prod.id,
        requestedQuantity,
        adjustedQuantity: availableStock,
        reason: "CAPPED_BY_STOCK",
      });
    }

    items.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: finalQuantity,
      maxStock: availableStock,
    });
  }

  return { items, adjustments };
}

test("Cart Merge: aggregates duplicate line items for the same product ID", () => {
  const guestItems = [
    { id: "PROD-1", quantity: 2 },
    { id: "PROD-2", quantity: 1 },
    { id: "PROD-1", quantity: 3 }, // duplicate line
  ];

  const mockDb = [
    { id: "PROD-1", name: "Modern Nordic Chair", price: 12000, stockQuantity: 10, status: "ACTIVE", isApproved: true },
    { id: "PROD-2", name: "Ceramic Lamp", price: 4500, stockQuantity: 5, status: "ACTIVE", isApproved: true },
  ];

  const result = mergeAndCapCart(guestItems, mockDb);

  assert.equal(result.items.length, 2);
  const prod1 = result.items.find((i) => i.id === "PROD-1");
  assert.equal(prod1.quantity, 5, "2 + 3 items must be aggregated to 5");
  assert.equal(result.adjustments.length, 0, "No adjustments when stock is sufficient");
});

test("Cart Merge: strictly caps quantity when requested exceeds warehouse stock", () => {
  const guestItems = [
    { id: "PROD-LIMITED", quantity: 8 },
  ];

  const mockDb = [
    { id: "PROD-LIMITED", name: "Walnut Dining Table", price: 85000, stockQuantity: 3, status: "ACTIVE", isApproved: true },
  ];

  const result = mergeAndCapCart(guestItems, mockDb);

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].quantity, 3, "Quantity must be capped to available stock (3)");
  assert.equal(result.items[0].maxStock, 3);

  assert.equal(result.adjustments.length, 1);
  assert.equal(result.adjustments[0].reason, "CAPPED_BY_STOCK");
  assert.equal(result.adjustments[0].requestedQuantity, 8);
  assert.equal(result.adjustments[0].adjustedQuantity, 3);
});

test("Cart Merge: removes out-of-stock items and returns OUT_OF_STOCK adjustment", () => {
  const guestItems = [
    { id: "PROD-OOS", quantity: 1 },
  ];

  const mockDb = [
    { id: "PROD-OOS", name: "Sold Out Vase", price: 2500, stockQuantity: 0, status: "ACTIVE", isApproved: true },
  ];

  const result = mergeAndCapCart(guestItems, mockDb);

  assert.equal(result.items.length, 0, "Out-of-stock items must be removed from cart");
  assert.equal(result.adjustments.length, 1);
  assert.equal(result.adjustments[0].reason, "OUT_OF_STOCK");
  assert.equal(result.adjustments[0].adjustedQuantity, 0);
});

test("Cart Merge: safely discards deactivated or unapproved products", () => {
  const guestItems = [
    { id: "PROD-DRAFT", quantity: 2 },
    { id: "PROD-DEACTIVATED", quantity: 1 },
  ];

  const mockDb = [
    { id: "PROD-DRAFT", name: "Pending Desk", price: 15000, stockQuantity: 10, status: "ACTIVE", isApproved: false },
    { id: "PROD-DEACTIVATED", name: "Archived Shelf", price: 8000, stockQuantity: 10, status: "INACTIVE", isApproved: true },
  ];

  const result = mergeAndCapCart(guestItems, mockDb);

  assert.equal(result.items.length, 0);
  assert.equal(result.adjustments.length, 2);
  assert.equal(result.adjustments[0].reason, "UNAVAILABLE");
  assert.equal(result.adjustments[1].reason, "UNAVAILABLE");
});

test("Cart Merge: empty cart input returns clean empty result", () => {
  const result = mergeAndCapCart([], []);
  assert.equal(result.items.length, 0);
  assert.equal(result.adjustments.length, 0);
});
