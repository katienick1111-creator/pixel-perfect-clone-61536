import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CreditCard,
  Heart,
  Settings,
  Sparkles,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { categories } from "@/data/trovin";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Trovin'" },
      {
        name: "description",
        content:
          "Your Trovin' profile — saved markets, preferences, and account.",
      },
      { property: "og:title", content: "Profile — Trovin'" },
      {
        property: "og:description",
        content: "Your Trovin' profile and preferences.",
      },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: ProfilePage,
});

const stats = [
  { label: "Following", value: 14 },
  { label: "Markets visited", value: 27 },
  { label: "Bookmarks", value: 42 },
];

const settingsRows = [
  { icon: Bell, label: "Notifications", detail: "Fresh drops, open today" },
  { icon: CreditCard, label: "Payment methods", detail: "Card · Venmo" },
  { icon: MapPin, label: "Home base", detail: "Chicago, IL" },
  { icon: Settings, label: "Account & privacy", detail: "Manage" },
];

function ProfilePage() {
  return (
    <AppShell>
      <PageHeader scribble="hey there —" title="Jordan M." subtitle="Member since Spring '24 • Chicago, IL" />

      {/* Profile card */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-navy p-6 text-cream shadow-brand-lg md:p-8">
        <span className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/20 blur-2xl" />
        <span className="absolute right-6 top-5 -rotate-6 rounded-sm bg-gold/85 px-2.5 py-0.5 font-script text-sm text-navy shadow-brand-md">
          loyal trover ✨
        </span>
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cream font-display text-2xl font-bold text-navy shadow-brand-md">
            JM
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-3xl">Jordan M.</h2>
            <p className="text-sm text-cream/80">
              "Always one booth away from the good stuff."
            </p>
            <div className="mt-4 flex flex-wrap gap-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl leading-none">{s.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-cream/65">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <button className="rounded-full border border-cream/30 bg-navy/30 px-4 py-2 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60">
            Edit profile
          </button>
        </div>
      </section>

      {/* Interests */}
      <section className="mt-8">
        <h3 className="mb-3 font-display text-xl">What you're into</h3>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.key !== "All")
            .map((c, i) => (
              <span
                key={c.key}
                style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.2}deg)` }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-medium text-navy shadow-brand-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {c.label}
              </span>
            ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/following"
          className="group flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md"
        >
          <div>
            <p className="font-script text-lg leading-none text-teal">your people</p>
            <p className="mt-1 font-display text-xl">Vendors you follow</p>
            <p className="text-xs text-ink-soft">14 vendors • 3 new drops</p>
          </div>
          <Heart className="h-6 w-6 fill-teal text-teal transition group-hover:scale-110" />
        </Link>
        <Link
          to="/events"
          className="group flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md"
        >
          <div>
            <p className="font-script text-lg leading-none text-teal">coming up</p>
            <p className="mt-1 font-display text-xl">Saved events</p>
            <p className="text-xs text-ink-soft">4 this weekend</p>
          </div>
          <ChevronRight className="h-5 w-5 text-ink-mute transition group-hover:translate-x-0.5 group-hover:text-teal" />
        </Link>
      </section>

      {/* Settings */}
      <section className="mt-8 rounded-2xl border border-line bg-paper shadow-brand-sm">
        <h3 className="border-b border-line px-5 py-4 font-display text-lg">
          Settings
        </h3>
        <ul>
          {settingsRows.map((row, i) => (
            <li
              key={row.label}
              className={`flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-cream-deep/60 ${
                i !== settingsRows.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-200/50 text-teal">
                  <row.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{row.label}</p>
                  <p className="text-xs text-ink-soft">{row.detail}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-ink-mute" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 text-center">
        <button className="rounded-full border border-line bg-paper px-5 py-2 text-sm font-semibold text-ink-soft transition hover:border-teal hover:text-navy">
          Sign out
        </button>
      </section>
    </AppShell>
  );
}
