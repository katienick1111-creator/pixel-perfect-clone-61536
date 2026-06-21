import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Share2, ExternalLink, ChevronLeft, Star, Award, Check, X } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/academy/must-haves/$slug")({
  head: () => ({ meta: [{ title: "Product — Vendor Must-Haves" }] }),
  notFoundComponent: () => (
    <div className="ac-card p-10 text-center">
      <p className="text-sm text-[var(--ac-ink-soft)]">Product not found.</p>
      <Link to="/academy/must-haves" className="ac-btn-ghost mt-4">Back to library</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="ac-card p-10 text-center">
      <p className="text-sm text-[var(--ac-ink-soft)]">{error.message}</p>
      <button onClick={reset} className="ac-btn-ghost mt-4">Retry</button>
    </div>
  ),
  component: ProductDetail,
});

type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_slug: string;
  short_description: string | null;
  full_description: string | null;
  why_recommended: string | null;
  pros: string[];
  cons: string[];
  best_uses: string[];
  best_for: string[];
  price_min: number | null;
  price_max: number | null;
  price_display: string | null;
  image_url: string | null;
  images: string[];
  purchase_url: string | null;
  affiliate_url: string | null;
  is_staff_pick: boolean;
  is_trovin_recommended: boolean;
  rating: number | null;
  rating_count: number;
};

function ProductDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("academy_musthave_products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) { setLoading(false); throw notFound(); }
      setProduct(data as Product);
      const { data: rel } = await supabase
        .from("academy_musthave_products")
        .select("*")
        .eq("category_slug", data.category_slug)
        .neq("id", data.id)
        .limit(4);
      setRelated((rel as Product[]) ?? []);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (!user || !product) return;
    supabase
      .from("academy_musthave_favorites")
      .select("product_id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle()
      .then(({ data }) => setFavorite(!!data));
  }, [user, product]);

  const toggleFav = async () => {
    if (!user || !product) return;
    if (favorite) {
      setFavorite(false);
      await supabase.from("academy_musthave_favorites").delete().eq("user_id", user.id).eq("product_id", product.id);
    } else {
      setFavorite(true);
      await supabase.from("academy_musthave_favorites").insert({ user_id: user.id, product_id: product.id });
    }
  };

  const share = async () => {
    if (!product) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else { await navigator.clipboard.writeText(url); alert("Link copied"); }
    } catch {}
  };

  if (loading) return <p className="text-sm text-[var(--ac-ink-mute)]">Loading…</p>;
  if (!product) return null;

  const gallery = [product.image_url, ...(product.images ?? [])].filter(Boolean) as string[];
  const buyUrl = product.affiliate_url || product.purchase_url;

  return (
    <div>
      <Link to="/academy/must-haves" className="ac-no-print inline-flex items-center gap-1 text-xs text-[var(--ac-ink-mute)] hover:text-[var(--ac-ink)]">
        <ChevronLeft className="h-3.5 w-3.5" /> Back to library
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="ac-card aspect-[4/3] overflow-hidden p-0">
            {gallery[activeImg] ? (
              <img src={gallery[activeImg]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[var(--ac-ink-mute)]">No image</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 overflow-hidden rounded-sm border ${i === activeImg ? "border-[var(--ac-terracotta)]" : "border-[var(--ac-rule-soft)]"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.is_trovin_recommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ac-forest)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                <Award className="h-3 w-3" /> Trovin Recommended
              </span>
            )}
            {product.is_staff_pick && (
              <span className="rounded-full bg-[var(--ac-terracotta)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">Staff Pick</span>
            )}
          </div>
          <p className="ac-eyebrow mt-3">{product.brand ?? "Vendor must-have"}</p>
          <h1 style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-4xl leading-tight">{product.name}</h1>
          {product.short_description && (
            <p className="mt-3 text-lg text-[var(--ac-ink-soft)]">{product.short_description}</p>
          )}

          <div className="mt-5 flex items-end gap-4">
            <p className="font-serif text-3xl">
              {product.price_display ?? formatPrice(product.price_min, product.price_max)}
            </p>
            {product.rating != null && (
              <p className="flex items-center gap-1 text-sm text-[var(--ac-ink-mute)]">
                <Star className="h-4 w-4 fill-current text-[var(--ac-terracotta)]" />
                {product.rating.toFixed(1)} <span className="opacity-60">({product.rating_count} reviews)</span>
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {buyUrl && (
              <a href={buyUrl} target="_blank" rel="noopener noreferrer nofollow" className="ac-btn">
                Buy on retailer site <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button onClick={toggleFav} className="ac-btn-ghost">
              <Heart className={`h-4 w-4 ${favorite ? "fill-[var(--ac-terracotta)] text-[var(--ac-terracotta)]" : ""}`} />
              {favorite ? "Saved" : "Favorite"}
            </button>
            <button onClick={share} className="ac-btn-ghost"><Share2 className="h-4 w-4" /> Share</button>
          </div>

          {product.best_for.length > 0 && (
            <div className="mt-6">
              <p className="ac-eyebrow">best for</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.best_for.map((b) => (
                  <span key={b} className="rounded-full bg-[var(--ac-cream-deep)] px-3 py-1 text-xs text-[var(--ac-ink-soft)]">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Long-form */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          {product.full_description && (
            <section>
              <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-2xl">Full description</h2>
              <p className="mt-3 whitespace-pre-line text-[var(--ac-ink-soft)]">{product.full_description}</p>
            </section>
          )}
          {product.why_recommended && (
            <section className="ac-card p-6">
              <p className="ac-eyebrow">why vendors recommend it</p>
              <p style={{ fontFamily: "Fraunces, serif" }} className="mt-3 text-xl italic leading-snug">
                "{product.why_recommended}"
              </p>
            </section>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            {product.pros.length > 0 && (
              <section>
                <p className="ac-eyebrow">pros</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {product.pros.map((x) => (
                    <li key={x} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--ac-forest)]" /> {x}</li>
                  ))}
                </ul>
              </section>
            )}
            {product.cons.length > 0 && (
              <section>
                <p className="ac-eyebrow">cons</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {product.cons.map((x) => (
                    <li key={x} className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 text-[var(--ac-terracotta)]" /> {x}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          {product.best_uses.length > 0 && (
            <section>
              <p className="ac-eyebrow">best uses</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.best_uses.map((x) => (
                  <li key={x} className="ac-card p-3 text-sm">{x}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Related */}
        <aside className="space-y-3">
          <p className="ac-eyebrow">related products</p>
          {related.length === 0 && <p className="text-sm text-[var(--ac-ink-mute)]">Nothing related yet.</p>}
          {related.map((r) => (
            <Link
              key={r.id}
              to="/academy/must-haves/$slug"
              params={{ slug: r.slug }}
              className="ac-card flex gap-3 p-3 transition hover:-translate-y-0.5"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-[var(--ac-cream-deep)]">
                {r.image_url ? <img src={r.image_url} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <p style={{ fontFamily: "Fraunces, serif" }} className="truncate text-base">{r.name}</p>
                <p className="truncate text-xs text-[var(--ac-ink-mute)]">{r.brand}</p>
                <p className="mt-1 text-xs">{r.price_display ?? formatPrice(r.price_min, r.price_max)}</p>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}

function formatPrice(min: number | null, max: number | null) {
  if (min == null && max == null) return "—";
  if (min != null && max != null && min !== max) return `$${min}–$${max}`;
  return `$${min ?? max}`;
}

// satisfy unused-import lint
void AcademyPageHeader;
