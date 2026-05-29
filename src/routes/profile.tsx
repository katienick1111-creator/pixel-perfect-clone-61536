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
import { AppShell } from "@/components/AppShell";
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
  { label: "Following", value: 14, scribble: "growing" },
  { label: "Markets visited", value: 27, scribble: "well done" },
  { label: "Bookmarks", value: 42, scribble: "for later" },
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
      {/* Beefed-up header with scribbled underline */}
      <div className="mb-7">
        <p className="font-script text-4xl leading-none text-teal -rotate-2 origin-left">
          hey there —
        </p>
        <div className="relative mt-3 inline-block">
          <h1 className="font-display text-5xl md:text-6xl leading-none">
            Jordan M.
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
        <p className="mt-5 text-sm text-ink-soft">
          Member since Spring '24 • Chicago, IL
        </p>
      </div>

      {/* Profile card */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-navy p-6 text-cream shadow-brand-lg md:p-8">
        <span className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/20 blur-2xl" />
        <span className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-teal/30 blur-2xl" />

        {/* Big loyal-trover tape strip */}
        <span className="absolute right-4 top-4 -rotate-6 rounded-sm bg-gold px-3.5 py-1.5 font-script text-xl leading-none text-navy shadow-brand-md md:text-2xl">
          loyal trover ✨
        </span>

        <div className="relative flex flex-wrap items-center gap-5">
          <div className="relative">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cream font-display text-2xl font-bold text-navy shadow-brand-md">
              JM
            </div>
            {/* hand-drawn ring around avatar */}
            <svg
              className="absolute -inset-2 h-24 w-24 -rotate-12 text-gold"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M50 6 C 80 6 94 28 92 54 C 90 80 64 96 38 90 C 14 84 4 56 14 32 C 22 14 38 8 50 6 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="3 5"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-script text-3xl leading-none text-gold-200">
              that's me —
            </p>
            <h2 className="mt-1 font-display text-3xl">Jordan M.</h2>
            <p className="mt-1 text-sm italic text-cream/80">
              "Always one booth away from the good stuff."
            </p>
          </div>

          <button className="rounded-full border border-cream/30 bg-navy/30 px-4 py-2 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60">
            Edit profile
          </button>
        </div>

        {/* Stats — each with a scribble */}
        <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-cream/15 pt-5">
          {stats.map((s, i) => (
            <div key={s.label} className="relative">
              <span
                style={{ transform: `rotate(${[-3, 2, -2][i]}deg)` }}
                className="absolute -top-3 right-0 inline-block font-script text-sm leading-none text-gold-200"
              >
                {s.scribble}
              </span>
              <p className="font-display text-3xl leading-none">{s.value}</p>
              <p className="mt-1.5 text-[11px] uppercase tracking-wider text-cream/65">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="relative mt-10">
        <p className="font-script text-3xl leading-none text-teal -rotate-1 origin-left">
          stuff I'm into —
        </p>
        <h3 className="mt-2 font-display text-xl text-ink-soft">
          tap to tune your feed
        </h3>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {categories
            .filter((c) => c.key !== "All")
            .map((c, i) => (
              <span
                key={c.key}
                style={{
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.8}deg)`,
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-2 text-sm font-medium text-navy shadow-brand-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {c.label}
              </span>
            ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          to="/following"
          className="group relative flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md"
        >
          <span className="absolute -top-3 left-5 -rotate-3 rounded-sm bg-teal-200 px-2.5 py-0.5 font-script text-lg leading-none text-teal shadow-brand-sm">
            your people
          </span>
          <div>
            <p className="font-display text-xl">Vendors you follow</p>
            <p className="mt-1 text-xs text-ink-soft">
              14 vendors • 3 new drops
            </p>
          </div>
          <Heart className="h-7 w-7 fill-teal text-teal transition group-hover:scale-110" />
        </Link>
        <Link
          to="/events"
          className="group relative flex items-center justify-between rounded-2xl border border-line bg-paper p-5 shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md"
        >
          <span className="absolute -top-3 left-5 -rotate-2 rounded-sm bg-gold/85 px-2.5 py-0.5 font-script text-lg leading-none text-navy shadow-brand-sm">
            coming up
          </span>
          <div>
            <p className="font-display text-xl">Saved events</p>
            <p className="mt-1 text-xs text-ink-soft">4 this weekend</p>
          </div>
          <ChevronRight className="h-5 w-5 text-ink-mute transition group-hover:translate-x-0.5 group-hover:text-teal" />
        </Link>
      </section>

      {/* Settings */}
      <section className="relative mt-12 rounded-2xl border border-line bg-paper shadow-brand-sm">
        <span className="absolute -top-4 left-6 -rotate-2 rounded-sm bg-navy px-3 py-1 font-script text-xl leading-none text-cream shadow-brand-md">
          the boring bits —
        </span>
        <ul className="pt-3">
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

      <section className="mt-10 text-center">
        <p className="font-script text-3xl leading-none text-ink-mute -rotate-2">
          see ya later —
        </p>
        <button className="mt-2 rounded-full border border-line bg-paper px-6 py-2 text-sm font-semibold text-ink-soft transition hover:border-teal hover:text-navy">
          Sign out
        </button>
      </section>
    </AppShell>
  );
}
