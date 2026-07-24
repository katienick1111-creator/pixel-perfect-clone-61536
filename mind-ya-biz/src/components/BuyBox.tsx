"use client";

import { useState } from "react";
import type { Product } from "@/lib/demo-data";

const ADDONS = [
  { key: "none", label: "No interactive feature", extra: 0, pts: 0 },
  { key: "qr", label: "QR code only", extra: 4, pts: 50 },
  { key: "nfc", label: "NFC tag only", extra: 7, pts: 75 },
  { key: "both", label: "QR + NFC", extra: 10, pts: 120 },
] as const;

const PLACEMENTS = ["Sleeve", "Chest", "Back", "Hem", "Pocket", "Hat patch", "Tote corner", "Hang tag"];

export default function BuyBox({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [addon, setAddon] = useState<(typeof ADDONS)[number]["key"]>(product.wearItForward ? "qr" : "none");
  const [placement, setPlacement] = useState(PLACEMENTS[0]);
  const [added, setAdded] = useState(false);

  const addonObj = ADDONS.find((a) => a.key === addon)!;
  const unit = product.price + addonObj.extra;
  const total = unit * qty;
  const points = (product.points + addonObj.pts) * qty;
  const interactive = addon !== "none";

  return (
    <div className="space-y-5">
      {/* color */}
      <Field label="Color" value={color}>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              className={`h-9 w-9 rounded-full border-2 transition ${color === c.name ? "border-ink ring-2 ring-ink ring-offset-2" : "border-ink/30"}`}
              style={{ background: c.hex }}
              aria-label={c.name}
              title={c.name}
            />
          ))}
        </div>
      </Field>

      {/* size */}
      <Field label="Size" value={size}>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-10 min-w-10 rounded-lg border-2 border-ink px-3 text-sm font-extrabold transition ${size === s ? "bg-ink text-cream" : "bg-white hover:bg-cream-deep"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      {/* interactive add-on */}
      <div className="rounded-2xl border-2 border-purple bg-purple-soft p-4">
        <p className="flex items-center gap-2 font-display text-lg">📲 Wear It Forward</p>
        <p className="text-xs font-semibold text-ink-soft">Make it scannable. Earn when someone taps or scans it.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {ADDONS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAddon(a.key)}
              className={`flex items-center justify-between rounded-xl border-2 px-3 py-2.5 text-left transition ${addon === a.key ? "border-ink bg-white" : "border-ink/20 bg-white/60"}`}
            >
              <span className="text-sm font-extrabold">{a.label}</span>
              <span className="text-xs font-bold text-ink-soft">{a.extra ? `+$${a.extra}` : "Free"}</span>
            </button>
          ))}
        </div>
        {interactive && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-ink-soft">Tag placement</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {PLACEMENTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlacement(p)}
                  className={`shrink-0 rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold ${placement === p ? "bg-ink text-cream" : "bg-white"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* qty */}
      <Field label="Quantity" value={String(qty)}>
        <div className="inline-flex items-center rounded-full border-2 border-ink bg-white">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 text-lg font-extrabold">−</button>
          <span className="w-10 text-center font-extrabold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="h-10 w-10 text-lg font-extrabold">+</button>
        </div>
      </Field>

      {/* totals */}
      <div className="rounded-2xl bg-cream-deep p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-ink-soft">Total</span>
          <span className="font-display text-3xl">${total}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="font-bold text-ink-soft">You'll earn</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 font-extrabold">⭐ +{points.toLocaleString()} pts</span>
        </div>
      </div>

      {/* actions */}
      <div className="grid gap-2">
        <button
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
          className="rounded-full bg-ink py-3.5 text-base font-extrabold text-cream pop pop-hover"
        >
          {added ? "✓ Added to cart!" : "🛒 Add to cart"}
        </button>
        <button className="rounded-full bg-pink py-3.5 text-base font-extrabold text-white pop pop-hover">⚡ Buy now</button>
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-full border-2 border-ink bg-white py-2.5 text-sm font-extrabold pop-hover">♡ Save</button>
          <button className="rounded-full border-2 border-ink bg-white py-2.5 text-sm font-extrabold pop-hover">↗ Share</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-bold text-ink-soft">
        <span className="rounded-full bg-white px-2.5 py-1 pop">🚚 Ships in 5–7 days</span>
        <span className="rounded-full bg-white px-2.5 py-1 pop">🏬 Local pickup available</span>
        <span className="rounded-full bg-white px-2.5 py-1 pop">🎨 Custom design on request</span>
      </div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-extrabold">
        {label}: <span className="font-bold text-ink-soft">{value}</span>
      </p>
      {children}
    </div>
  );
}
