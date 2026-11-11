import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Stage 2: Products & Image Pipeline Verification", () => {
  test("renders all 5 herbal oil bottles and captures verification screenshot", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify all 5 bottles are rendered
    const bottleIds = [
      "oil-white",
      "oil-black",
      "oil-green",
      "oil-orange",
      "oil-pink",
    ];

    for (const id of bottleIds) {
      const bottleEl = page.locator(`[data-testid="bottle-${id}"]`);
      await expect(bottleEl).toBeVisible();
    }

    // Ensure verification directory exists
    const verificationDir = path.resolve(process.cwd(), "verification");
    if (!fs.existsSync(verificationDir)) {
      fs.mkdirSync(verificationDir, { recursive: true });
    }

    // Capture screenshot
    await page.screenshot({
      path: path.join(verificationDir, "s2-bottles-gallery.png"),
      fullPage: true,
    });

    // Zero console errors
    expect(consoleErrors).toEqual([]);
  });
});
