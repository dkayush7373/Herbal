"use client";

import React, { useRef, useState, useCallback } from "react";
import { Product, getPrice } from "@/lib/products";
import { BottleImage, DECK_ASPECT, MAX_H } from "@/components/bottle-image";
import { PriceTag } from "@/components/rail/price-tag";
import { RailHook, BottleEyelet } from "@/components/rail/rail";
import { cn } from "@/lib/utils";

interface RailBottleProps {
  product: Product;
  index: number;
  isActive: boolean;
  bottleRef: React.RefObject<HTMLDivElement | null>;
  tagRef: React.RefObject<HTMLDivElement | null>;
  role?: "button" | "option";
  onSelect: (product: Product) => void;
  onTap: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

export function RailBottle({
  product,
  index,
  isActive,
  bottleRef,
  tagRef,
  role = "option",
  onSelect,
  onTap,
  onKeyDown,
}: RailBottleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startTime: 0, moved: false });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const price = getPrice(product.id, "100 ml");

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click / touch drag
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if cannot capture
    }
    dragStartRef.current = {
      startX: e.clientX,
      startTime: performance.now(),
      moved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    if (Math.abs(dx) > 6) {
      dragStartRef.current.moved = true;
      if (bottleRef.current) {
        const dragAngle = Math.max(-4, Math.min(4, dx / 20));
        bottleRef.current.style.transform = `rotate(${dragAngle.toFixed(2)}deg)`;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    const dx = Math.abs(e.clientX - dragStartRef.current.startX);
    if (dx < 6) {
      // Click registered
      onSelect(product);
      onTap(index);
    } else {
      // Drag released: trigger swing back
      onTap(index);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div
      ref={containerRef}
      role={role}
      {...(role === "option" ? { "aria-selected": isActive } : {})}
      tabIndex={role === "button" ? 0 : (isActive ? 0 : -1)}
      id={`rail-bottle-${product.id}`}
      data-testid={`rail-bottle-${product.id}`}
      onKeyDown={(e) => onKeyDown(e, index)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={cn(
        "relative flex flex-col items-center select-none cursor-pointer group focus-visible:outline-none",
        isHovered ? "z-30" : "z-10"
      )}
      style={{ touchAction: "pan-y" }}
    >
      {/* Hook attaching bottle to the rail */}
      <div className="z-10 pointer-events-none -mb-2.5">
        <RailHook />
      </div>

      {/* Hanging Bottle Rig (Rotates around Hook Top-Center) */}
      <div
        ref={bottleRef}
        className={cn(
          "relative flex flex-col items-center w-full max-w-[170px] origin-top transition-shadow will-change-transform",
          isHovered && "scale-[1.04]"
        )}
        style={{
          transformOrigin: "50% 0px",
          maxHeight: MAX_H,
          transition: "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
      >
        {/* Hanging ₹ Price Tag */}
        <PriceTag price={price} productName={product.name} tagRef={tagRef} />

        {/* Bottle Container with Glint Effect (DECK_ASPECT, with BottleEyelet) */}
        <div className="relative w-full" style={{ aspectRatio: DECK_ASPECT }}>
          <BottleEyelet h={MAX_H} />
          <BottleImage
            product={product}
            priority={index === 0}
            sizes="(max-width:768px) 60vw, 20vw"
            className="w-full h-full"
          />

          {/* Gold Glint Sweep on Hover */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none z-20 animate-glint rounded-2xl"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(232, 185, 35, 0.55) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "glintSweep 0.6s ease-out forwards",
              }}
            />
          )}
        </div>

        {/* Focus Ring Indicator (Accessible >= 3:1) */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-ring" />
      </div>

      {/* Product Name Label beneath bottle */}
      <div className="mt-3 text-center pointer-events-none">
        <p className="font-serif font-bold text-sm text-foreground group-hover:text-forest dark:group-hover:text-gold transition-colors">
          {product.name}
        </p>
        <p className="text-[11px] text-muted-foreground">{product.tagline}</p>
      </div>
    </div>
  );
}
