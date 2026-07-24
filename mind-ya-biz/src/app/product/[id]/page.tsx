import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getStorefront, productsByStore, PRODUCTS } from "@/lib/demo-data";
import { ProductCard, Stars, WifBadge } from "@/components/cards";
import BuyBox from "@/components/BuyBox";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const store = getStorefront(product.store)!;
  const more = productsByStore(product.store).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-sm font-bold text-ink-soft">
        <Link href="/storefronts" className="hover:text-ink">Storefronts</Link>
        <span>/</span>
        <Link href={`/store/${store.slug}`} className="hover:text-ink">{store.name}</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* gallery */}
        <div>
          <div
            className="relative grid aspect-square place-items-center rounded-3xl pop-lg"
            style={{ background: `linear-gradient(150deg, ${product.cover[0]}, ${product.cover[1]})` }}
          >
            <span className="text-[9rem] drop-shadow-[4px_6px_0_rgba(0,0,0,0.18)]">{product.emoji}</span>
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold uppercase">{product.type}</span>
            {product.wearItForward && <span className="absolute right-4 top-4"><WifBadge /></span>}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid aspect-square place-items-center rounded-xl border-2 border-ink text-2xl"
                style={{ background: `linear-gradient(${120 + i * 40}deg, ${product.cover[i % 2]}, ${product.cover[(i + 1) % 2]})` }}
              >
                {product.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* details */}
        <div>
          <Link href={`/store/${store.slug}`} className="inline-flex items-center gap-2 rounded-full bg-cream-deep px-3 py-1.5 text-sm font-extrabold pop-hover">
            <span className="text-lg">{store.logo}</span> {store.name}
          </Link>
          <h1 className="mt-3 font-display text-4xl leading-none lg:text-5xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Stars rating={product.rating} reviews={product.reviews} />
            <span className="font-display text-3xl">${product.price}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 text-sm font-extrabold">⭐ +{product.points} pts</span>
          </div>
          <p className="mt-4 text-lg text-ink-soft">{product.description}</p>

          <div className="mt-6">
            <BuyBox product={product} />
          </div>
        </div>
      </div>

      {/* more from store */}
      {more.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl">More from {store.name}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {more.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
