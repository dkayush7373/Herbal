"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartBadge() {
  const { itemCount, mounted, setIsDrawerOpen } = useCart();
  const shouldReduceMotion = useReducedMotion();
  const [bounce, setBounce] = useState(0);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (mounted && itemCount > prevCount.current && !shouldReduceMotion) {
      setBounce((b) => b + 1);
    }
    prevCount.current = itemCount;
  }, [itemCount, mounted, shouldReduceMotion]);

  const displayCount = mounted ? itemCount : 0;

  return (
    <button
      type="button"
      aria-label={`Cart, ${displayCount} items`}
      onClick={() => setIsDrawerOpen(true)}
      className="relative p-2 rounded-full hover:bg-muted/60 text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <ShoppingBag className="w-5 h-5 text-forest dark:text-cream" />

      {displayCount > 0 && (
        <motion.span
          key={bounce}
          initial={
            shouldReduceMotion
              ? { scale: 1 }
              : { scale: 0.6, y: -2 }
          }
          animate={{ scale: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 400, damping: 15 }
          }
          data-testid="cart-badge-count"
          className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-forest dark:bg-gold px-1.5 text-[11px] font-bold text-cream dark:text-charcoal shadow-sm"
        >
          {displayCount}
        </motion.span>
      )}
    </button>
  );
}
