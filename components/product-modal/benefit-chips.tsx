"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BenefitChipsProps {
  benefits: [string, string, string] | string[];
  badge?: string | null;
  className?: string;
}

export function BenefitChips({ benefits, badge, className }: BenefitChipsProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {badge && (
        <span className="inline-block rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-charcoal dark:text-gold border border-gold/40">
          {badge}
        </span>
      )}
      <div
        data-testid="benefit-chips-group"
        className="flex flex-wrap gap-1.5"
      >
        {benefits.map((b, i) => (
          <span
            key={i}
            data-testid="benefit-chip"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted/50 text-foreground/80 border border-border/40"
          >
            <Sparkles className="w-2.5 h-2.5 text-forest dark:text-gold" />
            <span>{b}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
