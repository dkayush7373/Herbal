"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Size, getProduct, getPrice, formatINR } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/site";
import { getStoredReferral, captureReferralFromUrl } from "@/lib/referral";

export const CART_STORAGE_KEY = "akatsuki.cart.v1";
export const MAX_QTY_PER_LINE = 10;
export const WHATSAPP_PHONE_REGEX = /^[1-9]\d{9,14}$/;

export interface CartItem {
  id: string;
  size: Size;
  qty: number;
}

export interface CartContextValue {
  items: CartItem[];
  mounted: boolean;
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addItem: (id: string, size: Size, qty?: number) => void;
  incQty: (id: string, size: Size) => void;
  decQty: (id: string, size: Size) => void;
  removeItem: (id: string, size: Size) => void;
  clearCart: () => void;
  checkoutUrl: string | null;
  isWhatsAppConfigured: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Validates and sanitizes raw stored cart items.
 * Discards unknown product ids, unsupported sizes, or invalid quantities.
 */
export function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const valid: CartItem[] = [];

  for (const item of raw) {
    if (
      typeof item === "object" &&
      item !== null &&
      typeof (item as CartItem).id === "string" &&
      typeof (item as CartItem).size === "string" &&
      typeof (item as CartItem).qty === "number"
    ) {
      const candidate = item as CartItem;
      const product = getProduct(candidate.id);
      const isSizeValid = candidate.size === "100 ml" || candidate.size === "200 ml";
      const isQtyValid =
        Number.isInteger(candidate.qty) &&
        candidate.qty >= 1 &&
        candidate.qty <= MAX_QTY_PER_LINE;

      if (product && isSizeValid && isQtyValid) {
        // Merge with existing line if duplicated
        const existingIdx = valid.findIndex(
          (v) => v.id === candidate.id && v.size === candidate.size
        );
        if (existingIdx >= 0) {
          valid[existingIdx].qty = Math.min(
            MAX_QTY_PER_LINE,
            valid[existingIdx].qty + candidate.qty
          );
        } else {
          valid.push({
            id: candidate.id,
            size: candidate.size,
            qty: candidate.qty,
          });
        }
      }
    }
  }

  return valid;
}

/**
 * Builds plain-text WhatsApp order message with real \n before URL encoding.
 */
export function buildWhatsAppOrderMessage(
  items: CartItem[],
  subtotal: number,
  referralCode?: string | null
): string {
  if (items.length === 0) return "";

  const lines: string[] = ["Hi Akatsuki, I'd like to order:"];

  for (const item of items) {
    const product = getProduct(item.id);
    const price = getPrice(item.id, item.size) ?? 0;
    const lineTotal = price * item.qty;
    const name = product ? product.name : item.id;
    lines.push(`• ${name} — ${item.size} × ${item.qty} — ${formatINR(lineTotal)}`);
  }

  lines.push(`Total: ${formatINR(subtotal)}`);

  if (referralCode) {
    lines.push(`Referred by: ${referralCode}`);
  }

  return lines.join("\n");
}

/**
 * Encodes order message and creates wa.me checkout URL.
 */
export function buildWhatsAppCheckoutUrl(
  items: CartItem[],
  subtotal: number,
  whatsappNumber: string,
  referralCode?: string | null
): string | null {
  if (!WHATSAPP_PHONE_REGEX.test(whatsappNumber)) {
    return null;
  }
  const plainMessage = buildWhatsAppOrderMessage(items, subtotal, referralCode);
  if (!plainMessage) return null;

  const encodedMessage = encodeURIComponent(plainMessage);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Initialize and load persisted cart & check URL for ?ref=
  useEffect(() => {
    captureReferralFromUrl();
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(sanitizeCartItems(parsed));
      }
    } catch {
      // Corrupt JSON: fallback to empty items safely without crashing
      setItems([]);
    }
    setMounted(true);
  }, []);

  // Persist cart updates
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota or restriction fail gracefully
    }
  }, [items, mounted]);

  const addItem = useCallback((id: string, size: Size, qty = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === id && i.size === size
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(
          MAX_QTY_PER_LINE,
          updated[existingIndex].qty + qty
        );
        updated[existingIndex] = { ...updated[existingIndex], qty: newQty };
        return updated;
      }
      return [...prev, { id, size, qty: Math.min(MAX_QTY_PER_LINE, qty) }];
    });
  }, []);

  const incQty = useCallback((id: string, size: Size) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === size) {
          return {
            ...item,
            qty: Math.min(MAX_QTY_PER_LINE, item.qty + 1),
          };
        }
        return item;
      })
    );
  }, []);

  const decQty = useCallback((id: string, size: Size) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id && i.size === size);
      if (!existing) return prev;
      if (existing.qty <= 1) {
        return prev.filter((i) => !(i.id === id && i.size === size));
      }
      return prev.map((item) => {
        if (item.id === id && item.size === size) {
          return { ...item, qty: item.qty - 1 };
        }
        return item;
      });
    });
  }, []);

  const removeItem = useCallback((id: string, size: Size) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Derived state
  const itemCount = useMemo(
    () => (mounted ? items.reduce((sum, item) => sum + item.qty, 0) : 0),
    [items, mounted]
  );

  const subtotal = useMemo(() => {
    if (!mounted) return 0;
    return items.reduce((sum, item) => {
      const unitPrice = getPrice(item.id, item.size);
      return unitPrice ? sum + unitPrice * item.qty : sum;
    }, 0);
  }, [items, mounted]);

  const rawNumber = SITE_CONFIG.whatsappNumber;
  const isWhatsAppConfigured = WHATSAPP_PHONE_REGEX.test(rawNumber);

  const checkoutUrl = useMemo(() => {
    if (!mounted || items.length === 0 || !isWhatsAppConfigured) return null;
    const refCode = getStoredReferral();
    return buildWhatsAppCheckoutUrl(items, subtotal, rawNumber, refCode);
  }, [mounted, items, subtotal, isWhatsAppConfigured, rawNumber]);

  const value = {
    items: mounted ? items : [],
    mounted,
    itemCount,
    subtotal,
    isDrawerOpen,
    setIsDrawerOpen,
    addItem,
    incQty,
    decQty,
    removeItem,
    clearCart,
    checkoutUrl,
    isWhatsAppConfigured,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider />");
  }
  return context;
}
