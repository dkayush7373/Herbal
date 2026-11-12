import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Layering and stacking contexts", () => {
  it("delight particle canvas operates behind modal and drawer overlays", () => {
    const src = readFileSync(
      resolve(__dirname, "../components/delight/delight-layer.tsx"),
      "utf-8"
    );
    // Ensure delight layer does not exceed z-20
    expect(src).toMatch(/z-20/);
    expect(src).not.toMatch(/z-50/);
  });
});
