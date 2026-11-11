"use client";

import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/site";
import { formatINR } from "@/lib/products";
import { Clock, Truck } from "lucide-react";

export function OfferBanner() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    setMounted(true);

    const calculateRemaining = () => {
      const now = new Date();
      // Target: local midnight (23:59:59 today)
      let target = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        // If passed midnight, add 24 hours
        target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
        diff = target.getTime() - now.getTime();
      }

      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const threshold = SITE_CONFIG.shipping.freeShippingThreshold;

  return (
    <div
      aria-label="Daily Shipping Offer"
      className="w-full bg-forest text-cream dark:bg-gold dark:text-charcoal py-3 px-4 shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 shrink-0" />
          <span>
            Complimentary Standard Delivery on all orders above {formatINR(threshold)}!
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Midnight delivery dispatch window:</span>
          {mounted ? (
            <span className="font-bold bg-black/20 dark:bg-black/15 px-2 py-0.5 rounded">
              {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </span>
          ) : (
            <span className="font-bold bg-black/20 dark:bg-black/15 px-2 py-0.5 rounded">
              --:--:--
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
