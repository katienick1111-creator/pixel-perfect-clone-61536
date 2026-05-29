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
      {/* Header */}
      <div className="mb-8">
        <p className="font-hand text-3xl leading-none text-teal -rotate-2 origin-left">
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

      {/* POLAROID profile card */}
      <section className="relative mx-auto max-w-md rotate-[-1.5deg]">
        {/* tape strips */}
        <span className="absolute -top-3 left-8 h-5 w-20 -rotate-6 rounded-[2px] bg-gold-200/80 shadow-brand-sm" />
        <span className="absolute -top-3 right-10 h-5 w-16 rotate-6 rounded-[2px] bg-teal-200/80 shadow-brand-sm" />

        <div className="rounded-sm bg-paper p-4 pb-6 shadow-brand-lg ring-1 ring-line">
          {/* photo area */}
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm bg-navy">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(228,161,8,0.35),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(10,118,116,0.45),transparent_55%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-flex h-28 w-28 items-center justify-center rounded-full bg-cream font-display text-4xl font-bold text-navy shadow-brand-md">
                JM
              </div>
            </div>
            <span className="absolute left-3 top-3 rounded-sm bg-navy/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cream">
              CHI · 2024
            </span>
            <span className="absolute right-3 bottom-3 -rotate-3 rounded-sm bg-gold px-2.5 py-1 font-script text-base leading-none text-navy shadow-brand-sm">
              loyal trover
            </span>
          </div>

          {/* caption */}
          <div className="mt-4 px-1">
            <p className="font-script text-3xl leading-tight text-navy">
              Jordan M.
            </p>
            <p className="mt-1 font-hand text-xl leading-tight text-ink-soft">
              "always one booth away from the good stuff"
            </p>
          </div>

          {/* stats — index card row */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-line border-y border-line py-3">
            {stats.map((s, i) => (
              <div key={s.label} className="px-2 text-center">
                <p
                  style={{ transform: `rotate(${[-3, 2, -2][i]}deg)` }}
                  className="font-hand text-base leading-none text-teal"
                >
                  {s.scribble}
                </p>
                <p className="mt-1 font-display text-3xl leading-none text-navy">
                  {s.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-mute">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full rounded-full border border-navy/20 bg-navy px-4 py-2 text-sm font-semibold text-cream transition hover:bg-navy-700">
            Edit profile
          </button>
        </div>
      </section>

      {/* Interests — sticker chips */}
      <section className="relative mt-12">
        <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
          stuff I'm into
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

      {/* TICKET STUB quick links */}
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <Link
          to="/following"
          className="group relative flex overflow-hidden rounded-lg bg-teal text-cream shadow-brand-md transition hover:-translate-y-0.5 hover:shadow-brand-lg"
        >
          {/* stub */}
          <div className="flex w-20 flex-col items-center justify-center border-r-2 border-dashed border-cream/40 bg-teal-400/40 px-3 py-5">
            <Heart className="h-7 w-7 fill-cream text-cream" />
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-cream/80">
              No. 14
            </p>
          </div>
          {/* notches */}
          <span className="absolute left-[5rem] -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <span className="absolute left-[5rem] -bottom-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <div className="flex-1 p-5">
            <p className="font-hand text-xl leading-none text-gold-200">
              your people
            </p>
            <p className="mt-2 font-display text-2xl leading-tight">
              Vendors you follow
            </p>
            <p className="mt-1 text-xs text-cream/75">14 vendors · 3 new drops</p>
          </div>
        </Link>

        <Link
          to="/events"
          className="group relative flex overflow-hidden rounded-lg bg-gold text-navy shadow-brand-md transition hover:-translate-y-0.5 hover:shadow-brand-lg"
        >
          <div className="flex w-20 flex-col items-center justify-center border-r-2 border-dashed border-navy/30 bg-gold-400/60 px-3 py-5">
            <p className="font-display text-3xl leading-none">04</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-navy/70">
              events
            </p>
          </div>
          <span className="absolute left-[5rem] -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <span className="absolute left-[5rem] -bottom-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
          <div className="flex-1 p-5">
            <p className="font-hand text-xl leading-none text-teal">
              coming up
            </p>
            <p className="mt-2 font-display text-2xl leading-tight">
              Saved events
            </p>
            <p className="mt-1 text-xs text-navy/70">4 this weekend</p>
            <ChevronRight className="absolute right-3 bottom-3 h-5 w-5 text-navy/60 transition group-hover:translate-x-0.5" />
          </div>
        </Link>
      </section>

      {/* INDEX-CARD settings */}
      <section className="relative mt-14">
        <p className="absolute -top-6 left-4 -rotate-2 font-script text-2xl leading-none text-navy">
          the boring bits
        </p>
        <div
          className="rounded-md border border-line bg-paper shadow-brand-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 63px, rgba(10,118,116,0.18) 63px 64px)",
          }}
        >
          {/* red margin line */}
          <span className="pointer-events-none absolute left-12 top-0 bottom-0 w-px bg-danger/50" />
          <ul>
            {settingsRows.map((row, i) => (
              <li
                key={row.label}
                className={`relative flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-cream-deep/40 ${
                  i !== settingsRows.length - 1 ? "" : ""
                }`}
                style={{ height: 64 }}
              >
                <div className="flex items-center gap-3 pl-9">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal-200/60 text-teal">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-hand text-lg leading-none text-navy">
                      {row.label}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">{row.detail}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-mute" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 text-center">
        <p className="font-script text-2xl leading-none text-ink-mute -rotate-2">
          see ya later
        </p>
        <button className="mt-3 rounded-full border border-line bg-paper px-6 py-2 text-sm font-semibold text-ink-soft transition hover:border-teal hover:text-navy">
          Sign out
        </button>
      </section>
    </AppShell>
  );
}
