import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/sonner";
import { generateProductJsonLd } from "@/lib/jsonld";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil",
    template: "%s | AKATSUKI",
  },
  description:
    "Handcrafted 100% Ayurvedic Herbal Hair Oil made with natural herbs to nourish, strengthen, and support healthy hair. Paraben free for men, women & children.",
  keywords: [
    "Ayurvedic Hair Oil",
    "Herbal Hair Oil",
    "Natural Hair Care",
    "Paraben Free",
    "Akatsuki Beauty",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil",
    description:
      "Handcrafted 100% Ayurvedic Herbal Hair Oil made with natural herbs to nourish, strengthen, and support healthy hair.",
    url: siteUrl,
    siteName: "AKATSUKI Beauty & Wellness",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil",
    description:
      "Handcrafted 100% Ayurvedic Herbal Hair Oil made with natural herbs to nourish, strengthen, and support healthy hair.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8E7" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1E1E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateProductJsonLd();

  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans bg-grain">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <main id="main" className="flex-1 overflow-x-clip">
                {children}
              </main>
            </div>
            <CartDrawer />
            <Toaster position="bottom-right" />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
