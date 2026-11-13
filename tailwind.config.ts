import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand design tokens
        forest: {
          DEFAULT: "#0F3D2E",
          hover: "#144e3b",
          light: "#1c5d48",
          dark: "#0a291f",
        },
        gold: {
          DEFAULT: "#E8B923",
          hover: "#d4a71c",
          light: "#f0ca4f",
          dark: "#be9516",
        },
        cream: {
          DEFAULT: "#FFF8E7",
          hover: "#f5edd6",
          dark: "#ece2c5",
        },
        charcoal: {
          DEFAULT: "#1E1E1E",
          light: "#2a2a2a",
          dark: "#141414",
        },
        // Product tokens
        product: {
          white: {
            body: "#E9E4DA",
            cap: "#C9C3B4",
            accent: "#8A8474",
          },
          black: {
            body: "#1B1B1B",
            cap: "#2E2E2E",
            accent: "#E8B923",
          },
          green: {
            body: "#0F3D2E",
            cap: "#17453A",
            accent: "#E8B923",
          },
          orange: {
            body: "#D9772E",
            cap: "#B85F1F",
            accent: "#FFF2DA",
          },
          pink: {
            body: "#C97A8A",
            cap: "#A75F6D",
            accent: "#FFF8E7",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ambient-drift": {
          "0%, 100%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.04) translate(-0.8%, -0.6%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ambient-drift": "ambient-drift 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
