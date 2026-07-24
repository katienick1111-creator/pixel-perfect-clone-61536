import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefront, productsByStore, STOREFRONTS } from "@/lib/demo-data";
import { ProductCard, Stars, WifBadge } from "@/components/cards";

export function generateStaticParams() {
  return STOREFRONTS.map((s) => ({ slug: s.slug }));
}

const REVIEWS = [
  { name: "Marcus T.", stars: 5, text: "Quality is unreal and the scan-for-a-freebie thing is genius. Everyone asks about my shirt." },
  { name: "Priya N.", stars: 5, text: "Ordered for my whole crew. Fast, easy, and the points added up quick." },
  { name: "Dee W.", stars: 4, text: "Love repping a local spot. Tote is thick and the tap-to-menu is a nice touch." },
];

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getStorefront(slug);
  if (!store) notFound();

  const products = productsByStore(slug);
  const featured = products.filter((p) => p.featured);
  const fresh = products.filter((p) => p.isNew);
  const favs = products.filter((p) => p.favorite);

  return (
    <main>
      {/* cover */}
      <div className="relative h-40 w-full lg:h-52" style={{ background: `linear-gradient(135deg, ${store.cover[0]}, ${store.cover[1]})` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,rgba(255,255,255,0.25),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* identity */}
        <div className="relative z-10 mt-5 flex flex-col gap-4 rounded-3xl bg-paper p-5 pop-lg lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex items-start gap-4">
            <span className="-mt-16 grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-[3px] border-ink bg-white text-4xl shadow-[3px_3px_0_rgba(27,20,32,0.9)]">
              {store.logo}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl lg:text-4xl">{store.name}</h1>
                <span className="sticker">{store.categoryIcon} {store.category}</span>
              </div>
              <p className="mt-1 font-marker text-lg text-ink-soft">{store.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-ink-soft">
                <Stars rating={store.rating} reviews={store.reviews} />
                <span>📍 {store.location}</span>
                <a href="#" className="text-blue hover:underline">🌐 {store.website}</a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="#" className="rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-cream pop pop-hover">✉️ Contact</Link>
            <Link href="#" className="rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold pop-hover">♡ Follow +25 pts</Link>
          </div>
        </div>

        {/* badges + promo */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="sticker" style={{ background: "var(--color-yellow)" }}>⭐ Earns rewards</span>
          {store.wearItForward && <WifBadge />}
          {store.bonusEvent && (
            <span className="rounded-full bg-pink px-3 py-1 text-xs font-extrabold text-white">⚡ {store.bonusEvent}</span>
          )}
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-extrabold text-cream">🏷️ Built by Mind Ya Biz</span>
        </div>

        {store.promo && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink bg-teal-soft p-4">
            <span className="text-2xl">🎁</span>
            <p className="font-bold">Current promo: <span className="font-extrabold">{store.promo}</span></p>
          </div>
        )}

        {/* layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            {featured.length > 0 && <ProductSection title="🔥 Featured merch" products={featured} />}
            {fresh.length > 0 && <ProductSection title="✨ New this week" products={fresh} />}
            {favs.length > 0 && <ProductSection title="💛 Customer favorites" products={favs} />}
            <ProductSection title="🛍️ All products" products={products} />
          </div>

          {/* sidebar */}
          <aside className="space-y-5">
            <SideCard title="📲 Wear It Forward">
              <p className="text-sm text-ink-soft">
                Add a QR code or NFC tag to eligible {store.name} merch. When someone scans or taps
                it, they reach a destination this business chooses — and you earn rewards for the share.
              </p>
              <div className="mt-3 rounded-xl bg-cream-deep p-3 text-sm font-bold">
                {store.promo ?? "Interactive merch available on eligible products."}
              </div>
            </SideCard>

            <SideCard title="📖 Our story">
              <p className="text-sm text-ink-soft">{store.story}</p>
            </SideCard>

            {store.events && store.events.length > 0 && (
              <SideCard title="📅 Upcoming">
                <ul className="space-y-2">
                  {store.events.map((e) => (
                    <li key={e.title} className="flex items-center gap-3 rounded-xl bg-cream-deep p-2.5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white font-display text-sm pop">{e.date}</span>
                      <div>
                        <p className="text-sm font-extrabold leading-tight">{e.title}</p>
                        <p className="text-xs font-bold text-ink-soft">📍 {e.place}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </SideCard>
            )}

            <SideCard title="⭐ Reviews">
              <div className="space-y-3">
                {REVIEWS.map((r) => (
                  <div key={r.name} className="rounded-xl bg-cream-deep p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-extrabold">{r.name}</p>
                      <span className="text-xs">{"⭐".repeat(r.stars)}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{r.text}</p>
                  </div>
                ))}
              </div>
            </SideCard>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ProductSection({ title, products }: { title: string; products: ReturnType<typeof productsByStore> }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-paper p-5 pop">
      <h3 className="font-display text-lg">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}
