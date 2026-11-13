import { OfferBanner } from "@/components/sections/offer";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { IngredientsSection } from "@/components/sections/ingredients";
import { BenefitsCountersSection } from "@/components/sections/benefits-counters";
import { QuizSection } from "@/components/sections/quiz";
import { ShareTheShelf } from "@/components/sections/share-the-shelf";
import { HowToUseSection } from "@/components/sections/how-to-use";
import { ReviewsSection } from "@/components/sections/reviews";
import { FaqSection } from "@/components/sections/faq";
import { NewsletterSection } from "@/components/sections/newsletter";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { DelightLayer } from "@/components/delight/delight-layer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground bg-grain">
      {/* 1. Daily Shipping Offer Countdown Banner */}
      <OfferBanner />

      {/* 2. Sticky Navbar with Theme Toggle, Cart & Mobile Drawer */}
      <Navbar />

      {/* Main Content Sections */}
      <div className="flex-1 space-y-16 sm:space-y-24">
        {/* 3. Hero with H1, 4 Trust Pills & Bottle Rail */}
        <Hero />

        {/* 4. Ayurvedic Trust Strip */}
        <TrustStrip />

        {/* 5. Pure Botanical Ingredients */}
        <IngredientsSection />

        {/* 6. Verified Benefits Counters */}
        <BenefitsCountersSection />

        {/* 7. Find Your Ayurvedic Oil Quiz */}
        <QuizSection />

        {/* 8. Share the Shelf Referral */}
        <ShareTheShelf />

        {/* 9. Three-Step Application Ritual */}
        <HowToUseSection />

        {/* 10. Verified Customer Reviews */}
        <ReviewsSection />

        {/* 11. Frequently Asked Questions */}
        <FaqSection />

        {/* 12. Ayurvedic Herbal Circle Newsletter */}
        <NewsletterSection />
      </div>

      {/* 13. Brand Footer with Social Links */}
      <Footer />

      {/* 14. Floating WhatsApp Action Button */}
      <WhatsAppFab />

      {/* 15. Sparkle Cursor Delight Layer */}
      <DelightLayer />
    </div>
  );
}
