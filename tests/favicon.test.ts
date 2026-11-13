import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Favicon and App Icon Assets (§Bug 1 Verification)", () => {
  it("verifies public/favicon.ico exists and has valid non-zero size", () => {
    const faviconPath = path.resolve(process.cwd(), "public", "favicon.ico");
    expect(fs.existsSync(faviconPath)).toBe(true);
    const stat = fs.statSync(faviconPath);
    expect(stat.size).toBeGreaterThan(0);
  });

  it("verifies app/icon.tsx exists and exports valid ImageResponse size", async () => {
    const iconModulePath = path.resolve(process.cwd(), "app", "icon.tsx");
    expect(fs.existsSync(iconModulePath)).toBe(true);
    const iconModule = await import("@/app/icon");
    expect(iconModule.size).toBeDefined();
    expect(iconModule.size.width).toBe(32);
    expect(iconModule.size.height).toBe(32);
    expect(iconModule.contentType).toBe("image/png");
  });
});
