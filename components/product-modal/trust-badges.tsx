"use client";

import React from "react";
import { ShieldCheck, Sparkles, Award, Heart } from "lucide-react";
import { TRUST_CONFIG } from "@/lib/trust-config";
import { PROMO } from "@/lib/promo-config";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  if (!PROMO.featureFlags.trustBadges) return null;

  const badges = [
    TRUST_CONFIG.parabenSulfateFree
      ? {
          key: "paraben-free",
          label: "Paraben & Sulfate Free",
          icon: ShieldCheck,
        }
      : null,
    TRUST_CONFIG.labTested
      ? {
          key: "lab-tested",
          label: "Lab Tested",
          icon: Award,
        }
      : null,
    TRUST_CONFIG.crueltyFree
      ? {
          key: "cruelty-free",
          label: "Cruelty Free",
          icon: Heart,
        }
      : null,
    TRUST_CONFIG.madeInIndia
      ? {
          key: "made-in-india",
          label: "Made in India",
          icon: Sparkles,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];

  if (badges.length === 0) return null;

  return (
    <div
      data-testid="trust-badges-row"
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.key}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forest/5 dark:bg-gold/10 text-forest dark:text-gold border border-forest/10 dark:border-gold/20"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}
