import React from "react";

const RITUAL_STEPS = [
  {
    step: "01",
    title: "Apply",
    subtitle: "Warm Between Palms",
    description:
      "Dispense 5 to 10 ml of herbal oil into your palm. Rub palms together gently for a few seconds to warm the natural botanicals before application.",
  },
  {
    step: "02",
    title: "Massage",
    subtitle: "Stimulate the Roots",
    description:
      "Part hair into sections. Using circular fingertip motions, massage thoroughly into the scalp for 5 to 7 minutes to encourage absorption.",
  },
  {
    step: "03",
    title: "Leave & Rinse",
    subtitle: "Absorb Deep Nutrients",
    description:
      "Allow the herbs to penetrate for at least 45 minutes to 2 hours (or overnight). Cleanse with a mild herbal cleanser and cool water.",
  },
];

export function HowToUseSection() {
  return (
    <section
      id="how-to-use"
      aria-label="Ayurvedic Hair Ritual"
      className="w-full py-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-forest dark:text-gold">
            Sacred Ritual
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest dark:text-cream">
            The Three-Step Ayurvedic Ritual
          </h2>
          <p className="text-sm text-muted-foreground">
            A timeless practice to ground the senses, calm the scalp, and nourish hair from root to tip.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* SVG Connecting Line between step circles (visible on desktop md+) */}
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[2px] z-0 pointer-events-none" aria-hidden="true">
            <svg width="100%" height="2" fill="none">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="url(#ritual-line-grad)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <defs>
                <linearGradient id="ritual-line-grad" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E8B923" stopOpacity="0.2" />
                  <stop offset="0.5" stopColor="#E8B923" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#E8B923" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {RITUAL_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-gold/15 hover:border-gold/40 transition-all space-y-3"
            >
              {/* Gold Circle with Forest Numeral */}
              <div className="w-14 h-14 rounded-full bg-gold shadow-md flex items-center justify-center border-4 border-background">
                <span className="font-serif text-lg font-bold text-forest">
                  {item.step}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-forest dark:text-gold">
                  {item.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
