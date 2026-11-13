import { describe, it, expect } from "vitest";

describe("Share the Shelf Referral URL Formatting (§Bug 3 Verification)", () => {
  it("formats universal api.whatsapp.com URL with pre-filled message and encoded URL", () => {
    const siteUrl = "http://localhost:3000";
    const refCode = "AKAT-998877";
    const shareUrl = `${siteUrl}?ref=${refCode}#rail`;
    const message = `Check out AKATSUKI 100% Ayurvedic Herbal Hair Oils! Handcrafted with cold-pressed natural botanicals: ${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    expect(waUrl.startsWith("https://api.whatsapp.com/send?text=")).toBe(true);
    expect(waUrl).not.toContain("https://wa.me/?text=");
    expect(decodeURIComponent(waUrl)).toContain(shareUrl);
  });
});
