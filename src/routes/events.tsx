import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Check,
  Send,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { events as fallbackEvents } from "@/data/trovin";
import { listPublicEvents, submitEvent } from "@/lib/public.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Trovin'" },
      {
        name: "description",
        content:
          "All the markets, fairs, and pop-ups happening near you. Submit your own — admins review every one.",
      },
      { property: "og:title", content: "Events — Trovin'" },
      {
        property: "og:description",
        content: "Markets, fairs, and pop-ups happening this weekend.",
      },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

type ApiEvent = {
  id: string;
  name: string;
  neighborhood: string;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string | null;
  tags: string[];
  hours: string | null;
  description: string | null;
};

type DisplayEvent = {
  id: string;
  name: string;
  neighborhood: string;
  date: Date | null;
  hours: string;
  image: string;
  tags: string[];
  scribble?: string;
  vendorCount?: number;
  followers?: number;
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function EventsPage() {
  const { user } = useAuth();
  const listFn = useServerFn(listPublicEvents);
  const { data, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: () => listFn(),
  });

  const remote: DisplayEvent[] = useMemo(() => {
    const rows = (data?.events ?? []) as ApiEvent[];
    return rows.map((e) => ({
      id: e.id,
      name: e.name,
      neighborhood: e.neighborhood,
      date: e.starts_at ? new Date(e.starts_at) : null,
      hours: e.hours ?? (e.starts_at ? new Date(e.starts_at).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) : "TBA"),
      image: e.image_url ?? fallbackEvents[0].image,
      tags: e.tags ?? [],
    }));
  }, [data]);

  // Mock events seeded into the visual demo so the calendar feels alive even when DB is empty
  const seeded: DisplayEvent[] = useMemo(() => {
    const now = new Date();
    return fallbackEvents.map((e, i) => {
      const offset = [0, 1, 3, 5, 6, 8][i] ?? i;
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      d.setHours(10 + (i % 4), 0, 0, 0);
      return {
        id: `seed-${e.id}`,
        name: e.name,
        neighborhood: e.neighborhood,
        date: d,
        hours: e.hours,
        image: e.image,
        tags: e.tags,
        scribble: e.scribble,
        vendorCount: e.vendorCount,
        followers: e.followers,
      };
    });
  }, []);

  const allEvents = useMemo(
    () => [...remote, ...seeded].filter((e) => e.date),
    [remote, seeded],
  );

  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DisplayEvent[]>();
    for (const e of allEvents) {
      if (!e.date) continue;
      const k = e.date.toDateString();
      const arr = map.get(k) ?? [];
      arr.push(e);
      map.set(k, arr);
    }
    return map;
  }, [allEvents]);

  const visibleEvents = useMemo(() => {
    if (selectedDay) {
      return allEvents
        .filter((e) => e.date && sameDay(e.date, selectedDay))
        .sort((a, b) => (a.date!.getTime() - b.date!.getTime()));
    }
    return allEvents.sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }, [allEvents, selectedDay]);

  const eventJsonLd = useMemo(() => {
    const upcoming = allEvents
      .filter((e) => e.date && e.date.getTime() >= Date.now() - 86_400_000)
      .slice(0, 12);
    if (upcoming.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@graph": upcoming.map((e) => ({
        "@type": "Event",
        name: e.name,
        startDate: e.date!.toISOString(),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.neighborhood,
          address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" },
        },
        image: e.image,
      })),
    };
  }, [allEvents]);

  return (
    <AppShell>
      {eventJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      )}
      <div className="mb-6 flex items-start justify-between gap-4">
        <PageHeader
          scribble="what's on —"
          title="Events near you"
          subtitle={`${allEvents.length} happening across Chicago • tap a day to filter`}
        />
        <button
          onClick={() => setSubmitOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-navy shadow-brand-md hover:bg-gold-400"
        >
          <Plus className="h-4 w-4" /> Submit event
        </button>
      </div>

      <CalendarBoard
        cursor={cursor}
        setCursor={setCursor}
        eventsByDay={eventsByDay}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      <div className="mt-8 flex items-center justify-between">
        <p className="font-script text-2xl leading-none text-teal">
          {selectedDay
            ? `on ${selectedDay.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })} —`
            : "everything coming up —"}
        </p>
        {selectedDay && (
          <button
            onClick={() => setSelectedDay(null)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-soft hover:text-navy"
          >
            <X className="h-3.5 w-3.5" /> Clear filter
          </button>
        )}
      </div>

      {isLoading && remote.length === 0 ? (
        <p className="mt-6 text-sm text-ink-soft">Loading events…</p>
      ) : visibleEvents.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-script text-2xl text-teal">nothin' on this day</p>
          <p className="mt-2 text-sm text-ink-soft">
            Know about a market we missed?{" "}
            <button
              className="underline decoration-gold underline-offset-2"
              onClick={() => setSubmitOpen(true)}
            >
              Submit it
            </button>{" "}
            and we'll review it.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {visibleEvents.map((e, i) => (
            <EventCard key={e.id} e={e} i={i} />
          ))}
        </div>
      )}

      {submitOpen && (
        <SubmitEventModal
          user={user}
          onClose={() => setSubmitOpen(false)}
        />
      )}
    </AppShell>
  );
}

function CalendarBoard({
  cursor,
  setCursor,
  eventsByDay,
  selectedDay,
  setSelectedDay,
}: {
  cursor: Date;
  setCursor: (d: Date) => void;
  eventsByDay: Map<string, DisplayEvent[]>;
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
}) {
  const today = new Date();
  const firstDow = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();

  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({ date: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null });

  const monthLabel = cursor.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-navy/15 bg-paper p-5 shadow-brand-md md:p-7">
      {/* paper-texture wash */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(15,22,46,0.4) 0 1px, transparent 2px), radial-gradient(circle at 80% 80%, rgba(10,118,116,0.4) 0 1px, transparent 2px)",
          backgroundSize: "24px 24px, 32px 32px",
        }}
      />
      <span className="absolute -top-3 left-8 h-5 w-20 -rotate-6 rounded-[2px] bg-gold-200/80 shadow-brand-sm" />
      <span className="absolute -top-3 right-10 h-5 w-16 rotate-6 rounded-[2px] bg-teal-200/80 shadow-brand-sm" />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
            mark your calendar —
          </p>
          <h2 className="mt-1 font-display text-3xl leading-none">
            {monthLabel}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-navy hover:border-teal"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setCursor(startOfMonth(new Date()));
              setSelectedDay(new Date());
            }}
            className="rounded-full border border-line bg-cream px-3 py-2 text-xs font-semibold text-navy hover:border-teal"
          >
            Today
          </button>
          <button
            onClick={() =>
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-cream text-navy hover:border-teal"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-7 gap-1.5 text-center font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>

      <div className="relative mt-1 grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => {
          if (!c.date) return <div key={i} className="aspect-square" />;
          const list = eventsByDay.get(c.date.toDateString()) ?? [];
          const isToday = sameDay(c.date, today);
          const isSelected = selectedDay && sameDay(c.date, selectedDay);
          const hasEvents = list.length > 0;
          const tilt = ((c.date.getDate() % 5) - 2) * 0.6;

          return (
            <button
              key={i}
              onClick={() =>
                setSelectedDay(isSelected ? null : c.date)
              }
              style={{ transform: hasEvents ? `rotate(${tilt}deg)` : undefined }}
              className={`relative aspect-square rounded-xl border text-left transition focus:outline-none focus:ring-2 focus:ring-teal/40 ${
                isSelected
                  ? "border-navy bg-navy text-cream shadow-brand-md"
                  : hasEvents
                    ? "border-teal/60 bg-gold/25 text-navy hover:-translate-y-0.5 hover:shadow-brand-md"
                    : "border-line bg-cream text-ink-soft hover:border-teal/40"
              }`}
            >
              <span
                className={`absolute left-1.5 top-1.5 text-xs font-bold ${
                  isToday && !isSelected ? "text-coral" : ""
                }`}
              >
                {c.date.getDate()}
              </span>
              {isToday && !isSelected && (
                <span className="absolute right-1.5 top-1.5 font-script text-[10px] leading-none text-coral -rotate-6">
                  today
                </span>
              )}
              {hasEvents && (
                <span className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5">
                  {list.slice(0, 3).map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-gold" : "bg-teal"
                      }`}
                    />
                  ))}
                  {list.length > 3 && (
                    <span
                      className={`ml-0.5 text-[9px] font-bold ${
                        isSelected ? "text-gold" : "text-teal"
                      }`}
                    >
                      +{list.length - 3}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-teal" />
          event(s) on this day
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-coral" />
          today
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-gold" />
          tap a day to filter the list
        </span>
      </div>
    </section>
  );
}

function EventCard({ e, i }: { e: DisplayEvent; i: number }) {
  const tilt = ((i % 3) - 1) * 0.7;
  return (
    <article
      style={{ transform: `rotate(${tilt}deg)` }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-paper shadow-brand-sm transition duration-300 hover:!rotate-0 hover:-translate-y-1 hover:shadow-brand-lg"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={e.image}
          alt={e.name}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent" />
        {e.scribble && (
          <span className="absolute left-4 top-4 -rotate-3 rounded-sm bg-gold/90 px-2.5 py-1 font-script text-base text-navy shadow-brand-md">
            {e.scribble}
          </span>
        )}
        {e.date && (
          <span className="absolute right-4 top-4 rotate-3 rounded-md bg-cream px-2.5 py-1 text-center font-display text-navy shadow-brand-md">
            <span className="block text-[9px] uppercase tracking-widest text-ink-mute leading-none">
              {e.date.toLocaleDateString([], { month: "short" })}
            </span>
            <span className="block text-xl leading-none font-black">
              {e.date.getDate()}
            </span>
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="font-display text-2xl leading-tight text-cream drop-shadow md:text-3xl">
            {e.name}
          </h2>
          <p className="mt-1 text-sm text-cream/85">
            {e.neighborhood}
            {e.date && ` • ${e.date.toLocaleDateString([], { weekday: "short" })}`}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="grid gap-1.5 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-teal" />
            {e.hours}
          </span>
          {(e.vendorCount || e.followers) && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-teal" />
              {e.vendorCount ?? 0} vendors
              {e.followers ? ` • ${(e.followers / 1000).toFixed(1)}k followers` : ""}
            </span>
          )}
          {e.tags.length > 0 && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-teal" />
              {e.tags.slice(0, 3).join(" • ")}
            </span>
          )}
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
  );
}

function SubmitEventModal({
  user,
  onClose,
}: {
  user: ReturnType<typeof useAuth>["user"];
  onClose: () => void;
}) {
  const submit = useServerFn(submitEvent);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    neighborhood: "",
    starts_at: "",
    ends_at: "",
    hours: "",
    description: "",
    image_url: "",
    tags: "",
    submitter_name: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("You need to sign in first so we can credit your submission.");
      return;
    }
    if (!form.name.trim() || !form.neighborhood.trim() || !form.starts_at) {
      setError("Name, neighborhood, and start date are required.");
      return;
    }
    setBusy(true);
    try {
      await submit({
        data: {
          name: form.name,
          neighborhood: form.neighborhood,
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          hours: form.hours,
          description: form.description,
          image_url: form.image_url || null,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          submitter_name: form.submitter_name,
        },
      });
      setDone(true);
      qc.invalidateQueries({ queryKey: ["public-events"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-paper shadow-brand-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute -top-3 left-8 h-5 w-20 -rotate-6 rounded-[2px] bg-gold-200/80 shadow-brand-sm" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-navy hover:bg-cream"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success">
              <Check className="h-7 w-7" />
            </div>
            <p className="mt-4 font-script text-3xl text-teal">on the list!</p>
            <h2 className="mt-1 font-display text-2xl">Submitted for review</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Thanks! An admin will look it over and approve it shortly. You'll
              see it appear on the calendar once it's live.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="max-h-[85vh] overflow-y-auto p-6">
            <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
              know a good one? —
            </p>
            <h2 className="mt-1 font-display text-3xl leading-none">
              Submit an event
            </h2>
            <p className="mt-2 text-xs text-ink-soft">
              Anyone can submit. Admins review every submission before it shows up
              on the calendar.
            </p>

            {!user && (
              <div className="mt-4 rounded-xl border border-gold/60 bg-gold/15 p-3 text-xs text-navy">
                You'll need to{" "}
                <Link to="/login" className="font-bold underline">
                  sign in
                </Link>{" "}
                first so we can credit your submission and contact you if we need
                more info.
              </div>
            )}

            <div className="mt-5 space-y-3">
              <Field label="Event name *">
                <input
                  className={ic}
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Logan Square Vintage Pop-up"
                />
              </Field>
              <Field label="Neighborhood *">
                <input
                  className={ic}
                  maxLength={120}
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm({ ...form, neighborhood: e.target.value })
                  }
                  placeholder="Logan Square, Chicago"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Starts *">
                  <input
                    type="datetime-local"
                    className={ic}
                    value={form.starts_at}
                    onChange={(e) =>
                      setForm({ ...form, starts_at: e.target.value })
                    }
                  />
                </Field>
                <Field label="Ends">
                  <input
                    type="datetime-local"
                    className={ic}
                    value={form.ends_at}
                    onChange={(e) =>
                      setForm({ ...form, ends_at: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label="Hours blurb (optional)">
                <input
                  className={ic}
                  maxLength={60}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                  placeholder="Sat 10a – 5p"
                />
              </Field>
              <Field label="What's it about?">
                <textarea
                  className={`${ic} resize-none`}
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Tell shoppers what makes it special…"
                />
              </Field>
              <Field label="Tags (comma-separated)">
                <input
                  className={ic}
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="vintage, makers, food trucks"
                />
              </Field>
              <Field label="Cover image URL (optional)">
                <input
                  className={ic}
                  type="url"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  placeholder="https://…"
                />
              </Field>
              <Field label="Your name (so we can credit you)">
                <input
                  className={ic}
                  maxLength={80}
                  value={form.submitter_name}
                  onChange={(e) =>
                    setForm({ ...form, submitter_name: e.target.value })
                  }
                  placeholder="Alex from Logan Square"
                />
              </Field>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-line px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream hover:bg-navy-700 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {busy ? "Sending…" : "Send for review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const ic =
  "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-teal";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}
