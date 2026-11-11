export type Size = "100 ml" | "200 ml";

export type ProductConcern =
  | "everyday"
  | "intense"
  | "classic"
  | "growth-care"
  | "shine";

export interface ProductTokens {
  body: string;
  cap: string;
  accent: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  prices: Partial<Record<Size, number>>;
  sizes: Size[];
  tokens: ProductTokens;
  image: string;
  ingredients: string[];
  howTo: string[];
  concern: ProductConcern;
}

export const PRODUCTS: Product[] = [
  {
    id: "oil-white",
    name: "Classic White",
    tagline: "Original Herbal",
    description:
      "Handcrafted everyday botanical blend that gently nourishes the scalp, softens strands, and helps maintain daily hair balance.",
    prices: {
      "100 ml": 349,
    },
    sizes: ["100 ml", "200 ml"],
    tokens: {
      body: "#E9E4DA",
      cap: "#C9C3B4",
      accent: "#8A8474",
    },
    image: "/images/oil-white.jpg",
    ingredients: [
      "Virgin Coconut Oil — Deeply nourishes hair shafts and locks in moisture",
      "Amla (Indian Gooseberry) — Rich in Vitamin C to support hair vitality",
      "Neem Leaf Extract — Purifies and maintains a calm scalp environment",
      "Fenugreek Seed — Natural protein source to enhance hair softness",
    ],
    howTo: [
      "Take 5–10 ml onto palms and warm gently between hands",
      "Massage evenly into scalp using circular fingertip motions for 5 minutes",
      "Leave on for at least 1 hour or overnight before washing with mild herbal cleanser",
    ],
    concern: "everyday",
  },
  {
    id: "oil-black",
    name: "Midnight Black",
    tagline: "Intense Strength",
    description:
      "Potent traditional infusion formulated with concentrated botanical extracts to deeply nourish roots and support resilient hair strength.",
    prices: {
      "100 ml": 399,
    },
    sizes: ["100 ml", "200 ml"],
    tokens: {
      body: "#1B1B1B",
      cap: "#2E2E2E",
      accent: "#E8B923",
    },
    image: "/images/oil-black.jpg",
    ingredients: [
      "Cold-Pressed Black Sesame Oil — Warm base that deeply penetrates root follicles",
      "Bhringraj (False Daisy) — Traditional Ayurvedic herb revered for root nourishment",
      "Brahmi (Bacopa Monnieri) — Calms the scalp and helps maintain strand vitality",
      "Amla & Fenugreek — Strengthens the outer hair structure against breakage",
    ],
    howTo: [
      "Dispense 8–12 ml and gently warm the oil between your palms",
      "Part hair into sections and thoroughly massage into roots and scalp",
      "Wrap with a warm towel for 20 minutes; leave for 2+ hours before gentle cleansing",
    ],
    concern: "intense",
  },
  {
    id: "oil-green",
    name: "Forest Green",
    tagline: "Ayurvedic Classic",
    description:
      "Timeless heritage formulation combining ancient forest herbs to balance scalp vitality and foster natural lustre.",
    prices: {
      "100 ml": 379,
    },
    sizes: ["100 ml", "200 ml"],
    tokens: {
      body: "#0F3D2E",
      cap: "#17453A",
      accent: "#E8B923",
    },
    image: "/images/oil-green.jpg",
    ingredients: [
      "Pure Sesame & Coconut Oil — Balanced carrier matrix rich in natural lipids",
      "Neem (Azadirachta Indica) — Keeps scalp balanced, clean, and invigorated",
      "Hibiscus Rosa-Sinensis — Conditions hair texture and promotes softness",
      "Tulsi (Holy Basil) — Supports scalp hygiene and natural protection",
    ],
    howTo: [
      "Apply 6–10 ml gently onto dry or damp scalp and throughout strand lengths",
      "Focus massage on temples and crown with relaxed, steady pressure",
      "Allow herbs to absorb for at least 45 minutes before rinsing with cool water",
    ],
    concern: "classic",
  },
  {
    id: "oil-orange",
    name: "Sunrise Orange",
    tagline: "Hair Growth Care",
    description:
      "Invigorating botanical blend designed to stimulate scalp micro-circulation and support optimal conditions for hair growth care.",
    prices: {
      "100 ml": 369,
    },
    sizes: ["100 ml", "200 ml"],
    tokens: {
      body: "#D9772E",
      cap: "#B85F1F",
      accent: "#FFF2DA",
    },
    image: "/images/oil-orange.jpg",
    ingredients: [
      "Cold-Pressed Almond & Castor Oil — Nutrient-dense fatty acids for dense hair care",
      "Methi (Fenugreek) Sprout Extract — Rich in amino acids for root nourishment",
      "Curry Leaf Extract — Rich in antioxidants that support follicle health",
      "Rosemary & Citrus Peel Oil — Invigorates scalp micro-circulation naturally",
    ],
    howTo: [
      "Apply 8–10 ml directly to scalp using applicator or fingertips",
      "Massage actively for 7 minutes to gently stimulate circulation",
      "Leave on for 1 to 3 hours before washing with gentle sulfate-free cleanser",
    ],
    concern: "growth-care",
  },
  {
    id: "oil-pink",
    name: "Rose Pink",
    tagline: "Silky Shine",
    description:
      "Lightweight floral-infused hair elixir that smooths frizz, reflects luminous sheen, and leaves hair silky and manageable.",
    prices: {
      "100 ml": 359,
    },
    sizes: ["100 ml", "200 ml"],
    tokens: {
      body: "#C97A8A",
      cap: "#A75F6D",
      accent: "#FFF8E7",
    },
    image: "/images/oil-pink.jpg",
    ingredients: [
      "Organic Golden Jojoba Oil — Biomimetic natural wax that mimics scalp sebum",
      "Hibiscus Petal Infusion — Enhances luminous shine and smoothens cuticles",
      "Rose Floral Wax — Imparts a delicate natural scent and seals cuticle moisture",
      "Aloe Vera Oil Extract — Provides lightweight hydration without greasy weight",
    ],
    howTo: [
      "Warm 4–6 drops for strand finishing, or 8 ml for full pre-wash treatment",
      "Smooth evenly along mid-lengths to ends to tame flyaways and enhance shine",
      "Can be used as a pre-wash deep gloss oil or sparingly as a post-wash finishing touch",
    ],
    concern: "shine",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getPrice(id: string, size: Size): number | null {
  const product = getProduct(id);
  if (!product) return null;
  const price = product.prices[size];
  return typeof price === "number" ? price : null;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
