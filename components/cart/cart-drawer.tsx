"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { getProduct, getPrice, formatINR } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/site";
import { BottleImage } from "@/components/bottle-image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

export function CartDrawer() {
  const {
    items,
    mounted,
    subtotal,
    isDrawerOpen,
    setIsDrawerOpen,
    incQty,
    decQty,
    removeItem,
    checkoutUrl,
    isWhatsAppConfigured,
  } = useCart();

  const threshold = SITE_CONFIG.shipping.freeShippingThreshold;
  const amountNeeded = Math.max(0, threshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / threshold) * 100));

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBrowseCollection = () => {
    setIsDrawerOpen(false);
    const railEl = document.getElementById("rail") || document.getElementById("collection");
    if (railEl) {
      railEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerContent className="max-w-md mx-auto max-h-[85vh] flex flex-col bg-background border-border">
        <DrawerHeader className="border-b border-border/50 pb-3">
          <DrawerTitle className="font-serif text-xl flex items-center gap-2 text-forest dark:text-cream">
            <ShoppingBag className="w-5 h-5 text-gold" />
            Your Herbal Bag
          </DrawerTitle>
          <DrawerDescription className="text-xs">
            100% authentic Ayurvedic formulations direct to your door.
          </DrawerDescription>
        </DrawerHeader>

        {/* Free Shipping Progress */}
        {mounted && items.length > 0 && (
          <div className="px-6 py-3 bg-muted/40 border-b border-border/40">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span>
                {amountNeeded === 0 ? (
                  <strong className="text-forest dark:text-gold">
                    🎉 You&apos;ve unlocked Free Standard Delivery!
                  </strong>
                ) : (
                  <span>
                    Add <strong className="text-forest dark:text-gold">{formatINR(amountNeeded)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-muted-foreground">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List / Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!mounted || items.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-semibold text-foreground">
                  Your bag is empty
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Explore our cold-pressed herbal hair oils tailored for your hair texture and routine.
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleBrowseCollection}
                className="mt-2"
              >
                Browse Collection
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const product = getProduct(item.id);
              if (!product) return null;
              const unitPrice = getPrice(item.id, item.size) ?? 0;
              const lineTotal = unitPrice * item.qty;

              return (
                <div
                  key={`${item.id}-${item.size}`}
                  data-testid={`cart-line-${item.id}`}
                  className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-24 shrink-0 flex items-center justify-center bg-muted/30 rounded-lg p-1">
                    <BottleImage
                      product={product}
                      sizes="48px"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-sm text-foreground truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.size}
                    </p>
                    <p className="text-xs font-medium text-forest dark:text-gold mt-0.5">
                      {formatINR(unitPrice)}
                    </p>

                    {/* Qty Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-full bg-background">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => decQty(item.id, item.size)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          data-testid={`qty-${item.id}`}
                          className="w-6 text-center text-xs font-semibold select-none"
                        >
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => incQty(item.id, item.size)}
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={`Remove ${product.name} from bag`}
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right">
                    <span className="font-semibold text-sm text-foreground">
                      {formatINR(lineTotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Subtotal and Checkout Button */}
        {mounted && items.length > 0 && (
          <DrawerFooter className="border-t border-border/50 pt-4 bg-background">
            <div className="flex justify-between items-center text-base font-semibold mb-2">
              <span className="text-foreground">Subtotal</span>
              <span
                data-testid="cart-subtotal"
                className="font-serif text-lg text-forest dark:text-gold"
              >
                {formatINR(subtotal)}
              </span>
            </div>

            {!isWhatsAppConfigured ? (
              <div className="space-y-2">
                <Button
                  disabled
                  className="w-full gap-2 rounded-full font-medium"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Checkout on WhatsApp
                </Button>
                <p className="text-[11px] text-destructive text-center font-medium">
                  Checkout not configured — add NEXT_PUBLIC_WHATSAPP_NUMBER
                </p>
              </div>
            ) : (
              <Button
                variant="gold"
                size="lg"
                onClick={handleCheckout}
                className="w-full gap-2 font-semibold shadow-md active:scale-95 transition-transform"
              >
                <WhatsAppIcon className="w-5 h-5 text-charcoal" />
                Checkout on WhatsApp
              </Button>
            )}

            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="mt-1 text-xs">
                Continue Browsing
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
