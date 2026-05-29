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

  const featured = allVendors.filter((v) => v.category !== "Food").slice(0, 2);


  return (
    <AppShell>
      {/* === HERO COLLAGE === */}
      <section className="relative -mx-4 overflow-hidden bg-gradient-to-b from-cream-deep via-cream-deep to-cream px-4 pb-10 pt-4 lg:-mx-8 lg:px-8">


        {/* paper texture blobs */}
        <span className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <span className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
          {/* Headline column */}
          <div className="relative">
            <p className="font-script text-2xl md:text-3xl leading-none text-teal -rotate-2 origin-left">
              Hey Trovers —
            </p>
            <h1 className="mt-2 font-script text-[clamp(2.5rem,7.5vw,5rem)] leading-[0.85] text-navy">

              Let's Go
              <br />
              <span className="relative inline-block">
                Trovin'<span className="text-gold">!</span>
                <svg
                  className="absolute -bottom-5 left-0 h-4 w-full text-gold"
                  viewBox="0 0 240 14"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 8 Q40 1 80 7 T160 7 T238 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="2 7"
                  />

                </svg>
                <span className="pointer-events-none absolute -bottom-[22px] left-0 right-0 block h-8 overflow-visible">



                  <span
                    className="absolute top-0 h-8 w-14"
                    style={{ animation: "trovin-drive 9s ease-in-out infinite" }}
                  >
                    <span
                      className="block h-full w-full"
                      style={{ animation: "trovin-flip 9s ease-in-out infinite" }}
                    >
                      <span
                        className="block h-full w-full"
                        style={{ animation: "trovin-bump 0.32s ease-in-out infinite" }}
                      >
                        <svg viewBox="0 0 56 32" className="h-full w-full" fill="none">
                          {/* shadow */}
                          <ellipse cx="28" cy="29" rx="20" ry="1.4" fill="oklch(0.22 0.07 260)" opacity="0.18" />
                          {/* body — rounded classic bus, two-tone */}
                          <path
                            d="M4 22 L4 12 Q4 7 9 7 L40 7 Q43 7 45 9 L52 15 Q53 16 53 17.5 L53 22 Z"
                            fill="oklch(0.96 0.02 85)"
                            stroke="oklch(0.22 0.07 260)"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                          />
                          {/* lower teal band */}
                          <path
                            d="M4 18 L53 18 L53 22 L4 22 Z"
                            fill="oklch(0.62 0.10 195)"
                            stroke="oklch(0.22 0.07 260)"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                          />
                          {/* gold pinstripe */}
                          <line x1="4" y1="17" x2="53" y2="17" stroke="oklch(0.78 0.14 80)" strokeWidth="0.9" />
                          {/* big curved windshield + window */}
                          <path
                            d="M9 9 Q9 8.5 9.6 8.5 L38 8.5 Q40.5 8.5 42 10 L48 14.5 L9 14.5 Z"
                            fill="oklch(0.92 0.05 220)"
                            stroke="oklch(0.22 0.07 260)"
                            strokeWidth="1"
                            strokeLinejoin="round"
                          />
                          {/* window divider */}
                          <line x1="25" y1="9" x2="25" y2="14.5" stroke="oklch(0.22 0.07 260)" strokeWidth="1" />
                          {/* door */}
                          <rect x="17" y="14.5" width="6" height="3.5" fill="none" stroke="oklch(0.22 0.07 260)" strokeWidth="0.6" />
                          {/* headlight */}
                          <circle cx="51" cy="20" r="1.2" fill="oklch(0.86 0.16 90)" stroke="oklch(0.22 0.07 260)" strokeWidth="0.6" />
                          {/* trovin' badge dot */}
                          <circle cx="32" cy="20" r="1.4" fill="oklch(0.78 0.14 80)" stroke="oklch(0.22 0.07 260)" strokeWidth="0.5" />
                          {/* wheel wells */}
                          <path d="M9 22 Q9 18 14 18 Q19 18 19 22 Z" fill="oklch(0.96 0.02 85)" stroke="oklch(0.22 0.07 260)" strokeWidth="0.8" />
                          <path d="M37 22 Q37 18 42 18 Q47 18 47 22 Z" fill="oklch(0.96 0.02 85)" stroke="oklch(0.22 0.07 260)" strokeWidth="0.8" />
                          {/* wheels */}
                          <circle cx="14" cy="23" r="3.8" fill="oklch(0.22 0.07 260)" />
                          <circle cx="14" cy="23" r="1.8" fill="oklch(0.96 0.02 85)" />
                          <circle cx="14" cy="23" r="0.6" fill="oklch(0.22 0.07 260)" />
                          <circle cx="42" cy="23" r="3.8" fill="oklch(0.22 0.07 260)" />
                          <circle cx="42" cy="23" r="1.8" fill="oklch(0.96 0.02 85)" />
                          <circle cx="42" cy="23" r="0.6" fill="oklch(0.22 0.07 260)" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </span>
              </span>



              {/* kraft paper price-tag badge */}
              <span className="absolute right-2 top-[22%] rotate-[-7deg] sm:right-6 sm:top-[28%] md:right-10">

                  {/* twine string */}
                  <span className="absolute left-1/2 -top-7 h-7 w-px -translate-x-1/2 rotate-[18deg] bg-navy/50" />
                  {/* tag body — cream kraft rectangle with teal border */}
                  <span
                    className="relative flex flex-col items-center rounded-sm border-2 border-teal bg-cream px-5 py-3 text-navy shadow-brand-md sm:px-6 sm:py-4"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, transparent 0 6px, rgba(15,22,46,0.04) 6px 7px)",
                    }}
                  >
                    {/* hole */}
                    <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-navy" />
                    <span className="font-script text-2xl leading-none text-teal sm:text-3xl">spend a day</span>
                    <span className="mt-1 flex items-center gap-1 font-display text-[9px] font-black uppercase tracking-[0.22em] text-navy/70 sm:text-[11px]">
                      <span className="h-px w-3 bg-gold" />
                      not a fortune
                      <span className="h-px w-3 bg-gold" />
                    </span>
                  </span>

                  <span className="absolute -right-3 -top-2 font-script text-xl text-gold rotate-[12deg]">✦</span>
                </span>





            </h1>

            <p className="mt-6 max-w-md font-script text-2xl leading-tight text-navy md:text-[1.7rem]">
              Ever find a great vendor and never know where to find them again?
            </p>

            <p className="mt-3 max-w-md font-display text-base leading-snug text-ink-soft md:text-lg">
              Follow your favorites. Discover new ones. Know who's there before
              you get there.
            </p>


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
          {/* Polaroid pair */}
          <div className="relative mx-auto h-[20rem] w-full max-w-sm sm:h-[22rem]">
            {featured.map((v, i) => {
              const rotations = [-7, 5];
              const offsets = [
                { left: "4%", top: "6%" },
                { left: "38%", top: "18%" },
              ];
              const tapes = ["bg-gold-200/80", "bg-teal-200/80"];
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
                  className="absolute w-40 rounded-sm bg-paper p-2 pb-4 shadow-brand-lg ring-1 ring-line transition duration-300 hover:!rotate-0 hover:-translate-y-2 hover:z-10 sm:w-44"
                >
                  <span
                    className={`absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-6 rounded-[2px] ${tapes[i]} shadow-brand-sm`}
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
                  <p className="mt-2 px-1 font-script text-base leading-tight text-navy">
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
