"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { MODAL_COPY } from "@/lib/modal-copy";
import { cn } from "@/lib/utils";

interface RatingBlockProps {
  rating: number | null;
  reviewCount: number | null;
  className?: string;
}

export function RatingBlock({ rating, reviewCount, className }: RatingBlockProps) {
  // Honest placeholder: When rating/reviewCount is null, hide stars completely and show honest text
  const isRatingPresent = typeof rating === "number" && typeof reviewCount === "number" && reviewCount > 0;

  return (
    <div
      data-testid="rating-block"
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}
    >
      {!isRatingPresent ? (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 text-[11px] font-medium text-muted-foreground">
          <MessageSquare className="w-3 h-3" />
          <span>{MODAL_COPY.beTheFirstToReview}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-[11px]">({reviewCount} reviews)</span>
        </div>
      )}
    </div>
  );
}
