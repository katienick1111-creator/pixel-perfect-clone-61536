# Booth Setup Masterclass — Build Plan

A full Booth Setup section inside Trovin Academy that mixes course-style lessons, a visual layout library, downloadable resources, and interactive planning tools. Designed so AI features can layer in later without re-architecting.

## Scope

Everything lives under `/academy/booth/*` using the existing AcademyShell + Editorial Cream design system. No changes to other Academy areas.

## Information Architecture

```
/academy/booth                       Masterclass hub (hero, progress, 10 chapter cards, featured layouts, tools strip, downloads strip)
/academy/booth/chapters/$slug        Chapter reader (lessons list + lesson body, mark-complete, prev/next)
/academy/booth/layouts               Layout Library grid (filters: size, venue, category)
/academy/booth/layouts/$slug         Single layout: SVG diagram + annotated zones (product, flow, checkout, storage, signage, upsell, waiting, impulse)
/academy/booth/gallery               Inspiration gallery (filter by category, favorite toggle)
/academy/booth/tools                 Tools index (10 tools listed; built ones link out, rest "coming soon" with same shell)
/academy/booth/tools/planner         Drag-and-drop Booth Designer (MVP build this turn)
/academy/booth/tools/checklist       Booth Setup Checklist (MVP build this turn)
/academy/booth/tools/timeline        Setup Timeline generator (MVP build this turn)
/academy/booth/downloads             Print-ready PDF library (uses window.print() of styled pages)
```

The 10 chapters mirror the user's outline: Booth Basics, Booth Layout Library overview, Display Psychology, Signage, Lighting, Merchandising, Branding, Customer Experience, Mistakes, plus a "Getting Started" intro. Each chapter holds 6–12 lessons sourced from the user's bullet list — written as real editorial copy, not Lorem Ipsum.

## Data Model (Supabase)

One migration. New tables, all RLS-scoped to `auth.uid()`.

- `academy_booth_progress` — `user_id`, `lesson_slug`, `completed_at`. Tracks lesson completion.
- `academy_booth_designs` — `user_id`, `name`, `size` (10x10/10x20/custom), `data jsonb` (items[], canvas dims), `is_favorite`. For the drag-and-drop planner.
- `academy_booth_checklists` — `user_id`, `name`, `data jsonb` (sections/items with checked state), `is_favorite`.
- `academy_gallery_favorites` — `user_id`, `image_slug`. Save favorite inspiration photos.
- `academy_booth_lessons_meta` (optional, public) — read-only seed of lessons for search; not required for MVP since content is in code.

All four user tables get `GRANT SELECT,INSERT,UPDATE,DELETE … TO authenticated`, `GRANT ALL … TO service_role`, RLS enabled, and `auth.uid() = user_id` policies. Updated_at trigger reused from existing `academy_touch_updated_at()`.

## Content (in code, not placeholder)

A new `src/data/booth.ts` exports:
- `boothChapters` — 10 chapters with `slug`, `title`, `summary`, `lessons[{slug,title,body,readMinutes}]`. Lesson bodies are real, concise editorial paragraphs derived from the user's outline (e.g. Tent Sizes lesson covers 10x10 vs 10x20 tradeoffs, weights, weather).
- `boothLayouts` — 21 layouts (every one the user listed). Each has `slug`, `title`, `size`, `category`, `summary`, `zones[]` where each zone has `{ kind: 'product'|'flow'|'checkout'|'storage'|'signage'|'upsell'|'waiting'|'impulse', x, y, w, h, label, note }`. Rendered as a labeled SVG.
- `galleryImages` — categorized inspiration entries with `slug`, `category`, `title`, `credit`, `src` (Unsplash-style external URL OK for MVP; swap to uploaded assets later).
- `downloadDocs` — 14 PDF docs, each a route that prints a styled page via `window.print()` (no jspdf dependency needed).

## Interactive Tools

**Booth Designer (`/academy/booth/tools/planner`)** — MVP drag-and-drop:
- Fixed grid canvas sized to the chosen booth (10x10 = 120x120 in, scaled).
- Palette of items: Table 6ft, Table 4ft, Shelf, Rack, Chair, Register, Signage, Storage Bin, Display Cube, Plant, Customer Path arrow.
- Pointer-based drag, snap to 6-inch grid, rotate (R key), delete (Del). Mobile: tap to select, then move via arrow buttons.
- State in `useState`, autosaved to `academy_booth_designs` (debounced) for signed-in users, localStorage fallback otherwise. Save / Duplicate / Rename / Delete / Favorite / Print, mirroring the pricing tool pattern.

**Setup Checklist (`/academy/booth/tools/checklist`)** — sectioned checklist (Equipment, Display, Signage, Lighting, Cash Handling, Breakdown). Add/edit/check items. Progress bar. Same persistence pattern.

**Setup Timeline (`/academy/booth/tools/timeline`)** — enter event start time + booth complexity; outputs a reverse-order schedule (e.g. "T-2h: arrive & park", "T-90m: tent up & weighted"). Editable, savable.

The remaining 7 tools (Sign Placement, Lighting Planner, Customer Flow Simulator, Product Placement Planner, Packing Checklist link, Display Planner, Drag designer variants) get listed on `/academy/booth/tools` with the same card shell and a "Coming soon" badge — the data model already supports them via `academy_booth_designs.data` jsonb, so they can be filled in later without migration.

## Downloads

Each download route renders a print-optimized A4/Letter page using the existing `ac-no-print` / `@media print` pattern. Users click Print → Save as PDF. No new dependency. All 14 documents in the user's list are scaffolded with real form fields and instructions, not blank pages.

## Gallery

Grid of inspiration cards, category chip filter, heart icon to favorite (writes `academy_gallery_favorites`). Clicking a card opens a Dialog with larger image + credit. Images sourced as remote URLs initially; structure supports swapping to a Supabase Storage bucket later.

## Future-AI Hooks (architecture only, no AI code this turn)

- `academy_booth_designs.data` jsonb already stores a structured item list — an AI layout generator can write to the same shape.
- A `notes` field on designs/checklists lets future AI attach suggestions inline.
- A `source: 'user'|'ai'` field on each design item is included from day one so AI-generated items can be visually marked and accepted/rejected.
- Gallery image rows include `tags[]` so future "analyze my booth photo" features can match against the same taxonomy.

No AI calls, no Lovable AI Gateway usage this turn.

## Navigation

- New "Booth Setup" entry in `AcademyShell` side nav (Tent icon).
- Featured card on `/academy` home pointing to the masterclass.
- Crosslink from the existing Packing Checklist tool to the new Setup Timeline.

## Out of Scope (this turn)

- AI generation/analysis features (architecture only).
- Real photo uploads to Supabase Storage (gallery uses remote URLs; bucket can be added later).
- Sharing booth designs between users.
- Native PDF generation via jspdf (uses `window.print()` instead — matches existing tools).

## Turn Plan

1. **This turn — Migration**: 4 tables + grants + RLS + policies.
2. **Next turn — Content + routes**: `src/data/booth.ts`, all chapter/layout/gallery/downloads routes, AcademyShell nav entry, home page feature card.
3. **Next turn — Tools**: Booth Designer + Checklist + Timeline with Supabase persistence.

After the migration is approved I'll ship steps 2 and 3 together.
