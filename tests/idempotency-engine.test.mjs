import test from "node:test";
import assert from "node:assert/strict";

/**
 * Senior Developer Standard:
 * Pure unit tests verifying NESTORA-053 & NESTORA-054 idempotency engine
 * and mock payment gateway test-card routing matrix.
 */

function processMockPayment(request, existingPaymentsStore, orderStore) {
  const rawDigits = request.cardNumber.replace(/\s+/g, "");
  const cardLast4 = rawDigits.slice(-4) || "4242";
  const cardBrand = rawDigits.startsWith("4")
    ? "Visa"
    : rawDigits.startsWith("5")
    ? "MasterCard"
    : "Card";

  // 1. HARD IDEMPOTENCY CHECK
  const prior = existingPaymentsStore.get(request.idempotencyKey);
  if (prior) {
    return {
      success: prior.status === "PAID",
      transactionId: prior.transactionId,
      status: "DUPLICATE_IDEMPOTENT",
      cardBrand: prior.cardBrand,
      cardLast4: prior.cardLast4,
      error: prior.error,
    };
  }

  // 2. Order verification
  const order = orderStore.get(request.orderId);
  if (!order) {
    return {
      success: false,
      status: "FAILED",
      cardBrand,
      cardLast4,
      error: `Order ${request.orderNumber} not found.`,
    };
  }

  if (order.paymentStatus === "PAID") {
    return {
      success: true,
      status: "PAID",
      cardBrand,
      cardLast4,
      error: "This order has already been paid.",
    };
  }

  // 3. Mock Gateway Routing Matrix
  let isApproved = true;
  let declineReason = null;

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

  const transactionId = `txn_mock_${Date.now()}`;
  const record = {
    orderId: request.orderId,
    transactionId,
    amount: request.amount,
    status: isApproved ? "PAID" : "FAILED",
    cardBrand,
    cardLast4,
    idempotencyKey: request.idempotencyKey,
    error: declineReason,
  };

  // Record in store
  existingPaymentsStore.set(request.idempotencyKey, record);

  if (isApproved) {
    order.paymentStatus = "PAID";
    order.status = "CONFIRMED";
  } else {
    order.paymentStatus = "FAILED";
    order.status = "PAYMENT_FAILED";
  }

  return {
    success: isApproved,
    transactionId,
    status: isApproved ? "PAID" : "FAILED",
    cardBrand,
    cardLast4,
    error: declineReason || undefined,
  };
}

test("Idempotency Engine: first payment attempt successfully authorizes and records transaction", () => {
  const paymentsStore = new Map();
  const orderStore = new Map([
    ["ord_1", { id: "ord_1", orderNumber: "ORD-001", paymentStatus: "UNPAID", status: "PENDING_PAYMENT" }],
  ]);

  const req = {
    orderId: "ord_1",
    orderNumber: "ORD-001",
    amount: 15000,
    cardNumber: "4242 4242 4242 4242",
    cardholderName: "Jane Doe",
    idempotencyKey: "idem_req_abc_123",
  };

  const res = processMockPayment(req, paymentsStore, orderStore);

  assert.equal(res.success, true);
  assert.equal(res.status, "PAID");
  assert.equal(res.cardBrand, "Visa");
  assert.equal(res.cardLast4, "4242");
  assert.ok(res.transactionId.startsWith("txn_mock_"));

  // Verify order updated
  const order = orderStore.get("ord_1");
  assert.equal(order.paymentStatus, "PAID");
  assert.equal(order.status, "CONFIRMED");
});

test("Idempotency Engine: duplicate call with identical idempotency key returns cached result without double charging", () => {
  const paymentsStore = new Map();
  const orderStore = new Map([
    ["ord_1", { id: "ord_1", orderNumber: "ORD-001", paymentStatus: "UNPAID", status: "PENDING_PAYMENT" }],
  ]);

  const req = {
    orderId: "ord_1",
    orderNumber: "ORD-001",
    amount: 15000,
    cardNumber: "4242 4242 4242 4242",
    cardholderName: "Jane Doe",
    idempotencyKey: "idem_req_abc_123",
  };

  // 1st execution
  const res1 = processMockPayment(req, paymentsStore, orderStore);
  assert.equal(res1.status, "PAID");

  // 2nd execution with same key (simulating network retry / double click)
  const res2 = processMockPayment(req, paymentsStore, orderStore);
  assert.equal(res2.success, true);
  assert.equal(res2.status, "DUPLICATE_IDEMPOTENT");
  assert.equal(res2.transactionId, res1.transactionId, "Must return the exact same transaction ID");
});

test("Mock Adapter: correctly declines card with insufficient funds (4000 0000 0000 0002)", () => {
  const paymentsStore = new Map();
  const orderStore = new Map([
    ["ord_2", { id: "ord_2", orderNumber: "ORD-002", paymentStatus: "UNPAID", status: "PENDING_PAYMENT" }],
  ]);

  const req = {
    orderId: "ord_2",
    orderNumber: "ORD-002",
    amount: 5000,
    cardNumber: "4000 0000 0000 0002",
    cardholderName: "John Smith",
    idempotencyKey: "idem_req_insufficient_funds",
  };

  const res = processMockPayment(req, paymentsStore, orderStore);
  assert.equal(res.success, false);
  assert.equal(res.status, "FAILED");
  assert.match(res.error, /Insufficient funds/);

  const order = orderStore.get("ord_2");
  assert.equal(order.paymentStatus, "FAILED");
});

test("Mock Adapter: correctly declines expired card (4000 0000 0000 0003)", () => {
  const paymentsStore = new Map();
  const orderStore = new Map([
    ["ord_3", { id: "ord_3", orderNumber: "ORD-003", paymentStatus: "UNPAID", status: "PENDING_PAYMENT" }],
  ]);

  const req = {
    orderId: "ord_3",
    orderNumber: "ORD-003",
    amount: 7500,
    cardNumber: "4000 0000 0000 0003",
    cardholderName: "John Smith",
    idempotencyKey: "idem_req_expired",
  };

  const res = processMockPayment(req, paymentsStore, orderStore);
  assert.equal(res.success, false);
  assert.equal(res.status, "FAILED");
  assert.match(res.error, /Card expired/);
});

test("Mock Adapter: correctly extracts MasterCard brand and last 4 digits", () => {
  const paymentsStore = new Map();
  const orderStore = new Map([
    ["ord_4", { id: "ord_4", orderNumber: "ORD-004", paymentStatus: "UNPAID", status: "PENDING_PAYMENT" }],
  ]);

  const req = {
    orderId: "ord_4",
    orderNumber: "ORD-004",
    amount: 9900,
    cardNumber: "5555 4444 3333 1234",
    cardholderName: "Alice Walker",
    idempotencyKey: "idem_req_mc_test",
  };

  const res = processMockPayment(req, paymentsStore, orderStore);
  assert.equal(res.cardBrand, "MasterCard");
  assert.equal(res.cardLast4, "1234");
});
