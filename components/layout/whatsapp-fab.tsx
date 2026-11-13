"use client";

import React from "react";
import { SITE_CONFIG } from "@/lib/site";
import { WHATSAPP_PHONE_REGEX } from "@/lib/cart-context";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { useReducedMotion } from "framer-motion";

export function WhatsAppFab() {
  const number = SITE_CONFIG.whatsappNumber;
  const cleanNumber = number.replace(/\D/g, "");
  const shouldReduceMotion = useReducedMotion();

  // Hidden when environment variable / number is invalid
  if (!WHATSAPP_PHONE_REGEX.test(cleanNumber)) {
    return null;
  }

  const prefilled = "Hi Akatsuki, I would like to know more about your Ayurvedic Hair Oil.";
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(prefilled)}`;

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
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 pointer-events-none"
          />
        )}

        <WhatsAppIcon className="w-8 h-8 shrink-0 text-white fill-white relative z-10" aria-hidden="true" />

        {/* Tooltip on hover */}
        <span
          role="tooltip"
          className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-charcoal text-cream text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
