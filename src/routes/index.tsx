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
  const { profile: vendorProfile } = useVendorProfile();
  const [following, setFollowing] = useState<Record<string, boolean>>({
    v1: true,
    v3: true,
    v5: true,
  });

  const allVendors = useMemo(() => {
    if (!vendorProfile.openToday) return vendors;
    // Surface the live vendor first
    return [
      {
        id: vendorProfile.id,
        name: vendorProfile.name,
        tagline: vendorProfile.tagline,
        category: vendorProfile.category,
        event: vendorProfile.event,
        booth: vendorProfile.booth,
        hours: vendorProfile.hours,
        payments: vendorProfile.payments,
        followers: vendorProfile.followers,
        featured: true,
        image: vendorProfile.image,
        scribble: vendorProfile.scribble,
        tilt: vendorProfile.tilt,
      },
      ...vendors,
    ];
  }, [vendorProfile]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allVendors.filter((v) => {
      if (activeCategory !== "All" && v.category !== activeCategory) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.event.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query, allVendors]);

  const featured = allVendors.slice(0, 3);
  const openNowNames = allVendors
    .slice(0, 8)
    .map((v) => v.name)
    .concat(["Open now", "Live in Chicago"]);

  return (
    <AppShell>
      {/* === HERO COLLAGE === */}
      <section className="relative -mx-4 overflow-hidden bg-cream-deep px-4 pb-14 pt-6 lg:-mx-8 lg:px-8">
        {/* paper texture blobs */}
        <span className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <span className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {/* Headline column */}
          <div className="relative">
            <p className="font-script text-3xl md:text-4xl leading-none text-teal -rotate-2 origin-left">
              Hey Trovers —
            </p>
            <h1 className="mt-3 font-script text-[clamp(3.5rem,9vw,7rem)] leading-[0.85] text-navy">
              Let's Go
              <br />
              <span className="relative inline-block">
                Trovin'<span className="text-gold">!</span>
                <svg
                  className="absolute -bottom-2 left-0 h-4 w-full text-gold"
                  viewBox="0 0 240 14"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 8 Q40 1 80 7 T160 7 T238 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <div className="mt-5 inline-flex -rotate-2 items-stretch overflow-hidden rounded-sm border-2 border-dashed border-navy/40 bg-paper font-display shadow-brand-sm">
              <span className="flex items-center bg-navy px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cream">
                Promise
              </span>
              <span className="flex items-center px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-navy">
                Spend a day · <span className="ml-1 text-gold">not a fortune</span>
              </span>
            </div>




            {/* vendor stats strip */}
            <div className="mt-6 inline-flex items-center gap-4 rounded-full border border-line bg-paper px-5 py-2.5 shadow-brand-sm">
              <span className="flex items-baseline gap-1.5">
                <span className="inline-flex h-2 w-2 translate-y-[-2px] animate-pulse rounded-full bg-success" />
                <span className="font-display text-lg font-semibold leading-none text-navy">
                  218
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  vendors live
                </span>
              </span>
              <span className="h-4 w-px bg-line" />
              <span className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-semibold leading-none text-navy">
                  11
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  markets today
                </span>
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-stretch gap-2.5">
              <button
                onClick={() =>
                  document
                    .getElementById("vendors")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-700"
              >
                Show me what's out today
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <a
                href="/vendor"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-navy bg-paper px-5 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-cream"
              >
                <Store className="h-4 w-4" />
                I'm a vendor
              </a>
            </div>

          </div>

          {/* Polaroid fan */}
          <div className="relative mx-auto h-[30rem] w-full max-w-md sm:h-[34rem]">
            {featured.map((v, i) => {
              const rotations = [-9, 4, -2];
              const offsets = [
                { left: "2%", top: "8%" },
                { left: "32%", top: "0%" },
                { left: "20%", top: "38%" },
              ];
              const tapes = ["bg-gold-200/80", "bg-teal-200/80", "bg-gold/70"];
              const r = rotations[i] ?? 0;
              const o = offsets[i] ?? { left: "10%", top: "10%" };
              return (
                <div
                  key={v.id}
                  style={{
                    transform: `rotate(${r}deg)`,
                    left: o.left,
                    top: o.top,
                    zIndex: i + 1,
                  }}
                  className="absolute w-48 rounded-sm bg-paper p-2 pb-5 shadow-brand-lg ring-1 ring-line transition duration-300 hover:!rotate-0 hover:-translate-y-2 hover:z-10"
                >
                  <span
                    className={`absolute -top-2 left-1/2 h-4 w-14 -translate-x-1/2 -rotate-6 rounded-[2px] ${tapes[i]} shadow-brand-sm`}
                  />
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-navy">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-sm bg-cream/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy">
                      {v.category}
                    </span>
                    {v.scribble && (
                      <span className="absolute -right-1 bottom-2 -rotate-6 rounded-sm bg-gold px-2 py-0.5 font-script text-sm leading-none text-navy shadow-brand-sm">
                        {v.scribble}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 px-1 font-script text-lg leading-tight text-navy">
                    {v.name}
                  </p>
                  <p className="px-1 text-[10px] uppercase tracking-wider text-ink-mute">
                    {v.event}
                  </p>
                </div>
              );
            })}
            {/* arrow scribble */}
            <svg
              className="absolute -left-2 bottom-0 hidden h-20 w-24 text-teal lg:block"
              viewBox="0 0 100 80"
              fill="none"
            >
              <path
                d="M5 70 C 20 40 50 25 85 30"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <path
                d="M75 22 L 88 30 L 78 42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* === MARQUEE: who's out today === */}
      <section className="relative -mx-4 overflow-hidden border-y-2 border-navy bg-navy py-3 lg:-mx-8">
        <div className="flex animate-[marquee_28s_linear_infinite] whitespace-nowrap will-change-transform">
          {[...openNowNames, ...openNowNames].map((name, i) => (
            <span
              key={i}
              className="mx-6 inline-flex items-center gap-3 font-script text-2xl text-cream"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              {name}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
      </section>

      {/* === Search + filters === */}
      <section className="mt-10 flex flex-col gap-4">
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

      {/* === VENDORS GRID === */}
      <section id="vendors" className="mt-10 scroll-mt-24">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-script text-2xl leading-none text-teal">
              out today —
            </p>
            <h3 className="mt-1 font-display text-3xl">The lineup</h3>
            <p className="mt-1 text-sm text-ink-soft">
              {filtered.length} of {allVendors.length} • near Chicago, IL
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

      {/* === WHERE THEY'RE AT — events as ticket stubs === */}
      <section className="mt-14">
        <div className="mb-4">
          <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
            and they're at —
          </p>
          <h3 className="mt-1 font-display text-3xl">Markets this weekend</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {events.slice(0, 4).map((e) => (
            <a
              key={e.id}
              href="/events"
              className="group relative flex overflow-hidden rounded-lg bg-paper shadow-brand-md ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-brand-lg"
            >
              <div className="relative h-32 w-32 shrink-0 overflow-hidden">
                <img
                  src={e.image}
                  alt={e.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <span className="absolute left-32 -top-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
              <span className="absolute left-32 -bottom-2 h-4 w-4 -translate-x-1/2 rounded-full bg-cream" />
              <div className="flex flex-1 flex-col justify-center border-l-2 border-dashed border-line/80 p-4">
                {e.scribble && (
                  <p className="font-hand text-base leading-none text-teal">
                    {e.scribble}
                  </p>
                )}
                <p className="mt-1 font-display text-lg leading-tight text-navy">
                  {e.name}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {e.neighborhood} · {e.date}
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  {e.vendorCount} vendors · {e.hours}
                </p>
              </div>
            </a>
          ))}
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
            {vendorProfile.openToday && vendorProfile.note && (
              <li className="flex items-start gap-3 rounded-md border border-dashed border-gold/60 bg-gold/10 p-2">
                <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/30 text-navy">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-hand text-base leading-tight text-navy">
                    {vendorProfile.note}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {vendorProfile.name} · {vendorProfile.event} · just now
                  </p>
                </div>
              </li>
            )}
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
