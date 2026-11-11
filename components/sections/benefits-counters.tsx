"use client";

import React, { useEffect, useRef } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useReducedMotion,
  motion,
} from "framer-motion";
import { SITE_CONFIG } from "@/lib/site";

interface CounterItemProps {
  label: string;
  target: number;
  suffix?: string;
  inView: boolean;
  shouldReduceMotion: boolean | null;
}

function AnimatedCounter({
  label,
  target,
  suffix = "",
  inView,
  shouldReduceMotion,
}: CounterItemProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        count.set(target);
      } else {
        animate(count, target, {
          duration: 1.8,
          ease: "easeOut",
        });
      }
    }
  }, [inView, target, count, shouldReduceMotion]);

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border shadow-sm text-center">
      <div className="font-serif text-4xl sm:text-5xl font-bold text-forest dark:text-gold flex items-center">
        <motion.span>{rounded}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export function BenefitsCountersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  // Filter only verified counters; customer counts without verified:true are omitted
  const verifiedCounters = SITE_CONFIG.counters.filter((c) => c.verified);

  return (
    <section
      ref={containerRef}
      aria-label="Verified Botanical Metrics"
      className="w-full py-12"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {verifiedCounters.map((item, idx) => (
            <AnimatedCounter
              key={idx}
              label={item.label}
              target={item.value}
              suffix={item.suffix}
              inView={inView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
