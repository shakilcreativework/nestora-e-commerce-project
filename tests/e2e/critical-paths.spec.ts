import { test, expect } from "@playwright/test";

/**
 * Senior Developer Standard:
 * NESTORA-071 Critical-Path End-to-End (E2E) Test Suite
 * 
 * Flow Coverage:
 * 1. Storefront Discovery: Homepage -> Shop Catalog -> Product Detail Page
 * 2. Cart & Drawer State: Add-to-Bag -> Redux State -> Cart Drawer -> Proceed to Checkout
 * 3. Two-Phase Sandbox Checkout: Shipping Input -> Instant Success Test Card -> Order Confirmation
 * 4. Security & RBAC Enforcement: Unauthorized Customer/Admin Route Blocking
 */

test.describe("NESTORA Critical E2E Journey", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log(`[BROWSER ERROR] ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      console.log(`[PAGE ERROR] ${err.message}`);
    });
  });
  test("1. Storefront Discovery & Product Navigation", async ({ page }) => {
    // 1. Visit Homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/NESTORA/);

    // Verify brand identity link
    const brandLink = page.locator("header").getByRole("link", { name: /NESTORA/i }).first();
    await expect(brandLink).toBeVisible();

    // 2. Navigate to Shop
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText(/All Collections|Collection|Shop/i);

    // 3. Verify product catalog items exist
    const productCards = page.locator("a[href^='/product/']");
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);

    // 4. Click first active product to navigate to PDP
    const firstProduct = productCards.first();
    const productHref = await firstProduct.getAttribute("href");
    expect(productHref).toBeTruthy();

    await page.goto(productHref!);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText(/In Stock|Limited Atelier Batch/i).first()).toBeVisible();
  });

  test("2. Add to Bag, Slide-Over Drawer & Checkout Redirection", async ({ page }) => {
    // 1. Navigate directly to catalog
    await page.goto("/shop");
    const productCards = page.locator("a[href^='/product/']");
    const firstProduct = productCards.first();
    const productHref = await firstProduct.getAttribute("href");

    await page.goto(productHref!);
    await page.waitForLoadState("domcontentloaded");

    // 2. Add to Bag with Playwright toPass retry to gracefully handle Next.js client hydration
    const addToBagBtn = page.getByRole("button", { name: /Add to Bag/i });
    const headerCartBtn = page.getByRole("button", { name: /Shopping bag with/i });

    await expect(addToBagBtn).toBeVisible();
    await expect(async () => {
      await addToBagBtn.click();
      await expect(headerCartBtn).toHaveAttribute("aria-label", /Shopping bag with [1-9]\d* items/i, { timeout: 1500 });
    }).toPass({ timeout: 15000 });

    // 3. Ensure Cart Drawer is open and click Proceed to Checkout
    const checkoutBtn = page.getByRole("link", { name: /Proceed to Checkout/i });
    if (!(await checkoutBtn.isVisible())) {
      await headerCartBtn.click();
    }
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 4. Verify URL is now /checkout
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByRole("heading", { name: /Express Checkout|Checkout/i })).toBeVisible();
  });

  test("3. End-to-End Sandbox Checkout & Order Confirmation", async ({ page }) => {
    // 1. Add product to cart to enable checkout
    await page.goto("/shop");
    const firstProductHref = await page.locator("a[href^='/product/']").first().getAttribute("href");
    await page.goto(firstProductHref!);
    await page.waitForLoadState("domcontentloaded");

    const addToBagBtn = page.getByRole("button", { name: /Add to Bag/i });
    const headerCartBtn = page.getByRole("button", { name: /Shopping bag with/i });

    await expect(async () => {
      await addToBagBtn.click();
      await expect(headerCartBtn).toHaveAttribute("aria-label", /Shopping bag with [1-9]\d* items/i, { timeout: 1500 });
    }).toPass({ timeout: 15000 });

    // 2. Open Cart Drawer & Navigate to Checkout
    const checkoutBtn = page.getByRole("link", { name: /Proceed to Checkout/i });
    if (!(await checkoutBtn.isVisible())) {
      await headerCartBtn.click();
    }
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();
    await page.waitForURL(/\/checkout/);

    // 3. Fill Shipping Information with actual form placeholders
    await page.fill("input[placeholder='e.g. Shakil Ahmed']", "Alexandra Montgomery");
    await page.fill("input[placeholder='name@example.com']", "alexandra.e2e@nestora-test.com");
    await page.fill("input[placeholder='+1 (555) 019-2834']", "+15552345678");
    await page.fill("input[placeholder='123 Artisan Way']", "1204 Artisan Way");
    await page.fill("input[placeholder='San Francisco']", "Portland");
    await page.fill("input[placeholder='California']", "Oregon");
    await page.fill("input[placeholder='94103']", "97201");

    // 4. Verify Sandbox Test Card Matrix is active
    await expect(page.getByText(/4242 •••• •••• 4242/i)).toBeVisible();
    await expect(page.getByText(/Visa • Instant Success/i)).toBeVisible();

    // 5. Submit Order
    const submitBtn = page.getByRole("button", { name: /Complete Purchase/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // 6. Verify Order Confirmation Page
    await page.waitForURL(/\/checkout\/success\?orderNumber=ORD-/, { timeout: 30000 });
    await expect(page.getByText(/Order Confirmed & Paid/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Thank You/i })).toBeVisible();
    await expect(page.getByText(/ORD-2026/i)).toBeVisible();
    await expect(page.getByText(/Portland, Oregon 97201/i)).toBeVisible();
  });

  test("4. Security & Server-Side Access Control (RBAC)", async ({ page }) => {
    // 1. Unauthorized attempt to visit /admin root
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);

    // 2. Unauthorized attempt to visit /admin/products (layout redirects with admin callback)
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);

    // 3. Unauthorized attempt to visit /admin/orders
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);

    // 4. Unauthorized attempt to visit /account
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Faccount/);
  });
});
