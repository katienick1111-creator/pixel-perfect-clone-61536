
## Goal

Establish Trovin's brand foundation in the app — design tokens, typography, and logo asset — so future feature work inherits the brand automatically. No marketing pages or product features yet.

## What I'll do

**1. Logo asset**
- Save the full horizontal logo (Trovin' wordmark + tagline + pin/x marks) to `src/assets/trovin-logo.png` for use in headers/hero.
- Save the circular badge variant to `src/assets/trovin-badge.png` for favicons, avatars, compact placements.
- Wire `trovin-badge.png` as the favicon via `__root.tsx` head links.

**2. Design tokens in `src/styles.css`**
Replace the default shadcn slate palette with Trovin's tokens from `style-guide.html`, converted to `oklch` (template requirement):
- Brand: `--navy`, `--navy-700`, `--navy-500`, `--teal`, `--teal-400`, `--teal-200`, `--gold`, `--gold-400`, `--gold-200`
- Neutrals: `--cream`, `--cream-deep`, `--paper`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`
- Semantic mapping so shadcn components inherit the brand:
  - `--background` → cream, `--foreground` → navy
  - `--primary` → navy, `--primary-foreground` → cream
  - `--secondary` → teal, `--accent` → gold
  - `--border` → line, `--ring` → teal
- Dark mode: navy background, cream foreground, teal/gold accents preserved.
- Keep all token names registered in `@theme inline` so Tailwind utilities like `bg-primary`, `text-accent`, `border-line` work.
- Add brand shadows (`--shadow-sm/md/lg/gold`) and radius scale (`--r-sm` … `--r-pill`) as theme tokens.

**3. Typography**
- Add Google Fonts link in `__root.tsx` head: Fraunces (display), DM Sans (body), JetBrains Mono (mono), Caveat Brush (script accent).
- Register `--font-display`, `--font-body`, `--font-mono`, `--font-script` in `@theme inline` so `font-display`, `font-body`, etc. work as Tailwind classes.
- Set `body` to use DM Sans; headings default to Fraunces via a base layer rule.

**4. Update `src/routes/index.tsx`**
- Replace the placeholder blank-app screen with a minimal brand showcase: centered logo on cream background, "Find more. Miss less." tagline, small palette/type swatch strip below. Purpose is to verify tokens render correctly — not a marketing page.
- Update the route's `head()` meta with Trovin name/description.

**5. Update `__root.tsx` head**
- Default title → "Trovin' — Find more. Miss less."
- Description, og:title, og:description, og:image (logo), twitter card.
- Favicon link → `trovin-badge.png`.
- Google Fonts preconnect + stylesheet link.

## Out of scope (next steps, not this plan)
- Marketing landing page sections (hero copy, features, waitlist)
- Auth, database, or any PRD product features
- Reusable Button/Card brand variants beyond what semantic tokens give for free

## Technical notes
- Hex → oklch conversion done at write-time; values committed as oklch literals per template rule.
- No new dependencies. Fonts loaded via `<link>` (no `@fontsource/*` packages).
- `components.json` and existing shadcn components untouched — they'll pick up the new tokens automatically because we keep the same CSS variable names.
