import test from "node:test";
import assert from "node:assert/strict";

/**
 * Pure calculation logic matching NESTORA-050 & NESTORA-051 standards
 * All financial amounts are integer cents (minor units).
 */
function calculateOrderTotals(subtotalCents, shippingMethod = "STANDARD", discountCents = 0) {
  const discountedSubtotal = Math.max(0, subtotalCents - discountCents);

  // Free shipping rule: $150.00+ (15000 cents)
  let shippingAmount = 0;
  if (shippingMethod === "EXPRESS") {
    shippingAmount = 2500; // $25.00
  } else {
    shippingAmount = discountedSubtotal >= 15000 ? 0 : 1500; // $15.00
  }

  // Estimated Tax: 8% on discounted goods
  const taxAmount = Math.round(discountedSubtotal * 0.08);

  const totalAmount = discountedSubtotal + shippingAmount + taxAmount;

  return {
    subtotal: subtotalCents,
    discountAmount: discountCents,
    discountedSubtotal,
    shippingAmount,
    taxAmount,
    totalAmount,
  };
}

test("Checkout Calculation: standard order below $150 free shipping threshold", () => {
  // $100.00 subtotal (10000 cents)
  const result = calculateOrderTotals(10000, "STANDARD", 0);

  assert.equal(result.subtotal, 10000);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.discountedSubtotal, 10000);
  assert.equal(result.shippingAmount, 1500, "Shipping must be $15.00 under $150");
  assert.equal(result.taxAmount, 800, "Tax must be 8% of $100.00 ($8.00)");
  assert.equal(result.totalAmount, 10000 + 1500 + 800, "Total must be $123.00 (12300 cents)");
});

test("Checkout Calculation: boundary condition at exactly $149.99 incurs shipping fee", () => {
  // 14999 cents ($149.99)
  const result = calculateOrderTotals(14999, "STANDARD", 0);
  assert.equal(result.shippingAmount, 1500, "$149.99 must NOT qualify for free shipping");
});

test("Checkout Calculation: boundary condition at exactly $150.00 qualifies for free shipping", () => {
  // 15000 cents ($150.00)
  const result = calculateOrderTotals(15000, "STANDARD", 0);
  assert.equal(result.shippingAmount, 0, "$150.00 must qualify for free shipping");
  assert.equal(result.totalAmount, 15000 + 0 + Math.round(15000 * 0.08));
});

test("Checkout Calculation: express shipping is always $25 regardless of order amount", () => {
  // Order over $300 with EXPRESS shipping
  const result = calculateOrderTotals(30000, "EXPRESS", 0);
  assert.equal(result.shippingAmount, 2500, "Express courier must be $25.00 flat");
});

test("Checkout Calculation: coupon discount reduces taxable subtotal & affects free shipping threshold", () => {
  // Subtotal $160 (16000 cents), coupon -$20 (2000 cents) -> Discounted subtotal $140
  // Since discounted subtotal is $140 (< $150), standard shipping applies ($15)
  const result = calculateOrderTotals(16000, "STANDARD", 2000);

  assert.equal(result.discountedSubtotal, 14000);
  assert.equal(result.shippingAmount, 1500, "Shipping fee applies because post-discount subtotal is under $150");
  assert.equal(result.taxAmount, Math.round(14000 * 0.08));
});
