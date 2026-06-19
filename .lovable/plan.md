# Trovin Academy — Full MVP Build Plan

A new top-level tab inside Trovin: a premium vendor operating system. Independent design system (editorial cream), interactive-first worksheets, dashboard, community, and admin, all backed by Lovable Cloud with autosave.

Given scope (~30+ new files, 8 new tables, 10 calculators), this will land across **3 sequenced turns** so each turn is reviewable.

---

## Design System (Editorial Cream)

- **Palette**: paper `#FAF7F2`, ink `#1A1A1A`, terracotta `#C8553D` (primary), forest `#2E5E4E` (secondary), muted sand `#E8E0D3`.
- **Type**: `Fraunces` (display serif, headlines) + `Inter Tight` (body) via `@fontsource`. Distinct from rest of app.
- **Motifs**: thin rules, generous margins, lowercase eyebrow labels, numbered section markers, soft paper grain shadow.
- New tokens scoped under `.academy` class on `<AcademyShell>` so it doesn't bleed into the rest of Trovin.

---

## Routes (all under `/academy`)

```text
/academy                    home (hero, featured categories, tip of the week)
/academy/categories         grid of 8 categories
/academy/c/$slug            category detail (articles + tools + downloads)
/academy/search             global search
/academy/downloads          download library
/academy/favorites          saved resources
/academy/dashboard          member dashboard
/academy/community          feed
/academy/admin              admin (gated to role=admin)
/academy/tools/packing
/academy/tools/inventory
/academy/tools/expenses
/academy/tools/sales
/academy/tools/pricing
/academy/tools/profit
/academy/tools/event-planner
/academy/tools/goals
/academy/tools/mileage
/academy/tools/crm
/academy/article/$slug
```

All under `_authenticated/` since worksheets autosave to the user's account; home + categories are also accessible signed-out (preview mode).

---

## Database (Lovable Cloud)

New tables, all RLS-scoped to `auth.uid()` except public-readable content:

| Table | Purpose | Access |
|---|---|---|
| `academy_categories` | 8 seeded categories | public read, admin write |
| `academy_articles` | tips/guides | public read (published), admin write |
| `academy_downloads` | downloadable files metadata | public read, admin write |
| `academy_favorites` | per-user saves | owner only |
| `academy_worksheets` | autosaved JSON state per tool per user | owner only |
| `academy_goals` | goal tracker rows | owner only |
| `academy_community_posts` | community feed | authenticated read, owner write |
| `academy_community_comments` | replies | authenticated read, owner write |
| `academy_download_log` | analytics | insert: authenticated, read: admin |

Worksheet table holds `{ user_id, tool_slug, data jsonb, updated_at }` — one row per tool per user, upserted on every change.

---

## Interactive Tool Pattern

Every tool follows the same shape:

```text
<ToolShell title eyebrow>
  <AutosaveProvider toolSlug="packing">
    {/* tool-specific form */}
  </AutosaveProvider>
  <ToolActions>  // Download PDF, Print, Reset
</ToolShell>
```

- `useAutosaveWorksheet(slug)` hook: loads row on mount, debounced upsert on change, optimistic local state.
- PDF export: client-side via `jspdf` + `html2canvas` (Worker-compatible).
- Print: `window.print()` with a print stylesheet.

---

## Turn Sequence

**Turn 1 (this turn) — Foundation**
- Migration: all 9 tables + RLS + grants + seed categories.
- Design tokens, fonts, `AcademyShell`, top-nav entry in main app.
- Routes: home, categories, category detail, dashboard skeleton.
- `useAutosaveWorksheet` hook + one flagship tool (Packing Checklist) end-to-end with PDF/print.

**Turn 2 — Tools + Library**
- Remaining 9 interactive tools.
- Downloads library + favorites.
- Global search.
- Article viewer.

**Turn 3 — Community + Admin**
- Community feed + comments.
- Admin console (CRUD on articles, downloads, categories; feature toggles; analytics view).
- Polish, empty states, error boundaries on every loader, OG tags on shareable routes.

---

## Technical Section

- Server fns in `src/lib/academy.functions.ts` with `requireSupabaseAuth`; public reads (categories, published articles, downloads index) via a separate `academy.public.functions.ts` using server publishable client + `TO anon` SELECT policies.
- Admin gating: `_authenticated/academy/admin/route.tsx` calls `has_role(uid, 'admin')` via existing RPC.
- Files: PDFs/images uploaded to a new `academy` storage bucket (created in Turn 2 alongside admin upload UI).
- No edits to `routeTree.gen.ts` (auto-generated).
- New top-level nav entry added to `AppShell` (existing component) — does not change current app visuals.

---

## Out of scope for MVP

- AI features (architecture-ready hooks left as TODOs but no model calls this build).
- Native mobile push.
- Per-vendor analytics beyond download counts.
