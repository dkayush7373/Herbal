"use client";

import React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

export function AmbientBotanicalBackdrop() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* 1. Cinematic Botanical Imagery with Ambient Breathing Movement */}
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-1000 ${
          shouldReduceMotion ? "" : "animate-ambient-drift"
        }`}
        style={{
          transformOrigin: "center center",
        }}
      >
        <Image
          src="/images/botanical-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-35 dark:opacity-25 filter blur-[0.5px]"
        />
      </div>

      {/* 2. Ambient Sunlight Rays & Golden Dust Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(212, 175, 55, 0.22) 0%, rgba(232, 185, 35, 0.08) 40%, transparent 75%)",
        }}
      />

      {/* 3. Dedicated Spotlight Glow Behind Hanging Bottle Rail */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[42%] w-full max-w-5xl h-[380px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.18) 0%, rgba(15, 61, 46, 0.08) 50%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />

      {/* 4. Luxury Vignette & Soft Gradient Masks for Flawless Text Contrast */}
      {/* Light Mode: Warm Silk Alabaster Fade */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250, 246, 238, 0.75) 0%, rgba(250, 246, 238, 0.45) 45%, rgba(250, 246, 238, 0.90) 85%, rgba(250, 246, 238, 1) 100%)",
        }}
      />

      {/* Dark Mode: Mystic Emerald Night Sanctuary Fade */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14, 23, 19, 0.85) 0%, rgba(14, 23, 19, 0.55) 45%, rgba(14, 23, 19, 0.92) 85%, rgba(14, 23, 19, 1) 100%)",
        }}
      />

      {/* 5. Delicate Botanical Branch Silhouette Accents (Left and Right Flanks) */}
      <div className="absolute top-0 left-0 w-72 h-72 opacity-20 dark:opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-forest dark:text-gold">
          <path
            d="M-20 -20 C30 50, 60 120, 20 180 M20 40 C60 50, 90 20, 110 30 M35 80 C80 90, 110 70, 130 90 M25 130 C70 150, 100 130, 120 160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-72 h-72 opacity-20 dark:opacity-15 pointer-events-none scale-x-[-1]">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-forest dark:text-gold">
          <path
            d="M-20 -20 C30 50, 60 120, 20 180 M20 40 C60 50, 90 20, 110 30 M35 80 C80 90, 110 70, 130 90 M25 130 C70 150, 100 130, 120 160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}

