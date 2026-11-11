import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil",
    short_name: "AKATSUKI",
    description:
      "Handcrafted 100% Ayurvedic Herbal Hair Oil made with natural herbs to nourish, strengthen, and support healthy hair.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#0F3D2E",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
