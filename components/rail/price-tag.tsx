import React from "react";
import { formatINR } from "@/lib/products";

interface PriceTagProps {
  price: number | null;
  productName: string;
  tagRef?: React.RefObject<HTMLDivElement | null>;
}

export function PriceTag({ price, productName, tagRef }: PriceTagProps) {
  return (
    <div
      ref={tagRef}
      className="absolute top-[clamp(56px,6.5vh,68px)] right-0 z-20 pointer-events-none origin-top-left transition-transform will-change-transform select-none"
      style={{ transform: "rotate(-8deg)" }}
      aria-hidden="true"
    >
      {/* String connecting to bottle neck */}
      <div className="w-[1px] h-3 bg-amber-700/60 dark:bg-gold/60 mx-auto" />

      {/* Hanging Tag */}
      <div className="flex items-center gap-0.5 px-2 py-0.5 rounded shadow-sm bg-cream dark:bg-charcoal border border-gold/40 text-forest dark:text-gold text-[11px] font-bold tracking-tight">
        <span>{price ? formatINR(price) : "Soon"}</span>
      </div>
    </div>
  );
}
