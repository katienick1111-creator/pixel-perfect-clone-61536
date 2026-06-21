import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  Copy,
  FileDown,
  Heart,
  Plus,
  Printer,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/tools/profit")({
  head: () => ({
    meta: [
      { title: "Profit Calculator — Trovin Academy" },
      {
        name: "description",
        content:
          "Find out if your event, product, or sales day actually made money. Track revenue, expenses, margin, ROI, and break-even.",
      },
    ],
  }),
  component: ProfitCalculator,
});

// ---------- Types ----------

type Inputs = {
  grossRevenue: string;
  salesCount: string;
  avgOrderValue: string;
  cogs: string;
  boothFee: string;
  inventoryCost: string;
  supplies: string;
  fuel: string;
  mileageCost: string;
  food: string;
  hotel: string;
  parking: string;
  labor: string;
  transactionFees: string;
  marketing: string;
  equipment: string;
  misc: string;
};

type Calc = {
  id: string;
  name: string;
  calc_date: string | null;
  event_name: string | null;
  product_name: string | null;
  inputs: Inputs;
  notes: string | null;
  is_favorite: boolean;
  updated_at: string;
};

const blank: Inputs = {
  grossRevenue: "",
  salesCount: "",
  avgOrderValue: "",
  cogs: "",
  boothFee: "",
  inventoryCost: "",
  supplies: "",
  fuel: "",
  mileageCost: "",
  food: "",
  hotel: "",
  parking: "",
  labor: "",
  transactionFees: "",
  marketing: "",
  equipment: "",
  misc: "",
};

const LS_KEY = "trovin.academy.profit.local";

// ---------- Helpers ----------

const n = (v: string) => {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : 0;
};
const money = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD" });
const pct = (v: number) =>
  Number.isFinite(v) ? `${v.toFixed(1)}%` : "—";

function compute(i: Inputs) {
  const revenue = n(i.grossRevenue);
  const cogs = n(i.cogs);
  const travel = n(i.fuel) + n(i.mileageCost) + n(i.hotel) + n(i.parking) + n(i.food);
  const operating =
    n(i.boothFee) +
    n(i.inventoryCost) +
    n(i.supplies) +
    n(i.labor) +
    n(i.transactionFees) +
    n(i.marketing) +
    n(i.equipment) +
    n(i.misc);
  const totalExpenses = cogs + travel + operating;
  const grossProfit = revenue - cogs;
  const netProfit = revenue - totalExpenses;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const expenseRatio = revenue > 0 ? (totalExpenses / revenue) * 100 : 0;
  const sales = Math.max(0, n(i.salesCount));
  const avgProfitPerSale = sales > 0 ? netProfit / sales : 0;
  const breakEven = totalExpenses;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
  const profitable = netProfit > 0;
  const profitAfterBooth = revenue - n(i.boothFee);
  const profitAfterTravel = netProfit - travel + travel; // for clarity show net minus travel separately
  const netExcludingTravel = revenue - (totalExpenses - travel);
  const bestCase = netProfit * 1.2;
  const conservative = netProfit * 0.8;
  const boothPctOfRevenue = revenue > 0 ? (n(i.boothFee) / revenue) * 100 : 0;
  const moreToBreakEven = Math.max(0, totalExpenses - revenue);

  return {
    revenue,
    totalExpenses,
    grossProfit,
    netProfit,
    margin,
    expenseRatio,
    avgProfitPerSale,
    breakEven,
    roi,
    profitable,
    profitAfterBooth,
    profitAfterTravel: netExcludingTravel,
    travel,
    bestCase,
    conservative,
    boothPctOfRevenue,
    moreToBreakEven,
  };
}

// ---------- Field definitions ----------

const fieldGroups: {
  title: string;
  number: string;
  fields: {
    key: keyof Inputs;
    label: string;
    prefix?: string;
    suffix?: string;
  }[];
}[] = [
  {
    title: "Revenue",
    number: "01",
    fields: [
      { key: "grossRevenue", label: "Gross Revenue", prefix: "$" },
      { key: "salesCount", label: "Total Sales Count", suffix: "sales" },
      { key: "avgOrderValue", label: "Average Order Value (optional)", prefix: "$" },
    ],
  },
  {
    title: "Cost of goods & booth",
    number: "02",
    fields: [
      { key: "cogs", label: "Cost of Goods Sold", prefix: "$" },
      { key: "boothFee", label: "Booth Fee", prefix: "$" },
      { key: "inventoryCost", label: "Inventory Cost", prefix: "$" },
      { key: "supplies", label: "Supplies", prefix: "$" },
    ],
  },
  {
    title: "Travel",
    number: "03",
    fields: [
      { key: "fuel", label: "Fuel", prefix: "$" },
      { key: "mileageCost", label: "Mileage Cost", prefix: "$" },
      { key: "food", label: "Food", prefix: "$" },
      { key: "hotel", label: "Hotel", prefix: "$" },
      { key: "parking", label: "Parking", prefix: "$" },
    ],
  },
  {
    title: "Operations",
    number: "04",
    fields: [
      { key: "labor", label: "Employee / Labor", prefix: "$" },
      { key: "transactionFees", label: "Transaction Fees", prefix: "$" },
      { key: "marketing", label: "Marketing", prefix: "$" },
      { key: "equipment", label: "Equipment", prefix: "$" },
      { key: "misc", label: "Miscellaneous", prefix: "$" },
    ],
  },
];

type SortKey = "updated" | "profit" | "revenue" | "expenses" | "date" | "margin";

// ---------- Component ----------

function ProfitCalculator() {
  const { user, loading: authLoading } = useAuth();
  const [calcs, setCalcs] = useState<Calc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState("Untitled calculation");
  const [calcDate, setCalcDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [eventName, setEventName] = useState("");
  const [productName, setProductName] = useState("");
  const [notes, setNotes] = useState("");
  const [inputs, setInputs] = useState<Inputs>(blank);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const results = useMemo(() => compute(inputs), [inputs]);

  // Load list when signed in
  useEffect(() => {
    if (!user) return;
    setLoadingList(true);
    supabase
      .from("academy_profit_calculations")
      .select(
        "id, name, calc_date, event_name, product_name, inputs, notes, is_favorite, updated_at",
      )
      .order("is_favorite", { ascending: false })
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Couldn't load your saved calculations.");
        } else if (data) {
          setCalcs(
            data.map((c) => ({
              id: c.id as string,
              name: (c.name as string) ?? "Untitled",
              calc_date: (c.calc_date as string | null) ?? null,
              event_name: (c.event_name as string | null) ?? null,
              product_name: (c.product_name as string | null) ?? null,
              inputs: { ...blank, ...(c.inputs as Partial<Inputs>) },
              notes: (c.notes as string | null) ?? null,
              is_favorite: !!c.is_favorite,
              updated_at: c.updated_at as string,
            })),
          );
        }
        setLoadingList(false);
      });
  }, [user]);

  // Local cache fallback
  useEffect(() => {
    if (user) return;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.inputs) setInputs({ ...blank, ...p.inputs });
        if (p?.name) setName(p.name);
        if (p?.calc_date) setCalcDate(p.calc_date);
        if (p?.event_name) setEventName(p.event_name);
        if (p?.product_name) setProductName(p.product_name);
        if (p?.notes) setNotes(p.notes);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            inputs,
            name,
            calc_date: calcDate,
            event_name: eventName,
            product_name: productName,
            notes,
          }),
        );
        setSavedAt(new Date());
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [inputs, name, calcDate, eventName, productName, notes, user]);

  // Autosave to supabase when editing an existing one
  useEffect(() => {
    if (!user || !activeId) return;
    const t = setTimeout(async () => {
      const { error } = await supabase
        .from("academy_profit_calculations")
        .update({
          name,
          calc_date: calcDate || null,
          event_name: eventName || null,
          product_name: productName || null,
          notes: notes || null,
          inputs: inputs as unknown as never,
        })
        .eq("id", activeId);
      if (!error) {
        setSavedAt(new Date());
        setCalcs((list) =>
          list.map((c) =>
            c.id === activeId
              ? {
                  ...c,
                  name,
                  calc_date: calcDate || null,
                  event_name: eventName || null,
                  product_name: productName || null,
                  notes: notes || null,
                  inputs,
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        );
      }
    }, 800);
    return () => clearTimeout(t);
  }, [inputs, name, calcDate, eventName, productName, notes, activeId, user]);

  const setField = (k: keyof Inputs, v: string) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const loadCalc = (c: Calc) => {
    setActiveId(c.id);
    setName(c.name);
    setCalcDate(c.calc_date ?? "");
    setEventName(c.event_name ?? "");
    setProductName(c.product_name ?? "");
    setNotes(c.notes ?? "");
    setInputs({ ...blank, ...c.inputs });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const newCalc = () => {
    setActiveId(null);
    setName("Untitled calculation");
    setCalcDate(new Date().toISOString().slice(0, 10));
    setEventName("");
    setProductName("");
    setNotes("");
    setInputs(blank);
  };

  const save = async () => {
    if (!user) {
      toast.error("Sign in to save calculations to your account.");
      return;
    }
    setSaving(true);
    if (activeId) {
      const { error } = await supabase
        .from("academy_profit_calculations")
        .update({
          name,
          calc_date: calcDate || null,
          event_name: eventName || null,
          product_name: productName || null,
          notes: notes || null,
          inputs: inputs as unknown as never,
        })
        .eq("id", activeId);
      if (error) toast.error("Save failed.");
      else {
        toast.success("Saved.");
        setSavedAt(new Date());
      }
    } else {
      const { data, error } = await supabase
        .from("academy_profit_calculations")
        .insert({
          user_id: user.id,
          name,
          calc_date: calcDate || null,
          event_name: eventName || null,
          product_name: productName || null,
          notes: notes || null,
          inputs: inputs as unknown as never,
        })
        .select(
          "id, name, calc_date, event_name, product_name, inputs, notes, is_favorite, updated_at",
        )
        .single();
      if (error || !data) toast.error("Save failed.");
      else {
        const created: Calc = {
          id: data.id as string,
          name: data.name as string,
          calc_date: (data.calc_date as string | null) ?? null,
          event_name: (data.event_name as string | null) ?? null,
          product_name: (data.product_name as string | null) ?? null,
          inputs: { ...blank, ...(data.inputs as Partial<Inputs>) },
          notes: (data.notes as string | null) ?? null,
          is_favorite: !!data.is_favorite,
          updated_at: data.updated_at as string,
        };
        setCalcs((l) => [created, ...l]);
        setActiveId(created.id);
        setSavedAt(new Date());
        toast.success("Calculation saved.");
      }
    }
    setSaving(false);
  };

  const duplicate = async (c: Calc) => {
    if (!user) {
      toast.error("Sign in to duplicate.");
      return;
    }
    const { data, error } = await supabase
      .from("academy_profit_calculations")
      .insert({
        user_id: user.id,
        name: `${c.name} (copy)`,
        calc_date: c.calc_date,
        event_name: c.event_name,
        product_name: c.product_name,
        notes: c.notes,
        inputs: c.inputs as unknown as never,
      })
      .select(
        "id, name, calc_date, event_name, product_name, inputs, notes, is_favorite, updated_at",
      )
      .single();
    if (error || !data) toast.error("Couldn't duplicate.");
    else {
      const created: Calc = {
        id: data.id as string,
        name: data.name as string,
        calc_date: (data.calc_date as string | null) ?? null,
        event_name: (data.event_name as string | null) ?? null,
        product_name: (data.product_name as string | null) ?? null,
        inputs: { ...blank, ...(data.inputs as Partial<Inputs>) },
        notes: (data.notes as string | null) ?? null,
        is_favorite: !!data.is_favorite,
        updated_at: data.updated_at as string,
      };
      setCalcs((l) => [created, ...l]);
      toast.success("Duplicated.");
    }
  };

  const remove = async (c: Calc) => {
    if (!user) return;
    if (!confirm(`Delete "${c.name}"?`)) return;
    const { error } = await supabase
      .from("academy_profit_calculations")
      .delete()
      .eq("id", c.id);
    if (error) toast.error("Delete failed.");
    else {
      setCalcs((l) => l.filter((x) => x.id !== c.id));
      if (activeId === c.id) newCalc();
    }
  };

  const toggleFavorite = async (c: Calc) => {
    if (!user) return;
    const next = !c.is_favorite;
    setCalcs((l) =>
      l.map((x) => (x.id === c.id ? { ...x, is_favorite: next } : x)),
    );
    const { error } = await supabase
      .from("academy_profit_calculations")
      .update({ is_favorite: next })
      .eq("id", c.id);
    if (error) {
      setCalcs((l) =>
        l.map((x) => (x.id === c.id ? { ...x, is_favorite: !next } : x)),
      );
      toast.error("Couldn't update favorite.");
    }
  };

  const events = useMemo(() => {
    const s = new Set<string>();
    calcs.forEach((c) => c.event_name && s.add(c.event_name));
    return Array.from(s).sort();
  }, [calcs]);

  const filtered = useMemo(() => {
    let arr = calcs.filter((c) => {
      if (eventFilter !== "all" && c.event_name !== eventFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.event_name ?? "").toLowerCase().includes(q) ||
          (c.product_name ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
    arr = [...arr].sort((a, b) => {
      const ra = compute(a.inputs);
      const rb = compute(b.inputs);
      switch (sort) {
        case "profit":
          return rb.netProfit - ra.netProfit;
        case "revenue":
          return rb.revenue - ra.revenue;
        case "expenses":
          return rb.totalExpenses - ra.totalExpenses;
        case "margin":
          return rb.margin - ra.margin;
        case "date":
          return (b.calc_date ?? "").localeCompare(a.calc_date ?? "");
        default:
          return b.updated_at.localeCompare(a.updated_at);
      }
    });
    return arr;
  }, [calcs, eventFilter, query, sort]);

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      [
        "Name",
        "Date",
        "Event",
        "Product",
        "Revenue",
        "Expenses",
        "Net Profit",
        "Margin %",
        "ROI %",
      ],
    ];
    filtered.forEach((c) => {
      const r = compute(c.inputs);
      rows.push([
        c.name,
        c.calc_date ?? "",
        c.event_name ?? "",
        c.product_name ?? "",
        r.revenue.toFixed(2),
        r.totalExpenses.toFixed(2),
        r.netProfit.toFixed(2),
        r.margin.toFixed(1),
        r.roi.toFixed(1),
      ]);
    });
    const csv = rows
      .map((r) =>
        r
          .map((v) => {
            const s = String(v);
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-calculations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tone =
    Math.abs(results.netProfit) < 0.01
      ? "neutral"
      : results.profitable
        ? "good"
        : "warn";

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · money & pricing"
        title="Profit calculator"
        description="Add up the day. See if your event, product, or pop-up actually made money — net of booth, travel, fees, and everything in between."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={newCalc} className="ac-btn-ghost">
              <Plus className="h-4 w-4" /> New calculation
            </button>
            <button onClick={exportCsv} className="ac-btn-ghost">
              <FileDown className="h-4 w-4" /> Export CSV
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
            <button
              onClick={save}
              disabled={saving || authLoading}
              className="ac-btn"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : activeId ? "Save changes" : "Save calculation"}
            </button>
          </div>
        }
      />

      {/* Save bar */}
      <div className="ac-no-print mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[var(--ac-rule-soft)] bg-white px-4 py-2 text-xs">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-0 flex-1 border-b border-transparent bg-transparent py-1 text-sm font-medium focus:border-[var(--ac-ink)] focus:outline-none"
          style={{ fontFamily: "Fraunces, serif" }}
          placeholder="Name this calculation"
        />
        <span className="flex items-center gap-2 text-[var(--ac-ink-mute)]">
          {!user && !authLoading && (
            <Link to="/login" className="text-[var(--ac-terracotta)] underline">
              Sign in to save
            </Link>
          )}
          {user && savedAt && `Saved · ${savedAt.toLocaleTimeString()}`}
        </span>
      </div>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <SummaryCard label="Net Profit" value={money(results.netProfit)} tone={tone} />
        <SummaryCard label="Total Revenue" value={money(results.revenue)} tone="neutral" />
        <SummaryCard label="Total Expenses" value={money(results.totalExpenses)} tone="neutral" />
        <SummaryCard label="Profit Margin" value={pct(results.margin)} tone={tone} />
        <SummaryCard label="ROI" value={pct(results.roi)} tone={tone} />
        <SummaryCard label="Break-Even Revenue" value={money(results.breakEven)} tone="neutral" />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {/* Top meta */}
          <section className="ac-card p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Labeled label="Date">
                <input
                  type="date"
                  value={calcDate}
                  onChange={(e) => setCalcDate(e.target.value)}
                  className="ac-input"
                />
              </Labeled>
              <Labeled label="Event name">
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="ac-input"
                  placeholder="Spring Maker's Market"
                />
              </Labeled>
              <Labeled label="Product (optional)">
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="ac-input"
                  placeholder="Soy candle, 8oz"
                />
              </Labeled>
              <Labeled label="Notes">
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="ac-input"
                  placeholder="Weather, traffic, what worked…"
                />
              </Labeled>
            </div>
          </section>

          {/* Input groups */}
          {fieldGroups.map((g) => (
            <section key={g.title} className="ac-card p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="ac-number">{g.number}</span>
                <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
                  {g.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.fields.map((f) => (
                  <Labeled key={f.key} label={f.label}>
                    <div className="relative">
                      {f.prefix && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--ac-ink-mute)]">
                          {f.prefix}
                        </span>
                      )}
                      <input
                        inputMode="decimal"
                        value={inputs[f.key]}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className={`ac-input ${f.prefix ? "pl-7" : ""} ${
                          f.suffix ? "pr-14" : ""
                        }`}
                        placeholder="0"
                      />
                      {f.suffix && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ac-ink-mute)]">
                          {f.suffix}
                        </span>
                      )}
                    </div>
                  </Labeled>
                ))}
              </div>
            </section>
          ))}

          {/* Detailed results */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard label="Gross Profit" value={money(results.grossProfit)} tone={results.grossProfit > 0 ? "good" : "warn"} hint="Revenue minus COGS." />
            <ResultCard label="Net Profit" value={money(results.netProfit)} tone={tone} hint="After every expense." />
            <ResultCard label="Profit Margin" value={pct(results.margin)} tone={tone} />
            <ResultCard label="Expense Ratio" value={pct(results.expenseRatio)} tone="neutral" hint="Expenses ÷ revenue." />
            <ResultCard label="Avg Profit / Sale" value={money(results.avgProfitPerSale)} tone={results.avgProfitPerSale > 0 ? "good" : "warn"} />
            <ResultCard label="Break-Even Revenue" value={money(results.breakEven)} tone="neutral" />
            <ResultCard label="ROI" value={pct(results.roi)} tone={tone} hint="Net profit ÷ expenses." />
            <ResultCard label="Profit After Booth Fee" value={money(results.profitAfterBooth)} tone={results.profitAfterBooth > 0 ? "good" : "warn"} hint="Revenue minus booth only." />
            <ResultCard label="Profit Excl. Travel" value={money(results.profitAfterTravel)} tone={results.profitAfterTravel > 0 ? "good" : "warn"} hint="What you'd earn if travel were $0." />
            <ResultCard label="Best Case (+20%)" value={money(results.bestCase)} tone="accent" />
            <ResultCard label="Conservative (-20%)" value={money(results.conservative)} tone="neutral" />
            <ResultCard
              label="Was This Profitable?"
              value={
                results.revenue === 0
                  ? "—"
                  : results.profitable
                    ? "Yes"
                    : "No"
              }
              tone={tone}
            />
          </section>

          {/* Insights */}
          <section className="ac-card p-5 md:p-6">
            <p className="ac-eyebrow">vendor insights</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--ac-ink-soft)]">
              {results.revenue === 0 && (
                <li>Enter your gross revenue to see how the day stacked up.</li>
              )}
              {results.revenue > 0 && results.moreToBreakEven > 0 && (
                <li>
                  You need to sell <strong className="text-[var(--ac-ink)]">{money(results.moreToBreakEven)}</strong> more to break even.
                </li>
              )}
              {results.revenue > 0 && results.moreToBreakEven === 0 && results.profitable && (
                <li>This event appears <strong className="text-[var(--ac-ink)]">profitable</strong>. Save it and use it as a benchmark.</li>
              )}
              {results.boothPctOfRevenue > 0 && (
                <li>
                  Your booth fee used <strong className="text-[var(--ac-ink)]">{pct(results.boothPctOfRevenue)}</strong> of revenue.
                  {results.boothPctOfRevenue > 25 && " That's high — consider negotiating, sharing space, or targeting events with higher foot traffic."}
                </li>
              )}
              {results.expenseRatio > 80 && results.revenue > 0 && (
                <li>Your expenses were high compared to sales. Trim travel or COGS before repeating this event.</li>
              )}
              {results.revenue > 0 && !results.profitable && (
                <li>This event may not be worth repeating unless sales increase by at least <strong className="text-[var(--ac-ink)]">{money(results.moreToBreakEven)}</strong>.</li>
              )}
              {results.margin > 30 && (
                <li>Healthy margin at <strong className="text-[var(--ac-ink)]">{pct(results.margin)}</strong>. Stack more events like this one.</li>
              )}
            </ul>
          </section>

          {/* Saved list */}
          <section className="ac-card ac-no-print p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-xl">
                Saved calculations
              </h2>
              <span className="text-xs text-[var(--ac-ink-mute)]">
                {user ? `${calcs.length} saved` : "Sign in to sync"}
              </span>
            </div>

            {user && calcs.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, event, product…"
                    className="ac-input pl-9"
                  />
                </div>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="ac-input max-w-[180px]"
                >
                  <option value="all">All events</option>
                  {events.map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ac-ink-mute)]" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="ac-input pl-9 max-w-[200px]"
                  >
                    <option value="updated">Recently updated</option>
                    <option value="profit">Net profit</option>
                    <option value="revenue">Revenue</option>
                    <option value="expenses">Expenses</option>
                    <option value="margin">Margin</option>
                    <option value="date">Event date</option>
                  </select>
                </div>
              </div>
            )}

            {!user && !authLoading && (
              <p className="rounded-sm border border-dashed border-[var(--ac-rule)] bg-[var(--ac-cream-deep)]/40 p-4 text-sm text-[var(--ac-ink-soft)]">
                Your work is being saved on this device.{" "}
                <Link to="/login" className="text-[var(--ac-terracotta)] underline">
                  Sign in
                </Link>{" "}
                to save multiple named calculations and access them anywhere.
              </p>
            )}
            {user && loadingList && (
              <p className="text-sm text-[var(--ac-ink-mute)]">Loading…</p>
            )}
            {user && !loadingList && calcs.length === 0 && (
              <p className="rounded-sm border border-dashed border-[var(--ac-rule)] bg-[var(--ac-cream-deep)]/40 p-4 text-sm text-[var(--ac-ink-soft)]">
                No saved calculations yet. Fill in the numbers above and hit “Save calculation”.
              </p>
            )}
            {user && filtered.length > 0 && (
              <ul className="divide-y divide-[var(--ac-rule-soft)]">
                {filtered.map((c) => {
                  const r = compute(c.inputs);
                  const active = activeId === c.id;
                  const profitTone =
                    r.netProfit > 0
                      ? "text-emerald-700"
                      : r.netProfit < 0
                        ? "text-[var(--ac-terracotta)]"
                        : "text-[var(--ac-ink-mute)]";
                  return (
                    <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                      <button
                        onClick={() => toggleFavorite(c)}
                        className="rounded p-1 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]"
                        aria-label="Favorite"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            c.is_favorite
                              ? "fill-[var(--ac-terracotta)] text-[var(--ac-terracotta)]"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => loadCalc(c)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="truncate font-medium">
                          {c.name}
                          {active && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--ac-terracotta)]">
                              editing
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--ac-ink-mute)]">
                          {c.calc_date ?? "—"} · {c.event_name ?? "no event"}
                          {c.product_name ? ` · ${c.product_name}` : ""}
                        </p>
                        <p className="mt-1 text-xs">
                          <span className="text-[var(--ac-ink-mute)]">Rev </span>
                          <span className="text-[var(--ac-ink)]">{money(r.revenue)}</span>
                          <span className="text-[var(--ac-ink-mute)]"> · Exp </span>
                          <span className="text-[var(--ac-ink)]">{money(r.totalExpenses)}</span>
                          <span className="text-[var(--ac-ink-mute)]"> · Net </span>
                          <span className={profitTone}>{money(r.netProfit)}</span>
                          <span className="text-[var(--ac-ink-mute)]"> · </span>
                          <span className={profitTone}>{pct(r.margin)}</span>
                          <span className="text-[var(--ac-ink-mute)]"> · ROI </span>
                          <span className={profitTone}>{pct(r.roi)}</span>
                        </p>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => duplicate(c)}
                          className="rounded p-1.5 text-[var(--ac-ink-mute)] hover:text-[var(--ac-ink)]"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(c)}
                          className="rounded p-1.5 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Tips sidebar */}
        <aside className="ac-no-print space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="ac-card p-5">
            <p className="ac-eyebrow">profit tips</p>
            <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-lg leading-tight">
              The receipt tells the truth.
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--ac-ink-soft)]">
              <li>
                <strong className="text-[var(--ac-ink)]">Log travel honestly.</strong>{" "}
                Fuel, hotels, food on the road — they're business expenses and they decide whether a far-away event is worth it.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">Booth fee under 20%.</strong>{" "}
                If a single booth eats more than a fifth of your revenue, the math rarely works long-term.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">Compare events side-by-side.</strong>{" "}
                Save every event. Patterns show up after 3–4 entries — same city, same crowd, same season.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Small UI primitives (match Academy look) ----------

function Labeled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--ac-ink-mute)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-600/40 bg-emerald-50/60 text-emerald-900"
      : tone === "warn"
        ? "border-[var(--ac-terracotta)]/40 bg-[var(--ac-terracotta)]/5 text-[var(--ac-terracotta)]"
        : "border-[var(--ac-rule-soft)] bg-white text-[var(--ac-ink)]";
  return (
    <div className={`rounded-sm border p-3 ${toneClass}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className="mt-1 text-xl leading-tight"
      >
        {value}
      </p>
    </div>
  );
}

function ResultCard({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral" | "accent" | "hero";
  hint?: string;
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-600/40 bg-emerald-50/60"
      : tone === "warn"
        ? "border-[var(--ac-terracotta)]/40 bg-[var(--ac-terracotta)]/5"
        : tone === "accent"
          ? "border-[var(--ac-rule)] bg-[var(--ac-cream-deep)]/40"
          : tone === "hero"
            ? "border-[var(--ac-ink)] bg-[var(--ac-ink)] text-[var(--ac-cream)]"
            : "border-[var(--ac-rule-soft)] bg-white";
  return (
    <div className={`rounded-sm border p-4 ${toneClass}`}>
      <p
        className={`text-[10px] uppercase tracking-wider ${
          tone === "hero" ? "opacity-70" : "text-[var(--ac-ink-mute)]"
        }`}
      >
        {label}
      </p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className="mt-1 text-2xl leading-tight"
      >
        {value}
      </p>
      {hint && (
        <p
          className={`mt-1 text-xs ${
            tone === "hero" ? "opacity-60" : "text-[var(--ac-ink-mute)]"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
