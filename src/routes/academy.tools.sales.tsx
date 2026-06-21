import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
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

export const Route = createFileRoute("/academy/tools/sales")({
  head: () => ({
    meta: [
      { title: "Sales Tracker — Trovin Academy" },
      {
        name: "description",
        content:
          "Log every sale from every event. Revenue, top sellers, and average order — autosaved to your account.",
      },
    ],
  }),
  component: SalesTool,
});

type Sale = {
  id: string;
  sale_date: string;
  event_name: string;
  product_name: string;
  quantity: number;
  price_per_item: number;
  discount: number;
  payment_type: string;
  notes: string;
};

const PAYMENT_TYPES = ["Cash", "Card", "Venmo", "Cash App", "Zelle", "Other"];
const LOCAL_KEY = "trovin.academy.sales";
const uid = () => Math.random().toString(36).slice(2, 11);
const todayISO = () => new Date().toISOString().slice(0, 10);

const blank = (): Sale => ({
  id: uid(),
  sale_date: todayISO(),
  event_name: "",
  product_name: "",
  quantity: 1,
  price_per_item: 0,
  discount: 0,
  payment_type: "Cash",
  notes: "",
});

const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const lineTotal = (s: Sale) =>
  Math.max(0, s.quantity * s.price_per_item - s.discount);

type SortKey = "date" | "amount" | "product" | "event";

function SalesTool() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Sale[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [editing, setEditing] = useState<Sale | null>(null);
  const dirty = useRef<Set<string>>(new Set());
  const removed = useRef<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data } = await supabase
          .from("academy_sales")
          .select("*")
          .order("sale_date", { ascending: false });
        if (!cancelled && data) {
          setItems(
            data.map((d) => ({
              id: d.id,
              sale_date: d.sale_date,
              event_name: d.event_name ?? "",
              product_name: d.product_name ?? "",
              quantity: Number(d.quantity) || 0,
              price_per_item: Number(d.price_per_item) || 0,
              discount: Number(d.discount) || 0,
              payment_type: d.payment_type ?? "Cash",
              notes: d.notes ?? "",
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
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (user) {
        try {
          const toUpsert = items.filter((i) => dirty.current.has(i.id));
          if (toUpsert.length) {
            await supabase.from("academy_sales").upsert(
              toUpsert.map((s) => ({
                id: s.id,
                user_id: user.id,
                sale_date: s.sale_date,
                event_name: s.event_name,
                product_name: s.product_name,
                quantity: s.quantity,
                price_per_item: s.price_per_item,
                discount: s.discount,
                payment_type: s.payment_type,
                notes: s.notes || null,
              })),
              { onConflict: "id" },
            );
            dirty.current.clear();
          }
          const toDelete = Array.from(removed.current);
          if (toDelete.length) {
            await supabase.from("academy_sales").delete().in("id", toDelete);
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
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [items, loaded, user]);

  const upsert = (s: Sale) => {
    dirty.current.add(s.id);
    setItems((prev) =>
      prev.some((p) => p.id === s.id)
        ? prev.map((p) => (p.id === s.id ? s : p))
        : [s, ...prev],
    );
  };
  const remove = (id: string) => {
    removed.current.add(id);
    dirty.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };
  const duplicate = (s: Sale) => {
    const c = { ...s, id: uid(), sale_date: todayISO() };
    dirty.current.add(c.id);
    setItems((prev) => [c, ...prev]);
  };

  const events = useMemo(
    () => Array.from(new Set(items.map((i) => i.event_name).filter(Boolean))).sort(),
    [items],
  );
  const products = useMemo(
    () => Array.from(new Set(items.map((i) => i.product_name).filter(Boolean))).sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((i) => {
      if (eventFilter && i.event_name !== eventFilter) return false;
      if (productFilter && i.product_name !== productFilter) return false;
      if (paymentFilter && i.payment_type !== paymentFilter) return false;
      if (!q) return true;
      return (
        i.product_name.toLowerCase().includes(q) ||
        i.event_name.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "amount":
          return lineTotal(b) - lineTotal(a);
        case "product":
          return a.product_name.localeCompare(b.product_name);
        case "event":
          return a.event_name.localeCompare(b.event_name);
        case "date":
        default:
          return b.sale_date.localeCompare(a.sale_date);
      }
    });
    return list;
  }, [items, search, eventFilter, productFilter, paymentFilter, sortKey]);

  const totals = useMemo(() => {
    let revenue = 0;
    let qty = 0;
    const byProduct = new Map<string, number>();
    items.forEach((i) => {
      revenue += lineTotal(i);
      qty += i.quantity;
      if (i.product_name) {
        byProduct.set(
          i.product_name,
          (byProduct.get(i.product_name) || 0) + i.quantity,
        );
      }
    });
    let best = "—";
    let bestQty = 0;
    byProduct.forEach((q, p) => {
      if (q > bestQty) {
        bestQty = q;
        best = p;
      }
    });
    return {
      count: items.length,
      revenue,
      qty,
      aov: items.length ? revenue / items.length : 0,
      best,
      bestQty,
    };
  }, [items]);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Event",
      "Product",
      "Qty",
      "Price",
      "Discount",
      "Total",
      "Payment",
      "Notes",
    ];
    const rows = filtered.map((s) => [
      s.sale_date,
      s.event_name,
      s.product_name,
      s.quantity,
      s.price_per_item,
      s.discount,
      lineTotal(s).toFixed(2),
      s.payment_type,
      (s.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · business"
        title="Sales tracker"
        description="Log every sale to see revenue, top sellers, and average order across events."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="ac-btn-ghost">
              <Download className="h-4 w-4" /> CSV
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={() => setEditing(blank())} className="ac-btn">
              <Plus className="h-4 w-4" /> Add sale
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
          {totals.count} {totals.count === 1 ? "sale" : "sales"}
        </span>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Summary label="Revenue" value={money(totals.revenue)} />
        <Summary label="Items sold" value={String(totals.qty)} />
        <Summary label="Avg order" value={money(totals.aov)} />
        <Summary
          label="Best seller"
          value={totals.best}
          hint={totals.bestQty ? `${totals.bestQty} units` : undefined}
        />
      </section>

      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search product, event, notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
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
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="">All products</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All payments</option>
          {PAYMENT_TYPES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="date">Sort: date</option>
          <option value="amount">Sort: amount</option>
          <option value="product">Sort: product</option>
          <option value="event">Sort: event</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <Empty
          empty={items.length === 0}
          onAdd={() => setEditing(blank())}
          title={items.length === 0 ? "Log your first sale" : "No matches"}
          body={
            items.length === 0
              ? "Track every transaction to see what's making you money."
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
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Disc.</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="ac-no-print px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-[var(--ac-rule-soft)] last:border-0"
                  >
                    <td className="px-4 py-3 tabular-nums">{s.sale_date}</td>
                    <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                      {s.event_name || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {s.product_name || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {s.quantity}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {money(s.price_per_item)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {s.discount ? money(s.discount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {money(lineTotal(s))}
                    </td>
                    <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                      {s.payment_type}
                    </td>
                    <td className="ac-no-print px-2 py-3 text-right">
                      <RowActions
                        onEdit={() => setEditing(s)}
                        onDuplicate={() => duplicate(s)}
                        onDelete={() => remove(s.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((s) => (
              <div key={s.id} className="ac-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {s.sale_date} · {s.event_name || "—"}
                    </p>
                    <p className="truncate font-medium">
                      {s.product_name || "Untitled"}
                    </p>
                    <p className="text-xs text-[var(--ac-ink-mute)]">
                      {s.quantity} × {money(s.price_per_item)} · {s.payment_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium tabular-nums">
                      {money(lineTotal(s))}
                    </p>
                    <RowActions
                      onEdit={() => setEditing(s)}
                      onDuplicate={() => duplicate(s)}
                      onDelete={() => remove(s.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <SaleDialog
          sale={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(s) => {
            upsert(s);
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

function Empty({
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
          if (confirm("Delete this sale?")) onDelete();
        }}
        className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-terracotta)]"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function SaleDialog({
  sale,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  sale: Sale;
  isNew: boolean;
  onClose: () => void;
  onSave: (s: Sale) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Sale>(sale);
  const set = <K extends keyof Sale>(k: K, v: Sale[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new sale" : "edit sale"}</p>
            <p style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
              {draft.product_name || "Untitled"}
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
              value={draft.sale_date}
              onChange={(e) => set("sale_date", e.target.value)}
            />
          </Field>
          <Field label="Event">
            <input
              className="ac-input"
              value={draft.event_name}
              onChange={(e) => set("event_name", e.target.value)}
              placeholder="Randolph Market"
            />
          </Field>
          <Field label="Product" full>
            <input
              className="ac-input"
              value={draft.product_name}
              onChange={(e) => set("product_name", e.target.value)}
              placeholder="Hand-poured candle"
            />
          </Field>
          <Field label="Quantity">
            <input
              type="number"
              min="0"
              step="1"
              className="ac-input"
              value={draft.quantity}
              onChange={(e) =>
                set("quantity", parseInt(e.target.value, 10) || 0)
              }
            />
          </Field>
          <Field label="Price per item">
            <input
              type="number"
              min="0"
              step="0.01"
              className="ac-input"
              value={draft.price_per_item}
              onChange={(e) =>
                set("price_per_item", parseFloat(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Discount">
            <input
              type="number"
              min="0"
              step="0.01"
              className="ac-input"
              value={draft.discount}
              onChange={(e) => set("discount", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Payment type">
            <select
              className="ac-input"
              value={draft.payment_type}
              onChange={(e) => set("payment_type", e.target.value)}
            >
              {PAYMENT_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes" full>
            <textarea
              className="ac-input min-h-[80px] py-2"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2 rounded-sm border border-[var(--ac-rule-soft)] bg-[var(--ac-cream)] p-3 text-center text-sm">
            <p className="ac-eyebrow">total sale</p>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-1 text-2xl tabular-nums"
            >
              {money(lineTotal(draft))}
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          {!isNew ? (
            <button
              onClick={() => {
                if (confirm("Delete this sale?")) onDelete(draft.id);
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
