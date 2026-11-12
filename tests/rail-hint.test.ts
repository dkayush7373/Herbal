import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Rail interactive hints", () => {
  it("renders a persistent guidance hint with data-testid='rail-interaction-hint'", () => {
    const src = readFileSync(
      resolve(__dirname, "../components/rail/bottle-rail.tsx"),
      "utf-8"
    );
    expect(src).toMatch(/data-testid=["']rail-interaction-hint["']/);
    expect(src).toMatch(/Select any bottle to view ingredients/);
  });
});
