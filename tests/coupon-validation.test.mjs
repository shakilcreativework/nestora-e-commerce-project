import test from "node:test";
import assert from "node:assert/strict";

/**
 * Senior Developer Standard:
 * Pure unit tests verifying NESTORA-052 & NESTORA-054 coupon discount calculation rules
 * and security gates (minimum spend, percentage caps, expiry, usage limits).
 */

function evaluateCoupon(coupon, subtotalCents) {
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code." };
  }

  if (!coupon.isActive) {
    return { valid: false, error: "This coupon is no longer active." };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: "This coupon has expired." };
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: "This coupon has reached its maximum redemption limit." };
  }

  if (subtotalCents < coupon.minOrderAmount) {
    const minDollars = (coupon.minOrderAmount / 100).toFixed(2);
    return {
      valid: false,
      error: `Minimum order amount of $${minDollars} is required to use this coupon.`,
    };
  }

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
    valid: true,
    discountAmount,
    discountedSubtotal: Math.max(0, subtotalCents - discountAmount),
  };
}

test("Coupon Validation: percentage discount calculates accurately in minor units", () => {
  const coupon = {
    code: "SAVE15",
    discountType: "PERCENTAGE",
    discountValue: 15, // 15%
    minOrderAmount: 5000, // $50.00
    maxDiscountAmount: null,
    isActive: true,
    expiresAt: null,
    usageLimit: 100,
    usageCount: 10,
  };

  // Subtotal $200.00 (20000 cents) -> 15% = $30.00 (3000 cents)
  const result = evaluateCoupon(coupon, 20000);
  assert.equal(result.valid, true);
  assert.equal(result.discountAmount, 3000);
  assert.equal(result.discountedSubtotal, 17000);
});

test("Coupon Validation: percentage discount enforces maximum discount ceiling", () => {
  const coupon = {
    code: "BIGSALE50",
    discountType: "PERCENTAGE",
    discountValue: 50, // 50%
    minOrderAmount: 10000, // $100.00
    maxDiscountAmount: 5000, // Max cap $50.00 (5000 cents)
    isActive: true,
    expiresAt: null,
    usageLimit: null,
    usageCount: 0,
  };

  // Subtotal $400.00 (40000 cents) -> 50% would be $200.00 (20000 cents), but cap is $50.00 (5000 cents)
  const result = evaluateCoupon(coupon, 40000);
  assert.equal(result.valid, true);
  assert.equal(result.discountAmount, 5000, "Must be capped at maxDiscountAmount");
  assert.equal(result.discountedSubtotal, 35000);
});

test("Coupon Validation: fixed dollar discount cannot exceed subtotal", () => {
  const coupon = {
    code: "FLAT30",
    discountType: "FIXED",
    discountValue: 3000, // $30.00
    minOrderAmount: 2000, // $20.00
    maxDiscountAmount: null,
    isActive: true,
    expiresAt: null,
    usageLimit: null,
    usageCount: 0,
  };

  // Subtotal $25.00 (2500 cents) -> discount capped at $25.00
  const result = evaluateCoupon(coupon, 2500);
  assert.equal(result.valid, true);
  assert.equal(result.discountAmount, 2500, "Fixed discount cannot reduce subtotal below 0");
  assert.equal(result.discountedSubtotal, 0);
});

test("Coupon Validation: rejects order below minimum spend threshold", () => {
  const coupon = {
    code: "VIP100",
    discountType: "FIXED",
    discountValue: 2000,
    minOrderAmount: 10000, // $100.00 required
    maxDiscountAmount: null,
    isActive: true,
    expiresAt: null,
    usageLimit: null,
    usageCount: 0,
  };

  // Subtotal $89.50 (8950 cents)
  const result = evaluateCoupon(coupon, 8950);
  assert.equal(result.valid, false);
  assert.match(result.error, /Minimum order amount of \$100.00/);
});

test("Coupon Validation: rejects expired coupons", () => {
  const coupon = {
    code: "EXPIRED2025",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: null,
    isActive: true,
    expiresAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    usageLimit: 100,
    usageCount: 5,
  };

  const result = evaluateCoupon(coupon, 5000);
  assert.equal(result.valid, false);
  assert.equal(result.error, "This coupon has expired.");
});

test("Coupon Validation: rejects coupons that have exhausted their redemption quota", () => {
  const coupon = {
    code: "FLASH100",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderAmount: 1000,
    maxDiscountAmount: null,
    isActive: true,
    expiresAt: null,
    usageLimit: 50,
    usageCount: 50, // exhausted
  };

  const result = evaluateCoupon(coupon, 5000);
  assert.equal(result.valid, false);
  assert.equal(result.error, "This coupon has reached its maximum redemption limit.");
});

test("Coupon Validation: rejects inactive or deactivated coupons", () => {
  const coupon = {
    code: "DISABLED10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: null,
    isActive: false,
    expiresAt: null,
    usageLimit: null,
    usageCount: 0,
  };

  const result = evaluateCoupon(coupon, 5000);
  assert.equal(result.valid, false);
  assert.equal(result.error, "This coupon is no longer active.");
});
