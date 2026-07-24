import Link from "next/link";
import { STOREFRONTS, PLATFORM_STATS, SCAN_DESTINATIONS } from "@/lib/demo-data";
import { StoreCard } from "@/components/cards";

/* ---------- tiny primitives ---------- */
function Btn({
  href,
  children,
  variant = "ink",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "ink" | "pink" | "purple" | "teal" | "white";
  className?: string;
}) {
  const styles: Record<string, string> = {
    ink: "bg-ink text-cream",
    pink: "bg-pink text-white",
    purple: "bg-purple text-white",
    teal: "bg-teal text-ink",
    white: "bg-white text-ink",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-extrabold pop pop-hover ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

function Blob({ className, color }: { className: string; color: string }) {
  return <span aria-hidden className={`spray pointer-events-none absolute ${className}`} style={{ background: color }} />;
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Marquee />
      <Stats />
      <ShopLocal />
      <Movement />
      <WearItForward />
      <ScanOpens />
      <BusinessTypes />
      <FeaturedStores />
      <HowItWorks />
      <CreateStore />
      <FinalCta />
    </main>
  );
}

/* ============================ HERO ============================ */
function Hero() {
  return (
    <section className="relative">
      <Blob className="left-[-4rem] top-10 h-56 w-56 opacity-30 blur-2xl" color="#7b2ff7" />
      <Blob className="right-[-3rem] top-24 h-52 w-52 opacity-30 blur-2xl" color="#10bfb2" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="relative">
          <span className="sticker" style={{ background: "var(--color-yellow)" }}>⚡ One account · every storefront</span>
          <h1 className="mt-4 text-[clamp(2.7rem,7vw,5rem)] leading-[0.9]">
            Wear It. <span className="text-pink">Share It.</span>
            <br />
            <span className="text-purple">Earn</span> From It.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Shop custom merchandise, support local businesses, earn rewards, and turn what you wear
            into something people can <b className="text-ink">scan, tap, and remember.</b>
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="/storefronts" variant="ink">🛍️ Shop Merch</Btn>
            <Btn href="#movement" variant="pink">⭐ Join The Movement</Btn>
            <Btn href="#create-store" variant="purple">🏪 Create Your Store</Btn>
            <Btn href="#how" variant="white">▶️ How It Works</Btn>
          </div>
          <div className="mt-7 flex items-center gap-4 text-sm font-bold text-ink-soft">
            <div className="flex -space-x-2">
              {["🌮", "🐾", "🔨", "🎉", "⚡"].map((e) => (
                <span key={e} className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-white">
                  {e}
                </span>
              ))}
            </div>
            <span>Loved by 60+ local businesses & their crews.</span>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-md">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-[2.2rem] border-[6px] border-ink bg-ink p-2 shadow-[10px_14px_0_rgba(27,20,32,0.35)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-cream">
          <div className="bg-purple px-4 py-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">The Movement</p>
            <p className="font-display text-2xl leading-none">3,240 pts</p>
            <p className="text-[11px] font-semibold opacity-90">Gold tier · 1,760 to Platinum</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-[64%] rounded-full bg-yellow" />
            </div>
          </div>
          <div className="space-y-2 p-3">
            {[
              { i: "🌮", t: "Taco Alley purchase", p: "+280" },
              { i: "📲", t: "Someone scanned your tee", p: "+50" },
              { i: "🧑‍🤝‍🧑", t: "Referral joined", p: "+500" },
              { i: "🏆", t: "Shop Local challenge", p: "+150" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-2 rounded-xl border-2 border-ink/10 bg-white p-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-cream-deep">{r.i}</span>
                <span className="flex-1 text-[11px] font-bold leading-tight">{r.t}</span>
                <span className="text-[11px] font-extrabold text-teal">{r.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-float absolute -left-1 top-4 rotate-[-8deg] rounded-2xl bg-white p-3 pop">
        <div className="grid h-16 w-16 place-items-center rounded-xl bg-linear-to-br from-pink to-purple text-3xl">👕</div>
        <p className="mt-1 text-center text-[10px] font-extrabold">SCAN ME</p>
      </div>
      <div className="animate-float absolute -right-1 top-10 rotate-[7deg] rounded-full bg-teal px-3 py-2 pop" style={{ animationDelay: "0.6s" }}>
        <p className="text-sm font-extrabold text-ink">📲 +50 pts</p>
      </div>
      <div className="animate-float absolute bottom-2 left-2 rotate-[-4deg] rounded-2xl bg-white p-2 pop" style={{ animationDelay: "1.1s" }}>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-soft text-lg">🌮</span>
          <div>
            <p className="text-[11px] font-extrabold leading-none">Taco Alley</p>
            <p className="text-[9px] font-bold text-ink-soft">⭐ Rewards · 📲 WIF</p>
          </div>
        </div>
      </div>
      <div className="animate-float absolute bottom-8 right-0 rotate-[6deg] rounded-2xl bg-yellow px-3 py-2 pop" style={{ animationDelay: "0.3s" }}>
        <p className="text-xs font-extrabold text-ink">🔥 Tier up!</p>
      </div>
    </div>
  );
}

/* ============================ MARQUEE ============================ */
function Marquee() {
  const items = [
    "MORE THAN MERCH · IT'S A MOVEMENT",
    "SCAN IT · TAP IT · SHARE IT",
    "SHOP SMALL · EARN BIG",
    "ONE ACCOUNT · EVERY STOREFRONT",
    "YOUR MERCH CAN DO MORE",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-[3px] border-ink bg-ink py-3 text-cream">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="font-display text-lg tracking-wide text-cream/90">
            {t} <span className="text-pink">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================ STATS ============================ */
function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLATFORM_STATS.map((s) => (
          <div key={s.label} className="rounded-2xl bg-paper p-5 text-center pop">
            <div className="text-3xl">{s.icon}</div>
            <div className="mt-1 font-display text-3xl">{s.value}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================ SHOP LOCAL ============================ */
function ShopLocal() {
  return (
    <Section id="shop-local" bg="bg-purple-soft">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-purple">Shop Local. Earn Everywhere.</p>
          <h2 className="mt-2 text-4xl">One rewards account. <span className="text-purple">Every storefront.</span></h2>
          <p className="mt-4 max-w-lg text-lg text-ink-soft">
            Shop merch from taco spots, groomers, contractors, realtors, creators and community
            events — all inside Mind Ya Biz. Every purchase, referral, review, and scan stacks
            points in the <b className="text-ink">same rewards account.</b>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Purchases", "Referrals", "Reviews", "Events", "Challenges", "Scans & Taps"].map((t) => (
              <span key={t} className="sticker">⭐ {t}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {STOREFRONTS.slice(0, 4).map((s, i) => (
            <div key={s.slug} className={`rounded-2xl bg-paper p-4 pop ${i % 2 ? "translate-y-4" : ""}`}>
              <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: `linear-gradient(135deg, ${s.cover[0]}, ${s.cover[1]})` }}>
                {s.logo}
              </div>
              <p className="mt-2 font-display text-lg leading-none">{s.name}</p>
              <p className="text-[11px] font-bold text-ink-soft">{s.category}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ============================ MOVEMENT ============================ */
function Movement() {
  const tiers = [
    { name: "Bronze", range: "0–999", color: "#c98a4b" },
    { name: "Silver", range: "1k–2.4k", color: "#9aa3ad" },
    { name: "Gold", range: "2.5k–4.9k", color: "#ffd21e" },
    { name: "Platinum", range: "5k+", color: "#10bfb2" },
  ];
  return (
    <Section id="movement">
      <div className="text-center">
        <p className="eyebrow text-pink">Meet The Movement</p>
        <h2 className="mt-2 text-4xl">The loyalty program that <span className="text-pink">actually moves.</span></h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-soft">
          Earn points through purchases, referrals, reviews, events, challenges and everyday
          engagement. Climb tiers. Unlock rewards. Support your community while you're at it.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl bg-paper p-5 text-center pop">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full text-2xl" style={{ background: t.color }}>
              🏅
            </div>
            <p className="mt-2 font-display text-2xl">{t.name}</p>
            <p className="text-xs font-bold text-ink-soft">{t.range} pts</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: "🛍️", t: "Every $1 spent", p: "1 pt" },
          { i: "🧑‍🤝‍🧑", t: "Refer a friend", p: "500 pts" },
          { i: "⭐", t: "Leave a review", p: "50 pts" },
          { i: "🎂", t: "Birthday reward", p: "250 pts" },
        ].map((r) => (
          <div key={r.t} className="flex items-center gap-3 rounded-2xl bg-cream-deep p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-xl pop">{r.i}</span>
            <div>
              <p className="text-sm font-extrabold leading-tight">{r.t}</p>
              <p className="text-xs font-bold text-teal">+{r.p}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================ WEAR IT FORWARD ============================ */
function WearItForward() {
  return (
    <Section bg="bg-ink" className="text-cream">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-teal">Meet Wear It Forward</p>
          <h2 className="mt-2 text-4xl text-cream">Your merch, but it <span className="text-teal">talks back.</span></h2>
          <p className="mt-4 max-w-lg text-lg text-cream/80">
            Add a QR code, NFC tag, or both to eligible merch. When someone scans your shirt or taps
            your tote, they land on a destination you choose — and you earn rewards for the assist.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { i: "👕", t: "Add a tag", d: "QR, NFC, or both on eligible merch." },
              { i: "📲", t: "Someone taps", d: "They reach your chosen destination." },
              { i: "⭐", t: "You earn", d: "Points, referral credit & badges." },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border-2 border-cream/15 bg-white/5 p-4">
                <div className="text-2xl">{s.i}</div>
                <p className="mt-1 font-display text-lg text-cream">{s.t}</p>
                <p className="text-xs text-cream/70">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Btn href="#" variant="teal">Explore Wear It Forward →</Btn>
          </div>
        </div>

        <div className="relative mx-auto h-80 w-full max-w-sm">
          <div className="absolute left-6 top-6 grid h-56 w-44 place-items-center rounded-3xl bg-linear-to-br from-pink to-purple pop-lg">
            <span className="text-7xl">👕</span>
            <span className="absolute bottom-4 right-4 grid h-14 w-14 place-items-center rounded-lg bg-white text-3xl">🔳</span>
          </div>
          <div className="animate-float absolute bottom-6 right-2 w-48 rounded-2xl bg-cream p-3 text-ink pop">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft">Scan opened</p>
            <p className="font-display text-lg">Taco Alley Menu</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-ink-soft">📍 Chicago</span>
              <span className="rounded-full bg-teal px-2 py-0.5 text-xs font-extrabold">+50 pts</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============================ SCAN OPENS ============================ */
function ScanOpens() {
  return (
    <Section>
      <div className="text-center">
        <p className="eyebrow text-blue">What Can a Scan Open?</p>
        <h2 className="mt-2 text-4xl">One tag. <span className="text-blue">Endless destinations.</span></h2>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SCAN_DESTINATIONS.map((d) => (
          <div key={d.label} className="rounded-2xl bg-paper p-4 text-center pop pop-hover">
            <div className="text-3xl">{d.icon}</div>
            <p className="mt-2 text-xs font-extrabold leading-tight">{d.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================ BUSINESS TYPES ============================ */
function BusinessTypes() {
  const all = [
    "Restaurants", "Salons", "Contractors", "Realtors", "Artists", "Coaches", "Food trucks",
    "Nonprofits", "Community groups", "Vendors", "Events", "Schools", "Sports teams", "Creators",
  ];
  const colors = ["bg-pink text-white", "bg-purple text-white", "bg-orange text-white", "bg-blue text-white", "bg-yellow text-ink", "bg-white text-ink"];
  return (
    <Section bg="bg-teal-soft">
      <div className="text-center">
        <p className="eyebrow text-teal">Built for Every Kind of Business</p>
        <h2 className="mt-2 text-4xl">If you've got a crew, <span className="text-teal">you've got merch.</span></h2>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {all.map((t, i) => (
          <span key={t} className={`rounded-full px-5 py-2.5 text-base font-extrabold pop ${colors[i % colors.length]}`}>
            {t}
          </span>
        ))}
      </div>
    </Section>
  );
}

/* ============================ FEATURED STORES ============================ */
function FeaturedStores() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-orange">Featured Storefronts</p>
          <h2 className="mt-2 text-4xl">Your favorite local spots, <span className="text-orange">all in one place.</span></h2>
        </div>
        <Btn href="/storefronts" variant="ink">Browse all storefronts →</Btn>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STOREFRONTS.map((s) => (
          <StoreCard key={s.slug} store={s} />
        ))}
      </div>
    </Section>
  );
}

/* ============================ HOW IT WORKS ============================ */
function HowItWorks() {
  const steps = [
    { n: 1, i: "🎨", t: "Choose a business or design", d: "Browse storefronts or start from a design you love." },
    { n: 2, i: "🛠️", t: "Customize or buy the merch", d: "Pick colors, add your logo, or grab it as-is." },
    { n: 3, i: "⭐", t: "Earn rewards", d: "Points for purchases, reviews, referrals & engagement." },
    { n: 4, i: "📲", t: "Share & earn more", d: "Scan or tap your QR / NFC merch and stack points." },
  ];
  return (
    <Section id="how" bg="bg-blue-soft">
      <div className="text-center">
        <p className="eyebrow text-blue">How It Works</p>
        <h2 className="mt-2 text-4xl">Four steps. <span className="text-blue">Zero headaches.</span></h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="relative rounded-2xl bg-paper p-5 pop">
            <span className="absolute -top-4 -left-3 grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-lg text-cream">
              {s.n}
            </span>
            <div className="text-4xl">{s.i}</div>
            <p className="mt-2 font-display text-xl leading-tight">{s.t}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================ CREATE STORE ============================ */
function CreateStore() {
  const perks = [
    "Custom designs", "No tech skills needed", "We handle the creative setup",
    "Your own branded storefront", "Sales reporting", "Loyalty program access",
    "Interactive QR & NFC merch", "Event-ready products", "Community exposure",
  ];
  return (
    <Section id="create-store" bg="bg-ink" className="text-cream">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow text-yellow">Create Your Own Store</p>
          <h2 className="mt-2 text-4xl text-cream">We build the merch line. <span className="text-yellow">You run the movement.</span></h2>
          <p className="mt-4 max-w-lg text-lg text-cream/80">
            Mind Ya Biz designs your custom merchandise and launches your own branded storefront —
            with rewards, referrals, and interactive QR + NFC merch baked in. You focus on your
            business; we handle the creative and the tech.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm font-bold text-cream/90">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-teal text-ink">✓</span>
                {p}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn href="#" variant="pink">🚀 Apply for a storefront</Btn>
            <Btn href="#" variant="white">See pricing</Btn>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-cream/15 bg-white/5 p-6">
          <p className="font-display text-2xl text-cream">Built by Mind Ya Biz</p>
          <p className="mt-1 text-sm text-cream/70">Everything your storefront ships with:</p>
          <div className="mt-4 space-y-3">
            {[
              { i: "🏪", t: "Branded storefront page" },
              { i: "📦", t: "Custom product catalog" },
              { i: "⭐", t: "The Movement rewards" },
              { i: "📲", t: "Wear It Forward QR / NFC" },
              { i: "📊", t: "Sales & engagement analytics" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-3 rounded-2xl bg-cream p-3 text-ink">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream-deep text-xl">{r.i}</span>
                <p className="text-sm font-extrabold">{r.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============================ FINAL CTA ============================ */
function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-purple via-pink to-orange p-8 text-center text-white pop-lg lg:p-14">
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-none text-white">
          More than merch. It's a movement.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-white/90">
          Join The Movement, shop your community, and turn what you wear into what you earn.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Btn href="/storefronts" variant="white">🛍️ Shop Merch</Btn>
          <Btn href="#movement" variant="ink">⭐ Join The Movement</Btn>
        </div>
      </div>
    </section>
  );
}

/* ---------- section wrapper ---------- */
function Section({
  children,
  id,
  bg,
  className = "",
}: {
  children: React.ReactNode;
  id?: string;
  bg?: string;
  className?: string;
}) {
  return (
    <section id={id} className={bg ?? ""}>
      <div className={`mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-16 ${className}`}>{children}</div>
    </section>
  );
}
