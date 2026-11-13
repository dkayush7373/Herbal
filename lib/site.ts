export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
  productName: string;
  isDemo?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  subtagline: string;
  whatsappNumber: string;
  newsletterEndpoint?: string;
  shipping: {
    freeShippingThreshold: number;
  };
  referral: {
    reward?: string; // undefined by default
  };
  socials: {
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
  };
  trustPills: string[];
  counters: Array<{
    label: string;
    value: number;
    suffix?: string;
    verified: boolean;
  }>;
  reviews: Review[];
  faqs: FaqItem[];
  quiz: {
    title: string;
    subtitle: string;
    questions: Array<{
      id: "hairFeel" | "routine" | "scentVibe";
      title: string;
      options: Array<{
        label: string;
        description: string;
        value: string;
      }>;
    }>;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "AKATSUKI",
  tagline: "Roots of Nature. Strength of Ayurveda.",
  subtagline:
    "Handcrafted 100% Ayurvedic Herbal Hair Oils infused with traditional botanicals to nourish roots, support hair strength, and maintain lasting lustre.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919844481633",
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || undefined,
  shipping: {
    freeShippingThreshold: 499,
  },
  referral: {
    // Demo — replace before launch (undefined by default unless configured)
    reward: undefined,
  },
  socials: {
    // Demo — replace before launch (empty/undefined links render accessible non-links)
    instagram: "https://instagram.com",
    facebook: undefined,
    x: undefined,
    youtube: undefined,
  },
  trustPills: [
    "100% Natural",
    "Paraben & Sulfate Free",
    "Men, Women & Kids",
    "Authentic Ayurvedic",
  ],
  counters: [
    { label: "Natural Ingredients", value: 100, suffix: "%", verified: true },
    { label: "Parabens & Sulfates", value: 0, suffix: "", verified: true },
    { label: "Core Ayurvedic Herbs", value: 5, suffix: "+", verified: true },
    // Customer counts are omitted or false until verified by owner
  ],
  reviews: [
    // Demo — replace before launch
    {
      id: "demo-rev-1",
      author: "Pooja Sharma",
      rating: 5,
      comment:
        "The Forest Green blend has a soothing herbal aroma. My scalp feels calm and my hair stays remarkably soft without feeling weighed down.",
      verified: true,
      productName: "Forest Green",
      isDemo: true,
    },
    // Demo — replace before launch
    {
      id: "demo-rev-2",
      author: "Arjun Mehta",
      rating: 5,
      comment:
        "Very clean formulation. Noticeable reduction in dryness after just two weeks of gentle scalp massage before showers.",
      verified: true,
      productName: "Midnight Black",
      isDemo: true,
    },
    // Demo — replace before launch
    {
      id: "demo-rev-3",
      author: "Sneha Reddy",
      rating: 5,
      comment:
        "Rose Pink gives an amazing, lightweight shine to my curls without any sticky residue. Perfect finishing oil.",
      verified: true,
      productName: "Rose Pink",
      isDemo: true,
    },
  ],
  faqs: [
    {
      question: "How often should I apply AKATSUKI Herbal Hair Oil?",
      answer:
        "For optimal hair nourishment, apply 2 to 3 times a week. Massage gently into your scalp and leave on for at least 45 minutes to 2 hours before washing with a mild cleanser. Leaving it overnight offers deeper conditioning.",
    },
    {
      question: "Which variant is best suited for daily hair maintenance?",
      answer:
        "Our Classic White (Original Herbal) is uniquely balanced with coconut, amla, and neem to nourish the scalp gently without heaviness, making it ideal for everyday or regular weekly routines.",
    },
    {
      question: "What herbs are infused into the formulations?",
      answer:
        "Every batch is infused with time-tested Ayurvedic botanicals including cold-pressed coconut, sesame, and almond oils, amla (Indian gooseberry), neem, hibiscus flowers, and fenugreek seeds.",
    },
    {
      question: "Are these oils safe for children and sensitive scalps?",
      answer:
        "Yes, our formulations are 100% Ayurvedic, free of parabens, mineral oils, synthetic dyes, and harsh artificial fragrances. They are crafted for men, women, and children.",
    },
    {
      question: "What bottle sizes are available?",
      answer:
        "All our hair oils are currently available in compact, travel-friendly 100 ml glass-feel bottles. Larger 200 ml family sizes are coming soon.",
    },
    {
      question: "What is your shipping policy and delivery timeline?",
      answer:
        "Orders above ₹499 qualify for Free Standard Delivery across India. Most metro orders arrive within 2–4 business days, and rest of India within 4–6 business days.",
    },
  ],
  quiz: {
    title: "Find Your Ayurvedic Oil",
    subtitle:
      "Answer 3 quick questions about your hair feel and lifestyle to discover your tailored botanical match.",
    questions: [
      {
        id: "hairFeel",
        title: "How does your hair and scalp currently feel?",
        options: [
          {
            label: "Dry or thirsty",
            description: "Strands feel brittle and scalp feels tight",
            value: "dry",
          },
          {
            label: "Balanced / Normal",
            description: "Healthy hair seeking daily maintenance and protection",
            value: "normal",
          },
          {
            label: "Fine or dull",
            description: "Lacks lustre, volume, or natural shine",
            value: "fine",
          },
        ],
      },
      {
        id: "routine",
        title: "How often do you oil your hair?",
        options: [
          {
            label: "Daily / Alternate days",
            description: "Light, frequent nourishment",
            value: "daily",
          },
          {
            label: "1–2 times weekly",
            description: "Deep weekend ritual or pre-wash soak",
            value: "weekly",
          },
        ],
      },
      {
        id: "scentVibe",
        title: "Which aroma profile do you prefer?",
        options: [
          {
            label: "Classic Herbal",
            description: "Earthy, grounding botanical aroma of amla & neem",
            value: "herbal",
          },
          {
            label: "Fresh & Invigorating",
            description: "Zesty citrus and fresh rosemary notes",
            value: "fresh",
          },
          {
            label: "Floral & Delicate",
            description: "Soft rose petals and sweet hibiscus blossoms",
            value: "floral",
          },
        ],
      },
    ],
  },
};
