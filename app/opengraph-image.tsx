import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F3D2E 0%, #082119 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          color: "#FFF8E7",
          padding: 60,
          border: "12px solid #E8B923",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#E8B923",
              textTransform: "uppercase",
            }}
          >
            AKATSUKI
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#E8B923",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 950,
            color: "#FFF8E7",
          }}
        >
          Roots of Nature. Strength of Ayurveda.
        </div>

        <div
          style={{
            fontSize: 26,
            color: "#E8B923",
            marginTop: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          100% Ayurvedic Herbal Hair Oil
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 36,
            fontSize: 20,
            color: "rgba(255, 248, 231, 0.8)",
          }}
        >
          <span>Cold-Pressed</span>
          <span>•</span>
          <span>Paraben Free</span>
          <span>•</span>
          <span>Natural Ingredients</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
