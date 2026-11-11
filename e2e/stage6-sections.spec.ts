import { test, expect } from "@playwright/test";

test.describe("Stage 6: Full Experience & Sections Verification Spec", () => {
  test("renders all sections, tests quiz flow, and verifies no horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 1. Verify No Horizontal Overflow (scrollWidth <= innerWidth)
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBe(false);

    // 2. Verify Key Sections are in document
    await expect(page.locator("text=Roots of Nature. Strength of Ayurveda.")).toBeVisible();
    await expect(page.locator("text=Potent Ayurvedic Botanicals")).toBeVisible();
    await expect(page.locator("text=Find Your Ayurvedic Oil")).toBeVisible();
    await expect(page.locator("text=The Three-Step Ayurvedic Ritual")).toBeVisible();
    await expect(page.locator("text=Frequently Asked Questions")).toBeVisible();
    await expect(page.locator("text=Join the Ayurvedic Herbal Circle")).toBeVisible();

    // 3. Complete Quiz Flow
    // Question 1: Dry or thirsty
    await page.locator("text=Dry or thirsty").click();
    // Question 2: Daily / Alternate days
    await page.locator("text=Daily / Alternate days").click();
    // Question 3: Fresh & Invigorating
    await page.locator("text=Fresh & Invigorating").click();

    // Verify Result Card is displayed
    const resultCard = page.locator('[data-testid="quiz-result-card"]');
    await expect(resultCard).toBeVisible();
    await expect(resultCard.getByText("Sunrise Orange")).toBeVisible();

    // 4. Test FAQ Accordion expansion
    const firstFaqTrigger = page.locator("text=How often should I apply AKATSUKI Herbal Hair Oil?");
    await firstFaqTrigger.click();
    await expect(
      page.locator("text=For optimal hair nourishment, apply 2 to 3 times a week.")
    ).toBeVisible();

    // 5. Verify WhatsApp FAB
    const fab = page.locator('a[aria-label="Chat with AKATSUKI on WhatsApp"]');
    await expect(fab).toBeVisible();
    const href = await fab.getAttribute("href");
    expect(href).toContain("https://wa.me/");
  });
});
