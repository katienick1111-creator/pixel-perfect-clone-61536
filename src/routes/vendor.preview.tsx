import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MapPin, Clock, Sparkles, Share2 } from "lucide-react";
import { useState } from "react";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { PaymentBrand, paymentLabel } from "@/components/PaymentBrand";
import {
  SocialBrand,
  socialMeta,
  socialUrl,
  type SocialKey,
} from "@/components/SocialBrand";

export const Route = createFileRoute("/vendor/preview")({
  head: () => ({
    meta: [{ title: "Preview your booth — Trovin'" }],
  }),
  component: VendorPreview,
});

function VendorPreview() {
  const { profile } = useVendorProfile();
  const [following, setFollowing] = useState(false);

  const socials = (Object.keys(socialMeta) as SocialKey[]).filter(
    (k) => (profile.socials?.[k] ?? "").trim().length > 0,
  );

  return (
    <div className="min-h-screen bg-cream text-navy">
      {/* sticky preview bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-navy text-cream">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2.5">
          <Link
            to="/vendor"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/85 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-navy">
            shopper preview
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-6">
        {/* hero card */}
        <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-brand-lg">
          <div className="relative aspect-[5/4] bg-cream-deep">
            <img
              src={profile.image}
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-brand-sm">
              {profile.category}
            </span>
            <span
              className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-brand-md ${
                profile.openToday
                  ? "bg-success text-cream"
                  : "bg-ink-mute text-cream"
              }`}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {profile.openToday ? "Open now" : "Closed"}
            </span>
            {profile.scribble && (
              <span className="absolute -right-1 bottom-12 -rotate-6 rounded-sm bg-cream/95 px-2 py-0.5 font-script text-lg text-teal shadow-brand-sm">
                {profile.scribble}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-script text-4xl leading-none text-cream drop-shadow">
                {profile.name}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <p className="font-hand text-xl leading-tight text-ink-soft">
              {profile.tagline}
            </p>

            <div className="grid gap-1.5 text-sm text-ink-soft">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal" />
                {profile.event} · {profile.booth}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal" />
                {profile.hours}
              </span>
            </div>

            {profile.note && (
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
                <p className="mt-1 font-hand text-lg leading-6">{profile.note}</p>
              </div>
            )}

            {/* payments */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                payments accepted
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {profile.payments.map((p) => (
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

            {/* socials */}
            {socials.length > 0 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  follow along
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {socials.map((k, i) => {
                    const value = profile.socials![k]!;
                    return (
                      <a
                        key={k}
                        href={socialUrl(k, value)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          transform: `rotate(${(i % 2 === 0 ? -1.5 : 1.5)}deg)`,
                        }}
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
                  following
                    ? "bg-teal text-cream"
                    : "bg-gold text-navy hover:bg-gold-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${following ? "fill-current" : ""}`} />
                {following ? "Following" : `Follow ${profile.name}`}
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
          This is exactly what shoppers see on your booth page.
        </p>
      </div>
    </div>
  );
}
