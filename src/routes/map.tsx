import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Navigation, Layers } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { events } from "@/data/trovin";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Trovin'" },
      {
        name: "description",
        content:
          "See every market, vendor, and pop-up plotted on a map of Chicago.",
      },
      { property: "og:title", content: "Map — Trovin'" },
      {
        property: "og:description",
        content: "Markets, vendors, and pop-ups plotted across Chicago.",
      },
    ],
    links: [{ rel: "canonical", href: "/map" }],
  }),
  component: MapPage,
});

function MapPage() {
  const [selected, setSelected] = useState(events[0].id);
  const active = events.find((e) => e.id === selected) ?? events[0];

  return (
    <AppShell>
      <PageHeader
        scribble="all the spots —"
        title="The map"
        subtitle="Tap a pin to peek the event. Hand-plotted, not auto-clustered."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Hand-drawn map surface */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-cream-deep shadow-brand-md">
          {/* sketched grid + river */}
          <svg
            viewBox="0 0 100 70"
            className="block h-[460px] w-full md:h-[560px]"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.3" fill="hsl(var(--ink-mute) / 0.35)" />
              </pattern>
            </defs>
            <rect width="100" height="70" fill="url(#dots)" />
            {/* lake */}
            <path
              d="M78 0 L100 0 L100 70 L82 70 Q74 50 80 30 Q86 12 78 0 Z"
              fill="hsl(var(--teal) / 0.18)"
              stroke="hsl(var(--teal) / 0.5)"
              strokeWidth="0.3"
              strokeDasharray="0.6 0.6"
            />
            {/* river */}
            <path
              d="M0 38 Q 25 36 40 44 T 78 50"
              fill="none"
              stroke="hsl(var(--teal) / 0.45)"
              strokeWidth="0.5"
              strokeDasharray="0.8 0.6"
            />
            {/* streets */}
            {[15, 28, 50, 62].map((y) => (
              <line
                key={y}
                x1="0"
                x2="78"
                y1={y}
                y2={y}
                stroke="hsl(var(--line))"
                strokeWidth="0.15"
              />
            ))}
            {[12, 30, 48, 66].map((x) => (
              <line
                key={x}
                y1="0"
                y2="70"
                x1={x}
                x2={x}
                stroke="hsl(var(--line))"
                strokeWidth="0.15"
              />
            ))}
            {/* neighborhood labels */}
            <text x="20" y="8" fontFamily="Caveat Brush" fontSize="3" fill="hsl(var(--ink-mute))">
              Logan Square
            </text>
            <text x="32" y="62" fontFamily="Caveat Brush" fontSize="3" fill="hsl(var(--ink-mute))">
              Pilsen
            </text>
            <text x="40" y="40" fontFamily="Caveat Brush" fontSize="3" fill="hsl(var(--ink-mute))">
              West Loop
            </text>
            <text x="85" y="36" fontFamily="Caveat Brush" fontSize="3.2" fill="hsl(var(--teal))">
              Lake
            </text>
          </svg>

          {/* pins */}
          {events.map((e) => {
            const isActive = e.id === active.id;
            return (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                style={{ left: `${e.x}%`, top: `${e.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-full"
              >
                <span
                  className={`relative block rounded-full px-3 py-1.5 font-script text-sm shadow-brand-md transition ${
                    isActive
                      ? "-rotate-3 bg-gold text-navy"
                      : "bg-paper text-navy hover:-rotate-2 hover:bg-cream"
                  }`}
                >
                  {e.name.split(" ")[0]}
                </span>
                <span
                  className={`mx-auto block h-3 w-3 -translate-y-1 rotate-45 ${
                    isActive ? "bg-gold" : "bg-paper"
                  } shadow-brand-sm`}
                />
              </button>
            );
          })}

          {/* corner controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-navy shadow-brand-md transition hover:bg-cream">
              <Navigation className="h-4 w-4" />
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-navy shadow-brand-md transition hover:bg-cream">
              <Layers className="h-4 w-4" />
            </button>
          </div>

          <span className="absolute bottom-3 left-4 -rotate-2 rounded-sm bg-cream/95 px-2 py-0.5 font-script text-sm text-teal shadow-brand-sm">
            hand-drawn, not generated
          </span>
        </div>

        {/* Selected event detail */}
        <aside className="rounded-2xl border border-line bg-paper p-5 shadow-brand-sm">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={active.image}
              alt={active.name}
              width={800}
              height={500}
              loading="lazy"
              className="h-40 w-full object-cover"
            />
            <span className="absolute left-3 top-3 -rotate-3 rounded-sm bg-gold/90 px-2 py-0.5 font-script text-sm text-navy shadow-brand-sm">
              {active.scribble ?? "tap a pin"}
            </span>
          </div>
          <h3 className="mt-4 font-display text-2xl leading-tight">
            {active.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin className="h-3.5 w-3.5 text-teal" />
            {active.neighborhood}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {active.date} • {active.hours}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {active.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-teal-200/40 px-2 py-0.5 text-[11px] font-semibold text-teal"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-display text-2xl leading-none text-navy">
                {active.vendorCount}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-ink-mute">
                vendors
              </p>
            </div>
            <div>
              <p className="font-display text-2xl leading-none text-navy">
                {(active.followers / 1000).toFixed(1)}k
              </p>
              <p className="text-[11px] uppercase tracking-wider text-ink-mute">
                followers
              </p>
            </div>
          </div>
          <button className="mt-5 w-full rounded-full bg-navy py-2.5 text-sm font-semibold text-cream transition hover:bg-navy/85">
            Get directions
          </button>
        </aside>
      </div>
    </AppShell>
  );
}
