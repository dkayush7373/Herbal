import { PRODUCTS, Product, ProductConcern } from "@/lib/products";

export interface QuizAnswers {
  hairFeel: "dry" | "normal" | "fine";
  routine: "daily" | "weekly";
  scentVibe: "herbal" | "fresh" | "floral";
}

/**
 * Pure mapping logic from user quiz answers to recommended Ayurvedic oil variant.
 * Strictly avoids medical diagnosis or therapeutic claims.
 */
export function mapQuizAnswersToProduct(answers: QuizAnswers): Product {
  const { hairFeel, routine, scentVibe } = answers;

  let targetConcern: ProductConcern = "everyday";

  if (scentVibe === "floral" || hairFeel === "fine") {
    // Floral or fine hair seeks lightweight silky shine
    targetConcern = "shine";
  } else if (hairFeel === "dry" && routine === "weekly") {
    // Dry hair with weekly deep soak seeks intense strength
    targetConcern = "intense";
  } else if (scentVibe === "fresh" || (hairFeel === "dry" && routine === "daily")) {
    // Fresh citrus / active scalp care seeks growth-care
    targetConcern = "growth-care";
  } else if (scentVibe === "herbal" && routine === "weekly") {
    // Traditional weekly herbal soak seeks classic heritage blend
    targetConcern = "classic";
  } else {
    // Balanced daily botanical maintenance
    targetConcern = "everyday";
  }

  const matched = PRODUCTS.find((p) => p.concern === targetConcern);
  return matched || PRODUCTS[0];
}
