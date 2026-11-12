"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODAL_COPY } from "@/lib/modal-copy";
import { PROMO } from "@/lib/promo-config";

export const WISHLIST_STORAGE_KEY = "akatsuki.wishlist.v1";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.includes(productId)) {
          setIsWishlisted(true);
        }
      }
    } catch {
      // Safe against invalid JSON
    }
  }, [productId]);

  const toggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        let list: string[] = [];
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            list = parsed.filter((id): id is string => typeof id === "string");
          }
        }

        const next = !isWishlisted;
        if (next) {
          if (!list.includes(productId)) list.push(productId);
        } else {
          list = list.filter((id) => id !== productId);
        }

        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
        setIsWishlisted(next);
      } catch {
        // Safe against storage quota or browser restrictions
      }
    },
    [isWishlisted, productId]
  );

  if (!PROMO.featureFlags.wishlist) return null;

  const label = isWishlisted ? MODAL_COPY.wishlistRemove : MODAL_COPY.wishlistAdd;

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      aria-label={label}
      aria-pressed={isWishlisted}
      data-testid="wishlist-toggle"
      className={cn(
        "p-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted/60",
        className
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-colors",
          mounted && isWishlisted
            ? "fill-destructive text-destructive"
            : "text-muted-foreground hover:text-foreground"
        )}
      />
    </button>
  );
}
