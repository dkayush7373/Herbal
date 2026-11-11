# AKATSUKI Beauty & Wellness — 100% Ayurvedic Herbal Hair Oil

Production-grade marketing, education, and e-commerce platform for **AKATSUKI Beauty & Wellness** handcrafted Ayurvedic Herbal Hair Oils.

---

## 1. Quick Setup & Scripts

```bash
# Install dependencies with zero peer warnings
pnpm install

# Run development server
pnpm dev

# Type check
npx tsc --noEmit

# Lint check
pnpm lint

# Unit and integration test suites
pnpm test

# End-to-end automated tests with Playwright
pnpm test:e2e

# Production build
pnpm build
```

---

## 2. Environment Variables (`.env.example`)

```ini
# Canonical base URL for SEO, OG images, and canonical tags
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WhatsApp business number for direct ordering and checkout (E.164 digits only)
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210

# Endpoint URL for newsletter subscriber registrations
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=

# Toggle demo reviews and sample content ("true" displays sample reviews with a clear badge)
NEXT_PUBLIC_SHOW_DEMO_CONTENT=true
```

---

## 3. The Jiggle Engine Architecture (§8)

The centerpiece of the user experience is the continuous, GPU-bound hanging bottle rail with semi-implicit Euler spring-damper physics.

### Architecture Highlights:
- **Single Global Animation Loop**: A single `requestAnimationFrame` loop runs at the rail root (`useJiggleEngine`). No per-bottle rAF loops.
- **Shared Refs Over React State**: Angle, velocity, squash, and slosh parameters mutate within refs, directly writing to GPU transforms (`rotate()`, `scale()`) for `<4 ms` frame execution budget.
- **Units**: Degrees (`deg`), pixels per millisecond (`px/ms`), normalized frame delta (`f = min(delta, 50) / 16.667`).
- **Angular Springs**: $K = 0.22$, $C = 0.065$ (underdamped, visible 3–5 wobbles, settles $< 1.8\text{ s}$). Clamped to $\pm 28^\circ$.
- **Squash & Stretch**: $K = 0.30$, $C = 0.10$. Clamped to $\pm 0.12$. Volume-preserving scales: $\text{scaleY} = 1 + s$, $\text{scaleX} = 1 - 0.6s$.
- **Liquid Slosh**: Realtime SVG quadratic curve responding to lateral pointer kicks: $\text{phase} += 0.2f$, $\text{amplitude} \times= 0.94^f$.
- **Secondary Motion**: Hanging ₹ price tag swings with an extra lag ring ($\text{tagAngle} = \text{angle} \times 1.25$, delayed by 2 frames).
- **Traveling Wave Ring Buffer**: When pointer speed exceeds $0.6\text{ px/ms}$, lateral kicks propagate down the rail at $45\text{ ms}$ per bottle of distance, attenuated by $\times 0.6$ per hop.
- **Neighbour Coupling**: Continuous order-independent force transfer:
  $$\text{impulse} += 0.06 \times (a_{i-1} + a_{i+1} - 2a_i)$$
- **Reduced Motion Support**: Completely zeroes physics, sway, and sparkle effects while preserving full navigation, selection, and keyboard accessibility.

---

## 4. Image Pipeline & Branch Decisions (§5)

All product images were inspected with Python PIL to verify color mode, alpha channel presence, and corner transparency:

| Product ID | Variant Name | Image Path | Bytes | Dimensions | Format / Mode | Alpha / Corners | Pipeline Branch |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `oil-white` | Classic White | `/images/oil-white.jpg` | 97,085 | 1024×1536 | JPEG (RGB) | False / Black | **Branch 2**: SVG bottle-silhouette clip mask |
| `oil-black` | Midnight Black | `/images/oil-black.jpg` | 267,332 | 1024×1536 | JPEG (RGB) | False / Pattern | **Branch 2**: SVG bottle-silhouette clip mask |
| `oil-green` | Forest Green | `/images/oil-green.jpg` | 126,206 | 1024×1536 | JPEG (RGB) | False / Black | **Branch 2**: SVG bottle-silhouette clip mask |
| `oil-orange` | Sunrise Orange | `/images/oil-orange.jpg` | 105,750 | 1024×1536 | JPEG (RGB) | False / Black | **Branch 2**: SVG bottle-silhouette clip mask |
| `oil-pink` | Rose Pink | `/images/oil-pink.jpg` | 144,580 | 1024×1536 | JPEG (RGB) | False / Dark | **Branch 2**: SVG bottle-silhouette clip mask |

*Note: Binaries were never edited or destructively altered. Branch 3 provides pure-CSS vector bottle fallback with token colors if decoding fails.*

---

## 5. Token Contrast Ratios (WCAG AA & AAA Compliance)

Evaluated with relative luminance ($L = 0.2126R + 0.7152G + 0.0722B$):

| Foreground Token | Background Token | Ratio | Standard Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Forest** (`#0F3D2E`) | **Cream** (`#FFF8E7`) | **11.48:1** | $\ge 4.5:1$ (Normal text) | **PASS (AAA)** |
| **Charcoal** (`#1E1E1E`) | **Cream** (`#FFF8E7`) | **15.74:1** | $\ge 4.5:1$ (Normal text) | **PASS (AAA)** |
| **Cream** (`#FFF8E7`) | **Charcoal** (`#1E1E1E`) | **15.74:1** | $\ge 4.5:1$ (Dark theme text) | **PASS (AAA)** |
| **Gold** (`#E8B923`) | **Charcoal** (`#1E1E1E`) | **9.05:1** | $\ge 4.5:1$ (Dark theme accent) | **PASS (AAA)** |
| **Gold** (`#E8B923`) | **Forest** (`#0F3D2E`) | **6.60:1** | $\ge 4.5:1$ (Accent text) | **PASS (AA)** |
| *Gold (`#E8B923`)* | *Cream (`#FFF8E7`)* | *1.74:1* | *Decoration ONLY* | **Adheres to rule (Never text)** |
| **Light Focus Ring (Forest)** | **Cream** (`#FFF8E7`) | **11.48:1** | $\ge 3.0:1$ (UI focus ring) | **PASS (High Visibility)** |
| **Dark Focus Ring (Gold)** | **Charcoal** (`#1E1E1E`) | **9.05:1** | $\ge 3.0:1$ (UI focus ring) | **PASS (High Visibility)** |

---

## 6. Before Launch Checklist (Production Owner Verification)

- [ ] **Reviews**: Replace demo reviews in `lib/site.ts` with authentic verified customer reviews, and set `NEXT_PUBLIC_SHOW_DEMO_CONTENT="false"`.
- [ ] **Counters**: Supply real, verified client or order metrics in `lib/site.ts` (unverified counters remain safely omitted).
- [ ] **Social Media Links**: Replace placeholder Instagram/Facebook/X/YouTube URLs in `lib/site.ts`. Unlinked socials render as accessible non-link tags.
- [ ] **WhatsApp Checkout**: Configure `NEXT_PUBLIC_WHATSAPP_NUMBER` with your verified business phone number (digits only, e.g. `919876543210`).
- [ ] **Newsletter Endpoint**: Deploy an endpoint to handle `{ email: string }` POST requests and add `NEXT_PUBLIC_NEWSLETTER_ENDPOINT`.
- [ ] **200 ml Bottle Prices**: Once family sizes enter production, update `prices["200 ml"]` in `lib/products.ts` (currently displays "Coming soon").
- [ ] **Canonical Domain**: Point `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://akatsukibeauty.com`).
- [ ] **Referral Incentives**: If you wish to offer monetary or gift rewards for referral codes, declare the policy in `SITE_CONFIG.referral.reward`.
