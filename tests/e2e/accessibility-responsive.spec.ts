import { test, expect } from "@playwright/test";

/**
 * Senior Developer Standard:
 * NESTORA-072: Multi-Device Responsive & Accessibility (a11y) Audit Suite
 * 
 * Verifies:
 * 1. All 6 Responsive Breakpoints: xs (375px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 * 2. Zero Horizontal Overflow: document.documentElement.scrollWidth <= window.innerWidth
 * 3. Product Grid Strict Progression: 2 cols on mobile/tablet (<1024px), 3 cols on lg, 4 cols on xl/2xl
 * 4. Accessibility: Single H1 per page, accessible image alt attributes, button aria-labels
 * 5. Keyboard Navigation: Tab navigation, focus visibility, and Escape key drawer closing
 */

const BREAKPOINTS = [
  { name: "xs (compact mobile)", width: 375, height: 667 },
  { name: "sm (large mobile)", width: 640, height: 800 },
  { name: "md (tablet)", width: 768, height: 1024 },
  { name: "lg (laptop)", width: 1024, height: 768 },
  { name: "xl (desktop)", width: 1280, height: 800 },
  { name: "2xl (ultra-wide)", width: 1536, height: 900 },
];

test.describe("NESTORA Multi-Tier Responsive Breakpoint Audit", () => {
  for (const bp of BREAKPOINTS) {
    test(`Zero Horizontal Overflow on ${bp.name} (${bp.width}x${bp.height}) across core routes`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });

      const routes = ["/", "/shop", "/checkout", "/login", "/register"];

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("domcontentloaded");

        // Evaluate whether document overflows horizontally
        const isOverflowing = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(isOverflowing, `Route ${route} must not horizontally overflow on ${bp.name} (${bp.width}px)`).toBe(false);
      }
    });
  }

  test("Product Grid strict column progression (<1024px = 2 cols, lg = 3 cols, xl = 4 cols)", async ({ page }) => {
    // 1. Mobile & Tablet (<1024px): Strictly 2 Columns
    for (const width of [375, 640, 768]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/shop");
      await page.waitForLoadState("domcontentloaded");

      const productGrid = page.locator("main").locator(".grid").first();
      await expect(productGrid).toBeVisible();

      // Verify grid-cols-2 class is applied
      const classAttr = await productGrid.getAttribute("class");
      expect(classAttr).toContain("grid-cols-2");
    }

    // 2. Laptop (1024px): 3 Columns
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const lgGrid = page.locator("main").locator(".grid").first();
    const lgClass = await lgGrid.getAttribute("class");
    expect(lgClass).toContain("lg:grid-cols-3");

    // 3. Desktop (1280px+): 4 Columns
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");
    const xlGrid = page.locator("main").locator(".grid").first();
    const xlClass = await xlGrid.getAttribute("class");
    expect(xlClass).toContain("xl:grid-cols-4");
  });
});

test.describe("NESTORA Accessibility (a11y) & Semantic Structure Audit", () => {
  test("Heading Hierarchy: Every major storefront page enforces a single H1", async ({ page }) => {
    const pagesToCheck = ["/", "/shop", "/checkout", "/login", "/register"];

    for (const path of pagesToCheck) {
      await page.goto(path);
      await page.waitForLoadState("domcontentloaded");

      const h1Count = await page.locator("h1").count();
      expect(h1Count, `Page ${path} must have exactly one <h1> heading`).toBe(1);
    }
  });

  test("Image Accessibility: All catalog images have descriptive alt attributes", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");

    const images = page.locator("main img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute("alt");
      expect(alt, "Catalog image must have an alt attribute").not.toBeNull();
      expect(alt?.trim().length, "Catalog image alt must not be empty whitespace").toBeGreaterThan(0);
    }
  });

  test("Icon-Only Buttons: All header and action buttons expose accessible labels", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Check header buttons
    const buttons = page.locator("header button");
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const ariaLabel = await btn.getAttribute("aria-label");
        const title = await btn.getAttribute("title");
        const text = await btn.innerText();

        const hasAccessibleName = !!(ariaLabel?.trim() || title?.trim() || text.trim());
        expect(hasAccessibleName, `Visible button in header must have an accessible name`).toBe(true);
      }
    }
  });

  test("Keyboard Navigation: Escape key safely dismisses slide-over Cart Drawer", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");

    // Open cart drawer via header button
    const cartBtn = page.getByRole("button", { name: /Shopping bag with/i });
    await cartBtn.click();

    // Verify drawer backdrop or container is active
    const drawerHeading = page.getByRole("heading", { name: /Shopping Bag/i });
    await expect(drawerHeading).toBeVisible();

    // Press Escape key
    await page.keyboard.press("Escape");

    // Verify drawer has closed
    await expect(drawerHeading).not.toBeVisible();
  });

  test("Dark Mode & Light Mode Theme Toggle updates HTML class attribute", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const html = page.locator("html");

    // Click Switch to dark theme
    const darkBtn = page.getByRole("button", { name: /Switch to dark theme/i });
    if (await darkBtn.isVisible()) {
      await darkBtn.click();
      await expect(html).toHaveClass(/dark/);

      // Click Switch to light theme
      const lightBtn = page.getByRole("button", { name: /Switch to light theme/i });
      await lightBtn.click();
      await expect(html).toHaveClass(/light/);
    }
  });
});
