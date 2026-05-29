import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, Download, MapPin, Clock, ExternalLink } from "lucide-react";

const STORAGE_KEY = "trovin:vendor-events:v1";

export type VendorEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  notes?: string;
};

function loadEvents(): VendorEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function seed(): VendorEvent[] {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const next = new Date(today);
  next.setDate(today.getDate() + 6);
  return [
    {
      id: crypto.randomUUID(),
      title: "Randolph Street Market",
      date: fmt(tomorrow),
      startTime: "10:00",
      endTime: "17:00",
      location: "1340 W Washington Blvd, Chicago",
      notes: "Booth 142 — bring extra mugs",
    },
    {
      id: crypto.randomUUID(),
      title: "Pilsen Maker Market",
      date: fmt(next),
      startTime: "11:00",
      endTime: "18:00",
      location: "Thalia Hall, Pilsen",
    },
  ];
}

function save(events: VendorEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    /* noop */
  }
}

function toICSDate(date: string, time: string): string {
  // returns YYYYMMDDTHHMMSS (local floating time)
  return `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
}

function buildICS(ev: VendorEvent): string {
  const uid = `${ev.id}@trovin`;
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Trovin//Vendor Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toICSDate(ev.date, ev.startTime)}`,
    `DTEND:${toICSDate(ev.date, ev.endTime)}`,
    `SUMMARY:${ev.title}`,
    `LOCATION:${ev.location}`,
    ev.notes ? `DESCRIPTION:${ev.notes.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function downloadICS(ev: VendorEvent) {
  const blob = new Blob([buildICS(ev)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function googleCalLink(ev: VendorEvent): string {
  const dates = `${toICSDate(ev.date, ev.startTime)}/${toICSDate(ev.date, ev.endTime)}`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates,
    location: ev.location,
    details: ev.notes ?? "",
  });
  return `https://www.google.com/calendar/render?${p.toString()}`;
}

function prettyDate(d: string): { day: string; mon: string; weekday: string } {
  const dt = new Date(`${d}T12:00:00`);
  return {
    day: dt.getDate().toString().padStart(2, "0"),
    mon: dt.toLocaleString(undefined, { month: "short" }).toUpperCase(),
    weekday: dt.toLocaleString(undefined, { weekday: "long" }),
  };
}

export function VendorCalendar() {
  const [events, setEvents] = useState<VendorEvent[]>([]);
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const [draft, setDraft] = useState<VendorEvent>({
    id: "",
    title: "",
    date: today,
    startTime: "10:00",
    endTime: "17:00",
    location: "",
    notes: "",
  });

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(`${a.date}T${a.startTime}`).getTime() -
          new Date(`${b.date}T${b.startTime}`).getTime(),
      ),
    [events],
  );

  const upsert = (next: VendorEvent[]) => {
    setEvents(next);
    save(next);
  };

  const addDraft = () => {
    if (!draft.title.trim() || !draft.location.trim()) return;
    const newEv = { ...draft, id: crypto.randomUUID() };
    upsert([...events, newEv]);
    setDraft({
      id: "",
      title: "",
      date: today,
      startTime: "10:00",
      endTime: "17:00",
      location: "",
      notes: "",
    });
    setOpen(false);
  };

  const remove = (id: string) => upsert(events.filter((e) => e.id !== id));

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-script text-2xl leading-none text-teal -rotate-1 origin-left">
            mark your calendar
          </p>
          <h3 className="mt-2 font-display text-2xl text-navy">
            Your market lineup
          </h3>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-cream shadow-brand-sm hover:bg-navy-700"
        >
          <Plus className="h-4 w-4" />
          Add date
        </button>
      </div>

      {open && (
        <div className="mt-4 rounded-lg border border-line bg-paper p-5 shadow-brand-md">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Event name
              </span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Logan Square Farmers Market"
                className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Where
              </span>
              <input
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                placeholder="3107 W Logan Blvd, Chicago"
                className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Date
              </span>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  Start
                </span>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(e) =>
                    setDraft({ ...draft, startTime: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                  End
                </span>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(e) =>
                    setDraft({ ...draft, endTime: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
                />
              </label>
            </div>
            <label className="block sm:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">
                Notes (booth #, what's new...)
              </span>
              <input
                value={draft.notes ?? ""}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder="Booth 142 — fresh brass candlesticks"
                className="mt-1 w-full rounded-md border border-line bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-teal"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft hover:border-teal"
            >
              Cancel
            </button>
            <button
              onClick={addDraft}
              className="inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-cream hover:bg-teal/90"
            >
              <Plus className="h-4 w-4" />
              Save date
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-paper/60 p-8 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-ink-mute" />
          <p className="mt-2 font-hand text-xl text-ink-soft">
            no dates yet — tap "Add date" to start
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {sorted.map((ev, i) => {
            const d = prettyDate(ev.date);
            return (
              <li
                key={ev.id}
                className="group relative flex overflow-hidden rounded-lg border border-line bg-paper shadow-brand-sm transition hover:shadow-brand-md"
                style={{ transform: `rotate(${(i % 2 === 0 ? -0.4 : 0.4)}deg)` }}
              >
                {/* date chip */}
                <div className="flex w-20 flex-col items-center justify-center border-r-2 border-dashed border-line bg-cream-deep/60 px-2 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-teal">
                    {d.mon}
                  </p>
                  <p className="font-display text-3xl leading-none text-navy">
                    {d.day}
                  </p>
                  <p className="mt-0.5 font-hand text-xs text-ink-soft">
                    {d.weekday.slice(0, 3).toLowerCase()}
                  </p>
                </div>

                <div className="flex-1 p-4">
                  <p className="font-display text-lg leading-tight text-navy">
                    {ev.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ev.startTime} – {ev.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ev.location}
                    </span>
                  </div>
                  {ev.notes && (
                    <p className="mt-2 font-hand text-base leading-tight text-teal">
                      {ev.notes}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => downloadICS(ev)}
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1 text-xs font-semibold text-navy hover:border-teal"
                    >
                      <Download className="h-3 w-3" />
                      .ics
                    </button>
                    <a
                      href={googleCalLink(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-cream px-3 py-1 text-xs font-semibold text-navy hover:border-teal"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Google
                    </a>
                    <button
                      onClick={() => remove(ev.id)}
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-xs text-ink-mute hover:border-danger/30 hover:text-danger"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
