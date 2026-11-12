"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
} from "framer-motion";
import { Product, Size, getPrice, formatINR } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BottleImage, DECK_ASPECT } from "@/components/bottle-image";
import { BottleEyelet } from "@/components/rail/rail";
import { useCart } from "@/lib/cart-context";
import { getOrCreateVisitorReferralCode } from "@/lib/referral";
import { toast } from "sonner";
import { RotateCw, Share2, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODAL_COPY } from "@/lib/modal-copy";
import { ModalHeader } from "@/components/product-modal/header";
import { TrustBadges } from "@/components/product-modal/trust-badges";

interface ProductDetailViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailView({
  product,
  isOpen,
  onClose,
}: ProductDetailViewProps) {
  const { addItem, setIsDrawerOpen } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const [selectedSize, setSelectedSize] = useState<Size>("100 ml");
  const [copied, setCopied] = useState(false);
  const [activeFace, setActiveFace] = useState<"front" | "back">("front");

  // Single MotionValue for 3D rotation
  const rotationY = useMotionValue(0);

  // Derive active face directly from rotationY without separate desynced state
  useEffect(() => {
    const unsubscribe = rotationY.on("change", (latest) => {
      const normalized = Math.round(latest / 180) % 2;
      setActiveFace(Math.abs(normalized) === 1 ? "back" : "front");
    });
    return () => unsubscribe();
  }, [rotationY]);

  // Reset rotation and size on dialog open
  useEffect(() => {
    if (isOpen) {
      setSelectedSize("100 ml");
      rotationY.set(0);
      setActiveFace("front");
    }
  }, [isOpen, rotationY]);

  if (!product) return null;

  const currentPrice = getPrice(product.id, selectedSize);

  // Front/Back toggle animation (nearest multiple, mod-360 normalized, never spins 360 backwards)
  const handleToggleFlip = () => {
    const nextFace = activeFace === "front" ? "back" : "front";
    setActiveFace(nextFace);

    if (shouldReduceMotion) {
      rotationY.set(nextFace === "front" ? 0 : 180);
      return;
    }

    const currentDeg = rotationY.get();
    const currentNearestHalf = Math.round(currentDeg / 180);
    const targetDeg = (currentNearestHalf + 1) * 180;

    animate(rotationY, targetDeg, {
      type: "spring",
      stiffness: 120,
      damping: 18,
    });
  };

  const handleDragEnd = (_: any, info: { velocity: { x: number } }) => {
    if (shouldReduceMotion) return;
    const currentDeg = rotationY.get();
    // Add inertia based on drag release velocity
    const targetWithInertia = currentDeg + info.velocity.x * 0.2;
    const settledTarget = Math.round(targetWithInertia / 180) * 180;

    animate(rotationY, settledTarget, {
      type: "spring",
      stiffness: 120,
      damping: 18,
    });
  };

  const handleAddToCart = () => {
    addItem(product.id, selectedSize, 1);
    onClose();
    setIsDrawerOpen(true);
    toast.success(`Added ${product.name} to your bag`);
  };

  const handleShare = async () => {
    const refCode = getOrCreateVisitorReferralCode();
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${siteUrl}?ref=${refCode}#rail`;
    const shareData = {
      title: `AKATSUKI — ${product.name}`,
      text: `Discover ${product.name} Ayurvedic Hair Oil from AKATSUKI: ${product.tagline}. Handcrafted with natural herbs!`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // Fall back to clipboard if share threw unexpected error
        } else {
          return;
        }
      }
    }

    // Fallback: Clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard with your referral tag!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Unable to copy link to clipboard.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg sm:rounded-3xl p-6 bg-background border border-border shadow-2xl overflow-hidden"
        aria-labelledby="product-detail-title"
        aria-describedby="product-detail-description"
      >
        <ModalHeader
          product={product}
          activeFace={activeFace}
          onToggleFlip={handleToggleFlip}
        />

        {/* 3D Flip Card Container with Perspective */}
        <div
          className="relative w-full h-[320px] my-2 flex items-center justify-center"
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateY: rotationY,
              transformStyle: "preserve-3d",
            }}
            drag={shouldReduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            {/* FRONT FACE: Jiggling Bottle View */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center select-none transition-opacity duration-200",
                activeFace === "back" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
              )}
              style={{
                visibility: activeFace === "back" ? "hidden" : "visible",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <motion.div
                initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.85, rotate: -4 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 220, damping: 15 }
                }
                className="relative h-[270px] flex items-center justify-center mx-auto"
                style={{ aspectRatio: DECK_ASPECT }}
              >
                <BottleEyelet h={270} />
                <BottleImage
                  product={product}
                  priority
                  sizes="160px"
                  className="w-full h-full"
                />
              </motion.div>
              <p className="text-[11px] text-forest dark:text-cream font-medium mt-1 flex items-center gap-1">
                <span>Drag horizontally to rotate 3D bottle</span>
                <Sparkles className="w-3 h-3 text-forest dark:text-gold" />
              </p>
            </div>

            {/* BACK FACE: Ingredients, Ritual, and Safety Information */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl bg-cream dark:bg-charcoal p-5 border border-gold/40 shadow-lg flex flex-col justify-between overflow-y-auto select-none transition-opacity duration-200",
                activeFace === "front" ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
              )}
              style={{
                transform: "rotateY(180deg)",
                visibility: activeFace === "front" ? "hidden" : "visible",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div>
                <h4 className="font-serif font-bold text-sm text-forest dark:text-gold uppercase tracking-wider mb-2">
                  Key Botanical Infusion
                </h4>
                <ul className="space-y-1.5 text-xs text-foreground/90">
                  {product.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-tight">
                      <span className="text-gold font-bold">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-serif font-bold text-sm text-forest dark:text-gold uppercase tracking-wider mb-1.5">
                  Ayurvedic Ritual (How to Use)
                </h4>
                <ol className="space-y-1 text-xs text-foreground/80 list-decimal list-inside">
                  {product.howTo.map((step, i) => (
                    <li key={i} className="leading-tight">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-gold/30 pt-2.5 mt-2 flex items-center justify-between text-[11px] font-semibold text-forest dark:text-cream">
                <span>Paraben free · Natural · For all</span>
                <span className="text-forest dark:text-gold font-bold">100% Ayurvedic</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Size Selection Chips (Tooltip on unpriced 200 ml) */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <div className="flex items-baseline justify-between text-xs font-semibold text-muted-foreground">
            <span className="font-medium">Select Bottle Size:</span>
            <div className="text-right">
              <span className="font-serif text-lg font-bold text-forest dark:text-gold">
                {currentPrice !== null
                  ? `${formatINR(currentPrice)} ${MODAL_COPY.perBottleSuffix}`
                  : "Price on release"}
              </span>
              <p className="text-[10px] text-muted-foreground/80 font-normal">
                {MODAL_COPY.inclusiveOfTaxes}
              </p>
            </div>
          </div>

          <TooltipProvider delayDuration={150}>
            <div className="flex gap-3">
              {product.sizes.map((size) => {
                const isPriced = getPrice(product.id, size) !== null;
                const isSelected = selectedSize === size;

                if (!isPriced) {
                  return (
                    <Tooltip key={size}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled
                          data-testid="size-chip-200-ml"
                          aria-label={`${size} (Coming soon)`}
                          className="flex-1 py-2 px-3 rounded-full text-xs font-medium border border-dashed border-muted-foreground/40 text-muted-foreground/50 cursor-not-allowed bg-muted/20"
                        >
                          {size} (Coming soon)
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-sans font-medium text-xs">
                          200 ml family bottle coming soon!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <button
                    key={size}
                    type="button"
                    data-testid="size-chip-100-ml"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all border",
                      isSelected
                        ? "bg-forest text-cream dark:bg-gold dark:text-charcoal border-transparent shadow-sm"
                        : "bg-background text-foreground border-border hover:bg-muted/50"
                    )}
                  >
                    {size} — {formatINR(getPrice(product.id, size)!)}
                  </button>
                );
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Action Buttons: Add to Bag & Share */}
        <div className="flex items-center gap-3 pt-3">
          <Button
            variant="gold"
            size="lg"
            data-testid="detail-add-to-bag"
            onClick={handleAddToCart}
            className="flex-1 rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Add to Bag
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleShare}
            className="rounded-full px-4 gap-2 text-xs font-medium border-border"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-forest dark:text-gold" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </Button>
        </div>

        {/* Flag-Gated Trust Badges Row */}
        <TrustBadges className="mt-2" />
      </DialogContent>
    </Dialog>
  );
}
