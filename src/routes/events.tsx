import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Users, ArrowUpRight, Filter } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { events } from "@/data/trovin";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Trovin'" },
      {
        name: "description",
        content:
          "All the markets, fairs, and pop-ups happening near you this weekend.",
      },
      { property: "og:title", content: "Events — Trovin'" },
      {
        property: "og:description",
        content: "Markets, fairs, and pop-ups happening this weekend.",
      },
      { property: "og:image", content: events[0].image },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

const days = ["Today", "Tomorrow", "This weekend", "Next 7 days"];

function EventsPage() {
  const [day, setDay] = useState("Today");

  return (
    <AppShell>
      <PageHeader
        scribble="what's on —"
        title="Events near you"
        subtitle={`${events.length} curated picks across Chicago • updated 12 min ago`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {days.map((d) => {
          const active = d === day;
          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-navy bg-navy text-cream"
                  : "border-line bg-paper text-ink-soft hover:border-teal hover:text-navy"
              }`}
            >
              {d}
            </button>
          );
        })}
        <span className="mx-1 h-5 w-px bg-line" />
        <button className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-teal">
          <Filter className="h-3.5 w-3.5" /> Filters
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {events.map((e, i) => (
          <article
            key={e.id}
            style={{ transform: `rotate(${e.tilt}deg)` }}
            className="group relative overflow-hidden rounded-2xl border border-line bg-paper shadow-brand-sm transition duration-300 hover:!rotate-0 hover:-translate-y-1 hover:shadow-brand-lg"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={e.image}
                alt={e.name}
                width={1024}
                height={1024}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />
              {e.scribble && (
                <span className="absolute left-4 top-4 -rotate-3 rounded-sm bg-gold/90 px-2.5 py-1 font-script text-base text-navy shadow-brand-md">
                  {e.scribble}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h2 className="font-display text-2xl leading-tight text-cream drop-shadow md:text-3xl">
                  {e.name}
                </h2>
                <p className="mt-1 text-sm text-cream/85">
                  {e.neighborhood} • {e.date}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="grid gap-1.5 text-xs text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-teal" />
                  {e.hours}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-teal" />
                  {e.vendorCount} vendors • {(e.followers / 1000).toFixed(1)}k
                  followers
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal" />
                  {e.tags.join(" • ")}
                </span>
              </div>
              <Link
                to="/map"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-navy px-3.5 py-2 text-xs font-semibold text-cream transition hover:bg-navy/85"
              >
                On the map
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
