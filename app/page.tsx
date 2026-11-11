"use client";

import { BottleRail } from "@/components/rail/bottle-rail";
import { CartBadge } from "@/components/cart/cart-badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag } from "lucide-react";

export default function HomePage() {
  const { setIsDrawerOpen } = useCart();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Header bar with Cart Badge */}
      <header className="w-full flex items-center justify-between py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-forest dark:text-cream">
            AKATSUKI
          </span>
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
        </div>
        <div className="flex items-center gap-4">
          <CartBadge />
        </div>
      </header>

      {/* Hero Header */}
      <div className="max-w-3xl space-y-4 text-center pt-2">
        <span className="inline-block rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold tracking-wider text-forest uppercase dark:bg-gold/15 dark:text-gold">
          100% Ayurvedic Herbal Care
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-forest dark:text-cream">
          Roots of Nature. Strength of Ayurveda.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Handcrafted Ayurvedic hair oils infused with cold-pressed natural botanicals to nourish roots, support strength, and maintain vibrant hair lustre.
        </p>
      </div>

      {/* Centerpiece: Hanging Bottle Rail with Jiggle Engine */}
      <div className="w-full">
        <BottleRail />
      </div>
    </div>
  );
}
