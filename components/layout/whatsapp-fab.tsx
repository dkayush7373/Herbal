"use client";

import React from "react";
import { SITE_CONFIG } from "@/lib/site";
import { WHATSAPP_PHONE_REGEX } from "@/lib/cart-context";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { useReducedMotion } from "framer-motion";

export function WhatsAppFab() {
  const number = SITE_CONFIG.whatsappNumber;
  const shouldReduceMotion = useReducedMotion();

  // Hidden when environment variable / number is invalid
  if (!WHATSAPP_PHONE_REGEX.test(number)) {
    return null;
  }

  const prefilled = "Hi Akatsuki, I'd like to know more about your Ayurvedic Hair Oil.";
  const url = `https://wa.me/${number}?text=${encodeURIComponent(prefilled)}`;

  return (
    <div className="fixed bottom-6 right-6 z-30 pointer-events-auto">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AKATSUKI on WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {/* Pulse Ring (off under Reduced Motion) */}
        {!shouldReduceMotion && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"
          />
        )}

        <WhatsAppIcon className="w-7 h-7" />

        {/* Tooltip on hover */}
        <span className="sr-only sm:not-sr-only absolute right-16 px-3 py-1.5 rounded-lg bg-charcoal text-cream text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
