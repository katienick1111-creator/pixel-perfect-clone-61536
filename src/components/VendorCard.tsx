import { MapPin, Clock, Sparkles, Heart, CreditCard, Banknote, Smartphone } from "lucide-react";
import type { Payment, Vendor } from "@/data/trovin";

const paymentIcon: Record<Payment, typeof CreditCard> = {
  Card: CreditCard,
  Cash: Banknote,
  Venmo: Smartphone,
};

export function VendorCard({
  vendor,
  following,
  onToggle,
}: {
  vendor: Vendor;
  following: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      style={{ transform: `rotate(${vendor.tilt}deg)` }}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-brand-sm transition duration-300 hover:!rotate-0 hover:-translate-y-1 hover:shadow-brand-lg"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          width={800}
          height={640}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/20 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-brand-sm">
          {vendor.category}
        </span>
        {vendor.featured && (
          <span className="absolute right-3 top-3 inline-flex -rotate-3 items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-brand-md">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
        {vendor.scribble && (
          <span className="absolute -right-1 bottom-12 -rotate-6 rounded-sm bg-cream/95 px-2 py-0.5 font-script text-base text-teal shadow-brand-sm">
            {vendor.scribble}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="font-display text-xl leading-tight text-cream drop-shadow">
            {vendor.name}
          </p>
        </div>
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
