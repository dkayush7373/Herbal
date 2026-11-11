import { test, expect } from "@playwright/test";

test.describe("Stage 5: Product Detail View, 3D Flip Card & Size Chips Spec", () => {
  test("opens detail view, toggles 3D flip card, tests size chips, share, and add to bag", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions for share fallback test
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/?ref=test-partner");
    await page.waitForLoadState("networkidle");

    // Click on Midnight Black bottle to open detail view
    const blackBottle = page.locator('[data-testid="rail-bottle-oil-black"]');
    await blackBottle.click();

    // Verify detail dialog opened
    const detailDialog = page.locator('[aria-labelledby="product-detail-title"]');
    await expect(detailDialog).toBeVisible();
    await expect(detailDialog.getByRole("heading", { name: "Midnight Black" })).toBeVisible();

    // 1. Verify 3D Flip Toggle (Front -> Back)
    const flipBtn = detailDialog.getByRole("button", { name: /View Details|View Bottle/ });
    await expect(flipBtn).toBeVisible();
    await flipBtn.click();

    // Back face should reveal Ingredients & Ritual
    await expect(detailDialog.getByText("Key Botanical Infusion")).toBeVisible();
    await expect(detailDialog.getByText("Ayurvedic Ritual (How to Use)")).toBeVisible();
    await expect(detailDialog.getByText("Paraben free · Natural · For all")).toBeVisible();

    // Toggle back to Front
    await flipBtn.click();
    await expect(detailDialog.getByText("Key Botanical Infusion")).toBeHidden();

    // 2. Verify Size Chips
    // 100 ml chip should be active and priced ₹399
    await expect(detailDialog.locator('[data-testid="size-chip-100-ml"]')).toBeVisible();

    // 200 ml chip should be disabled with Coming soon
    const chip200 = detailDialog.locator('[data-testid="size-chip-200-ml"]');
    await expect(chip200).toBeDisabled();

    // 3. Verify Share Button
    const shareBtn = detailDialog.getByRole("button", { name: /Share/ });
    await shareBtn.click();
    // Verify toast or copied state
    await expect(page.locator("text=Link copied to clipboard")).toBeVisible();

    // 4. Verify Add to Bag
    const addBtn = detailDialog.getByRole("button", { name: "Add to Bag" });
    await addBtn.click();

    // Product detail dialog should close and cart drawer should open with Midnight Black
    await expect(detailDialog).toHaveCount(0);
    await expect(page.locator("text=Your Herbal Bag")).toBeVisible();
    await expect(page.locator('[data-testid="cart-line-oil-black"]')).toBeVisible();
  });
});
