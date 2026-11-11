import { test, expect } from "@playwright/test";

async function addBottleToBag(page: any, id: string) {
  // If drawer is open, close it with Escape
  const drawerTitle = page.locator("text=Your Herbal Bag");
  if (await drawerTitle.isVisible()) {
    await page.keyboard.press("Escape");
    await expect(drawerTitle).toBeHidden();
  }
  const bottle = page.locator(`[data-testid="rail-bottle-${id}"]`).first();
  await bottle.click();
  const detailDialog = page.locator('[aria-labelledby="product-detail-title"]');
  await expect(detailDialog).toBeVisible();
  const addBtn = detailDialog.locator('[data-testid="detail-add-to-bag"]');
  await addBtn.click();
  await expect(detailDialog).toHaveCount(0);
}

test.describe("Stage 3: Cart, Drawer, Persistence & WhatsApp Checkout Spec", () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("full cart lifecycle: add, duplicate merges, inc/dec, dec-to-0 removes, persistence across reload, subtotal", async ({
    page,
  }) => {
    await page.goto("/?ref=partner-42");
    await page.waitForLoadState("networkidle");

    // Initially cart count is not shown or 0
    const badge = page.locator('[data-testid="cart-badge-count"]');
    await expect(badge).toHaveCount(0);

    // 1. Add Classic White (349)
    await addBottleToBag(page, "oil-white");
    await expect(badge).toHaveText("1");

    // 2. Duplicate add merges into quantity 2
    await addBottleToBag(page, "oil-white");
    await expect(badge).toHaveText("2");

    // 3. Add Midnight Black (399)
    await addBottleToBag(page, "oil-black");
    await expect(badge).toHaveText("3");

    // 4. Open Drawer if not already open
    const drawerTitle = page.locator("text=Your Herbal Bag");
    if (!(await drawerTitle.isVisible())) {
      await page.locator('button[aria-label^="Cart"]').click();
      await expect(drawerTitle).toBeVisible();
    }

    // Verify lines exist
    const whiteLine = page.locator('[data-testid="cart-line-oil-white"]');
    const blackLine = page.locator('[data-testid="cart-line-oil-black"]');
    await expect(whiteLine).toBeVisible();
    await expect(blackLine).toBeVisible();

    // Verify subtotal: 349*2 + 399 = 1097
    const subtotalEl = page.locator('[data-testid="cart-subtotal"]');
    await expect(subtotalEl).toContainText("1,097");

    // 5. Test Quantity Increase on Black (399 x 2)
    const incBlack = blackLine.locator('button[aria-label^="Increase quantity"]');
    await incBlack.click();
    await expect(blackLine.locator('[data-testid="qty-oil-black"]')).toHaveText("2");
    // Subtotal now 349*2 + 399*2 = 1496
    await expect(subtotalEl).toContainText("1,496");

    // 6. Test Quantity Decrease on White (qty 2 -> 1)
    const decWhite = whiteLine.locator('button[aria-label^="Decrease quantity"]');
    await decWhite.click();
    await expect(whiteLine.locator('[data-testid="qty-oil-white"]')).toHaveText("1");

    // 7. Dec-to-0 removes White line item
    await decWhite.click();
    await expect(page.locator('[data-testid="cart-line-oil-white"]')).toHaveCount(0);

    // 8. Reload page: verify cart persistence in localStorage
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Cart badge should remember 2 items of Midnight Black
    await expect(badge).toHaveText("2");

    // Open drawer again
    await page.locator('button[aria-label^="Cart"]').click();
    await expect(page.locator('[data-testid="cart-line-oil-black"]')).toBeVisible();

    // 9. Remove item completely with trash button
    const removeBtn = page.locator('button[aria-label^="Remove"]');
    await removeBtn.click();

    // Now empty state should show
    await expect(page.locator("text=Your bag is empty")).toBeVisible();
  });

  test("handles corrupt localStorage safely without crashing", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("akatsuki.cart.v1", "{corrupted_invalid_json: true");
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Page must load cleanly and badge should be 0
    const badge = page.locator('[data-testid="cart-badge-count"]');
    await expect(badge).toHaveCount(0);
  });
});
