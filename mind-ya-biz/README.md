# Mind Ya Biz — Platform (Next.js)

Multi-business merch platform with rewards (**The Movement**) and interactive
QR/NFC merch (**Wear It Forward**). This is the fresh Next.js build of the full
platform spec.

## Status — Phase 1: Public Experience (demo mode)

Built and clickable with polished seed data (no live Stripe/Supabase yet):

- **Home** (`/`) — hero "Wear It. Share It. Earn From It.", The Movement,
  Wear It Forward, "what a scan can open", business types, featured storefronts,
  how it works, create-your-store, CTAs.
- **Storefront directory** (`/storefronts`) — live search + category / interactive /
  bonus-event filters, featured & new rails.
- **Storefront pages** (`/store/[slug]`) — 6 demo businesses (Taco Alley,
  K9 & Kitty Kutters, Ironclad Contracting, Marquez Realty, Riverside Night
  Market, Jaylen Makes) with products, promo, WIF, story, events, reviews.
- **Product pages** (`/product/[id]`) — 30+ products with color/size/qty,
  interactive QR/NFC add-on + placement picker, live total & points earned.

Brand: colorful (purple / hot pink / orange / teal / blue on cream) with tasteful
graffiti/sticker accents. Mobile-first. Fonts via Google Fonts (Anton + Plus
Jakarta Sans + Permanent Marker).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

## Structure

- `src/app` — App Router pages (Next 16; dynamic `params` are async/awaited).
- `src/components` — SiteNav, SiteFooter, cards, BuyBox.
- `src/lib/demo-data.ts` — all seed data + selectors (single source of demo truth).
- `src/app/globals.css` — brand theme (Tailwind v4 `@theme`) + helper utilities.

## Roadmap (from the platform spec)

- Phase 2 — Customer rewards dashboard, Wear It Forward dashboard, QR generation,
  dynamic redirect links, scan/tap tracking, referrals, challenges.
- Phase 3 — Business dashboard (products, loyalty, campaigns, analytics).
- Phase 4 — Admin dashboard (points rules, rewards, fraud review, applications).
- Phase 5 — Stripe, Supabase schema + auth/RLS, notifications, accessibility.

All commerce/loyalty numbers are demo values intended to become
admin-configurable and backed by a point-transaction ledger.
