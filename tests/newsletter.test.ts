import { describe, it, expect } from "vitest";

describe("Newsletter email validation logic", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("accepts standard valid emails", () => {
    expect(emailRegex.test("user@example.com")).toBe(true);
    expect(emailRegex.test("care.ayurveda@akatsuki.co.in")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(emailRegex.test("")).toBe(false);
    expect(emailRegex.test("plainstring")).toBe(false);
    expect(emailRegex.test("@missingusername.com")).toBe(false);
    expect(emailRegex.test("user@missingdomain")).toBe(false);
  });
});
