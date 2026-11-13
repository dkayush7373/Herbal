import React from "react";
import { SITE_CONFIG } from "@/lib/site";

export function TrustStrip() {
  return (
    <section
      aria-label="Ayurvedic Trust Pillars"
      className="relative z-10 w-full py-8 border-y border-gold/30 bg-card/60 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6 text-center">
        {SITE_CONFIG.trustPills.map((pill, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-forest dark:text-cream">
              {pill}
            </span>
            {idx < SITE_CONFIG.trustPills.length - 1 && (
              <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
