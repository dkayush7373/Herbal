export const REFERRAL_STORAGE_KEY = "akatsuki.ref.v1";

const REFERRAL_REGEX = /^[a-zA-Z0-9_-]{1,24}$/;

export function sanitizeReferralCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const trimmed = code.trim();
  if (REFERRAL_REGEX.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export function captureReferralFromUrl(searchString?: string): string | null {
  if (typeof window === "undefined" && !searchString) return null;
  try {
    const query = searchString ?? (typeof window !== "undefined" ? window.location.search : "");
    const params = new URLSearchParams(query);
    const refParam = params.get("ref");
    const sanitized = sanitizeReferralCode(refParam);
    if (sanitized) {
      setStoredReferral(sanitized);
      return sanitized;
    }
  } catch {
    // Fail gracefully
  }
  return null;
}

export function getStoredReferral(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return sanitizeReferralCode(raw);
  } catch {
    return null;
  }
}

export function setStoredReferral(code: string): void {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeReferralCode(code);
  if (!sanitized) return;
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, sanitized);
  } catch {
    // Fail gracefully in restricted private storage
  }
}

export function generateVisitorReferralCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "akat-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getOrCreateVisitorReferralCode(): string {
  if (typeof window === "undefined") return "akat-guest";
  try {
    const existing = getStoredReferral();
    if (existing) return existing;
    const generated = generateVisitorReferralCode();
    setStoredReferral(generated);
    return generated;
  } catch {
    return "akat-guest";
  }
}
