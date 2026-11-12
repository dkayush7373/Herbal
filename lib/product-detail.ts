import { Product, PRODUCTS, getProduct, getPrice, formatINR, Size } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/site";

export type IngredientIconType = "leaf" | "flower" | "seed" | "root";

export interface DetailIngredient {
  name: string;
  benefit: string;
  icon: IngredientIconType;
}

export interface ProductDetailExtended {
  id: string;
  benefits: [string, string, string];
  badge: string | null;
  ingredients: DetailIngredient[];
  freeFrom: string[];
  bestFor: string;
  usage: string[];
  timeline: string;
  patchTest: string;
  shelfLifeMonths: number | null;
  faq: { question: string; answer: string }[];
  rating: number | null;
  reviewCount: number | null;
}

export const PRODUCT_DETAILS: Record<string, ProductDetailExtended> = {
  "oil-white": {
    id: "oil-white",
    benefits: ["Deep Nourishment", "Scalp Comfort", "Softness"],
    badge: null,
    ingredients: [
      {
        name: "Virgin Coconut Oil",
        benefit: "Deeply nourishes hair shafts and locks in moisture",
        icon: "seed",
      },
      {
        name: "Amla (Indian Gooseberry)",
        benefit: "Rich in Vitamin C to support hair vitality",
        icon: "leaf",
      },
      {
        name: "Neem Leaf Extract",
        benefit: "Purifies and maintains a calm scalp environment",
        icon: "leaf",
      },
      {
        name: "Fenugreek Seed",
        benefit: "Natural protein source to enhance hair softness",
        icon: "seed",
      },
    ],
    freeFrom: ["Parabens", "Sulfates"],
    bestFor: "Everyday hair balance and gentle scalp care",
    usage: [
      "Take 5–10 ml onto palms and warm gently between hands",
      "Massage evenly into scalp using circular fingertip motions for 5 minutes",
      "Leave on for at least 1 hour or overnight before washing with mild herbal cleanser",
    ],
    timeline:
      "Individual results may vary. Visible softness in 2 weeks; sustained scalp comfort and resilience with 4–6 weeks of regular application.",
    patchTest:
      "Apply a small drop behind the ear or inside inner elbow 24 hours prior to first use. Discontinue if irritation develops.",
    shelfLifeMonths: null,
    faq: [
      SITE_CONFIG.faqs[0],
      SITE_CONFIG.faqs[1],
      SITE_CONFIG.faqs[3],
    ],
    rating: null,
    reviewCount: null,
  },
  "oil-black": {
    id: "oil-black",
    benefits: ["Strength Care", "Root Nourishment", "Breakage Care"],
    badge: null,
    ingredients: [
      {
        name: "Cold-Pressed Black Sesame Oil",
        benefit: "Warm base that deeply penetrates root follicles",
        icon: "seed",
      },
      {
        name: "Bhringraj (False Daisy)",
        benefit: "Traditional Ayurvedic herb revered for root nourishment",
        icon: "leaf",
      },
      {
        name: "Brahmi (Bacopa Monnieri)",
        benefit: "Calms the scalp and helps maintain strand vitality",
        icon: "leaf",
      },
      {
        name: "Amla & Fenugreek",
        benefit: "Strengthens the outer hair structure against breakage",
        icon: "root",
      },
    ],
    freeFrom: ["Parabens", "Sulfates"],
    bestFor: "Root nourishment and intense strength care",
    usage: [
      "Dispense 8–12 ml and gently warm the oil between your palms",
      "Part hair into sections and thoroughly massage into roots and scalp",
      "Wrap with a warm towel for 20 minutes; leave for 2+ hours before gentle cleansing",
    ],
    timeline:
      "Individual results may vary. Noticeable strand resilience and root nourishment within 3–4 weeks of consistent ritual use.",
    patchTest:
      "Apply a small drop behind the ear or inside inner elbow 24 hours prior to first use. Discontinue if irritation develops.",
    shelfLifeMonths: null,
    faq: [
      SITE_CONFIG.faqs[0],
      SITE_CONFIG.faqs[2],
      SITE_CONFIG.faqs[3],
    ],
    rating: null,
    reviewCount: null,
  },
  "oil-green": {
    id: "oil-green",
    benefits: ["Scalp Balance", "Everyday Care", "Softness"],
    badge: null,
    ingredients: [
      {
        name: "Pure Sesame & Coconut Oil",
        benefit: "Balanced carrier matrix rich in natural lipids",
        icon: "seed",
      },
      {
        name: "Neem (Azadirachta Indica)",
        benefit: "Keeps scalp balanced, clean, and invigorated",
        icon: "leaf",
      },
      {
        name: "Hibiscus Rosa-Sinensis",
        benefit: "Conditions hair texture and promotes softness",
        icon: "flower",
      },
      {
        name: "Tulsi (Holy Basil)",
        benefit: "Supports scalp hygiene and natural protection",
        icon: "leaf",
      },
    ],
    freeFrom: ["Parabens", "Sulfates"],
    bestFor: "Scalp balance and heritage Ayurvedic care",
    usage: [
      "Apply 6–10 ml gently onto dry or damp scalp and throughout strand lengths",
      "Focus massage on temples and crown with relaxed, steady pressure",
      "Allow herbs to absorb for at least 45 minutes before rinsing with cool water",
    ],
    timeline:
      "Individual results may vary. Balanced scalp hygiene and natural hair lustre apparent after 2–3 weeks of application.",
    patchTest:
      "Apply a small drop behind the ear or inside inner elbow 24 hours prior to first use. Discontinue if irritation develops.",
    shelfLifeMonths: null,
    faq: [
      SITE_CONFIG.faqs[0],
      SITE_CONFIG.faqs[1],
      SITE_CONFIG.faqs[3],
    ],
    rating: null,
    reviewCount: null,
  },
  "oil-orange": {
    id: "oil-orange",
    benefits: ["Hair Growth Care", "Scalp Stimulation", "Root Nourishment"],
    badge: null,
    ingredients: [
      {
        name: "Cold-Pressed Almond & Castor Oil",
        benefit: "Nutrient-dense fatty acids for dense hair care",
        icon: "seed",
      },
      {
        name: "Methi (Fenugreek) Sprout Extract",
        benefit: "Rich in amino acids for root nourishment",
        icon: "seed",
      },
      {
        name: "Curry Leaf Extract",
        benefit: "Rich in antioxidants that support follicle health",
        icon: "leaf",
      },
      {
        name: "Rosemary & Citrus Peel Oil",
        benefit: "Invigorates scalp micro-circulation naturally",
        icon: "flower",
      },
    ],
    freeFrom: ["Parabens", "Sulfates"],
    bestFor: "Scalp stimulation and hair growth care",
    usage: [
      "Apply 8–10 ml directly to scalp using applicator or fingertips",
      "Massage actively for 7 minutes to gently stimulate circulation",
      "Leave on for 1 to 3 hours before washing with gentle sulfate-free cleanser",
    ],
    timeline:
      "Individual results may vary. Stimulates scalp circulation immediately; supports healthy follicle environment over 6–8 weeks.",
    patchTest:
      "Apply a small drop behind the ear or inside inner elbow 24 hours prior to first use. Discontinue if irritation develops.",
    shelfLifeMonths: null,
    faq: [
      SITE_CONFIG.faqs[0],
      SITE_CONFIG.faqs[2],
      SITE_CONFIG.faqs[4],
    ],
    rating: null,
    reviewCount: null,
  },
  "oil-pink": {
    id: "oil-pink",
    benefits: ["Silky Shine", "Frizz Control", "Lightweight Hydration"],
    badge: null,
    ingredients: [
      {
        name: "Organic Golden Jojoba Oil",
        benefit: "Biomimetic natural wax that mimics scalp sebum",
        icon: "seed",
      },
      {
        name: "Hibiscus Petal Infusion",
        benefit: "Enhances luminous shine and smoothens cuticles",
        icon: "flower",
      },
      {
        name: "Rose Floral Wax",
        benefit: "Imparts a delicate natural scent and seals cuticle moisture",
        icon: "flower",
      },
      {
        name: "Aloe Vera Oil Extract",
        benefit: "Provides lightweight hydration without greasy weight",
        icon: "leaf",
      },
    ],
    freeFrom: ["Parabens", "Sulfates"],
    bestFor: "Luminous shine, flyaway smoothing, and frizz control",
    usage: [
      "Warm 4–6 drops for strand finishing, or 8 ml for full pre-wash treatment",
      "Smooth evenly along mid-lengths to ends to tame flyaways and enhance shine",
      "Can be used as a pre-wash deep gloss oil or sparingly as a post-wash finishing touch",
    ],
    timeline:
      "Individual results may vary. Instant flyaway control and silky radiance on day 1; long-term cuticular smoothness with ongoing use.",
    patchTest:
      "Apply a small drop behind the ear or inside inner elbow 24 hours prior to first use. Discontinue if irritation develops.",
    shelfLifeMonths: null,
    faq: [
      SITE_CONFIG.faqs[0],
      SITE_CONFIG.faqs[1],
      SITE_CONFIG.faqs[3],
    ],
    rating: null,
    reviewCount: null,
  },
};

export function getProductDetail(id: string): ProductDetailExtended | undefined {
  return PRODUCT_DETAILS[id];
}
