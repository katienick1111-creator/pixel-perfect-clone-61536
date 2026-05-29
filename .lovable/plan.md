# Real payment brand logos, end-to-end

The previous turn claimed to create `src/components/PaymentBrand.tsx`, but the file doesn't exist. Also `VendorCard.tsx` still uses lucide icons (CreditCard / Banknote / Smartphone) and the `Payment` type in `src/data/trovin.ts` is only `"Card" | "Cash" | "Venmo"`, so Cash App / Apple Pay / Google Pay / PayPal / Zelle can't even be selected yet.

## What to build

1. **Expand the `Payment` type** in `src/data/trovin.ts` to:
   `"Card" | "Cash" | "Venmo" | "CashApp" | "ApplePay" | "GooglePay" | "PayPal" | "Zelle"`.
   Leave existing seed vendor `payments` arrays unchanged (they stay valid).

2. **Create `src/components/PaymentBrand.tsx`** — a single component that renders the correct brand mark for any `Payment` value:
   - Inline SVG paths (simple-icons style) so there's no extra dependency.
   - Brand colors: Venmo `#008CFF`, Cash App `#00C244`, Apple Pay black, Google Pay multi-color G, PayPal `#003087` / `#0070BA`, Zelle `#6D1ED4`.
   - Generic `Card` (credit-card glyph) and `Cash` (banknote glyph) fallback for the non-branded options.
   - Props: `brand: Payment`, `size?: number`, `className?: string`. Includes a `label` map for tooltips.

3. **Wire `VendorCard.tsx`** to use `<PaymentBrand brand={p} />` inside the existing chip instead of the lucide `paymentIcon` map. Drop the `paymentIcon` object and unused lucide imports. Keep the chip styling but let the brand color show through (remove the muted text color on the wrapper).

4. **Expand the vendor dashboard toggles** in `src/routes/vendor.tsx`:
   - Replace the 3-item `paymentChoices` array with the full 8-item list.
   - Render each toggle using `<PaymentBrand>` instead of the lucide icon, keeping the existing rounded chip styling and active/inactive states.

## Out of scope

- No backend / schema changes (payments are still part of the local `Vendor` shape + localStorage `VendorProfile`).
- No changes to the public `/v/:vendorId` page (it doesn't render payment chips today).
- No new images or asset files.

## Files touched

- `src/data/trovin.ts` — widen `Payment` union (one line).
- `src/components/PaymentBrand.tsx` — new file.
- `src/components/VendorCard.tsx` — swap icon map for `<PaymentBrand>`.
- `src/routes/vendor.tsx` — expand `paymentChoices`, render with `<PaymentBrand>`.
