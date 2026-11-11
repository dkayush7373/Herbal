"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useJiggle } from "@/lib/physics/use-jiggle-engine";

interface HerbCardProps {
  name: string;
  botanical: string;
  description: string;
  role: string;
  iconSvg: React.ReactNode;
}

function HerbCard({ name, botanical, description, role, iconSvg }: HerbCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useJiggle(cardRef);

  return (
    <div
      ref={cardRef}
      className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none cursor-pointer group"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-forest/10 dark:bg-gold/15 flex items-center justify-center mb-4 text-forest dark:text-gold group-hover:scale-110 transition-transform">
          {iconSvg}
        </div>
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-forest dark:group-hover:text-gold transition-colors">
            {name}
          </h3>
        </div>
        <p className="text-xs italic text-muted-foreground mb-3">{botanical}</p>
        <p className="text-xs leading-relaxed text-foreground/80">{description}</p>
      </div>
      <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-[11px] font-semibold text-forest dark:text-gold">
        <span>Target Benefit:</span>
        <span className="font-sans">{role}</span>
      </div>
    </div>
  );
}

export function IngredientsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const leafY1 = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const leafY2 = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const leafY3 = useTransform(scrollYProgress, [0, 1], [-10, 30]);

  return (
    <section
      id="ingredients"
      ref={containerRef}
      className="relative w-full py-16 overflow-hidden"
      aria-label="Pure Ayurvedic Botanicals"
    >
      {/* 5 Parallax Decorative Floating Leaves (off under Reduced Motion, positioned safely outside text box) */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Leaf 1: Top Left */}
          <div
            style={{ transform: `translateY(${leafY1}px)` }}
            className="absolute -top-6 left-6 opacity-20 text-forest dark:text-gold w-16 h-16"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 50 C20 10, 80 10, 90 50 C80 90, 20 90, 10 50 Z" />
            </svg>
          </div>
          {/* Leaf 2: Top Right */}
          <div
            style={{ transform: `translateY(${leafY2}px)` }}
            className="absolute top-12 right-8 opacity-20 text-forest dark:text-gold w-12 h-12"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 C90 20, 90 80, 50 90 C10 80, 10 20, 50 10 Z" />
            </svg>
          </div>
          {/* Leaf 3: Mid Left */}
          <div
            style={{ transform: `translateY(${leafY3}px)` }}
            className="absolute top-1/2 left-2 opacity-15 text-gold w-14 h-14"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 50 C40 20, 80 30, 80 50 C80 70, 40 80, 20 50 Z" />
            </svg>
          </div>
          {/* Leaf 4: Bottom Right */}
          <div
            style={{ transform: `translateY(${leafY1}px)` }}
            className="absolute bottom-10 right-4 opacity-15 text-forest dark:text-gold w-16 h-16"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 C80 30, 80 70, 50 90 C20 70, 20 30, 50 10 Z" />
            </svg>
          </div>
          {/* Leaf 5: Bottom Left */}
          <div
            style={{ transform: `translateY(${leafY2}px)` }}
            className="absolute -bottom-6 left-1/3 opacity-20 text-forest w-10 h-10"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 50 C30 20, 70 20, 90 50 C70 80, 30 80, 10 50 Z" />
            </svg>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-forest dark:text-gold">
            Earth to Root
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
            Potent Ayurvedic Botanicals
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every bottle is hand-infused with whole heritage botanicals chosen for their complementary abilities to nourish, soften, and protect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <HerbCard
            name="Neem"
            botanical="Azadirachta Indica"
            description="Revered in classical Ayurveda for purifying properties that soothe scalp irritation, maintain hygiene, and clear the foundation for healthy roots."
            role="Scalp Purification"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12" />
                <path d="M12 2C12 7 8 11 3 12" />
                <path d="M12 22C12 17 16 13 21 12" />
              </svg>
            }
          />

          <HerbCard
            name="Hibiscus"
            botanical="Hibiscus Rosa-Sinensis"
            description="Packed with natural amino acids and mucilage that deeply condition hair cuticle fibers, smoothing frizz and enhancing natural radiant sheen."
            role="Lustre & Softness"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2C14 5 14 7 12 9" />
                <path d="M12 15C14 17 14 19 12 22" />
                <path d="M2 12C5 14 7 14 9 12" />
                <path d="M15 12C17 14 19 14 22 12" />
              </svg>
            }
          />

          <HerbCard
            name="Amla"
            botanical="Phyllanthus Emblica"
            description="The premier rejuvenating fruit of Ayurveda, bursting with natural Vitamin C and flavonoids to strengthen hair fibers against breakage."
            role="Root Strengthening"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 4C10 8 10 16 12 20" />
                <path d="M4 12C8 10 16 10 20 12" />
              </svg>
            }
          />

          <HerbCard
            name="Fenugreek (Methi)"
            botanical="Trigonella Foenum-Graecum"
            description="Rich in botanical lecithin and proteins that replenish strand moisture, improve combability, and support natural root resilience."
            role="Density & Balance"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M7 17L17 7" />
                <path d="M17 17H7V7" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
