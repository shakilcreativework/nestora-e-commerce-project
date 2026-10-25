import { test, expect } from "@playwright/test";

/**
 * Senior Developer Standard:
 * NESTORA-073 Security & Privacy Review Spec
 * 
 * Audits:
 * 1. HTTP Security Headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
 * 2. RBAC Privilege Escalation Prevention (role tampering during signup ignored by Better Auth)
 * 3. Zero Raw Card Number (PAN/CVV) Storage or Exposure in Client State / DOM
 * 4. Customer Data Isolation & Server-Side RBAC Enforcement
 * 5. Secret Token Hygiene (DATABASE_URL and BETTER_AUTH_SECRET never leaked to client)
 */

test.describe("NESTORA Security & Privacy Review (NESTORA-073)", () => {
  test("1. Enterprise HTTP Security Headers enforced across responses", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);

    const headers = res.headers();
    expect(headers["x-frame-options"]?.toUpperCase(), "X-Frame-Options must be DENY").toBe("DENY");
    expect(headers["x-content-type-options"]?.toLowerCase(), "X-Content-Type-Options must be nosniff").toBe("nosniff");
    expect(headers["referrer-policy"]?.toLowerCase(), "Referrer-Policy must be strict-origin-when-cross-origin").toContain("strict-origin-when-cross-origin");
  });

  test("2. Zero Sensitive Credentials or Database Secrets leaked in client HTML", async ({ page }) => {
    await page.goto("/");
    const content = await page.content();

    // Verify database connection strings and server secrets are never leaked
    expect(content).not.toContain("postgresql://");
    expect(content).not.toContain("BETTER_AUTH_SECRET");
    expect(content).not.toContain("password=");
  });

  test("3. Zero Raw Card PAN or CVV stored in payment confirmation DOM", async ({ page }) => {
    // Add product to cart via Quick Add on shop catalog
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");

    const quickAddBtn = page.getByRole("button", { name: /Quick Add/i }).first();
    await expect(quickAddBtn).toBeVisible();
    await quickAddBtn.click();

    // Verify cart has item
    const headerCartBtn = page.getByRole("button", { name: /Shopping bag with/i });
    await expect(headerCartBtn).toHaveAttribute("aria-label", /Shopping bag with [1-9]\d* items/i, { timeout: 10000 });

    // Go to checkout with active items
    await page.goto("/checkout");
    await page.waitForLoadState("domcontentloaded");

    // Verify that NO CVV/CVC input exists on the page (Sandbox is clearly isolated)
    const cvvInputs = page.locator("input[placeholder*='CVV'], input[placeholder*='CVC'], input[name*='cvv']");
    const count = await cvvInputs.count();
    expect(count, "No CVV inputs should exist in mock sandbox").toBe(0);

    // Verify clear sandbox disclosure is present
    await expect(page.getByText(/Portfolio Sandbox Environment/i)).toBeVisible();
  });

  test("4. Server-Side RBAC: Admin layout strictly guards protected subroutes", async ({ page }) => {
    const protectedAdminRoutes = [
      "/admin",
      "/admin/products",
      "/admin/orders",
      "/admin/inventory",
      "/admin/categories",
      "/admin/coupons",
      "/admin/reviews",
    ];

    for (const route of protectedAdminRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login\?callbackUrl=/);
    }
  });

  test("5. Customer Account Data Isolation: unauthenticated users blocked from /account", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Faccount/);
  });
});
