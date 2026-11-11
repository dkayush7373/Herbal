"use client";

import React from "react";
import { SITE_CONFIG } from "@/lib/site";
import { Star, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSection() {
  const showDemoContent = process.env.NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true";
  const allReviews = SITE_CONFIG.reviews;

  // Filter reviews: verified reviews or demo reviews if NEXT_PUBLIC_SHOW_DEMO_CONTENT === "true"
  const visibleReviews = allReviews.filter((r) => r.verified || (showDemoContent && r.isDemo));

  if (visibleReviews.length === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      aria-label="Customer Experiences"
      className="w-full py-16 bg-muted/20 border-y border-border/50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-gold">
            Voices of Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
            Authentic Customer Experiences
          </h2>
          <p className="text-sm text-muted-foreground">
            Read what people are saying about our cold-pressed herbal hair oils.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Visible Sample Review Badge if demo */}
              {rev.isDemo && (
                <div className="inline-block self-start px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  Sample review — replace before launch
                </div>
              )}

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-gold">
                {rev.verified ? (
                  Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    Review pending verification
                  </span>
                )}
              </div>

              {/* Comment text */}
              <p className="text-sm italic text-foreground/85 leading-relaxed flex-1">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Author & Variant */}
              <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground flex items-center gap-1">
                    <span>{rev.author}</span>
                    {rev.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-forest dark:text-gold" />
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Verified Customer · {rev.productName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
