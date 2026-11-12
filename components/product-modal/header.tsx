"use client";

import React from "react";
import { Product } from "@/lib/products";
import { getProductDetail } from "@/lib/product-detail";
import { MODAL_COPY } from "@/lib/modal-copy";
import { WishlistButton } from "@/components/product-modal/wishlist-button";
import { RatingBlock } from "@/components/product-modal/rating-block";
import { BenefitChips } from "@/components/product-modal/benefit-chips";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RotateCw } from "lucide-react";

interface ModalHeaderProps {
  product: Product;
  activeFace: "front" | "back";
  onToggleFlip: () => void;
}

export function ModalHeader({
  product,
  activeFace,
  onToggleFlip,
}: ModalHeaderProps) {
  const detail = getProductDetail(product.id);

  return (
    <DialogHeader className="text-left border-b border-border/40 pb-3">
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-forest/10 px-3 py-0.5 text-[11px] font-semibold tracking-wider text-forest uppercase dark:bg-gold/15 dark:text-gold">
          100% Ayurvedic
        </span>
        <div className="flex items-center gap-1.5">
          <WishlistButton productId={product.id} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFlip}
            className="text-xs gap-1.5 text-muted-foreground hover:text-foreground h-7 px-2.5 rounded-full"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>
              {activeFace === "front" ? MODAL_COPY.viewDetails : MODAL_COPY.viewBottle}
            </span>
          </Button>
        </div>
      </div>
      <DialogTitle
        id="product-detail-title"
        className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1"
      >
        {product.name}
      </DialogTitle>
      <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
        {product.tagline}
      </DialogDescription>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <RatingBlock
          rating={detail?.rating ?? null}
          reviewCount={detail?.reviewCount ?? null}
        />
        {detail && (
          <BenefitChips
            benefits={detail.benefits}
            badge={detail.badge}
          />
        )}
      </div>
    </DialogHeader>
  );
}
