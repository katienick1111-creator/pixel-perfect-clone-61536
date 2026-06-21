import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  Pencil,
  Plus,
  Printer,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/academy/tools/event-planner")({
  head: () => ({
    meta: [
      { title: "Event Planner — Trovin Academy" },
      {
        name: "description",
        content:
          "Plan every market and festival application. Track deadlines, fees, status, and a checklist per event.",
      },
    ],
  }),
  component: EventPlannerTool,
});

const STATUSES = [
  "Interested",
  "Applied",
  "Accepted",
  "Waitlisted",
  "Declined",
  "Completed",
] as const;
type Status = (typeof STATUSES)[number];

const CHECKLIST_ITEMS = [
  ["applied", "Applied"],
  ["paid_booth_fee", "Paid Booth Fee"],
  ["insurance_sent", "Insurance Sent"],
  ["permit_sent", "Permit Sent"],
  ["inventory_planned", "Inventory Planned"],
  ["social_scheduled", "Social Post Scheduled"],
  ["packing_complete", "Packing Checklist Complete"],
  ["setup_confirmed", "Setup Time Confirmed"],
] as const;

type Checklist = Record<string, boolean>;
type Event = {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  website: string;
  application_deadline: string;
  booth_fee: number;
  booth_size: string;
  indoor_outdoor: string;
  electricity: boolean;
  notes: string;
  status: Status;
  checklist: Checklist;
};

const LOCAL_KEY = "trovin.academy.events";
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);
const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const blank = (): Event => ({
  id: uid(),
  event_name: "",
  event_date: "",
  event_time: "",
  location: "",
  organizer_name: "",
  organizer_email: "",
  organizer_phone: "",
  website: "",
  application_deadline: "",
  booth_fee: 0,
  booth_size: "",
  indoor_outdoor: "Outdoor",
  electricity: false,
  notes: "",
  status: "Interested",
  checklist: {},
});

type SortKey = "date" | "deadline" | "fee" | "name";
type Bucket = "all" | "upcoming" | "past" | "Interested" | "Applied" | "Accepted" | "Waitlisted" | "Declined" | "Completed";

function EventPlannerTool() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Event[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState<Bucket>("upcoming");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [editing, setEditing] = useState<Event | null>(null);
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_events")
          .select("*")
          .order("event_date", { ascending: true });
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              event_name: d.event_name ?? "",
              event_date: d.event_date ?? "",
              event_time: d.event_time ?? "",
              location: d.location ?? "",
              organizer_name: d.organizer_name ?? "",
              organizer_email: d.organizer_email ?? "",
              organizer_phone: d.organizer_phone ?? "",
              website: d.website ?? "",
              application_deadline: d.application_deadline ?? "",
              booth_fee: Number(d.booth_fee) || 0,
              booth_size: d.booth_size ?? "",
              indoor_outdoor: d.indoor_outdoor ?? "Outdoor",
              electricity: !!d.electricity,
              notes: d.notes ?? "",
              status: (d.status as Status) ?? "Interested",
              checklist: (d.checklist as Checklist) ?? {},
            })),
          );
        }
      } else {
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) setItems(JSON.parse(raw));
        } catch {
          /* noop */
        }
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  useEffect(() => {
    if (!loaded) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (user) {
        try {
          const up = items.filter((i) => dirty.current.has(i.id));
          if (up.length) {
            await supabase.from("academy_events").upsert(
              up.map((e) => ({
                id: e.id,
                user_id: user.id,
                event_name: e.event_name,
                event_date: e.event_date || null,
                event_time: e.event_time || null,
                location: e.location || null,
                organizer_name: e.organizer_name || null,
                organizer_email: e.organizer_email || null,
                organizer_phone: e.organizer_phone || null,
                website: e.website || null,
                application_deadline: e.application_deadline || null,
                booth_fee: e.booth_fee,
                booth_size: e.booth_size || null,
                indoor_outdoor: e.indoor_outdoor || null,
                electricity: e.electricity,
                notes: e.notes || null,
                status: e.status,
                checklist: e.checklist,
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const del = Array.from(removed.current);
          if (del.length) {
            await supabase.from("academy_events").delete().in("id", del);
            removed.current.clear();
          }
          setSavedAt(new Date());
        } catch {
          /* noop */
        }
      } else {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
        setSavedAt(new Date());
      }
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [items, loaded, user]);

  const upsert = (e: Event) => {
    dirty.current.add(e.id);
    setItems((prev) =>
      prev.some((p) => p.id === e.id)
        ? prev.map((p) => (p.id === e.id ? e : p))
        : [e, ...prev],
    );
  };
  const remove = (id: string) => {
    removed.current.add(id);
    dirty.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };
  const duplicate = (e: Event) => {
    const c = { ...e, id: uid(), event_name: `${e.event_name} (copy)` };
    dirty.current.add(c.id);
    setItems((prev) => [c, ...prev]);
  };
  const toggleCheck = (e: Event, key: string) => {
    upsert({ ...e, checklist: { ...e.checklist, [key]: !e.checklist[key] } });
  };

  const today = todayISO();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((i) => {
      if (bucket === "upcoming") {
        if (!i.event_date || i.event_date < today) return false;
      } else if (bucket === "past") {
        if (!i.event_date || i.event_date >= today) return false;
      } else if (bucket !== "all") {
        if (i.status !== bucket) return false;
      }
      if (!q) return true;
      return (
        i.event_name.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.organizer_name.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "deadline":
          return (a.application_deadline || "9999").localeCompare(
            b.application_deadline || "9999",
          );
        case "fee":
          return b.booth_fee - a.booth_fee;
        case "name":
          return a.event_name.localeCompare(b.event_name);
        case "date":
        default:
          return (a.event_date || "9999").localeCompare(b.event_date || "9999");
      }
    });
    return list;
  }, [items, search, bucket, sortKey, today]);

  const summary = useMemo(() => {
    const upcoming = items.filter(
      (i) => i.event_date && i.event_date >= today,
    ).length;
    const dueSoon = items.filter(
      (i) =>
        i.application_deadline &&
        i.application_deadline >= today &&
        i.status !== "Applied" &&
        i.status !== "Accepted" &&
        i.status !== "Completed",
    ).length;
    const accepted = items.filter((i) => i.status === "Accepted").length;
    const fees = items
      .filter((i) => i.status === "Accepted" || i.status === "Applied")
      .reduce((s, i) => s + i.booth_fee, 0);
    return { upcoming, dueSoon, accepted, fees };
  }, [items, today]);

  const exportCSV = () => {
    const headers = [
      "Name",
      "Date",
      "Deadline",
      "Location",
      "Organizer",
      "Email",
      "Phone",
      "Fee",
      "Status",
    ];
    const rows = filtered.map((e) => [
      e.event_name,
      e.event_date,
      e.application_deadline,
      e.location,
      e.organizer_name,
      e.organizer_email,
      e.organizer_phone,
      e.booth_fee.toFixed(2),
      e.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = `events-${today}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · festivals & events"
        title="Event planner"
        description="Track every market application — deadlines, fees, status, and your prep checklist."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="ac-btn-ghost">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={() => setEditing(blank())} className="ac-btn">
              <Plus className="h-4 w-4" /> Add event
            </button>
          </div>
        }
      />

      <div className="ac-no-print mb-6 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[var(--ac-rule-soft)] bg-white px-4 py-2 text-xs">
        <span className="flex items-center gap-2 text-[var(--ac-ink-mute)]">
          <Save className="h-3.5 w-3.5" />
          {savedAt
            ? `Autosaved · ${savedAt.toLocaleTimeString()}`
            : user
              ? "Autosave ready · syncs to your account"
              : "Autosave ready · sign in to sync"}
        </span>
        <span className="font-medium text-[var(--ac-forest)]">
          {items.length} {items.length === 1 ? "event" : "events"}
        </span>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Upcoming events" value={String(summary.upcoming)} />
        <Summary label="Applications due" value={String(summary.dueSoon)} />
        <Summary label="Accepted" value={String(summary.accepted)} />
        <Summary label="Booth fees" value={money(summary.fees)} hint="applied + accepted" />
      </section>

      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={bucket}
          onChange={(e) => setBucket(e.target.value as Bucket)}
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All saved</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="date">Sort: event date</option>
          <option value="deadline">Sort: deadline</option>
          <option value="fee">Sort: booth fee</option>
          <option value="name">Sort: name</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <div className="ac-card p-10 text-center">
          <p className="ac-eyebrow">empty</p>
          <p style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-2xl">
            {items.length === 0 ? "Plan your first event" : "No matches"}
          </p>
          <p className="mt-2 text-sm text-[var(--ac-ink-mute)]">
            {items.length === 0
              ? "Track deadlines, fees, and prep — never miss an application again."
              : "Try a different search or filter."}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => setEditing(blank())}
              className="ac-btn mx-auto mt-5"
            >
              <Plus className="h-4 w-4" /> Add event
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((e) => {
            const done = CHECKLIST_ITEMS.filter(
              ([k]) => e.checklist[k],
            ).length;
            const overdue =
              e.application_deadline &&
              e.application_deadline < today &&
              e.status === "Interested";
            return (
              <article key={e.id} className="ac-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={e.status} />
                      {overdue && (
                        <span className="rounded-full bg-[var(--ac-terracotta)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-terracotta)]">
                          deadline passed
                        </span>
                      )}
                    </div>
                    <h3
                      style={{ fontFamily: "Fraunces, serif" }}
                      className="mt-2 text-xl"
                    >
                      {e.event_name || "Untitled event"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--ac-ink-soft)]">
                      {e.event_date || "TBD"}
                      {e.event_time ? ` · ${e.event_time}` : ""}
                      {e.location ? ` · ${e.location}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-[var(--ac-ink-mute)]">
                      {e.application_deadline
                        ? `Apply by ${e.application_deadline}`
                        : "No deadline set"}{" "}
                      · Booth {money(e.booth_fee)}
                      {e.booth_size ? ` · ${e.booth_size}` : ""}
                      {e.indoor_outdoor ? ` · ${e.indoor_outdoor}` : ""}
                      {e.electricity ? " · Electric" : ""}
                    </p>
                  </div>
                  <RowActions
                    onEdit={() => setEditing(e)}
                    onDuplicate={() => duplicate(e)}
                    onDelete={() => remove(e.id)}
                  />
                </div>

                {(e.organizer_name ||
                  e.organizer_email ||
                  e.organizer_phone ||
                  e.website) && (
                  <div className="mt-3 grid gap-1 text-xs text-[var(--ac-ink-soft)] sm:grid-cols-2">
                    {e.organizer_name && <span>👤 {e.organizer_name}</span>}
                    {e.organizer_email && (
                      <a href={`mailto:${e.organizer_email}`} className="hover:underline">
                        ✉ {e.organizer_email}
                      </a>
                    )}
                    {e.organizer_phone && (
                      <a href={`tel:${e.organizer_phone}`} className="hover:underline">
                        ☎ {e.organizer_phone}
                      </a>
                    )}
                    {e.website && (
                      <a
                        href={e.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> Application link
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-4 border-t border-[var(--ac-rule-soft)] pt-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <p className="ac-eyebrow">event checklist</p>
                    <span className="text-[var(--ac-ink-mute)]">
                      {done} of {CHECKLIST_ITEMS.length}
                    </span>
                  </div>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {CHECKLIST_ITEMS.map(([key, label]) => (
                      <li key={key}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={!!e.checklist[key]}
                            onChange={() => toggleCheck(e, key)}
                          />
                          <span
                            className={
                              e.checklist[key]
                                ? "text-[var(--ac-ink-mute)] line-through"
                                : ""
                            }
                          >
                            {label}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {e.notes && (
                  <p className="mt-3 border-t border-[var(--ac-rule-soft)] pt-3 text-sm text-[var(--ac-ink-soft)]">
                    {e.notes}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <EventDialog
          item={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(e) => {
            upsert(e);
            setEditing(null);
          }}
          onDelete={(id) => {
            remove(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Summary({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="ac-card p-5">
      <p className="ac-eyebrow">{label}</p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className="mt-2 truncate text-3xl tabular-nums"
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--ac-ink-mute)]">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Interested: "bg-[var(--ac-cream-deep)] text-[var(--ac-ink-soft)]",
    Applied: "bg-amber-100 text-amber-900",
    Accepted: "bg-[var(--ac-forest)] text-white",
    Waitlisted: "bg-blue-100 text-blue-900",
    Declined: "bg-[var(--ac-terracotta)]/10 text-[var(--ac-terracotta)]",
    Completed: "bg-[var(--ac-ink)] text-white",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function RowActions({
  onEdit,
  onDuplicate,
  onDelete,
}: {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="ac-no-print flex items-center gap-1">
      <button
        onClick={onEdit}
        className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-ink)]"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDuplicate}
        className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-ink)]"
        aria-label="Duplicate"
      >
        <Copy className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this event?")) onDelete();
        }}
        className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-terracotta)]"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <p className="ac-eyebrow mb-2">{label}</p>
      {children}
    </label>
  );
}

function EventDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Event;
  isNew: boolean;
  onClose: () => void;
  onSave: (e: Event) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Event>(item);
  const set = <K extends keyof Event>(k: K, v: Event[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new event" : "edit event"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.event_name || "Untitled event"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Event name" full>
            <input
              className="ac-input"
              value={draft.event_name}
              onChange={(e) => set("event_name", e.target.value)}
            />
          </Field>
          <Field label="Event date">
            <input
              type="date"
              className="ac-input"
              value={draft.event_date}
              onChange={(e) => set("event_date", e.target.value)}
            />
          </Field>
          <Field label="Event time">
            <input
              className="ac-input"
              value={draft.event_time}
              onChange={(e) => set("event_time", e.target.value)}
              placeholder="10am – 5pm"
            />
          </Field>
          <Field label="Location" full>
            <input
              className="ac-input"
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </Field>
          <Field label="Organizer name">
            <input
              className="ac-input"
              value={draft.organizer_name}
              onChange={(e) => set("organizer_name", e.target.value)}
            />
          </Field>
          <Field label="Organizer email">
            <input
              type="email"
              className="ac-input"
              value={draft.organizer_email}
              onChange={(e) => set("organizer_email", e.target.value)}
            />
          </Field>
          <Field label="Organizer phone">
            <input
              className="ac-input"
              value={draft.organizer_phone}
              onChange={(e) => set("organizer_phone", e.target.value)}
            />
          </Field>
          <Field label="Application link">
            <input
              className="ac-input"
              value={draft.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Application deadline">
            <input
              type="date"
              className="ac-input"
              value={draft.application_deadline}
              onChange={(e) => set("application_deadline", e.target.value)}
            />
          </Field>
          <Field label="Booth fee">
            <input
              type="number"
              min="0"
              step="0.01"
              className="ac-input"
              value={draft.booth_fee}
              onChange={(e) => set("booth_fee", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Booth size">
            <input
              className="ac-input"
              value={draft.booth_size}
              onChange={(e) => set("booth_size", e.target.value)}
              placeholder="10x10"
            />
          </Field>
          <Field label="Indoor / Outdoor">
            <select
              className="ac-input"
              value={draft.indoor_outdoor}
              onChange={(e) => set("indoor_outdoor", e.target.value)}
            >
              <option>Outdoor</option>
              <option>Indoor</option>
              <option>Both</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              className="ac-input"
              value={draft.status}
              onChange={(e) => set("status", e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.electricity}
              onChange={(e) => set("electricity", e.target.checked)}
            />
            Electricity available
          </label>
          <Field label="Notes" full>
            <textarea
              className="ac-input min-h-[80px] py-2"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          {!isNew ? (
            <button
              onClick={() => {
                if (confirm("Delete this event?")) onDelete(draft.id);
              }}
              className="ac-btn-ghost text-[var(--ac-terracotta)]"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="ac-btn-ghost">
              Cancel
            </button>
            <button onClick={() => onSave(draft)} className="ac-btn">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
