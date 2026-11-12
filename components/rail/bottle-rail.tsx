"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { RailBar } from "@/components/rail/rail";
import { RailBottle } from "@/components/rail/bottle";
import { ProductDetailView } from "@/components/rail/detail-view";
import { useJiggleEngine } from "@/lib/physics/use-jiggle-engine";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sparkles, Touchpad } from "lucide-react";

export function BottleRail() {
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check SSR-safe with desktop default until mounted
  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Dedicated refs for DOM transform application (5 bottles)
  const b0 = useRef<HTMLDivElement>(null);
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);
  const b4 = useRef<HTMLDivElement>(null);
  const bottleRefs = [b0, b1, b2, b3, b4];

  const t0 = useRef<HTMLDivElement>(null);
  const t1 = useRef<HTMLDivElement>(null);
  const t2 = useRef<HTMLDivElement>(null);
  const t3 = useRef<HTMLDivElement>(null);
  const t4 = useRef<HTMLDivElement>(null);
  const tagRefs = [t0, t1, t2, t3, t4];

  const {
    handlePointerMove,
    handlePointerLeave,
    triggerTapImpulse,
    cancelIntroAndSway,
  } = useJiggleEngine(bottleRefs, tagRefs);

  const handleOpenDetail = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
    setHasInteracted(true);
    cancelIntroAndSway();
  }, [cancelIntroAndSway]);

  const handleBottleTap = useCallback(
    (index: number) => {
      setActiveIdx(index);
      setHasInteracted(true);
      triggerTapImpulse(index);
    },
    [triggerTapImpulse]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      cancelIntroAndSway();
      setHasInteracted(true);

      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (index + 1) % PRODUCTS.length;
        setActiveIdx(next);
        triggerTapImpulse(next);
        const nextEl = document.getElementById(`rail-bottle-${PRODUCTS[next].id}`);
        nextEl?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (index - 1 + PRODUCTS.length) % PRODUCTS.length;
        setActiveIdx(prev);
        triggerTapImpulse(prev);
        const prevEl = document.getElementById(`rail-bottle-${PRODUCTS[prev].id}`);
        prevEl?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIdx(0);
        triggerTapImpulse(0);
        document.getElementById(`rail-bottle-${PRODUCTS[0].id}`)?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = PRODUCTS.length - 1;
        setActiveIdx(last);
        triggerTapImpulse(last);
        document.getElementById(`rail-bottle-${PRODUCTS[last].id}`)?.focus();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenDetail(PRODUCTS[index]);
      }
    },
    [cancelIntroAndSway, handleOpenDetail, triggerTapImpulse]
  );

  return (
    <section
      id="rail"
      data-testid="bottle-rail-section"
      className="relative w-full pt-6 pb-4 flex flex-col items-center"
      aria-label="Hanging Ayurvedic Hair Oil Collection"
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Render Mobile Carousel on <768px, Desktop Rail on >=768px */}
        {mounted && isMobile ? (
          <div className="w-full">
            <RailBar>
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {PRODUCTS.map((product, idx) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-2 basis-[75%] sm:basis-[60%]"
                    >
                      <div className="pt-0 pb-2 px-2 flex flex-col items-center">
                        <RailBottle
                          product={product}
                          index={idx}
                          isActive={activeIdx === idx}
                          bottleRef={bottleRefs[idx]}
                          tagRef={tagRefs[idx]}
                          role="button"
                          onSelect={handleOpenDetail}
                          onTap={handleBottleTap}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </RailBar>
          </div>
        ) : (
          <div
            className="w-full py-4 select-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <RailBar>
              <div
                role="listbox"
                aria-label="Ayurvedic Hair Oils"
                className="grid grid-cols-5 gap-3 md:gap-4 lg:gap-6 pt-0 px-6 items-start"
              >
                {PRODUCTS.map((product, idx) => (
                  <RailBottle
                    key={product.id}
                    product={product}
                    index={idx}
                    isActive={activeIdx === idx}
                    bottleRef={bottleRefs[idx]}
                    tagRef={tagRefs[idx]}
                    onSelect={handleOpenDetail}
                    onTap={handleBottleTap}
                    onKeyDown={handleKeyDown}
                  />
                ))}
              </div>
            </RailBar>
          </div>
        )}

        {/* Interaction Guidance Hint beneath Rail (Clear 40px spacing beneath bottles, no overlap) */}
        {!hasInteracted && (
          <div
            data-testid="rail-interaction-hint"
            className="flex items-center justify-center gap-2 mt-10 mb-2 text-xs text-forest dark:text-cream font-medium select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest dark:text-gold hidden md:inline shrink-0" />
            <span className="hidden md:inline tracking-wide">
              Move your cursor across the bottles ✨
            </span>
            <Touchpad className="w-3.5 h-3.5 text-forest dark:text-gold md:hidden inline shrink-0" />
            <span className="md:hidden inline tracking-wide">Tap a bottle to explore</span>
          </div>
        )}
      </div>

      {/* Product Detail Dialog */}
      <ProductDetailView
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
}
