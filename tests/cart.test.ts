import { describe, it, expect, beforeEach } from "vitest";
import {
  sanitizeCartItems,
  buildWhatsAppOrderMessage,
  buildWhatsAppCheckoutUrl,
  CartItem,
  MAX_QTY_PER_LINE,
  WHATSAPP_PHONE_REGEX,
} from "@/lib/cart-context";
import {
  sanitizeReferralCode,
  captureReferralFromUrl,
  REFERRAL_STORAGE_KEY,
} from "@/lib/referral";

describe("Cart Reducer & Validation Spec", () => {
  it("drops invalid items, corrupt structures, unknown ids, and illegal sizes", () => {
    const corruptInput = [
      null,
      undefined,
      "bad-string",
      { id: "fake-oil", size: "100 ml", qty: 2 },
      { id: "oil-white", size: "500 ml", qty: 2 }, // invalid size
      { id: "oil-white", size: "100 ml", qty: 0 }, // invalid qty
      { id: "oil-white", size: "100 ml", qty: -5 },
      { id: "oil-white", size: "100 ml", qty: 15 }, // exceeds MAX_QTY_PER_LINE
      { id: "oil-white", size: "100 ml", qty: 2.5 }, // non-integer
    ];

    const result = sanitizeCartItems(corruptInput);
    expect(result).toEqual([]);
  });

  it("merges duplicate line items and clamps to max limit", () => {
    const input: CartItem[] = [
      { id: "oil-white", size: "100 ml", qty: 4 },
      { id: "oil-white", size: "100 ml", qty: 8 },
    ];

    const result = sanitizeCartItems(input);
    expect(result).toHaveLength(1);
    expect(result[0].qty).toBe(MAX_QTY_PER_LINE); // clamped to 10
  });

  it("safely handles valid items with correct schema", () => {
    const input: CartItem[] = [
      { id: "oil-white", size: "100 ml", qty: 2 },
      { id: "oil-black", size: "100 ml", qty: 1 },
    ];

    const result = sanitizeCartItems(input);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "oil-white", size: "100 ml", qty: 2 });
    expect(result[1]).toEqual({ id: "oil-black", size: "100 ml", qty: 1 });
  });
});

describe("WhatsApp Message Builder & Encoding Spec", () => {
  const sampleItems: CartItem[] = [
    { id: "oil-white", size: "100 ml", qty: 2 }, // 349 * 2 = 698
    { id: "oil-black", size: "100 ml", qty: 1 }, // 399
  ];
  const sampleSubtotal = 1097;

  it("builds plain text message with real newlines without premature encoding", () => {
    const msg = buildWhatsAppOrderMessage(sampleItems, sampleSubtotal);
    expect(msg).toContain("Hi Akatsuki, I'd like to order:\n");
    expect(msg).toContain("• Classic White — 100 ml × 2 — ₹698\n");
    expect(msg).toContain("• Midnight Black — 100 ml × 1 — ₹399\n");
    expect(msg).toContain("Total: ₹1,097");
    expect(msg).not.toContain("%0A");
  });

  it("CRITICAL: round-trip decoding test — decodeURIComponent(url param) === original message", () => {
    const plainMsg = buildWhatsAppOrderMessage(
      sampleItems,
      sampleSubtotal,
      "akat-test12"
    );
    expect(plainMsg).toContain("Referred by: akat-test12");

    const validNumber = "919876543210";
    const checkoutUrl = buildWhatsAppCheckoutUrl(
      sampleItems,
      sampleSubtotal,
      validNumber,
      "akat-test12"
    );

    expect(checkoutUrl).not.toBeNull();
    const urlObj = new URL(checkoutUrl!);
    expect(urlObj.origin + urlObj.pathname).toBe(`https://wa.me/${validNumber}`);

    const extractedTextParam = urlObj.searchParams.get("text");
    expect(extractedTextParam).toBe(plainMsg);
  });

  it("rejects invalid WhatsApp phone numbers", () => {
    expect(WHATSAPP_PHONE_REGEX.test("0987654321")).toBe(false); // starts with 0
    expect(WHATSAPP_PHONE_REGEX.test("+919876543210")).toBe(false); // contains +
    expect(WHATSAPP_PHONE_REGEX.test("invalid")).toBe(false);
    expect(WHATSAPP_PHONE_REGEX.test("919876543210")).toBe(true);

    const badUrl = buildWhatsAppCheckoutUrl(
      sampleItems,
      sampleSubtotal,
      "invalid-phone"
    );
    expect(badUrl).toBeNull();
  });
});

describe("Referral Capture & Sanitization Spec", () => {
  it("sanitizes referral code rejecting malicious or overly long inputs", () => {
    expect(sanitizeReferralCode("akat-promo")).toBe("akat-promo");
    expect(sanitizeReferralCode("akat_12345")).toBe("akat_12345");
    expect(sanitizeReferralCode("<script>alert(1)</script>")).toBeNull();
    expect(sanitizeReferralCode("a".repeat(25))).toBeNull(); // > 24 chars
    expect(sanitizeReferralCode("")).toBeNull();
  });

  it("extracts and captures ?ref= parameter from search query", () => {
    const code = captureReferralFromUrl("?ref=friend99&utm_source=ig");
    expect(code).toBe("friend99");
  });
});
