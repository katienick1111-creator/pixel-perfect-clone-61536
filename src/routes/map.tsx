import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Navigation, Layers } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { events, categories } from "@/data/trovin";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map — Trovin'" },
      {
        name: "description",
        content:
          "See every market, vendor, and pop-up plotted on a satellite map of Chicago.",
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

// Clean Esri World Imagery satellite of Chicago — no API key needed.
const SATELLITE_URL =
  "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox=-87.72,41.85,-87.60,41.93&bboxSR=4326&size=1400,1000&format=jpg&f=image";
// Soft place-label overlay (boundaries + names) for legibility.
const LABELS_URL =
  "https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/export?bbox=-87.72,41.85,-87.60,41.93&bboxSR=4326&size=1400,1000&format=png&transparent=true&f=image";

const dateFilters = [
  { key: "all", label: "Any day" },
  { key: "today", label: "Today" },
  { key: "weekend", label: "This weekend" },
] as const;
type DateKey = (typeof dateFilters)[number]["key"];

function matchesDate(date: string, key: DateKey) {
  if (key === "all") return true;
  if (key === "today") return /today/i.test(date);
  if (key === "weekend")
    return /sat|sun|fri\s*–|fri\s*-/i.test(date);
  return true;
}

function MapPage() {
  const [category, setCategory] = useState<string>("All");
  const [dateKey, setDateKey] = useState<DateKey>("all");
  const [selected, setSelected] = useState(events[0].id);

  const visible = useMemo(
    () =>
      events.filter((e) => {
        const tagOk =
          category === "All" || e.tags.some((t) => t.includes(category));
        const dateOk = matchesDate(e.date, dateKey);
        return tagOk && dateOk;
      }),
    [category, dateKey],
  );

  const active =
    visible.find((e) => e.id === selected) ?? visible[0] ?? events[0];

  return (
    <AppShell>
      <PageHeader
        scribble="all the spots —"
        title="The map"
        subtitle="Satellite view of Chicago. Tap a pin to peek the event."
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => {
            const on = category === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  on
                    ? "border-navy bg-navy text-cream"
                    : "border-line bg-paper text-ink-soft hover:border-teal hover:text-navy"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          {dateFilters.map((d) => {
            const on = dateKey === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setDateKey(d.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  on
                    ? "border-teal bg-teal text-cream"
                    : "border-line bg-paper text-ink-soft hover:border-teal hover:text-navy"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Satellite map surface */}
        <div className="relative overflow-hidden rounded-2xl border border-line shadow-brand-md">
          <div
            className="relative h-[460px] w-full md:h-[560px]"
            style={{
              backgroundImage: `url("${LABELS_URL}"), url("${SATELLITE_URL}")`,
              backgroundSize: "cover, cover",
              backgroundPosition: "center, center",
            }}
          >
            {/* subtle wash for legibility, doesn't dull the imagery */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy/10 via-transparent to-navy/25" />

            {/* pins — unchanged scribble style */}
            {visible.map((e) => {
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

            {visible.length === 0 && (
              <div className="absolute inset-x-0 top-6 mx-auto w-fit -rotate-1 rounded-full bg-paper/95 px-4 py-2 font-script text-base text-navy shadow-brand-md">
                no spots match — try another filter
              </div>
            )}

            {/* corner controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button aria-label="Recenter map" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-navy shadow-brand-md transition hover:bg-cream">
                <Navigation className="h-4 w-4" />
              </button>
              <button aria-label="Toggle map layers" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper text-navy shadow-brand-md transition hover:bg-cream">
                <Layers className="h-4 w-4" />
              </button>
            </div>

            <span className="absolute bottom-3 left-4 -rotate-2 rounded-sm bg-cream/95 px-2 py-0.5 font-script text-sm text-teal shadow-brand-sm">
              satellite • Chicago
            </span>
            <span className="absolute bottom-2 right-3 rounded-sm bg-navy/55 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-cream/90">
              Imagery © Esri
            </span>
          </div>
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
