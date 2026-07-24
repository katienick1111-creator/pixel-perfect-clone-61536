import Link from "next/link";
import type { Product, Storefront } from "@/lib/demo-data";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft">
      <span aria-hidden>⭐</span>
      {rating.toFixed(1)}
      {reviews != null && <span className="font-medium text-ink-soft/70">({reviews})</span>}
    </span>
  );
}

export function PointsPill({ points }: { points: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow px-2.5 py-1 text-xs font-extrabold text-ink">
      <span aria-hidden>⭐</span> +{points.toLocaleString()} pts
    </span>
  );
}

export function WifBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
      <span aria-hidden>📲</span> Wear It Forward
    </span>
  );
}

export function StoreCard({ store }: { store: Storefront }) {
  return (
    <Link
      href={`/store/${store.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-paper pop pop-hover"
    >
      <div
        className="relative h-28 w-full"
        style={{ background: `linear-gradient(135deg, ${store.cover[0]}, ${store.cover[1]})` }}
      >
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-extrabold">
            {store.categoryIcon} {store.category}
          </span>
          {store.bonusEvent && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-extrabold text-yellow">
              ⚡ Bonus points
            </span>
          )}
        </div>
        <span className="absolute -bottom-6 left-4 grid h-14 w-14 place-items-center rounded-2xl border-[3px] border-ink bg-white text-2xl">
          {store.logo}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-8">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl">{store.name}</h3>
          <Stars rating={store.rating} reviews={store.reviews} />
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{store.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="sticker">🛍️ {store.productCount} products</span>
          <span className="sticker" style={{ background: "var(--color-yellow)" }}>⭐ Rewards</span>
          {store.wearItForward && <WifBadge />}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-ink-soft">📍 {store.location}</span>
          <span className="rounded-full bg-ink px-4 py-1.5 text-sm font-extrabold text-cream transition group-hover:bg-purple">
            Shop →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-paper pop pop-hover"
    >
      <div
        className="relative grid aspect-square place-items-center"
        style={{ background: `linear-gradient(150deg, ${product.cover[0]}, ${product.cover[1]})` }}
      >
        <span className="text-6xl drop-shadow-[3px_4px_0_rgba(0,0,0,0.15)]">{product.emoji}</span>
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-extrabold uppercase">
          {product.type}
        </span>
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          {product.isNew && (
            <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-extrabold text-white">NEW</span>
          )}
          {product.wearItForward && (
            <span className="rounded-full bg-purple px-2 py-0.5 text-[10px] font-extrabold text-white">📲 WIF</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-display text-base leading-tight">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-ink-soft">
          <span aria-hidden>🏪</span> {storeName(product.store)}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl">${product.price}</span>
          <PointsPill points={product.points} />
        </div>
      </div>
    </Link>
  );
}

function storeName(slug: string) {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
