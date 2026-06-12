import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin, Clock, Sparkles, Share2 } from "lucide-react";
import { useState } from "react";
import { vendors } from "@/data/trovin";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { PaymentBrand, paymentLabel } from "@/components/PaymentBrand";
import {
  SocialBrand,
  socialMeta,
  socialUrl,
  type SocialKey,
} from "@/components/SocialBrand";

export const Route = createFileRoute("/booth/$id")({
  head: ({ params }) => {
    const v = vendors.find((x) => x.id === params.id);
    const name = v?.name ?? "Booth";
    const tagline = v?.tagline ?? "A vendor on Trovin'.";
    const title = `${name} — Trovin'`.slice(0, 60);
    const desc = `${name} · ${v?.category ?? "vendor"} at ${v?.event ?? "Trovin'"}. ${tagline}`.slice(0, 160);
    const url = `https://pixel-perfect-clone-61536.lovable.app/booth/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        ...(v?.image ? [{ property: "og:image", content: v.image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: v
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: v.name,
                description: v.tagline,
                image: v.image,
                category: v.category,
                url,
              }),
            },
          ]
        : undefined,
    };
  },
  component: BoothPage,
});

function BoothPage() {
  const { id } = Route.useParams();
  const { profile } = useVendorProfile();
  const [following, setFollowing] = useState(false);

  // Resolve booth: "me" → vendor's own profile; otherwise seed vendor by id
  const seed = vendors.find((v) => v.id === id);
  const isMe = id === "me" || id === profile.id;

  const booth = isMe
    ? {
        name: profile.name,
        tagline: profile.tagline,
        category: profile.category,
        event: profile.event,
        booth: profile.booth,
        hours: profile.hours,
        payments: profile.payments,
        image: profile.image,
        scribble: profile.scribble,
        openToday: profile.openToday,
        note: profile.note,
        socials: profile.socials,
      }
    : seed
      ? {
          name: seed.name,
          tagline: seed.tagline,
          category: seed.category,
          event: seed.event,
          booth: seed.booth,
          hours: seed.hours,
          payments: seed.payments,
          image: seed.image,
          scribble: seed.scribble,
          openToday: true,
          note: `Stop by ${seed.booth} — ${seed.hours.toLowerCase()}.`,
          socials: {} as Record<SocialKey, string>,
        }
      : null;

  if (!booth) {
    return (
      <div className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-md px-4 py-12">
          <p className="font-script text-3xl text-teal">oh no —</p>
          <h1 className="mt-1 font-display text-3xl">Booth not found</h1>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-cream"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const socials = (Object.keys(socialMeta) as SocialKey[]).filter(
    (k) => ((booth.socials as any)?.[k] ?? "").trim().length > 0,
  );

  return (
    <div className="min-h-screen bg-cream text-navy">
      <div className="sticky top-0 z-30 border-b border-line bg-navy text-cream">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/85 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Trovin'
          </Link>
          <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-navy">
            shopper view
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-brand-lg">
          <div className="relative aspect-[5/4] bg-cream-deep">
            <img
              src={booth.image}
              alt={booth.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-brand-sm">
              {booth.category}
            </span>
            <span
              className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-brand-md ${
                booth.openToday ? "bg-success text-cream" : "bg-ink-mute text-cream"
              }`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {booth.openToday ? "Open now" : "Closed"}
            </span>
            {booth.scribble && (
              <span className="absolute -right-1 bottom-12 -rotate-6 rounded-sm bg-cream/95 px-2 py-0.5 font-script text-lg text-teal shadow-brand-sm">
                {booth.scribble}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h1 className="font-script text-4xl leading-none text-cream drop-shadow">
                {booth.name}
              </h1>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <p className="font-hand text-xl leading-tight text-ink-soft">
              {booth.tagline}
            </p>

            <div className="grid gap-1.5 text-sm text-ink-soft">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal" />
                {booth.event} · {booth.booth}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal" />
                {booth.hours}
              </span>
            </div>

            {booth.note && (
              <div
                className="relative rounded-md border border-line bg-cream-deep/60 p-3 pl-5 text-sm text-navy"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0 23px, rgba(10,118,116,0.18) 23px 24px)",
                  lineHeight: "24px",
                }}
              >
                <span className="pointer-events-none absolute left-3 top-0 bottom-0 w-px bg-danger/50" />
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-mute">
                  fresh drop
                </p>
                <p className="mt-1 font-hand text-lg leading-6">{booth.note}</p>
              </div>
            )}

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                payments accepted
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {booth.payments.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-navy"
                  >
                    <PaymentBrand brand={p} size={12} />
                    {paymentLabel[p as keyof typeof paymentLabel] ?? p}
                  </span>
                ))}
              </div>
            </div>

            {socials.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  follow along
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {socials.map((k, i) => {
                    const value = (booth.socials as any)[k]!;
                    return (
                      <a
                        key={k}
                        href={socialUrl(k, value)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}
                        className="group inline-flex items-center gap-2 rounded-full border-2 border-line bg-paper px-3 py-1.5 text-xs font-semibold text-navy shadow-brand-sm transition hover:-translate-y-0.5 hover:border-teal hover:shadow-brand-md"
                      >
                        <SocialBrand brand={k} size={16} />
                        <span className="font-hand text-sm">
                          {socialMeta[k].prefix}
                          {value.replace(/^@+/, "").replace(/^https?:\/\//, "")}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setFollowing((f) => !f)}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  following ? "bg-teal text-cream" : "bg-gold text-navy hover:bg-gold-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${following ? "fill-current" : ""}`} />
                {following ? "Following" : `Follow ${booth.name}`}
              </button>
              <button
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-line bg-paper text-navy hover:border-teal"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>

        <p className="mt-5 text-center text-xs text-ink-mute">
          <Sparkles className="mr-1 inline h-3 w-3 text-gold" />
          This is exactly what shoppers see on this booth's page.
        </p>
      </div>
    </div>
  );
}
