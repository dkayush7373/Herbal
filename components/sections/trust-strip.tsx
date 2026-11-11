import React from "react";
import { SITE_CONFIG } from "@/lib/site";

export function TrustStrip() {
  return (
    <section
      aria-label="Ayurvedic Trust Pillars"
      className="w-full py-8 border-y border-gold/25 bg-muted/20 backdrop-blur-sm"
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6 text-center">
        {SITE_CONFIG.trustPills.map((pill, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="font-serif font-bold text-sm sm:text-base tracking-wide text-forest dark:text-cream">
              {pill}
            </span>
            {idx < SITE_CONFIG.trustPills.length - 1 && (
              <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-gold" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
