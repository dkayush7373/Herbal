export interface PromoConfig {
  bundle: {
    minQty: number;
    discountPct: number;
    enabled: boolean;
    wiredToCart: boolean;
  };
  subscribe: {
    discountPct: number;
    enabled: boolean;
    wiredToCart: boolean;
  };
  whatsapp: {
    number: string | null;
  };
  pincodeApi: {
    enabled: boolean;
  };
  notifyEndpoint: string | null;
  deliveryEstimateDays: {
    min: number;
    max: number;
  };
  featureFlags: {
    bundleStrip: boolean;
    subscribeToggle: boolean;
    pincode: boolean;
    notify: boolean;
    whatsapp: boolean;
    trustBadges: boolean;
    wishlist: boolean;
    alsoBought: boolean;
    reviews: boolean;
    timeline: boolean;
    miniFaq: boolean;
  };
}

export const PROMO: PromoConfig = {
  bundle: {
    minQty: 2,
    discountPct: 10,
    enabled: true,
    wiredToCart: false,
  },
  subscribe: {
    discountPct: 5,
    enabled: true,
    wiredToCart: false,
  },
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  },
  pincodeApi: {
    enabled: false,
  },
  notifyEndpoint: process.env.NEXT_PUBLIC_NOTIFY_ENDPOINT || null,
  deliveryEstimateDays: {
    min: 3,
    max: 6,
  },
  featureFlags: {
    bundleStrip: true,
    subscribeToggle: true,
    pincode: true,
    notify: true,
    whatsapp: true,
    trustBadges: true,
    wishlist: true,
    alsoBought: true,
    reviews: true,
    timeline: true,
    miniFaq: true,
  },
};
