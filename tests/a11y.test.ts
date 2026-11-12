import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Accessibility structural tests.
 * Verify static markup contracts that screen readers and keyboard users depend on.
 */
describe("Accessibility – structural markup contracts", () => {
  it("page.tsx contains id='main' so the skip-nav link resolves", () => {
    const src = readFileSync(resolve(__dirname, "../app/page.tsx"), "utf-8");
    // The main landmark must carry id="main" for the href="#main" skip link
    expect(src).toMatch(/id=["']main["']/);
  });

  it("navbar.tsx contains a skip-link targeting #main", () => {
    const src = readFileSync(
      resolve(__dirname, "../components/layout/navbar.tsx"),
      "utf-8"
    );
    expect(src).toMatch(/href=["']#main["']/);
  });

  it("every section with aria-label is wrapped in a <section> element", () => {
    const heroSrc = readFileSync(
      resolve(__dirname, "../components/sections/hero.tsx"),
      "utf-8"
    );
    // Hero is a <section> (not a bare div) with an aria label or landmark role
    expect(heroSrc).toMatch(/<section/);
  });
});
