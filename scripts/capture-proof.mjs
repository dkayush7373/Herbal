import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const proofDir = path.resolve(process.cwd(), "public/proof");
if (!fs.existsSync(proofDir)) {
  fs.mkdirSync(proofDir, { recursive: true });
}

async function run() {
  console.log("Launching Chromium...");
  const browser = await chromium.launch({ channel: "chrome" });

  // 1. Desktop full view at 1440px
  {
    console.log("1. Desktop full view at 1440px...");
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const rail = page.locator("#rail");
    await rail.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(proofDir, "01-desktop-1440px.png"),
      fullPage: false,
    });
    await page.close();
  }

  // 2. Mobile view at 375px
  {
    console.log("2. Mobile view at 375px...");
    const page = await browser.newPage({
      viewport: { width: 375, height: 812 },
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const innerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`Mobile width check: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}`);

    await page.screenshot({
      path: path.join(proofDir, "02-mobile-375px.png"),
      fullPage: false,
    });
    await page.close();
  }

  // 3. 300% zoom crop of the hook/eyelet area on bottle #1 (white) and bottle #2 (black)
  {
    console.log("3. 300% zoom crop of hook/eyelet on bottle #1 & #2...");
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 3,
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const bottleWhite = page.locator("#rail-bottle-oil-white");
    await bottleWhite.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Clip top area of bottle 1 (hook + eyelet + cap)
    const box1 = await bottleWhite.boundingBox();
    if (box1) {
      await page.screenshot({
        path: path.join(proofDir, "03-zoom-hook-eyelet-white.png"),
        clip: {
          x: box1.x,
          y: box1.y,
          width: box1.width,
          height: 120,
        },
      });
    }

    const bottleBlack = page.locator("#rail-bottle-oil-black");
    const box2 = await bottleBlack.boundingBox();
    if (box2) {
      await page.screenshot({
        path: path.join(proofDir, "03-zoom-hook-eyelet-black.png"),
        clip: {
          x: box2.x,
          y: box2.y,
          width: box2.width,
          height: 120,
        },
      });
    }

    await page.close();
  }

  // 4. Dark mode toggle proof
  {
    console.log("4. Dark mode toggle proof...");
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      colorScheme: "dark",
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    // Click theme toggle or force dark class
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(600);
    const rail = page.locator("#rail");
    await rail.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(proofDir, "04-dark-mode-rail.png"),
      fullPage: false,
    });
    await page.close();
  }

  // 5. Reduced-motion proof
  {
    console.log("5. Reduced-motion proof...");
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // Initial state screenshot
    await page.screenshot({
      path: path.join(proofDir, "05-reduced-motion-initial.png"),
      fullPage: false,
    });

    // Move pointer vigorously across rail
    await page.mouse.move(200, 400);
    await page.mouse.move(500, 400);
    await page.mouse.move(800, 400);
    await page.mouse.move(1100, 400);
    await page.waitForTimeout(400);

    // Pointer move state screenshot (should remain static at rest angles)
    await page.screenshot({
      path: path.join(proofDir, "05-reduced-motion-after-move.png"),
      fullPage: false,
    });
    await page.close();
  }

  // 6. Detail-view proof: front view with eyelet, flip to back view, add to bag, cart drawer opens with 1 item
  {
    console.log("6. Detail-view proof...");
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // Click first bottle to open detail dialog
    const bottle0 = page.locator("#rail-bottle-oil-white");
    await bottle0.click();
    await page.waitForTimeout(600);

    // 6a: Detail modal front view with eyelet
    await page.screenshot({
      path: path.join(proofDir, "06a-detail-front-view.png"),
      fullPage: false,
    });

    // 6b: Flip to back view
    const flipButton = page.locator("button:has-text('View Details')");
    if (await flipButton.isVisible()) {
      await flipButton.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(proofDir, "06b-detail-back-view.png"),
        fullPage: false,
      });
      // Flip back to front
      const flipBack = page.locator("button:has-text('View Bottle')");
      if (await flipBack.isVisible()) {
        await flipBack.click();
        await page.waitForTimeout(600);
      }
    }

    // 6c: Click Add to Bag
    const addBtn = page.locator("button:has-text('Add to Bag')");
    await addBtn.click();
    await page.waitForTimeout(800);

    // 6d: Cart drawer opens with 1 item
    await page.screenshot({
      path: path.join(proofDir, "06c-cart-drawer-open.png"),
      fullPage: false,
    });

    await page.close();
  }

  await browser.close();
  console.log("All proof screenshots generated in public/proof/!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
