"use client";

import { PRODUCTS, formatINR } from "@/lib/products";
import { BottleImage } from "@/components/bottle-image";
import { useCart } from "@/lib/cart-context";
import { CartBadge } from "@/components/cart/cart-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

export default function HomePage() {
  const { addItem, setIsDrawerOpen } = useCart();

  const handleAddToCart = (id: string, name: string) => {
    addItem(id, "100 ml", 1);
    toast.success(`Added ${name} to your bag`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-6 max-w-6xl mx-auto space-y-12">
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

      {/* Hero Intro */}
      <div className="max-w-2xl space-y-4 pt-4 text-center">
        <span className="inline-block rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold tracking-wider text-forest uppercase dark:bg-gold/15 dark:text-gold">
          100% Ayurvedic Herbal Care
        </span>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-forest dark:text-cream sm:text-6xl">
          Roots of Nature. Strength of Ayurveda.
        </h1>
        <p className="text-muted-foreground text-lg">
          Handcrafted Ayurvedic formulations to nourish, strengthen, and support healthy hair.
        </p>
      </div>

      {/* Bottles Collection */}
      <div id="collection" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Our Botanical Collection
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            className="text-xs gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            View Bag
          </Button>
        </div>

        <div
          id="bottles-container"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-end"
        >
          {PRODUCTS.map((product, idx) => (
            <div
              key={product.id}
              data-testid={`bottle-${product.id}`}
              className="flex flex-col items-center p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full max-w-[150px] mb-4">
                <BottleImage
                  product={product}
                  priority={idx === 0}
                  sizes="(max-width:768px) 45vw, 18vw"
                />
              </div>
              <h3 className="font-serif font-semibold text-foreground text-sm">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{product.tagline}</p>
              <p className="font-medium text-sm text-forest dark:text-gold my-2">
                {product.prices["100 ml"]
                  ? formatINR(product.prices["100 ml"]!)
                  : "Coming soon"}
              </p>
              <Button
                size="sm"
                variant="default"
                data-testid={`add-to-cart-${product.id}`}
                onClick={() => handleAddToCart(product.id, product.name)}
                className="w-full text-xs rounded-full mt-1"
              >
                Add to Bag
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
