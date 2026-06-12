## Trovin' Loyalty — Phase 1 (frontend demo)

A clickable, self-contained loyalty section using **localStorage** so you can walk through the whole loop on the published preview. No DB changes yet — backend wiring is a follow-up once the flow feels right.

### New routes (all under `/loyalty`)

```
src/routes/
  loyalty.tsx              layout + tabbed footer (My QR · Wallet · Rewards · Scan)
  loyalty.index.tsx        landing: explains Bytes, "I'm a customer / I'm a vendor"
  loyalty.qr.tsx           Customer: big personal QR + token
  loyalty.wallet.tsx       Customer: Bytes balance + ledger history
  loyalty.rewards.tsx      Customer: catalog grid, Redeem button
  loyalty.scan.tsx         Vendor: paste/enter customer token → check-in
  loyalty.vendor.tsx       Vendor: tier picker + today's "I'm here now" + dashboard stats
  loyalty.admin.tsx        Admin: manage reward catalog (add/edit/remove)
```

A small entry card on the home page (`/`) and a link in the vendor dashboard (`/vendor`) point into `/loyalty`.

### Data (localStorage only for now)

One namespaced store `trovin:loyalty:v1` holding:
- `me` — `{ role, name, personalQrToken }` (token generated on first visit via `crypto.randomUUID()`)
- `wallet` — `{ balance, ledger: LedgerEntry[] }`
- `checkIns` — `CheckIn[]` (used to enforce 1/vendor/day)
- `vendorProfile` — `{ tier, isLive, placeName, startTime, endTime }` (merged with existing `useVendorProfile`)
- `rewards` — seeded catalog, admin-editable
- `redemptions` — `Redemption[]`

A `useLoyalty()` hook wraps reads/writes and fires a `trovin:loyalty:changed` event so all open tabs stay in sync (same pattern as `useVendorProfile`).

### Hard-coded rules (enforced in the hook, not the UI)

- Earning values fixed: check-in 10, social 15, review 20, purchase 25.
- 1 Byte = $0.01 (display only).
- Tier gates which buttons render after a successful scan:
  - Free / Starter → only check-in fires automatically
  - Plus → check-in + "Social share (+15)" + "Review (+20)" (review queued as `pending`, no Bytes yet)
  - Pro → all of the above + "Confirm purchase (+25)"
- One check-in per customer per vendor per day — repeat scan shows "Already checked in today" and awards 0.
- No customer-initiated check-in anywhere in the UI.

### Screens (Phase 1 scope only)

**Customer**
1. `/loyalty` landing — explains program, role toggle.
2. `/loyalty/qr` — large QR (using existing `qrcode.react`) encoding `personalQrToken`, plus the raw token with copy button (so you can paste it into Scan during the demo).
3. `/loyalty/wallet` — balance card + scrollable ledger (action, vendor, +/− bytes, timestamp).
4. `/loyalty/rewards` — grid of seeded rewards ($5 Visa / 500, $10 Visa / 1000, Trovin' tote / 350, sticker pack / 100, coffee credit / 250). Redeem disabled when balance < cost; on tap, deducts Bytes, writes negative ledger entry, creates `requested` redemption, shows toast.

**Vendor**
5. `/loyalty/vendor` — tier picker (Free/Starter/Plus/Pro), "I'm here now" form (place name + end time → LiveSession), dashboard tiles: today's check-ins, new follows (placeholder), scans, and (Pro only) a "peak hours" mini-chart from the check-in log.
6. `/loyalty/scan` — input field for customer token + "Scan" button → validates against the saved `me.personalQrToken`, runs the check-in flow, then renders tier-gated extra action buttons. Confirmation card shows what was awarded.

**Admin**
7. `/loyalty/admin` — list/add/edit/remove rewards (name, cost in Bytes, type merch/visa, image URL). Gated by the existing admin role check pattern used in `/admin`.

### Out of scope (per spec, "Later phases")

Founding offer, referrals, boost packs, games, compliance helper, automated fulfillment, real camera scanner, server-side enforcement.

### Technical notes

- Stack: TanStack Start routes, Tailwind tokens already in `src/styles.css`, `qrcode.react` already installed, `sonner` for toasts.
- No DB migration in this phase.
- All "server-like" rules (tier gating, daily de-dupe, fixed values) live in `src/hooks/useLoyalty.ts` so the eventual backend port is a 1:1 swap.
- A clear `// TODO(backend): move to server fn` comment on every mutation that will need to become a `createServerFn`.

### Follow-up (not this turn)

Once you've clicked through and approved the flow, Phase 1.5 = port `useLoyalty` mutations to real tables (`bytes_wallets`, `ledger_entries`, `check_ins`, `live_sessions`, `rewards`, `redemptions`) with RLS, and add the actual camera scanner.