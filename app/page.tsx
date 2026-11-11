import { PRODUCTS, formatINR } from "@/lib/products";
import { BottleImage } from "@/components/bottle-image";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-8 text-center max-w-6xl mx-auto space-y-12">
      <div className="max-w-2xl space-y-4 pt-8">
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

      <div className="w-full">
        <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
          Our Botanical Collection
        </h2>
        <div
          id="bottles-container"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-end"
        >
          {PRODUCTS.map((product, idx) => (
            <div
              key={product.id}
              data-testid={`bottle-${product.id}`}
              className="flex flex-col items-center p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full max-w-[160px] mb-4">
                <BottleImage
                  product={product}
                  priority={idx === 0}
                  sizes="(max-width:768px) 45vw, 18vw"
                />
              </div>
              <h3 className="font-serif font-semibold text-foreground text-sm">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground">{product.tagline}</p>
              <p className="font-medium text-sm text-forest dark:text-gold mt-2">
                {product.prices["100 ml"]
                  ? formatINR(product.prices["100 ml"]!)
                  : "Coming soon"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
