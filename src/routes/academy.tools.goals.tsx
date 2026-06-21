import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
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

export const Route = createFileRoute("/academy/tools/goals")({
  head: () => ({
    meta: [
      { title: "Goal Tracker — Trovin Academy" },
      {
        name: "description",
        content:
          "Set revenue, sales, marketing, and growth goals. Track progress, deadlines, and priorities — autosaved.",
      },
    ],
  }),
  component: GoalsTool,
});

const GOAL_TYPES = [
  "Revenue",
  "Sales",
  "Inventory",
  "Marketing",
  "Social Media",
  "Events",
  "Customer Growth",
  "Personal",
  "Other",
] as const;
type GoalType = (typeof GOAL_TYPES)[number];

const PRIORITIES = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITIES)[number];

type Goal = {
  id: string;
  title: string;
  goal_type: GoalType;
  target_value: number;
  current_value: number;
  unit: string;
  due_date: string;
  priority: Priority;
  notes: string;
  is_complete: boolean;
};

const LOCAL_KEY = "trovin.academy.goals";
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);

const blank = (): Goal => ({
  id: uid(),
  title: "",
  goal_type: "Revenue",
  target_value: 0,
  current_value: 0,
  unit: "$",
  due_date: "",
  priority: "Medium",
  notes: "",
  is_complete: false,
});

type Filter = "all" | "active" | "completed" | "overdue";
type SortKey = "due" | "progress" | "priority";

const priorityRank = (p: Priority) =>
  p === "High" ? 0 : p === "Medium" ? 1 : 2;

function GoalsTool() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Goal[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | GoalType>("");
  const [statusFilter, setStatusFilter] = useState<Filter>("active");
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [editing, setEditing] = useState<Goal | null>(null);
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_goals")
          .select("*")
          .order("due_date", { ascending: true });
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              title: d.title ?? "",
              goal_type: ((d as { goal_type?: string }).goal_type as GoalType) ?? "Other",
              target_value: Number(d.target_value) || 0,
              current_value: Number(d.current_value) || 0,
              unit: d.unit ?? "",
              due_date: d.due_date ?? "",
              priority:
                (((d as { priority?: string }).priority as Priority) ?? "Medium"),
              notes: (d as { notes?: string }).notes ?? "",
              is_complete: !!d.is_complete,
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
            await supabase.from("academy_goals").upsert(
              up.map((g) => ({
                id: g.id,
                user_id: user.id,
                title: g.title,
                target_value: g.target_value,
                current_value: g.current_value,
                unit: g.unit || null,
                due_date: g.due_date || null,
                is_complete: g.is_complete,
                goal_type: g.goal_type,
                priority: g.priority,
                notes: g.notes || null,
                status: g.is_complete
                  ? "Completed"
                  : g.due_date && g.due_date < todayISO()
                    ? "Overdue"
                    : "Active",
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const del = Array.from(removed.current);
          if (del.length) {
            await supabase.from("academy_goals").delete().in("id", del);
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

  const upsert = (g: Goal) => {
    dirty.current.add(g.id);
    setItems((prev) =>
      prev.some((p) => p.id === g.id)
        ? prev.map((p) => (p.id === g.id ? g : p))
        : [g, ...prev],
    );
  };
  const remove = (id: string) => {
    removed.current.add(id);
    dirty.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };
  const toggleComplete = (g: Goal) =>
    upsert({
      ...g,
      is_complete: !g.is_complete,
      current_value: !g.is_complete ? g.target_value : g.current_value,
    });

  const today = todayISO();
  const progress = (g: Goal) =>
    g.target_value > 0
      ? Math.min(100, (g.current_value / g.target_value) * 100)
      : g.is_complete
        ? 100
        : 0;
  const isOverdue = (g: Goal) =>
    !g.is_complete && g.due_date && g.due_date < today;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((g) => {
      if (statusFilter === "active" && g.is_complete) return false;
      if (statusFilter === "completed" && !g.is_complete) return false;
      if (statusFilter === "overdue" && !isOverdue(g)) return false;
      if (typeFilter && g.goal_type !== typeFilter) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.notes.toLowerCase().includes(q) ||
        g.goal_type.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "progress":
          return progress(b) - progress(a);
        case "priority":
          return priorityRank(a.priority) - priorityRank(b.priority);
        case "due":
        default:
          return (a.due_date || "9999").localeCompare(b.due_date || "9999");
      }
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, statusFilter, typeFilter, sortKey, today]);

  const summary = useMemo(() => {
    const active = items.filter((g) => !g.is_complete).length;
    const completed = items.filter((g) => g.is_complete).length;
    const overdue = items.filter((g) => isOverdue(g)).length;
    const avg =
      items.length > 0
        ? Math.round(
            items.reduce((s, g) => s + progress(g), 0) / items.length,
          )
        : 0;
    return { active, completed, overdue, avg };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, today]);

  const exportCSV = () => {
    const headers = [
      "Title",
      "Type",
      "Target",
      "Current",
      "Unit",
      "Progress %",
      "Due",
      "Priority",
      "Status",
    ];
    const rows = filtered.map((g) => [
      g.title,
      g.goal_type,
      g.target_value,
      g.current_value,
      g.unit,
      progress(g).toFixed(0),
      g.due_date,
      g.priority,
      g.is_complete ? "Completed" : isOverdue(g) ? "Overdue" : "Active",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = `goals-${today}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · business"
        title="Goal tracker"
        description="Set targets for revenue, sales, marketing, and growth. Track progress against deadlines."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="ac-btn-ghost">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={() => setEditing(blank())} className="ac-btn">
              <Plus className="h-4 w-4" /> Add goal
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
          {items.length} {items.length === 1 ? "goal" : "goals"}
        </span>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Active goals" value={String(summary.active)} />
        <Summary label="Completed" value={String(summary.completed)} />
        <Summary
          label="Overdue"
          value={String(summary.overdue)}
          warn={summary.overdue > 0}
        />
        <Summary label="Average progress" value={`${summary.avg}%`} />
      </section>

      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search goals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "" | GoalType)}
        >
          <option value="">All types</option>
          {GOAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Filter)}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="all">All</option>
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="due">Sort: due date</option>
          <option value="progress">Sort: progress</option>
          <option value="priority">Sort: priority</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <div className="ac-card p-10 text-center">
          <p className="ac-eyebrow">empty</p>
          <p style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-2xl">
            {items.length === 0 ? "Set your first goal" : "No matches"}
          </p>
          <p className="mt-2 text-sm text-[var(--ac-ink-mute)]">
            {items.length === 0
              ? "Specific, time-bound targets keep your booth moving forward."
              : "Try a different search or filter."}
          </p>
          {items.length === 0 && (
            <button onClick={() => setEditing(blank())} className="ac-btn mx-auto mt-5">
              <Plus className="h-4 w-4" /> Add goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((g) => {
            const p = progress(g);
            const overdue = isOverdue(g);
            const daysLeft = g.due_date
              ? Math.ceil(
                  (new Date(g.due_date).getTime() - new Date(today).getTime()) /
                    86400000,
                )
              : null;
            const remaining = Math.max(0, g.target_value - g.current_value);
            return (
              <article key={g.id} className="ac-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--ac-cream-deep)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-ink-soft)]">
                        {g.goal_type}
                      </span>
                      <PriorityBadge p={g.priority} />
                      {g.is_complete && (
                        <span className="rounded-full bg-[var(--ac-forest)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">
                          done
                        </span>
                      )}
                      {overdue && (
                        <span className="rounded-full bg-[var(--ac-terracotta)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-terracotta)]">
                          overdue
                        </span>
                      )}
                    </div>
                    <h3
                      style={{ fontFamily: "Fraunces, serif" }}
                      className={`mt-2 text-xl ${g.is_complete ? "text-[var(--ac-ink-mute)] line-through" : ""}`}
                    >
                      {g.title || "Untitled goal"}
                    </h3>
                  </div>
                  <div className="ac-no-print flex items-center gap-1">
                    <button
                      onClick={() => toggleComplete(g)}
                      className={`rounded p-2 hover:bg-[var(--ac-cream-deep)] ${g.is_complete ? "text-[var(--ac-forest)]" : "text-[var(--ac-ink-mute)] hover:text-[var(--ac-forest)]"}`}
                      aria-label="Toggle complete"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditing(g)}
                      className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-ink)]"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const c = {
                          ...g,
                          id: uid(),
                          title: `${g.title} (copy)`,
                          is_complete: false,
                          current_value: 0,
                        };
                        dirty.current.add(c.id);
                        setItems((prev) => [c, ...prev]);
                      }}
                      className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-ink)]"
                      aria-label="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this goal?")) remove(g.id);
                      }}
                      className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-terracotta)]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-baseline justify-between text-xs text-[var(--ac-ink-mute)]">
                    <span>
                      {formatVal(g.current_value, g.unit)} /{" "}
                      {formatVal(g.target_value, g.unit)}
                    </span>
                    <span className="font-medium text-[var(--ac-ink)]">
                      {p.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--ac-cream-deep)]">
                    <div
                      className="h-full rounded-full bg-[var(--ac-forest)] transition-all"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-[var(--ac-ink-mute)]">
                    <span>
                      Remaining: {formatVal(remaining, g.unit)}
                    </span>
                    <span>
                      {g.due_date
                        ? daysLeft !== null && daysLeft >= 0
                          ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left · due ${g.due_date}`
                          : `Due ${g.due_date}`
                        : "No deadline"}
                    </span>
                  </div>
                </div>

                {!g.is_complete && (
                  <div className="ac-no-print mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      className="ac-input flex-1"
                      value={g.current_value}
                      onChange={(e) =>
                        upsert({
                          ...g,
                          current_value: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Update progress"
                    />
                  </div>
                )}

                {g.notes && (
                  <p className="mt-3 border-t border-[var(--ac-rule-soft)] pt-3 text-sm text-[var(--ac-ink-soft)]">
                    {g.notes}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <GoalDialog
          item={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(g) => {
            upsert(g);
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

function formatVal(n: number, unit: string) {
  if (unit === "$") {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }
  return `${n.toLocaleString()}${unit ? ` ${unit}` : ""}`;
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

function PriorityBadge({ p }: { p: Priority }) {
  const map: Record<Priority, string> = {
    Low: "bg-[var(--ac-cream-deep)] text-[var(--ac-ink-soft)]",
    Medium: "bg-amber-100 text-amber-900",
    High: "bg-[var(--ac-terracotta)]/10 text-[var(--ac-terracotta)]",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${map[p]}`}
    >
      {p}
    </span>
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

function GoalDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Goal;
  isNew: boolean;
  onClose: () => void;
  onSave: (g: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Goal>(item);
  const set = <K extends keyof Goal>(k: K, v: Goal[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new goal" : "edit goal"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.title || "Untitled"}
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
          <Field label="Goal title" full>
            <input
              className="ac-input"
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Hit $5,000 in summer revenue"
            />
          </Field>
          <Field label="Goal type">
            <select
              className="ac-input"
              value={draft.goal_type}
              onChange={(e) => set("goal_type", e.target.value as GoalType)}
            >
              {GOAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select
              className="ac-input"
              value={draft.priority}
              onChange={(e) => set("priority", e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Target">
            <input
              type="number"
              min="0"
              step="any"
              className="ac-input"
              value={draft.target_value}
              onChange={(e) =>
                set("target_value", parseFloat(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Current progress">
            <input
              type="number"
              min="0"
              step="any"
              className="ac-input"
              value={draft.current_value}
              onChange={(e) =>
                set("current_value", parseFloat(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Unit">
            <input
              className="ac-input"
              value={draft.unit}
              onChange={(e) => set("unit", e.target.value)}
              placeholder="$ / units / followers"
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              className="ac-input"
              value={draft.due_date}
              onChange={(e) => set("due_date", e.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.is_complete}
              onChange={(e) => set("is_complete", e.target.checked)}
            />
            Mark as completed
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
                if (confirm("Delete this goal?")) onDelete(draft.id);
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
