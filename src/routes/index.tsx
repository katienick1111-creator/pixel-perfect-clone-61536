import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Heart,
  CalendarDays,
  Store,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { VendorCard } from "@/components/VendorCard";
import { categories, events, vendors, type Category } from "@/data/trovin";
import { useVendorProfile } from "@/hooks/useVendorProfile";

const heroEvent = events[0];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trovin' — Find more. Miss less." },
      {
        name: "description",
        content:
          "Discover vendors, flea markets, food trucks, and craft fairs near you. Trovin' helps you spend the day, not a fortune.",
      },
      { property: "og:title", content: "Trovin' — Find more. Miss less." },
      {
        property: "og:description",
        content:
          "Discover vendors, flea markets, food trucks, and craft fairs near you.",
      },
      { property: "og:image", content: heroEvent.image },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: AppHome,
});

const notifications = [
  {
    id: "n1",
    icon: Heart,
    title: "Maven & Moth just dropped new inventory",
    detail: "Booth 142 · Randolph Street Market · 12 min ago",
  },
  {
    id: "n2",
    icon: CalendarDays,
    title: "Pilsen Maker Market opens in 1 hour",
    detail: "3 vendors you follow will be there",
  },
  {
    id: "n3",
    icon: Sparkles,
    title: "New near you: vintage vinyl pop-up",
    detail: "Based on your follows in Collectibles",
  },
];

function AppHome() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [openToday, setOpenToday] = useState(true);
  const [query, setQuery] = useState("");
  const [following, setFollowing] = useState<Record<string, boolean>>({
    v1: true,
    v3: true,
    v5: true,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vendors.filter((v) => {
      if (activeCategory !== "All" && v.category !== activeCategory) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.event.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query]);

  return (
    <AppShell>
      {/* Search + filters */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-3 shadow-brand-sm focus-within:border-teal">
          <Search className="h-5 w-5 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendors, events, neighborhoods…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-mute"
          />
          <span className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-mute md:inline">
            ⌘K
          </span>
        </div>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((c) => {
            const active = activeCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "border-navy bg-navy text-cream"
                    : "border-line bg-paper text-ink-soft hover:border-teal hover:text-navy"
                }`}
              >
                {c.label}
              </button>
            );
          })}
          <span className="mx-1 h-5 w-px shrink-0 bg-line" />
          <button
            onClick={() => setOpenToday((v) => !v)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              openToday
                ? "border-teal bg-teal-200/40 text-teal"
                : "border-line bg-paper text-ink-soft hover:border-teal"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            Open today
          </button>
        </div>
      </section>

      {/* Featured event hero */}
      <section className="relative mt-6 overflow-hidden rounded-2xl border border-line bg-navy text-cream shadow-brand-lg">
        <div className="relative h-72 md:h-96">
          <img
            src={heroEvent.image}
            alt={heroEvent.name}
            width={1280}
            height={896}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/10" />
          <span className="absolute left-6 top-4 -rotate-3 rounded-sm bg-gold/85 px-3 py-1 font-script text-base text-navy shadow-brand-md">
            happening now ✨
          </span>
          <svg
            className="absolute right-10 top-10 hidden h-24 w-24 -rotate-12 text-gold md:block"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M50 12 C 78 10 92 32 88 56 C 84 80 60 92 38 86 C 16 80 8 56 18 36 C 24 22 38 14 50 12 Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 4"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200">
              <Sparkles className="h-3 w-3" /> Featured today
            </span>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
              {heroEvent.name}
            </h2>
            <p className="mt-1 text-sm text-cream/80">
              {heroEvent.neighborhood} • {heroEvent.date} • {heroEvent.hours}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Stat label="Vendors" value={heroEvent.vendorCount} />
              <span className="h-8 w-px bg-cream/20" />
              <Stat
                label="Followers"
                value={`${(heroEvent.followers / 1000).toFixed(1)}k`}
              />
              <span className="h-8 w-px bg-cream/20" />
              <Stat label="Booths mapped" value="186" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="group inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-400">
                Open event map
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <button className="rounded-full border border-cream/30 bg-navy/30 px-5 py-2.5 text-sm font-semibold text-cream backdrop-blur transition hover:border-cream/60">
                Follow event
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vendors */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-script text-2xl leading-none text-teal">
              out today —
            </p>
            <h3 className="mt-1 font-display text-3xl">Vendors near you</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {filtered.length} of {vendors.length} • near Chicago, IL
            </p>
          </div>
          <button className="hidden items-center gap-1 text-sm font-medium text-teal hover:text-navy md:inline-flex">
            See all <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <VendorCard
              key={v.id}
              vendor={v}
              following={!!following[v.id]}
              onToggle={() =>
                setFollowing((f) => ({ ...f, [v.id]: !f[v.id] }))
              }
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-soft">
              No vendors match those filters. Try widening your search.
            </div>
          )}
        </div>
      </section>

      {/* Following + notifications */}
      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="relative rounded-xl border border-line bg-paper p-5 shadow-brand-sm">
          <span className="absolute -top-3 left-5 -rotate-2 rounded-sm bg-teal-200/80 px-2 py-0.5 font-script text-sm text-teal shadow-brand-sm">
            fresh drops
          </span>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-display text-lg">From who you follow</h4>
            <Heart className="h-4 w-4 fill-teal text-teal" />
          </div>
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-200/50 text-teal">
                  <n.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy">{n.title}</p>
                  <p className="text-xs text-ink-soft">{n.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-line bg-navy p-5 text-cream shadow-brand-md">
          <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
          <div className="relative mb-3 flex items-center gap-2">
            <Store className="h-4 w-4 text-gold" />
            <h4 className="font-display text-lg">Are you a vendor?</h4>
          </div>
          <p className="relative text-sm text-cream/80">
            Claim your booth, post your schedule, and get found by buyers
            already looking for you.
          </p>
          <p className="relative mt-3 font-script text-2xl leading-none text-gold-200">
            Mind ya biz.
          </p>
          <ul className="relative mt-2 space-y-1.5 text-sm text-cream/80">
            <li>• Free Starter listing</li>
            <li>• Plus, Featured & Growth subscriptions</li>
            <li>• Add-ons: site, CRM, QR, automations</li>
          </ul>
          <a
            href="/vendor"
            className="relative mt-4 inline-flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold-400"
          >
            Open Vendor Portal <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-2xl leading-none">{value}</span>
      <span className="mt-1 text-[11px] uppercase tracking-wider text-cream/70">
        {label}
      </span>
    </div>
  );
}
