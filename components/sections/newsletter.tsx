"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, ArrowRight, Check } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setStatusMessage("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
    if (!endpoint) {
      setSubscribed(true);
      setEmail("");
      setStatusMessage(null);
      toast.success("Thank you for joining our Ayurvedic circle!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        toast.success("Welcome to AKATSUKI Herbal Care circle!");
      } else {
        toast.error("Unable to subscribe right now. Please try again later.");
      }
    } catch {
      toast.error("Network error submitting subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Ayurvedic Newsletter"
      className="w-full py-16 bg-card border-t border-border/50"
    >
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-forest/10 dark:bg-gold/15 flex items-center justify-center text-forest dark:text-gold mb-2">
          <Mail className="w-5 h-5" />
        </div>

        <h2 className="font-serif text-3xl font-bold text-forest dark:text-cream">
          Join the Ayurvedic Herbal Circle
        </h2>

        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Receive seasonal hair care guides, traditional oiling rituals, and early updates on new batch releases.
        </p>

        {statusMessage && (
          <p className="text-xs text-destructive font-medium">{statusMessage}</p>
        )}

        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-3 rounded-full bg-forest/10 dark:bg-gold/15 text-forest dark:text-gold text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Thank you for joining our circle!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                aria-label="Email address for Ayurvedic newsletter"
                className="w-full px-5 py-3 rounded-full bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={loading}
              className="w-full sm:w-auto rounded-full px-6 py-3 font-semibold gap-2 whitespace-nowrap"
            >
              <span>{loading ? "Joining..." : "Subscribe"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
