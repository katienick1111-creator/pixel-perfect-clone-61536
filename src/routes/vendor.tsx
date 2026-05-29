import { createFileRoute } from "@tanstack/react-router";
import {
  Store,
  Check,
  Sparkles,
  QrCode,
  Globe,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Portal — Trovin'" },
      {
        name: "description",
        content:
          "Claim your booth on Trovin'. Post your schedule, drop new inventory, and get found by buyers who are already looking.",
      },
      { property: "og:title", content: "Vendor Portal — Trovin'" },
      {
        property: "og:description",
        content:
          "Claim your booth, post your schedule, and get found by buyers.",
      },
    ],
    links: [{ rel: "canonical", href: "/vendor" }],
  }),
  component: VendorPortalPage,
});

const tiers = [
  {
    name: "Starter",
    price: "Free",
    blurb: "Get on the map.",
    perks: ["Profile + booth listing", "Up to 20 photos", "Shows on event maps"],
    tilt: -1.2,
  },
  {
    name: "Plus",
    price: "$12/mo",
    blurb: "Get followed.",
    perks: [
      "Everything in Starter",
      "Push 'fresh drop' alerts",
      "Schedule + multi-event",
      "Basic analytics",
    ],
    tilt: 0.4,
    featured: true,
  },
  {
    name: "Featured",
    price: "$29/mo",
    blurb: "Get the spotlight.",
    perks: [
      "Top placement at your events",
      "Trovin' homepage rotation",
      "Custom hand-tag art",
      "Priority support",
    ],
    tilt: 1.5,
  },
];

const addons = [
  { icon: Globe, label: "Mini-site", detail: "Your own trovin.co/you" },
  { icon: QrCode, label: "Booth QR", detail: "Printable, instant follow" },
  { icon: Users, label: "CRM", detail: "Buyer notes, repeat tracker" },
  { icon: Sparkles, label: "Automations", detail: "Auto-post when you arrive" },
];

function VendorPortalPage() {
  return (
    <AppShell>
      <PageHeader
        scribble="mind ya biz —"
        title="Vendor Portal"
        subtitle="Claim your booth, post your schedule, and get found by buyers already looking for you."
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-navy p-6 text-cream shadow-brand-lg md:p-10">
        <span className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/25 blur-2xl" />
        <span className="absolute -left-6 bottom-6 h-32 w-32 rounded-full bg-teal/30 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200">
            <Store className="h-3 w-3" /> For vendors
          </span>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
            Buyers find you <em className="font-script text-gold not-italic">before</em>{" "}
            they leave the house.
          </h2>
          <p className="mt-3 text-sm text-cream/80 md:text-base">
            218 vendors are already claimed in Chicago. Drop your hours, post
            fresh inventory, and let Trovin' nudge the buyers already following
            you.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-400">
              Claim my booth
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-cream/30 bg-navy/30 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60">
              See vendor demo
            </button>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="mt-10">
        <h3 className="mb-4 font-display text-2xl">Pick your hustle</h3>
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              style={{ transform: `rotate(${t.tilt}deg)` }}
              className={`relative flex flex-col rounded-2xl border p-5 transition duration-300 hover:!rotate-0 hover:-translate-y-1 hover:shadow-brand-lg ${
                t.featured
                  ? "border-gold bg-navy text-cream shadow-brand-md"
                  : "border-line bg-paper shadow-brand-sm"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 right-4 -rotate-6 rounded-sm bg-gold px-2 py-0.5 font-script text-sm text-navy shadow-brand-sm">
                  most picked
                </span>
              )}
              <p
                className={`font-script text-2xl leading-none ${
                  t.featured ? "text-gold" : "text-teal"
                }`}
              >
                {t.blurb}
              </p>
              <h4 className="mt-2 font-display text-2xl">{t.name}</h4>
              <p
                className={`mt-1 font-display text-3xl ${
                  t.featured ? "text-cream" : "text-navy"
                }`}
              >
                {t.price}
              </p>
              <ul
                className={`mt-4 space-y-2 text-sm ${
                  t.featured ? "text-cream/85" : "text-ink-soft"
                }`}
              >
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        t.featured ? "text-gold" : "text-teal"
                      }`}
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  t.featured
                    ? "bg-gold text-navy hover:bg-gold-400"
                    : "border border-line bg-cream text-navy hover:border-teal"
                }`}
              >
                Choose {t.name}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="mt-12">
        <h3 className="mb-4 font-display text-2xl">Add-ons</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {addons.map((a) => (
            <div
              key={a.label}
              className="rounded-xl border border-line bg-paper p-4 shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-200/50 text-teal">
                <a.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-lg">{a.label}</p>
              <p className="text-xs text-ink-soft">{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-dashed border-teal/50 bg-teal-200/30 p-6 text-center md:p-10">
        <p className="font-script text-3xl text-teal">ready when you are.</p>
        <h3 className="mt-2 font-display text-2xl">
          Set up your booth in under 4 minutes.
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          No app install, no setup fee, no kidding.
        </p>
        <button className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-navy/85">
          Claim my booth
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </section>
    </AppShell>
  );
}
