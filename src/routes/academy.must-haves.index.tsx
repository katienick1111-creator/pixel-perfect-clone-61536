import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, Share2, ExternalLink, Search, Star, Sparkles, Award } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/academy/must-haves/")({
  head: () => ({
    meta: [
      { title: "Vendor Must-Haves — Trovin Academy" },
      {
        name: "description",
        content:
          "A curated library of the gear, displays, tech, and supplies vendors actually trust — searchable by category, price, and vendor type.",
      },
    ],
  }),
  component: MustHavesIndex,
});

type Category = {
  id: string;
  slug: string;
  title: string;
  group_name: string;
  sort_order: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_slug: string;
  short_description: string | null;
  best_for: string[];
  price_min: number | null;
  price_max: number | null;
  price_display: string | null;
  image_url: string | null;
  purchase_url: string | null;
  affiliate_url: string | null;
  is_featured: boolean;
  is_staff_pick: boolean;
  is_trovin_recommended: boolean;
  rating: number | null;
  rating_count: number;
  popularity: number;
};

const PRICE_FILTERS = [
  { id: "under-25", label: "Under $25", test: (p: Product) => (p.price_max ?? p.price_min ?? Infinity) < 25 },
  { id: "under-50", label: "Under $50", test: (p: Product) => (p.price_max ?? p.price_min ?? Infinity) < 50 },
  { id: "under-100", label: "Under $100", test: (p: Product) => (p.price_max ?? p.price_min ?? Infinity) < 100 },
  { id: "premium", label: "Premium", test: (p: Product) => (p.price_min ?? 0) >= 100 },
];

const VENDOR_FILTERS = ["Food Vendors", "Craft Vendors", "Boutique Vendors", "Jewelry Vendors", "Farmers Markets"];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "popular", label: "Most Popular" },
  { id: "rated", label: "Highest Rated" },
  { id: "favorites", label: "Community Favorites" },
];

function MustHavesIndex() {
  const { user } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [vendorFilter, setVendorFilter] = useState<string>("");
  const [sort, setSort] = useState<string>("featured");

  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([
        supabase.from("academy_musthave_categories").select("*").order("group_name").order("sort_order"),
        supabase.from("academy_musthave_products").select("*").order("is_featured", { ascending: false }).order("popularity", { ascending: false }),
      ]);
      setCats((c.data as Category[]) ?? []);
      setProducts((p.data as Product[]) ?? []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!user) { setFavorites(new Set()); return; }
    supabase
      .from("academy_musthave_favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavorites(new Set((data ?? []).map((r) => r.product_id)));
      });
  }, [user]);

  const grouped = useMemo(() => {
    const map = new Map<string, Category[]>();
    cats.forEach((c) => {
      if (!map.has(c.group_name)) map.set(c.group_name, []);
      map.get(c.group_name)!.push(c);
    });
    return map;
  }, [cats]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = products.filter((p) => {
      if (activeCat !== "all" && p.category_slug !== activeCat) return false;
      if (q) {
        const hay = [p.name, p.brand ?? "", p.category_slug].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (priceFilter) {
        const f = PRICE_FILTERS.find((x) => x.id === priceFilter);
        if (f && !f.test(p)) return false;
      }
      if (vendorFilter && !p.best_for.includes(vendorFilter)) return false;
      return true;
    });
    if (sort === "popular") arr = [...arr].sort((a, b) => b.popularity - a.popularity);
    else if (sort === "rated") arr = [...arr].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sort === "favorites") arr = [...arr].sort((a, b) => b.rating_count - a.rating_count);
    return arr;
  }, [products, query, activeCat, priceFilter, vendorFilter, sort]);

  const toggleFav = async (p: Product) => {
    if (!user) return;
    const next = new Set(favorites);
    if (next.has(p.id)) {
      next.delete(p.id);
      setFavorites(next);
      await supabase.from("academy_musthave_favorites").delete().eq("user_id", user.id).eq("product_id", p.id);
    } else {
      next.add(p.id);
      setFavorites(next);
      await supabase.from("academy_musthave_favorites").insert({ user_id: user.id, product_id: p.id });
    }
  };

  const share = async (p: Product) => {
    const url = `${window.location.origin}/academy/must-haves/${p.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url });
      else { await navigator.clipboard.writeText(url); alert("Link copied"); }
    } catch {}
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="vendor must-haves"
        title="Gear vendors actually trust."
        description="A curated, vendor-tested library of canopies, displays, payments, lighting, and supplies. Updated by the Trovin team — no sponsored fluff."
        actions={
          <Link to="/academy/admin/must-haves" className="ac-btn text-xs">+ Add a product</Link>
        }
      />

      {/* Search + filters */}
      <div className="ac-card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, brand, or category"
              className="ac-input w-full pl-9"
            />
          </div>
          <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="ac-input w-40">
            <option value="">Any price</option>
            {PRICE_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} className="ac-input w-44">
            <option value="">Any vendor type</option>
            {VENDOR_FILTERS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="ac-input w-44">
            {SORT_OPTIONS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Category sidebar */}
        <aside className="ac-no-print">
          <button
            onClick={() => setActiveCat("all")}
            className={`mb-2 w-full rounded-sm px-3 py-2 text-left text-sm ${activeCat === "all" ? "bg-[var(--ac-ink)] text-[var(--ac-paper)]" : "hover:bg-[var(--ac-cream-deep)]"}`}
          >
            All categories <span className="ml-1 text-xs opacity-60">({products.length})</span>
          </button>
          {[...grouped.entries()].map(([group, list]) => (
            <div key={group} className="mt-5">
              <p className="ac-eyebrow mb-2">{group}</p>
              <ul className="space-y-0.5">
                {list.map((c) => {
                  const count = products.filter((p) => p.category_slug === c.slug).length;
                  return (
                    <li key={c.slug}>
                      <button
                        onClick={() => setActiveCat(c.slug)}
                        className={`w-full truncate rounded-sm px-2 py-1.5 text-left text-xs ${activeCat === c.slug ? "bg-[var(--ac-ink)] text-[var(--ac-paper)]" : "text-[var(--ac-ink-soft)] hover:bg-[var(--ac-cream-deep)]"}`}
                      >
                        {c.title} <span className="opacity-50">({count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        {/* Product grid */}
        <div>
          {loading ? (
            <p className="text-sm text-[var(--ac-ink-mute)]">Loading library…</p>
          ) : filtered.length === 0 ? (
            <div className="ac-card flex flex-col items-center gap-3 p-12 text-center">
              <Sparkles className="h-8 w-8 text-[var(--ac-terracotta)]" />
              <p className="font-serif text-lg italic">No products yet in this view.</p>
              <p className="max-w-md text-sm text-[var(--ac-ink-soft)]">
                Vendors and admins can add products to the library.
              </p>
              <Link to="/academy/admin/must-haves" className="ac-btn mt-2 text-xs">+ Add a product</Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <article key={p.id} className="ac-card group flex flex-col overflow-hidden p-0">
                  <Link to="/academy/must-haves/$slug" params={{ slug: p.slug }} className="block aspect-[4/3] overflow-hidden bg-[var(--ac-cream-deep)]">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[var(--ac-ink-mute)]">No image</div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-2">
                      {p.is_trovin_recommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ac-forest)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                          <Award className="h-2.5 w-2.5" /> Trovin
                        </span>
                      )}
                      {p.is_staff_pick && (
                        <span className="rounded-full bg-[var(--ac-terracotta)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">Staff pick</span>
                      )}
                      {p.is_featured && (
                        <span className="rounded-full border border-[var(--ac-rule)] px-2 py-0.5 text-[9px] uppercase tracking-widest text-[var(--ac-ink-soft)]">Featured</span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-lg leading-tight">
                      <Link to="/academy/must-haves/$slug" params={{ slug: p.slug }} className="hover:underline">
                        {p.name}
                      </Link>
                    </h3>
                    {p.brand && <p className="text-xs text-[var(--ac-ink-mute)]">{p.brand}</p>}
                    {p.short_description && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--ac-ink-soft)]">{p.short_description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.best_for.slice(0, 3).map((b) => (
                        <span key={b} className="rounded-full bg-[var(--ac-cream-deep)] px-2 py-0.5 text-[10px] text-[var(--ac-ink-soft)]">{b}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div>
                        <p className="font-serif text-base">
                          {p.price_display ?? formatPrice(p.price_min, p.price_max)}
                        </p>
                        {p.rating != null && (
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--ac-ink-mute)]">
                            <Star className="h-3 w-3 fill-current text-[var(--ac-terracotta)]" /> {p.rating.toFixed(1)} ({p.rating_count})
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleFav(p)} title="Favorite" className="rounded-full p-2 hover:bg-[var(--ac-cream-deep)]">
                          <Heart className={`h-4 w-4 ${favorites.has(p.id) ? "fill-[var(--ac-terracotta)] text-[var(--ac-terracotta)]" : ""}`} />
                        </button>
                        <button onClick={() => share(p)} title="Share" className="rounded-full p-2 hover:bg-[var(--ac-cream-deep)]">
                          <Share2 className="h-4 w-4" />
                        </button>
                        {(p.affiliate_url || p.purchase_url) && (
                          <a
                            href={p.affiliate_url || p.purchase_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="ac-btn-ghost !px-2 !py-1.5 text-[11px]"
                          >
                            Buy <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatPrice(min: number | null, max: number | null) {
  if (min == null && max == null) return "—";
  if (min != null && max != null && min !== max) return `$${min}–$${max}`;
  return `$${min ?? max}`;
}
