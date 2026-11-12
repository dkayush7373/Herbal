"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export const DECK_ASPECT = 0.30;
export const HOLE_Y = 0.022;
export const HOOK_LEN = 0.07;
export const MAX_H = 440;

export function restAngle(i: number): number {
  return -5 - ((i * 5 + 3) % 4);
}

export const DECK_PATH =
  "M88,0 L212,0 Q218,0 218,8 L218,160 Q218,175 226,190 C262,235 296,290 296,360 L296,960 Q296,998 258,998 L42,998 Q4,998 4,960 L4,360 C4,290 38,235 74,190 Q82,175 82,160 L82,8 Q82,0 88,0 Z";

interface BottleImageProps {
  product: Product;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function BottleImage({
  product,
  priority = false,
  className,
  sizes = "(max-width:768px) 60vw, 20vw",
}: BottleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[BottleImage] Failed to decode image for product ${product.id}. Falling back to SVG silhouette mask.`
      );
    }
    // Fallback mask using DECK_PATH and viewBox 0 0 300 1000
    return (
      <div
        className={cn(
          "relative flex items-center justify-center w-full max-h-full mx-auto select-none",
          className
        )}
        style={{ aspectRatio: DECK_ASPECT }}
        role="img"
        aria-label={`${product.name} Fallback Silhouette`}
      >
        <svg
          viewBox="0 0 300 1000"
          className="w-full h-full drop-shadow-md"
          id="FALLBACK_MASK"
        >
          <path d={DECK_PATH} fill={product.tokens.body} />
        </svg>
      </div>
    );
  }

  return (
    <div
      data-testid={`bottle-${product.id}`}
      className={cn(
        "relative w-full flex items-center justify-center select-none",
        className
      )}
      style={{ aspectRatio: DECK_ASPECT }}
    >
      <Image
        src={product.image}
        alt={`Bottle of AKATSUKI ${product.name} Ayurvedic Hair Oil`}
        fill
        priority={priority}
        sizes={sizes}
        className="absolute inset-0 size-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
