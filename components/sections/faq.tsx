"use client";

import React from "react";
import { SITE_CONFIG } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = SITE_CONFIG.faqs;

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="w-full py-16"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-forest dark:text-gold">
            Answers & Clarity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Learn more about our formulations, natural ingredients, and application routines.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-item-${idx}`}
              className="bg-card border border-border/80 rounded-2xl px-5 shadow-sm"
            >
              <AccordionTrigger className="font-serif font-semibold text-base text-foreground hover:text-forest dark:hover:text-gold py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
