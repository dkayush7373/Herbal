"use client";

import React, { useState, useRef } from "react";
import { SITE_CONFIG } from "@/lib/site";
import { mapQuizAnswersToProduct, QuizAnswers } from "@/lib/quiz";
import { BottleImage } from "@/components/bottle-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { getOrCreateVisitorReferralCode } from "@/lib/referral";
import { useJiggle } from "@/lib/physics/use-jiggle-engine";
import { toast } from "sonner";
import { Sparkles, Check, Share2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizSection() {
  const { addItem, setIsDrawerOpen } = useCart();
  const quizConfig = SITE_CONFIG.quiz;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const resultCardRef = useRef<HTMLDivElement>(null);
  useJiggle(resultCardRef);

  const handleSelectOption = (questionId: "hairFeel" | "routine" | "scentVibe", value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    if (currentStep < quizConfig.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const matchedProduct = isCompleted
    ? mapQuizAnswersToProduct({
        hairFeel: answers.hairFeel || "normal",
        routine: answers.routine || "daily",
        scentVibe: answers.scentVibe || "herbal",
      })
    : null;

  const handleAddPickToBag = () => {
    if (!matchedProduct) return;
    addItem(matchedProduct.id, "100 ml", 1);
    setIsDrawerOpen(true);
    toast.success(`Added your personalized match: ${matchedProduct.name}`);
  };

  const handleSharePick = async () => {
    if (!matchedProduct) return;
    const refCode = getOrCreateVisitorReferralCode();
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${siteUrl}?ref=${refCode}#quiz`;

    const shareData = {
      title: `My Ayurvedic Oil Match — ${matchedProduct.name}`,
      text: `I took the AKATSUKI Herbal Hair Oil quiz and matched with ${matchedProduct.name} (${matchedProduct.tagline})! Discover yours here:`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e: any) {
        if (e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Match link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <section
      id="quiz"
      aria-label="Find Your Ayurvedic Oil Quiz"
      className="w-full py-16 bg-muted/20 border-y border-border/50"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-gold">
            Personalized Routine
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
            {quizConfig.title}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {quizConfig.subtitle}
          </p>
        </div>

        {!isCompleted ? (
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-md">
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
              <span className="text-xs font-semibold text-muted-foreground">
                Question {currentStep + 1} of {quizConfig.questions.length}
              </span>
              <div className="flex gap-1.5">
                {quizConfig.questions.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-6 h-1 rounded-full transition-colors",
                      i === currentStep
                        ? "bg-gold"
                        : i < currentStep
                        ? "bg-forest dark:bg-gold/40"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                {quizConfig.questions[currentStep].title}
              </h3>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {quizConfig.questions[currentStep].options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      handleSelectOption(
                        quizConfig.questions[currentStep].id,
                        opt.value
                      )
                    }
                    className="flex flex-col text-left p-4 rounded-2xl border border-border/80 bg-background hover:border-gold hover:bg-gold/5 active:scale-[0.99] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-serif font-bold text-base text-foreground group-hover:text-forest dark:group-hover:text-gold transition-colors">
                      {opt.label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Result Card with Jiggle Hook */
          matchedProduct && (
            <div
              ref={resultCardRef}
              data-testid="quiz-result-card"
              className="bg-card rounded-3xl p-6 sm:p-8 border border-gold/50 shadow-xl text-center space-y-6 select-none cursor-pointer"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 dark:bg-gold/15 text-forest dark:text-gold text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Botanical Match</span>
              </div>

              <div className="max-w-xs mx-auto">
                <div className="w-32 h-64 mx-auto mb-4">
                  <BottleImage
                    product={matchedProduct}
                    priority
                    sizes="140px"
                    className="w-full h-full"
                  />
                </div>
                <h3 className="font-serif text-3xl font-bold text-foreground">
                  {matchedProduct.name}
                </h3>
                <p className="text-sm text-gold font-medium mt-1">
                  {matchedProduct.tagline}
                </p>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {matchedProduct.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleAddPickToBag}
                  className="rounded-full font-bold shadow-md active:scale-95 px-6"
                >
                  Add My Pick to Bag
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSharePick}
                  className="rounded-full gap-2 text-xs font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-forest dark:text-gold" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share My Pick</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetQuiz}
                  className="rounded-full text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
