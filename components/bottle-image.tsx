"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

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
  const clipId = useId().replace(/:/g, "-");

  if (hasError) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[BottleImage] Failed to decode image for product ${product.id}. Falling back to Pure-CSS bottle (Branch 3).`
      );
    }
    // Branch 3: Pure-CSS bottle (.cap/.neck/.body, token colors, aspect 0.45)
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-end w-full aspect-[450/1000] max-h-full mx-auto select-none",
          className
        )}
        style={{ aspectRatio: "450 / 1000" }}
        role="img"
        aria-label={`${product.name} CSS Bottle representation`}
      >
        {/* Cap */}
        <div
          className="w-[33%] h-[14%] rounded-t-xl shadow-md border border-black/10"
          style={{ backgroundColor: product.tokens.cap }}
        />
        {/* Neck */}
        <div
          className="w-[22%] h-[3%] shadow-inner"
          style={{ backgroundColor: product.tokens.cap }}
        />
        {/* Body */}
        <div
          className="w-[74%] h-[83%] rounded-t-[40px] rounded-b-[30px] flex flex-col items-center justify-between p-4 shadow-xl border border-black/15"
          style={{ backgroundColor: product.tokens.body }}
        >
          <div
            className="w-full text-center text-xs font-serif font-bold tracking-widest uppercase mt-4"
            style={{ color: product.tokens.accent }}
          >
            AKATSUKI
          </div>
          <div className="w-[85%] rounded-lg bg-white/90 p-3 text-center shadow-sm">
            <p className="font-serif text-sm font-bold text-forest">{product.name}</p>
            <p className="text-[10px] text-muted-foreground">{product.tagline}</p>
            <p className="text-[9px] font-semibold text-gold mt-1">100% Ayurvedic</p>
          </div>
          <div
            className="w-12 h-1 rounded-full mb-2 opacity-50"
            style={{ backgroundColor: product.tokens.accent }}
          />
        </div>
      </div>
    );
  }

  // Branch 2: Inline SVG bottle-silhouette mask (viewBox "0 0 450 1000", cap->neck->shoulders->body)
  return (
    <div
      className={cn(
        "relative w-full aspect-[450/1000] flex items-center justify-center select-none",
        className
      )}
      style={{ aspectRatio: "450 / 1000" }}
    >
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={`bottle-clip-${clipId}`} clipPathUnits="objectBoundingBox">
            {/* Normalized 0..1 path matching viewBox 0 0 450 1000 */}
            <path
              d="
                M 0.344 0.02
                h 0.312
                c 0.033 0, 0.044 0.015, 0.044 0.035
                v 0.095
                c 0 0.015, -0.015 0.02, -0.03 0.02
                h -0.045
                v 0.025
                c 0 0.01, -0.01 0.015, -0.02 0.015
                c -0.045 0.01, -0.15 0.035, -0.17 0.09
                v 0.63
                c 0 0.035, 0.05 0.045, 0.13 0.045
                c 0.08 0, 0.13 -0.01, 0.13 -0.045
                v -0.63
                c -0.02 -0.055, -0.125 -0.08, -0.17 -0.09
                c -0.01 0, -0.02 -0.005, -0.02 -0.015
                v -0.025
                h -0.045
                c -0.015 0, -0.03 -0.005, -0.03 -0.02
                v -0.095
                c 0 -0.02, 0.011 -0.035, 0.044 -0.035
                z
              "
            />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped Bottle Container with SVG bottle-silhouette clip */}
      <div
        className="relative w-full h-full"
        style={{
          clipPath: `url(#bottle-clip-${clipId})`,
          WebkitClipPath: `url(#bottle-clip-${clipId})`,
        }}
      >
        <Image
          src={product.image}
          alt={`Bottle of AKATSUKI ${product.name} Ayurvedic Hair Oil`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  );
}
