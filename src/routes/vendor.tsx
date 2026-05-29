import { createFileRoute } from "@tanstack/react-router";
import {
  Store,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  CalendarDays,
} from "lucide-react";
import { PaymentBrand, paymentLabel } from "@/components/PaymentBrand";
import { AppShell } from "@/components/AppShell";
import { VendorCalendar } from "@/components/VendorCalendar";
import {
  useVendorProfile,
  type VendorProfile,
} from "@/hooks/useVendorProfile";
import { categories } from "@/data/trovin";
import { useState } from "react";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — Trovin'" },
      {
        name: "description",
        content:
          "Run your booth on Trovin' — post your hours, drop fresh inventory, and watch shoppers find you.",
      },
      { property: "og:title", content: "Vendor Dashboard — Trovin'" },
      {
        property: "og:description",
        content:
          "Run your booth on Trovin' — post your hours, drop fresh inventory, and watch shoppers find you.",
      },
    ],
    links: [{ rel: "canonical", href: "/vendor" }],
  }),
  component: VendorDashboard,
});

const eventOptions = [
  "Randolph Street Market",
  "Pilsen Maker Market",
  "Logan Square Farmers Market",
  "West Loop Food Yard",
  "Kane County Flea",
];

const paymentChoices: { key: VendorProfile["payments"][number] }[] = [
  { key: "Card" },
  { key: "Cash" },
  { key: "Venmo" },
  { key: "CashApp" },
  { key: "ApplePay" },
  { key: "GooglePay" },
  { key: "PayPal" },
  { key: "Zelle" },
];

const stats = [
  { label: "Followers", scribble: "growing", icon: Users },
  { label: "Profile views", scribble: "this week", icon: Eye },
  { label: "Saves", scribble: "🔥", icon: TrendingUp },
];

function VendorDashboard() {
  const { profile, update } = useVendorProfile();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const togglePayment = (k: VendorProfile["payments"][number]) => {
    const has = profile.payments.includes(k);
    update({
      payments: has
        ? profile.payments.filter((p) => p !== k)
        : [...profile.payments, k],
    });
  };

  const onSave = () => {
    update({});
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 1800);
  };

  const computed = {
    followers: 128 + profile.name.length * 7,
    views: 412 + profile.tagline.length * 3,
    saves: 36 + (profile.openToday ? 12 : 0),
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8">
        <p className="font-hand text-3xl leading-none text-teal -rotate-2 origin-left">
          mind ya biz —
        </p>
        <div className="relative mt-3 inline-block">
          <h1 className="font-display text-5xl md:text-6xl leading-none">
            Your booth
          </h1>
          <svg
            className="absolute -bottom-3 left-0 h-3 w-full text-gold"
            viewBox="0 0 240 12"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M2 7 Q40 1 80 6 T160 6 T238 4"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="mt-5 flex items-center gap-2 text-sm text-ink-soft">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              profile.openToday ? "animate-pulse bg-success" : "bg-ink-mute"
            }`}
          />
          {profile.openToday
            ? "You're live on Discover right now."
            : "You're hidden from Discover. Flip the switch when you arrive."}
        </p>
      </div>

      {/* POLAROID — vendor identity */}
      <section className="relative mx-auto max-w-md rotate-[-1.5deg]">
        <span className="absolute -top-3 left-8 h-5 w-20 -rotate-6 rounded-[2px] bg-gold-200/80 shadow-brand-sm" />
        <span className="absolute -top-3 right-10 h-5 w-16 rotate-6 rounded-[2px] bg-teal-200/80 shadow-brand-sm" />

        <div className="rounded-sm bg-paper p-4 pb-6 shadow-brand-lg ring-1 ring-line">
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm">
            <img
              src={profile.image}
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
            <span className="absolute left-3 top-3 rounded-sm bg-navy/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cream">
              {profile.category} · CHI
            </span>
            <span className="absolute right-3 bottom-3 -rotate-3 rounded-sm bg-gold px-2.5 py-1 font-script text-base leading-none text-navy shadow-brand-sm">
              {profile.openToday ? "open now" : "closed"}
            </span>
          </div>

          <div className="mt-4 px-1">
            <input
              value={profile.name}
              onChange={(e) => update({ name: e.target.value })}
              maxLength={60}
              className="w-full bg-transparent font-script text-3xl leading-tight text-navy outline-none focus:bg-cream-deep/40"
            />
            <textarea
              value={profile.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
              maxLength={140}
              rows={2}
              className="mt-1 w-full resize-none bg-transparent font-hand text-xl leading-tight text-ink-soft outline-none focus:bg-cream-deep/40"
            />
          </div>

          {/* mini stats */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-line border-y border-line py-3">
            {[
              { v: computed.followers, l: "Followers", s: "growing" },
              { v: computed.views, l: "Views", s: "👀" },
              { v: computed.saves, l: "Saves", s: "🔥" },
            ].map((s, i) => (
              <div key={s.l} className="px-2 text-center">
                <p
                  style={{ transform: `rotate(${[-3, 2, -2][i]}deg)` }}
                  className="font-hand text-base leading-none text-teal"
                >
                  {s.s}
                </p>
                <p className="mt-1 font-display text-3xl leading-none text-navy">
                  {s.v}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-mute">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          {/* live toggle */}
          <button
            onClick={() => update({ openToday: !profile.openToday })}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              profile.openToday
                ? "bg-teal text-cream hover:bg-teal/90"
                : "border border-line bg-cream text-navy hover:border-teal"
            }`}
          >
            {profile.openToday ? (
              <>
                <Eye className="h-4 w-4" /> Live on Discover
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" /> Go live
              </>
            )}
          </button>
        </div>
      </section>

      {/* TICKET STUBS — today setup */}
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="group relative flex overflow-hidden rounded-lg bg-teal text-cream shadow-brand-md">
          <div className="flex w-20 flex-col items-center justify-center border-r-2 border-dashed border-cream/40 bg-teal-400/40 px-3 py-5">
            <CalendarDays className="h-7 w-7" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-cream/80">
              today
            </p>
          </div>
          <span className="absolute left-[5rem] -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <span className="absolute left-[5rem] -bottom-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <div className="flex-1 p-5">
            <p className="font-hand text-xl leading-none text-gold-200">
              where you at
            </p>
            <select
              value={profile.event}
              onChange={(e) => update({ event: e.target.value })}
              className="mt-2 w-full appearance-none bg-transparent font-display text-xl leading-tight outline-none [&>option]:text-navy"
            >
              {eventOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gold-200" />
              <input
                value={profile.booth}
                onChange={(e) => update({ booth: e.target.value })}
                maxLength={40}
                className="w-full bg-transparent text-xs text-cream/85 outline-none placeholder:text-cream/50"
                placeholder="Booth 142"
              />
            </div>
          </div>
        </div>

        <div className="group relative flex overflow-hidden rounded-lg bg-gold text-navy shadow-brand-md">
          <div className="flex w-20 flex-col items-center justify-center border-r-2 border-dashed border-navy/30 bg-gold-400/60 px-3 py-5">
            <Clock className="h-7 w-7" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-navy/70">
              hours
            </p>
          </div>
          <span className="absolute left-[5rem] -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <span className="absolute left-[5rem] -bottom-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <div className="flex-1 p-5">
            <p className="font-hand text-xl leading-none text-teal">
              clock it in
            </p>
            <input
              value={profile.hours}
              onChange={(e) => update({ hours: e.target.value })}
              maxLength={40}
              className="mt-2 w-full bg-transparent font-display text-xl leading-tight outline-none"
              placeholder="10a – 5p today"
            />
            <p className="mt-1 text-xs text-navy/70">
              Shoppers see this on your card.
            </p>
          </div>
        </div>
      </section>

      {/* Category + payments — sticker chips */}
      <section className="mt-12">
        <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
          what you sell
        </p>
        <h3 className="mt-2 font-display text-xl text-ink-soft">
          tag yourself
        </h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {categories
            .filter((c) => c.key !== "All")
            .map((c, i) => {
              const active = profile.category === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => update({ category: c.key as VendorProfile["category"] })}
                  style={{
                    transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.8}deg)`,
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium shadow-brand-sm transition ${
                    active
                      ? "border-navy bg-navy text-cream"
                      : "border-line bg-paper text-navy hover:border-teal"
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${active ? "text-gold" : "text-gold"}`} />
                  {c.label}
                </button>
              );
            })}
        </div>

        <p className="mt-7 font-script text-2xl leading-none text-teal -rotate-1 origin-left">
          how they pay
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {paymentChoices.map((p) => {
            const active = profile.payments.includes(p.key);
            return (
              <button
                key={p.key}
                onClick={() => togglePayment(p.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "border-teal bg-teal text-cream"
                    : "border-line bg-paper text-ink-soft hover:border-teal"
                }`}
              >
                <PaymentBrand brand={p.key} size={12} />
                {paymentLabel[p.key]}
              </button>
            );
          })}
        </div>
      </section>

      {/* INDEX-CARD — fresh drop note + scribble */}
      <section className="relative mt-14">
        <p className="absolute -top-6 left-4 -rotate-2 font-script text-2xl leading-none text-navy">
          fresh drop note
        </p>
        <div
          className="relative rounded-md border border-line bg-paper p-6 pl-16 shadow-brand-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 31px, rgba(10,118,116,0.18) 31px 32px)",
            lineHeight: "32px",
          }}
        >
          <span className="pointer-events-none absolute left-12 top-0 bottom-0 w-px bg-danger/50" />
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              Shoppers see this on the homepage
            </span>
            <textarea
              value={profile.note}
              onChange={(e) => update({ note: e.target.value })}
              maxLength={140}
              rows={3}
              placeholder="Just dropped: brass candlesticks & a fresh batch of mugs."
              className="mt-1 block w-full resize-none bg-transparent font-hand text-2xl leading-8 text-navy outline-none placeholder:text-ink-mute"
            />
          </label>

          <div className="mt-4 border-t border-line/60 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              Card scribble (a lil' tag on your photo)
            </span>
            <input
              value={profile.scribble ?? ""}
              onChange={(e) => update({ scribble: e.target.value })}
              maxLength={20}
              placeholder="ooh, brass!"
              className="mt-1 block w-full bg-transparent font-script text-2xl leading-none text-teal outline-none placeholder:text-ink-mute"
            />
          </div>
        </div>
      </section>

      <VendorCalendar />

      {/* Save bar */}
      <section className="sticky bottom-24 mt-10 lg:bottom-6">
        <div className="flex items-center justify-between gap-3 rounded-full border border-line bg-paper/95 px-4 py-3 shadow-brand-lg backdrop-blur">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Store className="h-4 w-4 text-teal" />
            <span className="hidden sm:inline">
              Edits save instantly to your live card.
            </span>
            <span className="sm:hidden">Auto-saved</span>
          </div>
          <button
            onClick={onSave}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              savedAt
                ? "bg-success text-cream"
                : "bg-navy text-cream hover:bg-navy-700"
            }`}
          >
            <Save className="h-4 w-4" />
            {savedAt ? "Saved!" : "Push to Discover"}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
