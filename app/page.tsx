export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-4">
        <span className="inline-block rounded-full bg-forest/10 px-4 py-1 text-xs font-semibold tracking-wider text-forest uppercase dark:bg-gold/15 dark:text-gold">
          100% Ayurvedic Herbal Care
        </span>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-forest dark:text-cream sm:text-6xl">
          Roots of Nature. Strength of Ayurveda.
        </h1>
        <p className="text-muted-foreground text-lg">
          Handcrafted Ayurvedic formulations to nourish, strengthen, and support healthy hair.
        </p>
      </div>
    </div>
  );
}
