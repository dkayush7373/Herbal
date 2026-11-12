import { describe, it, expect } from "vitest";
import { SITE_CONFIG } from "@/lib/site";

describe("Reviews configuration and verification", () => {
  it("has valid reviews configured", () => {
    expect(SITE_CONFIG.reviews.length).toBeGreaterThan(0);
  });

  it("all production reviews have rating between 1 and 5", () => {
    SITE_CONFIG.reviews.forEach((review) => {
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(review.author.length).toBeGreaterThan(0);
      expect(review.comment.length).toBeGreaterThan(0);
    });
  });

  it("no reviews contain active demo badges or unverified flags in production dataset", () => {
    SITE_CONFIG.reviews.forEach((review) => {
      expect(review.isDemo).toBeFalsy();
      expect(review.verified).toBe(true);
    });
  });
});
