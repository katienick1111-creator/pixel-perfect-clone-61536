"use client";

import { useMemo, useState } from "react";
import { STOREFRONTS, CATEGORIES } from "@/lib/demo-data";
import { StoreCard } from "@/components/cards";

export default function StorefrontsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [wif, setWif] = useState(false);
  const [bonus, setBonus] = useState(false);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return STOREFRONTS.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (wif && !s.wearItForward) return false;
      if (bonus && !s.bonusEvent) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.location.toLowerCase().includes(query)
      );
    });
  }, [q, cat, wif, bonus]);

  const featured = results.filter((s) => s.featured);
  const fresh = results.filter((s) => s.isNew);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      {/* header */}
      <div className="rounded-3xl bg-linear-to-br from-purple to-pink p-6 text-white pop-lg lg:p-10">
        <span className="sticker" style={{ background: "var(--color-yellow)", color: "#1b1420" }}>🏪 The Directory</span>
        <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-none text-white">
          Shop local. <span className="text-yellow">Earn everywhere.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/90">
          Browse every participating storefront. One rewards account works across all of them.
        </p>
      </div>

      {/* search + filters */}
      <div className="sticky top-[70px] z-30 mt-6 rounded-2xl border-[3px] border-ink bg-cream/95 p-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-3 py-2.5">
          <span aria-hidden>🔎</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search businesses, categories, neighborhoods…"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink-soft/60"
          />
        </div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <Chip active={!cat} onClick={() => setCat(null)}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.label} active={cat === c.label} onClick={() => setCat(cat === c.label ? null : c.label)}>
              {c.icon} {c.label}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px shrink-0 bg-ink/20" />
          <Chip active={wif} onClick={() => setWif((v) => !v)} tone="purple">📲 Interactive merch</Chip>
          <Chip active={bonus} onClick={() => setBonus((v) => !v)} tone="pink">⚡ Bonus-point events</Chip>
        </div>
      </div>

      {/* featured rail */}
      {featured.length > 0 && !q && !cat && (
        <Rail title="⭐ Featured businesses" stores={featured} />
      )}
      {fresh.length > 0 && !q && !cat && <Rail title="✨ New storefronts" stores={fresh} />}

      {/* all results */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-2xl">
          {q || cat || wif || bonus ? "Results" : "All storefronts"}
        </h2>
        <span className="text-sm font-bold text-ink-soft">{results.length} found</span>
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/30 bg-paper p-12 text-center">
          <div className="text-4xl">🕵️</div>
          <p className="mt-2 font-display text-2xl">No storefronts match that.</p>
          <p className="text-sm text-ink-soft">Try clearing a filter or searching something broader.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      )}
    </main>
  );
}

function Rail({ title, stores }: { title: string; stores: typeof STOREFRONTS }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
        {stores.map((s) => (
          <div key={s.slug} className="w-[300px] shrink-0">
            <StoreCard store={s} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Chip({
  children,
  active,
  onClick,
  tone = "ink",
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  tone?: "ink" | "purple" | "pink";
}) {
  const activeCls = { ink: "bg-ink text-cream", purple: "bg-purple text-white", pink: "bg-pink text-white" }[tone];
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-extrabold transition ${
        active ? activeCls : "bg-white text-ink hover:bg-cream-deep"
      }`}
    >
      {children}
    </button>
  );
}
