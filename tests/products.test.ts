import { describe, it, expect } from "vitest";
import { PRODUCTS, getProduct, getPrice, formatINR, Size } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/site";

describe("Products Data & Pricing Specification", () => {
  it("defines exactly 5 authentic Ayurvedic oil variants", () => {
    expect(PRODUCTS).toHaveLength(5);
    const ids = PRODUCTS.map((p) => p.id);
    expect(ids).toEqual([
      "oil-white",
      "oil-black",
      "oil-green",
      "oil-orange",
      "oil-pink",
    ]);
  });

  it("returns authentic 100 ml prices without hallucination", () => {
    expect(getPrice("oil-white", "100 ml")).toBe(349);
    expect(getPrice("oil-black", "100 ml")).toBe(399);
    expect(getPrice("oil-green", "100 ml")).toBe(379);
    expect(getPrice("oil-orange", "100 ml")).toBe(369);
    expect(getPrice("oil-pink", "100 ml")).toBe(359);
  });

  it("CRITICAL: 200 ml size ALWAYS returns null (unpriced / Coming soon)", () => {
    PRODUCTS.forEach((product) => {
      const price200 = getPrice(product.id, "200 ml");
      expect(price200).toBeNull();
    });
  });

  it("returns null for non-existent product or invalid size", () => {
    expect(getPrice("unknown-id", "100 ml")).toBeNull();
    expect(getPrice("oil-white", "500 ml" as Size)).toBeNull();
  });

  it("formats INR currency correctly using en-IN locale", () => {
    const formatted = formatINR(349);
    expect(formatted).toMatch(/₹\s*349/);
  });

  it("STRICT: zero medical claims in product descriptions or taglines", () => {
    const forbiddenClaims = [
      /cure[s]?/i,
      /treat[s]?/i,
      /prevent[s]?/i,
      /clinically proven/i,
      /fda approved/i,
    ];

    PRODUCTS.forEach((p) => {
      forbiddenClaims.forEach((claim) => {
        expect(p.description).not.toMatch(claim);
        expect(p.tagline).not.toMatch(claim);
      });
    });
  });

  it("validates site configuration defaults", () => {
    expect(SITE_CONFIG.shipping.freeShippingThreshold).toBe(499);
    expect(SITE_CONFIG.referral.reward).toBeUndefined();
    // In production without env vars, whatsappNumber defaults to empty string or valid regex
    if (SITE_CONFIG.whatsappNumber) {
      expect(SITE_CONFIG.whatsappNumber).toMatch(/^[1-9]\d{9,14}$/);
    } else {
      expect(SITE_CONFIG.whatsappNumber).toBe("");
    }
  });
});
