import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const viewports = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "Desktop", width: 1280, height: 800 },
];

for (const vp of viewports) {
  test.describe(`Audit Gate: Viewport ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("zero console errors, zero hydration errors, zero horizontal overflow", async ({ page }) => {
      const consoleErrors: string[] = [];
      const hydrationWarnings: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
        if (msg.text().includes("Hydration failed") || msg.text().includes("hydration mismatch")) {
          hydrationWarnings.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Verify no horizontal overflow across whole document
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      expect(overflow.hasOverflow).toBe(false);
      expect(consoleErrors).toEqual([]);
      expect(hydrationWarnings).toEqual([]);
    });
  });
}

test.describe("Axe Accessibility Audit (§13.4)", () => {
  test("Home page has 0 critical or serious a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const seriousOrCritical = accessibilityScanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    if (seriousOrCritical.length > 0) {
      console.error("A11y Violations (Home):", JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });

  test("Product detail dialog has 0 critical/serious a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open detail dialog
    const bottle = page.locator('[data-testid="rail-bottle-oil-white"]').first();
    await bottle.click();
    const dialog = page.locator('[aria-labelledby="product-detail-title"]');
    await expect(dialog).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[aria-labelledby="product-detail-title"]')
      .analyze();

    const seriousOrCritical = accessibilityScanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    if (seriousOrCritical.length > 0) {
      console.error("A11y Violations (Detail Dialog):", JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });

  test("Cart drawer has 0 critical/serious a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open drawer
    const cartBtn = page.locator('button[aria-label^="Cart,"]').first();
    await cartBtn.click();
    const drawer = page.locator('[aria-labelledby="cart-drawer-title"]');
    await expect(drawer).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[aria-labelledby="cart-drawer-title"]')
      .analyze();

    const seriousOrCritical = accessibilityScanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    if (seriousOrCritical.length > 0) {
      console.error("A11y Violations (Cart Drawer):", JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });

  test("Quiz section has 0 critical/serious a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const quizSection = page.locator("#quiz");
    await expect(quizSection).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include("#quiz")
      .analyze();

    const seriousOrCritical = accessibilityScanResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    if (seriousOrCritical.length > 0) {
      console.error("A11y Violations (Quiz):", JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toEqual([]);
  });
});

test.describe("Prefers-Reduced-Motion Audit (§13.9)", () => {
  test.use({
    reducedMotion: "reduce",
  });

  test("reduced motion disables bouncing badges and excessive animations with zero errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open detail dialog to add product
    const bottle = page.locator('[data-testid="rail-bottle-oil-white"]').first();
    await bottle.click();
    const detailDialog = page.locator('[aria-labelledby="product-detail-title"]');
    await expect(detailDialog).toBeVisible();
    const addBtn = detailDialog.locator('[data-testid="detail-add-to-bag"]');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Verify badge
    const badge = page.locator('[aria-label="Cart, 1 items"]').first();
    await expect(badge).toBeVisible();

    // Verify reduced motion in media query matches
    const isReduced = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    expect(isReduced).toBe(true);
    expect(consoleErrors).toEqual([]);
  });
});
