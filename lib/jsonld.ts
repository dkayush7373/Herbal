import { PRODUCTS, getPrice } from "@/lib/products";

export function generateProductJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@graph": PRODUCTS.map((product) => {
      const price = getPrice(product.id, "100 ml") ?? 349;
      return {
        "@type": "Product",
        "@id": `${siteUrl}/#product-${product.id}`,
        name: `AKATSUKI ${product.name} Ayurvedic Hair Oil`,
        description: product.description,
        image: `${siteUrl}${product.image}`,
        brand: {
          "@type": "Brand",
          name: "AKATSUKI",
        },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/#rail`,
          priceCurrency: "INR",
          price: price.toString(),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      };
    }),
  };
}
