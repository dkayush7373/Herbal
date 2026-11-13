import { describe, it, expect } from "vitest";
import { buildWhatsAppCheckoutUrl, CartItem } from "@/lib/cart-context";

describe("WhatsApp Phone Number Sanitization (§Bug 2 Verification)", () => {
  const sampleItems: CartItem[] = [
    { id: "oil-white", size: "100 ml", qty: 2 },
  ];
  const subtotal = 698;

  it("handles numbers with country code prefix and spaces (+91 98444 81633)", () => {
    const url = buildWhatsAppCheckoutUrl(sampleItems, subtotal, "+91 98444 81633");
    expect(url).not.toBeNull();
    expect(url).toContain("https://wa.me/919844481633");
  });

  it("handles numbers with dashes (+91-98444-81633)", () => {
    const url = buildWhatsAppCheckoutUrl(sampleItems, subtotal, "+91-98444-81633");
    expect(url).not.toBeNull();
    expect(url).toContain("https://wa.me/919844481633");
  });

  it("handles numbers with parentheses ((+91) 9844481633)", () => {
    const url = buildWhatsAppCheckoutUrl(sampleItems, subtotal, "(+91) 9844481633");
    expect(url).not.toBeNull();
    expect(url).toContain("https://wa.me/919844481633");
  });

  it("returns null for completely invalid phone numbers", () => {
    expect(buildWhatsAppCheckoutUrl(sampleItems, subtotal, "abc")).toBeNull();
    expect(buildWhatsAppCheckoutUrl(sampleItems, subtotal, "123")).toBeNull();
    expect(buildWhatsAppCheckoutUrl(sampleItems, subtotal, "")).toBeNull();
  });
});
