import { test, expect } from "@playwright/test";

test.describe("Stage 4: Hanging Bottle Rail & Jiggle Engine Spec", () => {
  test("renders rail with 5 bottles, handles sweep, and opens detail dialog on click", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 1. Verify rail section is present
    const rail = page.locator('[data-testid="bottle-rail-section"]');
    await expect(rail).toBeVisible();

    // 2. Verify all 5 bottles on rail
    const bottleIds = [
      "oil-white",
      "oil-black",
      "oil-green",
      "oil-orange",
      "oil-pink",
    ];

    for (const id of bottleIds) {
      await expect(page.locator(`[data-testid="rail-bottle-${id}"]`)).toBeVisible();
    }

    // 4. Simulate pointer sweep across the bottles
    const railBox = await rail.boundingBox();
    if (railBox) {
      // Rapid sweep from left to right across rail
      await page.mouse.move(railBox.x + 50, railBox.y + railBox.height / 2);
      await page.mouse.move(railBox.x + railBox.width - 50, railBox.y + railBox.height / 2, {
        steps: 10,
      });
    }

    // 5. Click on Forest Green bottle to open temporary detail dialog
    const greenBottle = page.locator('[data-testid="rail-bottle-oil-green"]');
    await greenBottle.click();

    // Verify detail dialog opened
    const dialog = page.locator("role=dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Forest Green" })).toBeVisible();
    await expect(dialog.getByText("Ayurvedic Classic")).toBeVisible();

    // Close dialog
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});
