"use client";

import React, { useState } from "react";
import { SITE_CONFIG } from "@/lib/site";
import { getOrCreateVisitorReferralCode } from "@/lib/referral";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { Share2, Copy, Check, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

export function ShareTheShelf() {
  const [copied, setCopied] = useState(false);
  const rewardText = SITE_CONFIG.referral.reward;

  const getShareUrl = () => {
    const code = getOrCreateVisitorReferralCode();
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${siteUrl}?ref=${code}#rail`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Unable to copy link to clipboard.");
    }
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const message = `Check out AKATSUKI 100% Ayurvedic Herbal Hair Oils! Handcrafted with cold-pressed natural botanicals: ${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleWebShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil",
      text: "Handcrafted 100% Ayurvedic Herbal Hair Oil made with natural herbs to nourish, strengthen, and support healthy hair.",
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }
    handleCopyLink();
  };

  return (
    <section
      id="referral"
      aria-label="Share the Shelf Referral"
      className="w-full py-16"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl bg-card border border-gold/40 p-8 sm:p-12 shadow-lg text-center relative overflow-hidden">
          {/* Subtle gold decorative background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 dark:bg-gold/15 text-forest dark:text-gold text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-gold" />
              <span>Community & Sharing</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
              Love it? Share it.
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Introduce your friends and family to the holistic nourishing power of 100% Ayurvedic botanicals. Share your personal shelf link directly.
            </p>

            {/* Reward text shown ONLY if CONFIG.referral.reward is set */}
            {rewardText && (
              <p className="text-xs font-semibold text-forest dark:text-gold bg-forest/10 dark:bg-gold/15 px-4 py-2 rounded-xl inline-block">
                {rewardText}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button
                variant="gold"
                size="lg"
                onClick={handleWhatsAppShare}
                className="rounded-full gap-2 font-semibold shadow-md active:scale-95 px-6"
              >
                <WhatsAppIcon className="w-4 h-4 text-charcoal" />
                <span>Share on WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleCopyLink}
                className="rounded-full gap-2 font-medium px-5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-forest dark:text-gold" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleWebShare}
                className="rounded-full gap-2 text-xs font-semibold"
              >
                <Share2 className="w-4 h-4" />
                <span>More Options</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
