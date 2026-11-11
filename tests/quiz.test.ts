import { describe, it, expect } from "vitest";
import { mapQuizAnswersToProduct, QuizAnswers } from "@/lib/quiz";
import { PRODUCTS } from "@/lib/products";

describe("Find Your Oil Quiz Specification (§10.6 & §13)", () => {
  const hairFeels: QuizAnswers["hairFeel"][] = ["dry", "normal", "fine"];
  const routines: QuizAnswers["routine"][] = ["daily", "weekly"];
  const scentVibes: QuizAnswers["scentVibe"][] = ["herbal", "fresh", "floral"];

  it("maps every possible answer combination (18 permutations) to a valid authentic product", () => {
    const validIds = new Set(PRODUCTS.map((p) => p.id));

    let combinationCount = 0;
    for (const hairFeel of hairFeels) {
      for (const routine of routines) {
        for (const scentVibe of scentVibes) {
          combinationCount++;
          const result = mapQuizAnswersToProduct({
            hairFeel,
            routine,
            scentVibe,
          });

          expect(result).toBeDefined();
          expect(validIds.has(result.id)).toBe(true);
        }
      }
    }

    expect(combinationCount).toBe(18);
  });

  it("recommends Rose Pink (shine) for floral scent preference", () => {
    const pick = mapQuizAnswersToProduct({
      hairFeel: "normal",
      routine: "daily",
      scentVibe: "floral",
    });
    expect(pick.id).toBe("oil-pink");
  });

  it("recommends Midnight Black (intense) for dry hair with weekly ritual", () => {
    const pick = mapQuizAnswersToProduct({
      hairFeel: "dry",
      routine: "weekly",
      scentVibe: "herbal",
    });
    expect(pick.id).toBe("oil-black");
  });

  it("recommends Sunrise Orange (growth-care) for fresh zesty scent vibe", () => {
    const pick = mapQuizAnswersToProduct({
      hairFeel: "normal",
      routine: "daily",
      scentVibe: "fresh",
    });
    expect(pick.id).toBe("oil-orange");
  });
});
