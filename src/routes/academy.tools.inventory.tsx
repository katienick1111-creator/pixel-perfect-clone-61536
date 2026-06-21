import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Copy,
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

export const Route = createFileRoute("/academy/tools/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Tracker — Trovin Academy" },
      {
        name: "description",
        content:
          "Track product stock, cost, retail value, and low-stock alerts for your market booth. Autosaves to your account.",
      },
    ],
  }),
  component: InventoryTool,
});

type Item = {
  id: string;
  name: string;
  category: string;
  sku: string;
  cost: number;
  retail_price: number;
  quantity: number;
  low_stock_alert: number;
  notes: string;
  image_url: string;
};

const LOCAL_KEY = "trovin.academy.inventory";
const uid = () => Math.random().toString(36).slice(2, 11);

const blankItem = (): Item => ({
  id: uid(),
  name: "",
  category: "",
  sku: "",
  cost: 0,
  retail_price: 0,
  quantity: 0,
  low_stock_alert: 0,
  notes: "",
  image_url: "",
});

type SortKey = "name" | "category" | "quantity" | "value";

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function InventoryTool() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [editing, setEditing] = useState<Item | null>(null);
  const dirtyIds = useRef<Set<string>>(new Set());
  const deletedIds = useRef<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial load: cloud if signed-in, else local.
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      if (user) {
        const { data, error } = await supabase
          .from("academy_inventory_items")
          .select("*")
          .order("created_at", { ascending: true });
        if (!cancelled) {
          if (!error && data) {
            setItems(
              data.map((d) => ({
                id: d.id,
                name: d.name ?? "",
                category: d.category ?? "",
                sku: d.sku ?? "",
                cost: Number(d.cost) || 0,
                retail_price: Number(d.retail_price) || 0,
                quantity: Number(d.quantity) || 0,
                low_stock_alert: Number(d.low_stock_alert) || 0,
                notes: d.notes ?? "",
                image_url: d.image_url ?? "",
              })),
            );
          }
          setLoaded(true);
        }
      } else {
        try {
          const raw = localStorage.getItem(LOCAL_KEY);
          if (raw) setItems(JSON.parse(raw));
        } catch {
          /* noop */
        }
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // Autosave (debounced).
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (user) {
        const dirty = items.filter((i) => dirtyIds.current.has(i.id));
        const toDelete = Array.from(deletedIds.current);
        try {
          if (dirty.length) {
            const payload = dirty.map((i) => ({
              id: i.id,
              user_id: user.id,
              name: i.name,
              category: i.category,
              sku: i.sku || null,
              cost: i.cost,
              retail_price: i.retail_price,
              quantity: i.quantity,
              low_stock_alert: i.low_stock_alert,
              notes: i.notes || null,
              image_url: i.image_url || null,
            }));
            await supabase
              .from("academy_inventory_items")
              .upsert(payload, { onConflict: "id" });
            dirtyIds.current.clear();
          }
          if (toDelete.length) {
            await supabase
              .from("academy_inventory_items")
              .delete()
              .in("id", toDelete);
            deletedIds.current.clear();
          }
          setSavedAt(new Date());
        } catch {
          /* noop */
        }
      } else {
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
          setSavedAt(new Date());
        } catch {
          /* noop */
        }
      }
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [items, loaded, user]);

  const markDirty = (id: string) => dirtyIds.current.add(id);

  const upsertItem = (item: Item) => {
    markDirty(item.id);
    setItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [...prev, item];
    });
  };

  const deleteItem = (id: string) => {
    deletedIds.current.add(id);
    dirtyIds.current.delete(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicateItem = (item: Item) => {
    const copy: Item = { ...item, id: uid(), name: item.name ? `${item.name} (copy)` : "" };
    markDirty(copy.id);
    setItems((prev) => [...prev, copy]);
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.category && set.add(i.category));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((i) => {
      if (categoryFilter && i.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.notes.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "quantity":
          return b.quantity - a.quantity;
        case "value":
          return b.quantity * b.cost - a.quantity * a.cost;
        case "category":
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [items, search, categoryFilter, sortKey]);

  const totals = useMemo(() => {
    let value = 0;
    let retail = 0;
    let low = 0;
    items.forEach((i) => {
      value += i.cost * i.quantity;
      retail += i.retail_price * i.quantity;
      if (i.low_stock_alert > 0 && i.quantity <= i.low_stock_alert) low += 1;
    });
    return {
      count: items.length,
      value,
      retail,
      profit: retail - value,
      low,
    };
  }, [items]);

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · business"
        title="Inventory tracker"
        description="Track product stock, cost, retail price, and low-stock alerts. Autosaves to your account."
        actions={
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
            <button onClick={() => setEditing(blankItem())} className="ac-btn">
              <Plus className="h-4 w-4" /> Add product
            </button>
          </div>
        }
      />

      {/* Save bar */}
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
          {totals.count} {totals.count === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Summary cards */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total products" value={String(totals.count)} />
        <SummaryCard label="Inventory value" value={money(totals.value)} hint="cost × qty" />
        <SummaryCard label="Retail value" value={money(totals.retail)} hint="price × qty" />
        <SummaryCard
          label="Low stock items"
          value={String(totals.low)}
          tone={totals.low > 0 ? "warn" : "default"}
          hint={totals.low > 0 ? "needs restock" : "all stocked"}
        />
      </section>

      {/* Controls */}
      <section className="ac-no-print ac-card mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
          <input
            className="ac-input pl-9"
            placeholder="Search by name, SKU, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="ac-input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="ac-input"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
        >
          <option value="name">Sort: name</option>
          <option value="category">Sort: category</option>
          <option value="quantity">Sort: quantity</option>
          <option value="value">Sort: value</option>
        </select>
      </section>

      {/* Table / cards */}
      {filtered.length === 0 ? (
        <div className="ac-card p-10 text-center">
          <p className="ac-eyebrow">empty shelf</p>
          <p
            style={{ fontFamily: "Fraunces, serif" }}
            className="mt-2 text-2xl"
          >
            {items.length === 0 ? "Add your first product" : "No matches"}
          </p>
          <p className="mt-2 text-sm text-[var(--ac-ink-mute)]">
            {items.length === 0
              ? "Track every SKU you bring to market — cost, retail, and stock on hand."
              : "Try a different search or category filter."}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => setEditing(blankItem())}
              className="ac-btn mx-auto mt-5"
            >
              <Plus className="h-4 w-4" /> Add product
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="ac-card hidden overflow-hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--ac-rule-soft)] text-left text-[var(--ac-ink-mute)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Cost</th>
                  <th className="px-4 py-3 font-medium text-right">Retail</th>
                  <th className="px-4 py-3 font-medium text-right">Value</th>
                  <th className="ac-no-print px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const low = i.low_stock_alert > 0 && i.quantity <= i.low_stock_alert;
                  return (
                    <tr
                      key={i.id}
                      className="border-b border-[var(--ac-rule-soft)] last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {i.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={i.image_url}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-[var(--ac-cream-deep)]" />
                          )}
                          <div>
                            <div className="font-medium">
                              {i.name || <span className="text-[var(--ac-ink-mute)]">Untitled</span>}
                            </div>
                            {i.sku && (
                              <div className="text-xs text-[var(--ac-ink-mute)]">SKU {i.sku}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--ac-ink-soft)]">
                        {i.category || "—"}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          {low && (
                            <AlertTriangle className="h-3.5 w-3.5 text-[var(--ac-terracotta)]" />
                          )}
                          {i.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{money(i.cost)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{money(i.retail_price)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {money(i.cost * i.quantity)}
                      </td>
                      <td className="ac-no-print px-2 py-3 text-right">
                        <RowActions
                          onEdit={() => setEditing(i)}
                          onDuplicate={() => duplicateItem(i)}
                          onDelete={() => deleteItem(i.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((i) => {
              const low = i.low_stock_alert > 0 && i.quantity <= i.low_stock_alert;
              return (
                <div key={i.id} className="ac-card p-4">
                  <div className="flex items-start gap-3">
                    {i.image_url ? (
                      <img
                        src={i.image_url}
                        alt=""
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded bg-[var(--ac-cream-deep)]" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {i.name || "Untitled"}
                          </div>
                          <div className="text-xs text-[var(--ac-ink-mute)]">
                            {i.category || "—"}
                            {i.sku ? ` · SKU ${i.sku}` : ""}
                          </div>
                        </div>
                        <RowActions
                          onEdit={() => setEditing(i)}
                          onDuplicate={() => duplicateItem(i)}
                          onDelete={() => deleteItem(i.id)}
                        />
                      </div>
                      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <Stat label="Qty" value={String(i.quantity)} warn={low} />
                        <Stat label="Cost" value={money(i.cost)} />
                        <Stat label="Retail" value={money(i.retail_price)} />
                      </dl>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {editing && (
        <EditDialog
          item={editing}
          isNew={!items.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(it) => {
            upsertItem(it);
            setEditing(null);
          }}
          onDelete={(id) => {
            deleteItem(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="ac-card p-5">
      <p className="ac-eyebrow">{label}</p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className={`mt-2 text-3xl tabular-nums ${
          tone === "warn" ? "text-[var(--ac-terracotta)]" : ""
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-[var(--ac-ink-mute)]">{hint}</p>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">
        {label}
      </dt>
      <dd
        className={`mt-0.5 font-medium tabular-nums ${
          warn ? "text-[var(--ac-terracotta)]" : ""
        }`}
      >
        {value}
      </dd>
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
    <div className="flex items-center gap-1">
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
          if (confirm("Delete this product?")) onDelete();
        }}
        className="rounded p-2 text-[var(--ac-ink-mute)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-terracotta)]"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function EditDialog({
  item,
  isNew,
  onClose,
  onSave,
  onDelete,
}: {
  item: Item;
  isNew: boolean;
  onClose: () => void;
  onSave: (i: Item) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Item>(item);
  const set = <K extends keyof Item>(k: K, v: Item[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const profit = (draft.retail_price - draft.cost) * draft.quantity;

  return (
    <div className="ac-no-print fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-white shadow-xl sm:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          <div>
            <p className="ac-eyebrow">{isNew ? "new product" : "edit product"}</p>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="text-xl"
            >
              {draft.name || "Untitled product"}
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
          <Field label="Product name" full>
            <input
              className="ac-input"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Hand-poured soy candle"
            />
          </Field>
          <Field label="Category">
            <input
              className="ac-input"
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Candles"
            />
          </Field>
          <Field label="SKU (optional)">
            <input
              className="ac-input"
              value={draft.sku}
              onChange={(e) => set("sku", e.target.value)}
              placeholder="CN-001"
            />
          </Field>
          <Field label="Cost per unit">
            <input
              type="number"
              step="0.01"
              min="0"
              className="ac-input"
              value={draft.cost}
              onChange={(e) => set("cost", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Retail price">
            <input
              type="number"
              step="0.01"
              min="0"
              className="ac-input"
              value={draft.retail_price}
              onChange={(e) => set("retail_price", parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Quantity in stock">
            <input
              type="number"
              step="1"
              min="0"
              className="ac-input"
              value={draft.quantity}
              onChange={(e) => set("quantity", parseInt(e.target.value, 10) || 0)}
            />
          </Field>
          <Field label="Low stock alert at">
            <input
              type="number"
              step="1"
              min="0"
              className="ac-input"
              value={draft.low_stock_alert}
              onChange={(e) =>
                set("low_stock_alert", parseInt(e.target.value, 10) || 0)
              }
            />
          </Field>
          <Field label="Image URL (optional)" full>
            <input
              className="ac-input"
              value={draft.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Notes" full>
            <textarea
              className="ac-input min-h-[80px] py-2"
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Scent, size, supplier…"
            />
          </Field>

          <div className="sm:col-span-2 grid grid-cols-3 gap-3 rounded-sm border border-[var(--ac-rule-soft)] bg-[var(--ac-cream)] p-3 text-center text-xs">
            <div>
              <p className="ac-eyebrow">inv value</p>
              <p className="mt-1 font-medium tabular-nums">
                {money(draft.cost * draft.quantity)}
              </p>
            </div>
            <div>
              <p className="ac-eyebrow">retail value</p>
              <p className="mt-1 font-medium tabular-nums">
                {money(draft.retail_price * draft.quantity)}
              </p>
            </div>
            <div>
              <p className="ac-eyebrow">est. profit</p>
              <p className="mt-1 font-medium tabular-nums">{money(profit)}</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-[var(--ac-rule-soft)] bg-white px-5 py-3">
          {!isNew ? (
            <button
              onClick={() => {
                if (confirm("Delete this product?")) onDelete(draft.id);
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
