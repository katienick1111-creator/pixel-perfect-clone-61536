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

export const Route = createFileRoute("/academy/tools/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Tracker — Trovin Academy" },
      {
        name: "description",
        content:
          "Track booth expenses and mileage by event. Categories, totals, and IRS-style deductions — autosaved.",
      },
    ],
  }),
  component: ExpensesTool,
});

const CATEGORIES = [
  "Booth Fee",
  "Inventory",
  "Supplies",
  "Fuel",
  "Food",
  "Hotel",
  "Parking",
  "Marketing",
  "Equipment",
  "Transaction Fees",
  "Miscellaneous",
];
const PAYMENT_METHODS = ["Card", "Cash", "Venmo", "Cash App", "Zelle", "Check", "Other"];

type Expense = {
  id: string;
  expense_date: string;
  event_name: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  receipt_url: string;
  notes: string;
};
type Mileage = {
  id: string;
  trip_date: string;
  event_name: string;
  start_location: string;
  end_location: string;
  miles: number;
  rate: number;
  notes: string;
};

const LK_EXP = "trovin.academy.expenses";
const LK_MILE = "trovin.academy.mileage";
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);
const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const blankExpense = (): Expense => ({
  id: uid(),
  expense_date: todayISO(),
  event_name: "",
  category: "Miscellaneous",
  description: "",
  amount: 0,
  payment_method: "Card",
  receipt_url: "",
  notes: "",
});
const blankMileage = (): Mileage => ({
  id: uid(),
  trip_date: todayISO(),
  event_name: "",
  start_location: "",
  end_location: "",
  miles: 0,
  rate: 0.67,
  notes: "",
});

type ExpSort = "date" | "amount" | "category";
type MileSort = "date" | "miles" | "value";

function ExpensesTool() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"expenses" | "mileage">("expenses");

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · business"
        title="Expense & mileage tracker"
        description="Log booth expenses and trip mileage to keep tax-ready totals across every event."
      />

      <div className="ac-no-print mb-6 flex gap-1 rounded-sm border border-[var(--ac-rule-soft)] bg-white p-1 text-sm w-full sm:w-fit">
        {(["expenses", "mileage"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 sm:flex-none rounded-sm px-4 py-2 capitalize ${
              tab === t
                ? "bg-[var(--ac-ink)] text-white"
                : "text-[var(--ac-ink-soft)] hover:bg-[var(--ac-cream-deep)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "expenses" ? (
        <ExpenseSection user={user} authLoading={authLoading} />
      ) : (
        <MileageSection user={user} authLoading={authLoading} />
      )}
    </div>
  );
}

/* -------------------------------- Expenses -------------------------------- */

function ExpenseSection({
  user,
  authLoading,
}: {
  user: ReturnType<typeof useAuth>["user"];
  authLoading: boolean;
}) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [evtFilter, setEvtFilter] = useState("");
  const [sortKey, setSortKey] = useState<ExpSort>("date");
  const [editing, setEditing] = useState<Expense | null>(null);
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_expenses")
          .select("*")
          .order("expense_date", { ascending: false });
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              expense_date: d.expense_date,
              event_name: d.event_name ?? "",
              category: d.category ?? "Miscellaneous",
              description: d.description ?? "",
              amount: Number(d.amount) || 0,
              payment_method: d.payment_method ?? "Card",
              receipt_url: d.receipt_url ?? "",
              notes: d.notes ?? "",
            })),
          );
        }
      } else {
        try {
          const raw = localStorage.getItem(LK_EXP);
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
          const toUpsert = items.filter((i) => dirty.current.has(i.id));
          if (toUpsert.length) {
            await supabase.from("academy_expenses").upsert(
              toUpsert.map((e) => ({
                id: e.id,
                user_id: user.id,
                expense_date: e.expense_date,
                event_name: e.event_name,
                category: e.category,
                description: e.description,
                amount: e.amount,
                payment_method: e.payment_method,
                receipt_url: e.receipt_url || null,
                notes: e.notes || null,
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const toDelete = Array.from(removed.current);
          if (toDelete.length) {
            await supabase.from("academy_expenses").delete().in("id", toDelete);
            removed.current.clear();
          }
          setSavedAt(new Date());
        } catch {
          /* noop */
        }
      } else {
        localStorage.setItem(LK_EXP, JSON.stringify(items));
        setSavedAt(new Date());
      }
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [items, loaded, user]);

  const upsert = (e: Expense) => {
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
  const duplicate = (e: Expense) => {
    const c = { ...e, id: uid(), expense_date: todayISO() };
    dirty.current.add(c.id);
    setItems((prev) => [c, ...prev]);
  };

  const events = useMemo(
    () => Array.from(new Set(items.map((i) => i.event_name).filter(Boolean))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((i) => {
      if (catFilter && i.category !== catFilter) return false;
      if (evtFilter && i.event_name !== evtFilter) return false;
      if (!q) return true;
      return (
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.event_name.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "amount":
          return b.amount - a.amount;
        case "category":
          return a.category.localeCompare(b.category);
        case "date":
        default:
          return b.expense_date.localeCompare(a.expense_date);
      }
    });
    return list;
  }, [items, search, catFilter, evtFilter, sortKey]);

  const totals = useMemo(() => {
    let total = 0;
    let thisMonth = 0;
    let eventTotal = 0;
    const byCat = new Map<string, number>();
    const monthKey = todayISO().slice(0, 7);
    items.forEach((i) => {
      total += i.amount;
      if (i.expense_date.startsWith(monthKey)) thisMonth += i.amount;
      if (evtFilter && i.event_name === evtFilter) eventTotal += i.amount;
      byCat.set(i.category, (byCat.get(i.category) || 0) + i.amount);
    });
    let largest = "—";
    let largestAmt = 0;
    byCat.forEach((amt, c) => {
      if (amt > largestAmt) {
        largestAmt = amt;
        largest = c;
      }
    });
    return { total, thisMonth, eventTotal, largest, largestAmt };
  }, [items, evtFilter]);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Event",
      "Category",
      "Description",
      "Amount",
      "Payment",
      "Receipt",
      "Notes",
    ];
    const rows = filtered.map((e) => [
      e.expense_date,
      e.event_name,
      e.category,
      e.description,
      e.amount.toFixed(2),
      e.payment_method,
      e.receipt_url,
      (e.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `expenses-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="ac-no-print mb-6 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[var(--ac-rule-soft)] bg-white px-4 py-2 text-xs">
        <span className="flex items-center gap-2 text-[var(--ac-ink-mute)]">
          <Save className="h-3.5 w-3.5" />
          {savedAt
            ? `Autosaved · ${savedAt.toLocaleTimeString()}`
            : user
              ? "Autosave ready · syncs to your account"
              : "Autosave ready · sign in to sync"}
        </span>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="ac-btn-ghost text-xs">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={() => window.print()} className="ac-btn-ghost text-xs">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button onClick={() => setEditing(blankExpense())} className="ac-btn text-xs">
            <Plus className="h-3.5 w-3.5" /> Add expense
          </button>
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Total expenses" value={money(totals.total)} />
        <Summary
          label="Largest category"
          value={totals.largest}
          hint={totals.largestAmt ? money(totals.largestAmt) : undefined}
        />
        <Summary
          label={evtFilter ? `${evtFilter} expenses` : "Event expenses"}
          value={money(totals.eventTotal)}
          hint={evtFilter ? undefined : "filter by event"}
        />
        <Summary label="This month" value={money(totals.thisMonth)} />
      </section>

      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search expenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={evtFilter}
          onChange={(e) => setEvtFilter(e.target.value)}
        >
          <option value="">All events</option>
          {events.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as ExpSort)}
        >
          <option value="date">Sort: date</option>
          <option value="amount">Sort: amount</option>
          <option value="category">Sort: category</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          empty={items.length === 0}
          onAdd={() => setEditing(blankExpense())}
          title={items.length === 0 ? "Log your first expense" : "No matches"}
          body={
            items.length === 0
              ? "Booth fees, supplies, fuel — every dollar counts at tax time."
              : "Try a different search or filter."
          }
        />
      ) : (
        <>
          <div className="ac-card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--ac-rule-soft)] text-left text-[var(--ac-ink-mute)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="ac-no-print px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-[var(--ac-rule-soft)] last:border-0"
                  >
                    <td className="px-4 py-3 tabular-nums">{e.expense_date}</td>
                    <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                      {e.event_name || "—"}
                    </td>
                    <td className="px-4 py-3">{e.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {e.description || "—"}
                        </span>
                        {e.receipt_url && (
                          <a
                            href={e.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--ac-forest)]"
                            aria-label="Open receipt"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                      {e.payment_method}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {money(e.amount)}
                    </td>
                    <td className="ac-no-print px-2 py-3 text-right">
                      <RowActions
                        onEdit={() => setEditing(e)}
                        onDuplicate={() => duplicate(e)}
                        onDelete={() => remove(e.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {filtered.map((e) => (
              <div key={e.id} className="ac-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {e.expense_date} · {e.category}
                    </p>
                    <p className="truncate font-medium">
                      {e.description || "—"}
                    </p>
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {e.event_name || "—"} · {e.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">{money(e.amount)}</p>
                    <RowActions
                      onEdit={() => setEditing(e)}
                      onDuplicate={() => duplicate(e)}
                      onDelete={() => remove(e.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <ExpenseDialog
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
    </>
  );
}

/* --------------------------------- Mileage -------------------------------- */

function MileageSection({
  user,
  authLoading,
}: {
  user: ReturnType<typeof useAuth>["user"];
  authLoading: boolean;
}) {
  const [items, setItems] = useState<Mileage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [editing, setEditing] = useState<Mileage | null>(null);
  const [sortKey, setSortKey] = useState<MileSort>("date");
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_mileage")
          .select("*")
          .order("trip_date", { ascending: false });
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              trip_date: d.trip_date,
              event_name: d.event_name ?? "",
              start_location: d.start_location ?? "",
              end_location: d.end_location ?? "",
              miles: Number(d.miles) || 0,
              rate: Number(d.rate) || 0.67,
              notes: d.notes ?? "",
            })),
          );
        }
      } else {
        try {
          const raw = localStorage.getItem(LK_MILE);
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
            await supabase.from("academy_mileage").upsert(
              up.map((m) => ({
                id: m.id,
                user_id: user.id,
                trip_date: m.trip_date,
                event_name: m.event_name,
                start_location: m.start_location,
                end_location: m.end_location,
                miles: m.miles,
                rate: m.rate,
                notes: m.notes || null,
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const del = Array.from(removed.current);
          if (del.length) {
            await supabase.from("academy_mileage").delete().in("id", del);
            removed.current.clear();
          }
          setSavedAt(new Date());
        } catch {
          /* noop */
        }
      } else {
        localStorage.setItem(LK_MILE, JSON.stringify(items));
        setSavedAt(new Date());
      }
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [items, loaded, user]);

  const upsert = (m: Mileage) => {
    dirty.current.add(m.id);
    setItems((prev) =>
      prev.some((p) => p.id === m.id)
        ? prev.map((p) => (p.id === m.id ? m : p))
        : [m, ...prev],
    );
  };
  const remove = (id: string) => {
    removed.current.add(id);
    dirty.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };
  const duplicate = (m: Mileage) => {
    const c = { ...m, id: uid(), trip_date: todayISO() };
    dirty.current.add(c.id);
    setItems((prev) => [c, ...prev]);
  };

  const totals = useMemo(() => {
    let miles = 0;
    let value = 0;
    items.forEach((i) => {
      miles += i.miles;
      value += i.miles * i.rate;
    });
    return { miles, value, count: items.length };
  }, [items]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        switch (sortKey) {
          case "miles":
            return b.miles - a.miles;
          case "value":
            return b.miles * b.rate - a.miles * a.rate;
          case "date":
          default:
            return b.trip_date.localeCompare(a.trip_date);
        }
      }),
    [items, sortKey],
  );

  const exportCSV = () => {
    const headers = ["Date", "Event", "Start", "End", "Miles", "Rate", "Deduction", "Notes"];
    const rows = sorted.map((m) => [
      m.trip_date,
      m.event_name,
      m.start_location,
      m.end_location,
      m.miles,
      m.rate,
      (m.miles * m.rate).toFixed(2),
      (m.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    a.download = `mileage-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="ac-no-print mb-6 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[var(--ac-rule-soft)] bg-white px-4 py-2 text-xs">
        <span className="flex items-center gap-2 text-[var(--ac-ink-mute)]">
          <Save className="h-3.5 w-3.5" />
          {savedAt
            ? `Autosaved · ${savedAt.toLocaleTimeString()}`
            : user
              ? "Autosave ready · syncs to your account"
              : "Autosave ready · sign in to sync"}
        </span>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="ac-btn-ghost text-xs">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={() => window.print()} className="ac-btn-ghost text-xs">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button onClick={() => setEditing(blankMileage())} className="ac-btn text-xs">
            <Plus className="h-3.5 w-3.5" /> Add trip
          </button>
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <Summary label="Total miles" value={totals.miles.toFixed(1)} />
        <Summary label="Mileage deduction" value={money(totals.value)} hint="miles × rate" />
        <Summary label="Trips logged" value={String(totals.count)} />
      </section>

      <div className="ac-no-print mb-4 flex justify-end">
        <select
          className="ac-input w-auto"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as MileSort)}
        >
          <option value="date">Sort: date</option>
          <option value="miles">Sort: miles</option>
          <option value="value">Sort: value</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          empty
          onAdd={() => setEditing(blankMileage())}
          title="Log your first trip"
          body="The 2025 standard IRS rate is $0.67/mi — adjust per trip if needed."
        />
      ) : (
        <>
          <div className="ac-card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--ac-rule-soft)] text-left text-[var(--ac-ink-mute)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">From → To</th>
                  <th className="px-4 py-3 font-medium text-right">Miles</th>
                  <th className="px-4 py-3 font-medium text-right">Rate</th>
                  <th className="px-4 py-3 font-medium text-right">Deduction</th>
                  <th className="ac-no-print px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[var(--ac-rule-soft)] last:border-0"
                  >
                    <td className="px-4 py-3 tabular-nums">{m.trip_date}</td>
                    <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                      {m.event_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[var(--ac-ink-soft)]">
                        {m.start_location || "—"}
                      </span>
                      <span className="px-1 text-[var(--ac-ink-mute)]">→</span>
                      <span className="text-[var(--ac-ink-soft)]">
                        {m.end_location || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {m.miles.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {money(m.rate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {money(m.miles * m.rate)}
                    </td>
                    <td className="ac-no-print px-2 py-3 text-right">
                      <RowActions
                        onEdit={() => setEditing(m)}
                        onDuplicate={() => duplicate(m)}
                        onDelete={() => remove(m.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {sorted.map((m) => (
              <div key={m.id} className="ac-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {m.trip_date} · {m.event_name || "—"}
                    </p>
                    <p className="truncate text-sm">
                      {m.start_location || "—"} → {m.end_location || "—"}
                    </p>
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {m.miles.toFixed(1)} mi × {money(m.rate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">
                      {money(m.miles * m.rate)}
                    </p>
                    <RowActions
                      onEdit={() => setEditing(m)}
                      onDuplicate={() => duplicate(m)}
                      onDelete={() => remove(m.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <MileageDialog
          item={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(m) => {
            upsert(m);
            setEditing(null);
          }}
          onDelete={(id) => {
            remove(id);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

/* --------------------------------- Shared --------------------------------- */

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

function EmptyState({
  empty,
  onAdd,
  title,
  body,
}: {
  empty: boolean;
  onAdd: () => void;
  title: string;
  body: string;
}) {
  return (
    <div className="ac-card p-10 text-center">
      <p className="ac-eyebrow">empty</p>
      <p style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-2xl">
        {title}
      </p>
      <p className="mt-2 text-sm text-[var(--ac-ink-mute)]">{body}</p>
      {empty && (
        <button onClick={onAdd} className="ac-btn mx-auto mt-5">
          <Plus className="h-4 w-4" /> Add
        </button>
      )}
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
    <div className="flex items-center justify-end gap-1">
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
          if (confirm("Delete this entry?")) onDelete();
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

function ExpenseDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Expense;
  isNew: boolean;
  onClose: () => void;
  onSave: (e: Expense) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Expense>(item);
  const set = <K extends keyof Expense>(k: K, v: Expense[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new expense" : "edit expense"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.description || "Untitled"}
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
          <Field label="Date">
            <input
              type="date"
              className="ac-input"
              value={draft.expense_date}
              onChange={(e) => set("expense_date", e.target.value)}
            />
          </Field>
          <Field label="Event">
            <input
              className="ac-input"
              value={draft.event_name}
              onChange={(e) => set("event_name", e.target.value)}
              placeholder="Optional"
            />
          </Field>
          <Field label="Category">
            <select
              className="ac-input"
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Payment method">
            <select
              className="ac-input"
              value={draft.payment_method}
              onChange={(e) => set("payment_method", e.target.value)}
            >
              {PAYMENT_METHODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description" full>
            <input
              className="ac-input"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What did you buy?"
            />
          </Field>
          <Field label="Amount">
            <input
              type="number"
              min="0"
              step="0.01"
              className="ac-input"
              value={draft.amount}
              onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Receipt URL (optional)">
            <input
              className="ac-input"
              value={draft.receipt_url}
              onChange={(e) => set("receipt_url", e.target.value)}
              placeholder="https://…"
            />
          </Field>
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
                if (confirm("Delete this expense?")) onDelete(draft.id);
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

function MileageDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Mileage;
  isNew: boolean;
  onClose: () => void;
  onSave: (m: Mileage) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Mileage>(item);
  const set = <K extends keyof Mileage>(k: K, v: Mileage[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new trip" : "edit trip"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.event_name || "Mileage trip"}
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
          <Field label="Date">
            <input
              type="date"
              className="ac-input"
              value={draft.trip_date}
              onChange={(e) => set("trip_date", e.target.value)}
            />
          </Field>
          <Field label="Event">
            <input
              className="ac-input"
              value={draft.event_name}
              onChange={(e) => set("event_name", e.target.value)}
            />
          </Field>
          <Field label="Start location">
            <input
              className="ac-input"
              value={draft.start_location}
              onChange={(e) => set("start_location", e.target.value)}
            />
          </Field>
          <Field label="End location">
            <input
              className="ac-input"
              value={draft.end_location}
              onChange={(e) => set("end_location", e.target.value)}
            />
          </Field>
          <Field label="Miles driven">
            <input
              type="number"
              min="0"
              step="0.1"
              className="ac-input"
              value={draft.miles}
              onChange={(e) => set("miles", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Mileage rate ($/mi)">
            <input
              type="number"
              min="0"
              step="0.001"
              className="ac-input"
              value={draft.rate}
              onChange={(e) => set("rate", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Notes" full>
            <textarea
              className="ac-input min-h-[80px] py-2"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2 rounded-sm border border-[var(--ac-rule-soft)] bg-[var(--ac-cream)] p-3 text-center">
            <p className="ac-eyebrow">deduction</p>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-1 text-2xl tabular-nums"
            >
              {money(draft.miles * draft.rate)}
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          {!isNew ? (
            <button
              onClick={() => {
                if (confirm("Delete this trip?")) onDelete(draft.id);
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
