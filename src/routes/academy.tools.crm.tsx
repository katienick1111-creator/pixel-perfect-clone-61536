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
  Star,
  Trash2,
  X,
} from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/academy/tools/crm")({
  head: () => ({
    meta: [
      { title: "Vendor CRM — Trovin Academy" },
      {
        name: "description",
        content:
          "Track organizers, repeat customers, wholesale leads, and partners. Follow-ups, interaction notes, autosaved.",
      },
    ],
  }),
  component: CrmTool,
});

const TYPES = [
  "Organizer",
  "Customer",
  "Vendor",
  "Wholesale",
  "Partner",
  "Supplier",
  "Other",
] as const;
type ContactType = (typeof TYPES)[number];

const METHODS = ["Email", "Phone", "Text", "DM", "In person", "Other"] as const;

type Interaction = {
  id: string;
  date: string;
  method: string;
  notes: string;
  followup: boolean;
};

type Contact = {
  id: string;
  name: string;
  company: string;
  contact_type: ContactType;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  location: string;
  notes: string;
  last_contacted: string;
  next_followup: string;
  favorite: boolean;
  interactions: Interaction[];
};

const LOCAL_KEY = "trovin.academy.contacts";
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);

const blank = (): Contact => ({
  id: uid(),
  name: "",
  company: "",
  contact_type: "Customer",
  email: "",
  phone: "",
  website: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  location: "",
  notes: "",
  last_contacted: "",
  next_followup: "",
  favorite: false,
  interactions: [],
});

type SortKey = "name" | "company" | "last" | "next";

function CrmTool() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Contact[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "favorites" | ContactType>(
    "",
  );
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [editing, setEditing] = useState<Contact | null>(null);
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_contacts")
          .select("*")
          .order("name");
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              name: d.name ?? "",
              company: d.company ?? "",
              contact_type: (d.contact_type as ContactType) ?? "Other",
              email: d.email ?? "",
              phone: d.phone ?? "",
              website: d.website ?? "",
              instagram: d.instagram ?? "",
              facebook: d.facebook ?? "",
              tiktok: d.tiktok ?? "",
              location: d.location ?? "",
              notes: d.notes ?? "",
              last_contacted: d.last_contacted ?? "",
              next_followup: d.next_followup ?? "",
              favorite: !!d.favorite,
              interactions: (d.interactions as Interaction[]) ?? [],
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
            await supabase.from("academy_contacts").upsert(
              up.map((c) => ({
                id: c.id,
                user_id: user.id,
                name: c.name,
                company: c.company || null,
                contact_type: c.contact_type,
                email: c.email || null,
                phone: c.phone || null,
                website: c.website || null,
                instagram: c.instagram || null,
                facebook: c.facebook || null,
                tiktok: c.tiktok || null,
                location: c.location || null,
                notes: c.notes || null,
                last_contacted: c.last_contacted || null,
                next_followup: c.next_followup || null,
                favorite: c.favorite,
                interactions: c.interactions,
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const del = Array.from(removed.current);
          if (del.length) {
            await supabase.from("academy_contacts").delete().in("id", del);
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

  const upsert = (c: Contact) => {
    dirty.current.add(c.id);
    setItems((prev) =>
      prev.some((p) => p.id === c.id)
        ? prev.map((p) => (p.id === c.id ? c : p))
        : [c, ...prev],
    );
  };
  const remove = (id: string) => {
    removed.current.add(id);
    dirty.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };
  const duplicate = (c: Contact) => {
    const copy = { ...c, id: uid(), name: `${c.name} (copy)`, interactions: [] };
    dirty.current.add(copy.id);
    setItems((prev) => [copy, ...prev]);
  };

  const today = todayISO();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((i) => {
      if (typeFilter === "favorites") {
        if (!i.favorite) return false;
      } else if (typeFilter) {
        if (i.contact_type !== typeFilter) return false;
      }
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "company":
          return a.company.localeCompare(b.company);
        case "last":
          return (b.last_contacted || "").localeCompare(a.last_contacted || "");
        case "next":
          return (a.next_followup || "9999").localeCompare(
            b.next_followup || "9999",
          );
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [items, search, typeFilter, sortKey]);

  const summary = useMemo(() => {
    const dueSoon = items.filter(
      (i) => i.next_followup && i.next_followup <= today,
    ).length;
    const organizers = items.filter((i) => i.contact_type === "Organizer").length;
    const customers = items.filter((i) => i.contact_type === "Customer").length;
    return { total: items.length, dueSoon, organizers, customers };
  }, [items, today]);

  const exportCSV = () => {
    const headers = [
      "Name",
      "Company",
      "Type",
      "Email",
      "Phone",
      "Website",
      "Instagram",
      "Location",
      "Last contacted",
      "Next follow-up",
    ];
    const rows = filtered.map((c) => [
      c.name,
      c.company,
      c.contact_type,
      c.email,
      c.phone,
      c.website,
      c.instagram,
      c.location,
      c.last_contacted,
      c.next_followup,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = `contacts-${today}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · business"
        title="Vendor CRM"
        description="Organizers, repeat customers, wholesale leads, partners — one place for every relationship."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="ac-btn-ghost">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={() => setEditing(blank())} className="ac-btn">
              <Plus className="h-4 w-4" /> Add contact
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
          {summary.total} {summary.total === 1 ? "contact" : "contacts"}
        </span>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Total contacts" value={String(summary.total)} />
        <Summary
          label="Follow-ups due"
          value={String(summary.dueSoon)}
          warn={summary.dueSoon > 0}
        />
        <Summary label="Organizers" value={String(summary.organizers)} />
        <Summary label="Customers" value={String(summary.customers)} />
      </section>

      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search contacts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "" | "favorites" | ContactType)
          }
        >
          <option value="">All types</option>
          <option value="favorites">★ Favorites</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name">Sort: name</option>
          <option value="company">Sort: company</option>
          <option value="last">Sort: last contacted</option>
          <option value="next">Sort: next follow-up</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <div className="ac-card p-10 text-center">
          <p className="ac-eyebrow">empty</p>
          <p style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-2xl">
            {items.length === 0 ? "Add your first contact" : "No matches"}
          </p>
          <p className="mt-2 text-sm text-[var(--ac-ink-mute)]">
            {items.length === 0
              ? "Organizers, repeat customers, suppliers — keep your network in one place."
              : "Try a different search or filter."}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => setEditing(blank())}
              className="ac-btn mx-auto mt-5"
            >
              <Plus className="h-4 w-4" /> Add contact
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => {
            const due = c.next_followup && c.next_followup <= today;
            return (
              <article key={c.id} className="ac-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          upsert({ ...c, favorite: !c.favorite })
                        }
                        className={`rounded p-1 ${c.favorite ? "text-amber-500" : "text-[var(--ac-ink-mute)] hover:text-amber-500"}`}
                        aria-label="Favorite"
                      >
                        <Star
                          className="h-4 w-4"
                          fill={c.favorite ? "currentColor" : "none"}
                        />
                      </button>
                      <span className="rounded-full bg-[var(--ac-cream-deep)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-ink-soft)]">
                        {c.contact_type}
                      </span>
                      {due && (
                        <span className="rounded-full bg-[var(--ac-terracotta)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-terracotta)]">
                          follow up
                        </span>
                      )}
                    </div>
                    <h3
                      style={{ fontFamily: "Fraunces, serif" }}
                      className="mt-2 text-xl"
                    >
                      {c.name || "Untitled"}
                    </h3>
                    {c.company && (
                      <p className="text-sm text-[var(--ac-ink-soft)]">
                        {c.company}
                      </p>
                    )}
                    {c.location && (
                      <p className="text-xs text-[var(--ac-ink-mute)]">
                        {c.location}
                      </p>
                    )}
                  </div>
                  <RowActions
                    onEdit={() => setEditing(c)}
                    onDuplicate={() => duplicate(c)}
                    onDelete={() => remove(c.id)}
                  />
                </div>

                <div className="mt-3 grid gap-1 text-xs text-[var(--ac-ink-soft)]">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="truncate hover:underline">
                      ✉ {c.email}
                    </a>
                  )}
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="hover:underline">
                      ☎ {c.phone}
                    </a>
                  )}
                  {(c.website || c.instagram || c.facebook || c.tiktok) && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Site
                        </a>
                      )}
                      {c.instagram && <span>IG @{c.instagram.replace(/^@/, "")}</span>}
                      {c.facebook && <span>FB {c.facebook}</span>}
                      {c.tiktok && <span>TT @{c.tiktok.replace(/^@/, "")}</span>}
                    </div>
                  )}
                </div>

                <div className="mt-3 border-t border-[var(--ac-rule-soft)] pt-3 text-xs text-[var(--ac-ink-mute)]">
                  Last contacted: {c.last_contacted || "—"} · Next:{" "}
                  <span className={due ? "text-[var(--ac-terracotta)]" : ""}>
                    {c.next_followup || "—"}
                  </span>
                </div>

                {c.interactions.length > 0 && (
                  <div className="mt-3 border-t border-[var(--ac-rule-soft)] pt-3">
                    <p className="ac-eyebrow mb-1">recent</p>
                    <ul className="space-y-1 text-xs">
                      {c.interactions.slice(0, 3).map((it) => (
                        <li key={it.id} className="text-[var(--ac-ink-soft)]">
                          <span className="text-[var(--ac-ink-mute)]">
                            {it.date} · {it.method}
                          </span>
                          {it.notes ? ` — ${it.notes}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <ContactDialog
          item={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(c) => {
            upsert(c);
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
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="ac-card p-5">
      <p className="ac-eyebrow">{label}</p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className={`mt-2 truncate text-3xl tabular-nums ${warn ? "text-[var(--ac-terracotta)]" : ""}`}
      >
        {value}
      </p>
    </div>
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
          if (confirm("Delete this contact?")) onDelete();
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

function ContactDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Contact;
  isNew: boolean;
  onClose: () => void;
  onSave: (c: Contact) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Contact>(item);
  const [newInt, setNewInt] = useState<Interaction>({
    id: uid(),
    date: todayISO(),
    method: "Email",
    notes: "",
    followup: false,
  });
  const set = <K extends keyof Contact>(k: K, v: Contact[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const addInteraction = () => {
    if (!newInt.notes.trim() && !newInt.method) return;
    setDraft((d) => ({
      ...d,
      interactions: [newInt, ...d.interactions],
      last_contacted: newInt.date,
    }));
    setNewInt({
      id: uid(),
      date: todayISO(),
      method: "Email",
      notes: "",
      followup: false,
    });
  };
  const removeInteraction = (id: string) =>
    setDraft((d) => ({
      ...d,
      interactions: d.interactions.filter((i) => i.id !== id),
    }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new contact" : "edit contact"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.name || "Untitled"}
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
          <Field label="Name">
            <input
              className="ac-input"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Business / Company">
            <input
              className="ac-input"
              value={draft.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </Field>
          <Field label="Contact type">
            <select
              className="ac-input"
              value={draft.contact_type}
              onChange={(e) => set("contact_type", e.target.value as ContactType)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location">
            <input
              className="ac-input"
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className="ac-input"
              value={draft.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className="ac-input"
              value={draft.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Website">
            <input
              className="ac-input"
              value={draft.website}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Instagram">
            <input
              className="ac-input"
              value={draft.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              placeholder="@handle"
            />
          </Field>
          <Field label="Facebook">
            <input
              className="ac-input"
              value={draft.facebook}
              onChange={(e) => set("facebook", e.target.value)}
            />
          </Field>
          <Field label="TikTok">
            <input
              className="ac-input"
              value={draft.tiktok}
              onChange={(e) => set("tiktok", e.target.value)}
              placeholder="@handle"
            />
          </Field>
          <Field label="Last contacted">
            <input
              type="date"
              className="ac-input"
              value={draft.last_contacted}
              onChange={(e) => set("last_contacted", e.target.value)}
            />
          </Field>
          <Field label="Next follow-up">
            <input
              type="date"
              className="ac-input"
              value={draft.next_followup}
              onChange={(e) => set("next_followup", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.favorite}
              onChange={(e) => set("favorite", e.target.checked)}
            />
            <Star
              className="h-4 w-4 text-amber-500"
              fill={draft.favorite ? "currentColor" : "none"}
            />{" "}
            Favorite contact
          </label>
          <Field label="Notes" full>
            <textarea
              className="ac-input min-h-[80px] py-2"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>

          <div className="sm:col-span-2 rounded-sm border border-[var(--ac-rule-soft)] p-3">
            <p className="ac-eyebrow mb-2">interactions</p>
            <div className="mb-3 grid gap-2 sm:grid-cols-[auto_auto_1fr_auto_auto]">
              <input
                type="date"
                className="ac-input"
                value={newInt.date}
                onChange={(e) =>
                  setNewInt((n) => ({ ...n, date: e.target.value }))
                }
              />
              <select
                className="ac-input"
                value={newInt.method}
                onChange={(e) =>
                  setNewInt((n) => ({ ...n, method: e.target.value }))
                }
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                className="ac-input"
                value={newInt.notes}
                onChange={(e) =>
                  setNewInt((n) => ({ ...n, notes: e.target.value }))
                }
                placeholder="Notes from the chat…"
              />
              <label className="flex items-center gap-1 text-xs text-[var(--ac-ink-soft)]">
                <input
                  type="checkbox"
                  checked={newInt.followup}
                  onChange={(e) =>
                    setNewInt((n) => ({ ...n, followup: e.target.checked }))
                  }
                />
                Follow-up
              </label>
              <button onClick={addInteraction} className="ac-btn-ghost text-xs">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            {draft.interactions.length === 0 ? (
              <p className="text-xs text-[var(--ac-ink-mute)]">
                No interactions logged yet.
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {draft.interactions.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center gap-2 border-t border-[var(--ac-rule-soft)] py-2 first:border-0 first:pt-0"
                  >
                    <span className="text-xs text-[var(--ac-ink-mute)] tabular-nums">
                      {it.date}
                    </span>
                    <span className="text-xs text-[var(--ac-ink-soft)]">
                      {it.method}
                    </span>
                    <span className="flex-1 truncate">{it.notes}</span>
                    {it.followup && (
                      <span className="text-[10px] uppercase tracking-widest text-[var(--ac-terracotta)]">
                        follow-up
                      </span>
                    )}
                    <button
                      onClick={() => removeInteraction(it.id)}
                      className="text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          {!isNew ? (
            <button
              onClick={() => {
                if (confirm("Delete this contact?")) onDelete(draft.id);
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
