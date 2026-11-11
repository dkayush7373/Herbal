"use client";

import React, { useRef } from "react";
import { BottleRail } from "@/components/rail/bottle-rail";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, ShieldCheck, Leaf, HeartHandshake } from "lucide-react";
import { useReducedMotion } from "framer-motion";

const TRUST_PILLS = [
  { label: "100% Natural Botanicals", icon: Leaf },
  { label: "0 Parabens & Sulfates", icon: ShieldCheck },
  { label: "For Men, Women & Children", icon: HeartHandshake },
  { label: "Authentic Ayurvedic Heritage", icon: Sparkles },
];

export function Hero() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle magnetic hover effect on desktop CTA button (RM-safe)
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    buttonRef.current.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <section className="relative w-full pt-8 pb-4 flex flex-col items-center">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 dark:bg-gold/15 px-4 py-1 text-xs font-bold tracking-widest text-forest dark:text-gold uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>100% Ayurvedic Herbal Oil</span>
        </div>

        {/* H1 Heading with Responsive Clamp (text-4xl -> text-6xl) */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-forest dark:text-cream leading-[1.15]">
          Roots of Nature. Strength of Ayurveda.
        </h1>

        {/* No medical claims subtext */}
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Artisanal botanical formulations crafted with pure cold-pressed oils and heritage herbs to deeply nourish the scalp, support hair vitality, and maintain natural silky lustre.
        </p>

        {/* Magnetic CTA Button */}
        <div className="pt-2">
          <a
            ref={buttonRef}
            href="#rail"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-forest text-cream hover:bg-forest/90 dark:bg-gold dark:text-charcoal dark:hover:bg-gold/90 font-semibold shadow-md transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>Shop Now</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>

        {/* 4 Trust Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
          {TRUST_PILLS.map((pill, i) => {
            const Icon = pill.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-card border border-border/60 text-xs font-medium text-foreground shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="truncate">{pill.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hanging Bottle Rail (Above the fold on desktop >= 768px) */}
      <div className="w-full mt-8">
        <BottleRail />
      </div>
    </section>
  );
}
