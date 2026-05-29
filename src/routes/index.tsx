import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Bell,
  Heart,
  Compass,
  CalendarDays,
  Map as MapIcon,
  Store,
  Sparkles,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import trovinLogo from "@/assets/trovin-logo.png";
import trovinBadge from "@/assets/trovin-badge.png";

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
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: AppHome,
});

type Category =
  | "Antiques"
  | "Craft"
  | "Food"
  | "Collectibles"
  | "Farmers";

type Payment = "Card" | "Cash" | "Venmo";

type Vendor = {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  event: string;
  booth: string;
  hours: string;
  payments: Payment[];
  followers: number;
  featured?: boolean;
  accent: "navy" | "teal" | "gold";
};

const categories: { key: Category | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Antiques", label: "Antiques" },
  { key: "Craft", label: "Craft" },
  { key: "Food", label: "Food trucks" },
  { key: "Collectibles", label: "Collectibles" },
  { key: "Farmers", label: "Farmers" },
];

const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Maven & Moth",
    tagline: "Mid-century brass, glassware, oddities.",
    category: "Antiques",
    event: "Randolph Street Market",
    booth: "Booth 142",
    hours: "10a – 5p today",
    payments: ["Card", "Cash", "Venmo"],
    followers: 1284,
    featured: true,
    accent: "navy",
  },
  {
    id: "v2",
    name: "Smoke & Sown",
    tagline: "Wood-fired tacos, salsas, agua frescas.",
    category: "Food",
    event: "West Loop Food Yard",
    booth: "Truck #7",
    hours: "11a – 8p today",
    payments: ["Card", "Venmo"],
    followers: 3420,
    accent: "gold",
  },
  {
    id: "v3",
    name: "Paper Crane Press",
    tagline: "Letterpress prints, zines, handbound books.",
    category: "Craft",
    event: "Pilsen Maker Market",
    booth: "Aisle B • 14",
    hours: "9a – 4p today",
    payments: ["Card", "Cash"],
    followers: 612,
    accent: "teal",
  },
  {
    id: "v4",
    name: "Diamond Cuts Vinyl",
    tagline: "Soul, jazz, and rare 45s from 1962–84.",
    category: "Collectibles",
    event: "Randolph Street Market",
    booth: "Booth 071",
    hours: "10a – 5p today",
    payments: ["Cash", "Venmo"],
    followers: 945,
    accent: "navy",
  },
  {
    id: "v5",
    name: "Greenline Farm",
    tagline: "Heirloom tomatoes, honey, sourdough.",
    category: "Farmers",
    event: "Logan Square Farmers Market",
    booth: "Stall 22",
    hours: "8a – 1p today",
    payments: ["Card", "Cash"],
    followers: 2110,
    accent: "teal",
  },
  {
    id: "v6",
    name: "Tin Roof Toys",
    tagline: "Vintage Star Wars, tin robots, lunchboxes.",
    category: "Collectibles",
    event: "Kane County Flea",
    booth: "Row 4 • 18",
    hours: "7a – 4p Sun",
    payments: ["Cash"],
    followers: 530,
    accent: "gold",
  },
];

const featuredEvent = {
  name: "Randolph Street Market",
  neighborhood: "West Loop, Chicago",
  date: "Today • Sat May 30",
  hours: "10a – 5p",
  vendors: 218,
  followers: 12400,
};

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

const paymentIcon: Record<Payment, typeof CreditCard> = {
  Card: CreditCard,
  Cash: Banknote,
  Venmo: Smartphone,
};

const accentClasses: Record<Vendor["accent"], string> = {
  navy: "bg-navy text-cream",
  teal: "bg-teal text-cream",
  gold: "bg-gold text-navy",
};

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
      if (activeCategory !== "All" && v.category !== activeCategory)
        return false;
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
    <div className="min-h-screen bg-cream text-navy">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={trovinBadge}
              alt="Trovin'"
              className="h-10 w-10 rounded-full shadow-brand-sm"
            />
            <img
              src={trovinLogo}
              alt="Trovin' — Find more. Miss less."
              className="hidden h-9 w-auto md:block"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-teal hover:text-navy md:inline-flex">
              <MapPin className="h-4 w-4 text-teal" />
              Chicago, IL
              <ChevronRight className="h-4 w-4 -rotate-90 text-ink-mute" />
            </button>
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-navy transition hover:border-teal"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
            </button>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-cream">
              JM
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 lg:px-8 lg:py-10">
        {/* Side nav (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            <NavItem icon={Compass} label="Discover" active />
            <NavItem icon={CalendarDays} label="Events" badge="12" />
            <NavItem icon={MapIcon} label="Map" />
            <NavItem icon={Heart} label="Following" badge="3" />
            <NavItem icon={Store} label="Vendor Portal" />
            <div className="mt-6 rounded-lg border border-line bg-paper p-4 shadow-brand-sm">
              <p className="font-script text-2xl text-teal leading-none">
                Let's go Trovin'.
              </p>
              <p className="mt-2 text-xs text-ink-soft">
                218 vendors are out today across 11 events in Chicago.
              </p>
            </div>
          </nav>
        </aside>

        {/* Main column */}
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
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

          {/* Featured event */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-navy text-cream shadow-brand-lg">
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr,1fr] md:p-8">
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200">
                    <Sparkles className="h-3 w-3" /> Featured today
                  </span>
                  <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
                    {featuredEvent.name}
                  </h2>
                  <p className="mt-1 text-sm text-cream/70">
                    {featuredEvent.neighborhood} • {featuredEvent.date} •{" "}
                    {featuredEvent.hours}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Stat label="Vendors" value={featuredEvent.vendors} />
                  <span className="h-8 w-px bg-cream/15" />
                  <Stat
                    label="Followers"
                    value={`${(featuredEvent.followers / 1000).toFixed(1)}k`}
                  />
                  <span className="h-8 w-px bg-cream/15" />
                  <Stat label="Booths mapped" value="186" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-400">
                    Open event map
                  </button>
                  <button className="rounded-full border border-cream/25 px-5 py-2.5 text-sm font-semibold text-cream transition hover:border-cream/60">
                    Follow event
                  </button>
                </div>
              </div>

              <MapPreview />
            </div>
          </section>

          {/* Vendors */}
          <section className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h3 className="font-display text-2xl">Vendors out today</h3>
                <p className="text-sm text-ink-soft">
                  {filtered.length} of {vendors.length} • near {`Chicago, IL`}
                </p>
              </div>
              <button className="hidden items-center gap-1 text-sm font-medium text-teal hover:text-navy md:inline-flex">
                See all <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
          <section className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line bg-paper p-5 shadow-brand-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-display text-lg">From who you follow</h4>
                <Heart className="h-4 w-4 text-teal" />
              </div>
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-200/50 text-teal">
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy">
                        {n.title}
                      </p>
                      <p className="text-xs text-ink-soft">{n.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-line bg-navy p-5 text-cream shadow-brand-md">
              <div className="mb-3 flex items-center gap-2">
                <Store className="h-4 w-4 text-gold" />
                <h4 className="font-display text-lg">Are you a vendor?</h4>
              </div>
              <p className="text-sm text-cream/75">
                Claim your booth, post your schedule, and get found by buyers
                already looking for you.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-cream/80">
                <li>• Free Starter listing</li>
                <li>• Plus, Featured & Growth subscriptions</li>
                <li>• Mind Ya Biz add-ons: site, CRM, QR, automations</li>
              </ul>
              <button className="mt-4 inline-flex items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold-400">
                Open Vendor Portal <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-paper/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          <MobileTab icon={Compass} label="Discover" active />
          <MobileTab icon={CalendarDays} label="Events" />
          <MobileTab icon={MapIcon} label="Map" />
          <MobileTab icon={Heart} label="Follows" />
          <MobileTab icon={Store} label="Vendor" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: typeof Compass;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <button
      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-navy text-cream shadow-brand-sm"
          : "text-ink-soft hover:bg-paper hover:text-navy"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            active ? "bg-cream/15 text-cream" : "bg-cream-deep text-ink-soft"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileTab({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Compass;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition ${
        active ? "text-navy" : "text-ink-mute"
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-teal" : ""}`} />
      {label}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-2xl leading-none">{value}</span>
      <span className="mt-1 text-[11px] uppercase tracking-wider text-cream/60">
        {label}
      </span>
    </div>
  );
}

function VendorCard({
  vendor,
  following,
  onToggle,
}: {
  vendor: Vendor;
  following: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-brand-sm transition hover:-translate-y-0.5 hover:shadow-brand-md">
      <div
        className={`relative flex h-28 items-end justify-between p-4 ${accentClasses[vendor.accent]}`}
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 70 Q 50 40 100 60 T 200 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
        </svg>
        <div className="relative">
          <span className="inline-flex items-center rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
            {vendor.category}
          </span>
          <p className="mt-2 font-display text-xl leading-tight">
            {vendor.name}
          </p>
        </div>
        {vendor.featured && (
          <span className="relative inline-flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-ink-soft">{vendor.tagline}</p>

        <div className="grid gap-1.5 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-teal" />
            {vendor.event} • {vendor.booth}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" />
            {vendor.hours}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            {vendor.payments.map((p) => {
              const Icon = paymentIcon[p];
              return (
                <span
                  key={p}
                  title={p}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-cream text-ink-soft"
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              );
            })}
          </div>
          <button
            onClick={onToggle}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              following
                ? "border-teal bg-teal text-cream"
                : "border-line bg-paper text-navy hover:border-teal hover:text-teal"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${following ? "fill-current" : ""}`}
            />
            {following ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </article>
  );
}

function MapPreview() {
  const pins = [
    { x: 22, y: 38, label: "142", tone: "gold" },
    { x: 58, y: 28, label: "071", tone: "cream" },
    { x: 70, y: 62, label: "203", tone: "cream" },
    { x: 38, y: 70, label: "118", tone: "cream" },
    { x: 84, y: 44, label: "094", tone: "cream" },
  ];
  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-xl border border-cream/15 bg-navy-700">
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 h-full w-full text-teal-400/40"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100" height="80" fill="url(#grid)" />
        <path
          d="M5 60 Q 25 30 55 45 T 95 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <path
          d="M10 20 L 90 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <path
          d="M50 5 L 50 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
      </svg>
      {pins.map((p, i) => (
        <div
          key={i}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-full"
        >
          <div
            className={`flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[10px] font-bold shadow-brand-md ${
              p.tone === "gold"
                ? "bg-gold text-navy ring-2 ring-gold-200"
                : "bg-cream text-navy"
            }`}
          >
            {p.label}
          </div>
          <div
            className={`mx-auto h-2 w-2 -translate-y-0.5 rotate-45 ${
              p.tone === "gold" ? "bg-gold" : "bg-cream"
            }`}
          />
        </div>
      ))}
      <div className="absolute bottom-3 left-3 rounded-md bg-navy/70 px-2 py-1 text-[10px] font-medium text-cream/80 backdrop-blur">
        Randolph Street • mapped booths
      </div>
    </div>
  );
}
