import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  FileDown,
  Heart,
  Info,
  Plus,
  Printer,
  Save,
  Trash2,
} from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/tools/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Calculator — Trovin Academy" },
      {
        name: "description",
        content:
          "Vendor pricing calculator: cover your costs, hit your margin, and price like a pro. Save, duplicate, and export.",
      },
    ],
  }),
  component: PricingCalculator,
});

// ---------- Types ----------

type Inputs = {
  productName: string;
  materialCost: string;
  packagingCost: string;
  laborHours: string;
  hourlyRate: string;
  boothFee: string;
  expectedSales: string;
  transactionFeePct: string;
  taxPct: string;
  desiredMarginPct: string;
  overhead: string;
  shippingCost: string;
  additionalCosts: string;
};

type Calc = {
  id: string;
  name: string;
  inputs: Inputs;
  is_favorite: boolean;
  updated_at: string;
};

const blank: Inputs = {
  productName: "",
  materialCost: "",
  packagingCost: "",
  laborHours: "",
  hourlyRate: "",
  boothFee: "",
  expectedSales: "",
  transactionFeePct: "2.9",
  taxPct: "",
  desiredMarginPct: "40",
  overhead: "",
  shippingCost: "",
  additionalCosts: "",
};

const LS_KEY = "trovin.academy.pricing.local";

// ---------- Helpers ----------

const n = (v: string) => {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : 0;
};
const money = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD" });

function compute(i: Inputs) {
  const materials = n(i.materialCost) + n(i.packagingCost) + n(i.shippingCost);
  const labor = n(i.laborHours) * n(i.hourlyRate);
  const expected = Math.max(1, n(i.expectedSales));
  const perItemBooth = n(i.boothFee) / expected;
  const perItemOverhead = n(i.overhead) / expected;
  const perItemExtra = n(i.additionalCosts) / expected;
  const baseCost =
    materials + labor + perItemBooth + perItemOverhead + perItemExtra;

  const margin = Math.min(95, Math.max(0, n(i.desiredMarginPct))) / 100;
  const txFee = Math.max(0, n(i.transactionFeePct)) / 100;
  const tax = Math.max(0, n(i.taxPct)) / 100;

  // selling price must cover cost + transaction fee + tax + margin
  // price * (1 - txFee) / (1 + tax) - cost = margin * price  →ish; simpler model:
  const breakEven = baseCost / Math.max(0.01, 1 - txFee);
  const recommended = margin < 1 ? baseCost / (1 - margin - txFee) : breakEven;
  const safeRecommended = Number.isFinite(recommended) && recommended > 0
    ? recommended
    : breakEven;
  const premium = safeRecommended * 1.25;
  const bundle = safeRecommended * 3 * 0.85; // 3-pack at 15% off

  const profitPerItem = safeRecommended * (1 - txFee) - baseCost;
  const profitPerEvent = profitPerItem * expected - 0; // booth already in cost
  const revenueGoal = safeRecommended * expected;

  return {
    totalCost: baseCost,
    breakEven,
    recommended: safeRecommended,
    premium,
    bundle,
    profitPerItem,
    profitPerEvent,
    revenueGoal,
    tax,
  };
}

// ---------- Field definitions ----------

const fields: {
  key: keyof Inputs;
  label: string;
  prefix?: string;
  suffix?: string;
  info: string;
  type?: "text" | "number";
}[] = [
  {
    key: "productName",
    label: "Product Name",
    info: "Name this product so you can find it later. Example: 'Hand-poured soy candle, 8oz'.",
    type: "text",
  },
  {
    key: "materialCost",
    label: "Material Cost",
    prefix: "$",
    info: "Raw materials per single finished item (wax, wick, fragrance, jar, etc).",
  },
  {
    key: "packagingCost",
    label: "Packaging Cost",
    prefix: "$",
    info: "Boxes, tissue, stickers, tags, bags — per item.",
  },
  {
    key: "laborHours",
    label: "Labor Hours",
    suffix: "hrs",
    info: "Time it takes to make one finished item, including prep and cleanup.",
  },
  {
    key: "hourlyRate",
    label: "Hourly Rate",
    prefix: "$",
    info: "What you pay yourself per hour. If unsure, start at $25–$40.",
  },
  {
    key: "boothFee",
    label: "Booth Fee",
    prefix: "$",
    info: "Total event/booth cost for the day. Split across expected sales.",
  },
  {
    key: "expectedSales",
    label: "Expected Number of Sales",
    suffix: "items",
    info: "Realistic count of this product you expect to sell at the event.",
  },
  {
    key: "transactionFeePct",
    label: "Transaction Fee",
    suffix: "%",
    info: "Card processor fee — Square is ~2.6%, Stripe/PayPal ~2.9% + $0.30.",
  },
  {
    key: "taxPct",
    label: "Sales Tax",
    suffix: "%",
    info: "Local sales tax rate, for reference. Doesn't change your take-home unless tax-included pricing.",
  },
  {
    key: "desiredMarginPct",
    label: "Desired Profit Margin",
    suffix: "%",
    info: "Profit kept on every sale. 40–60% is healthy for handmade goods.",
  },
  {
    key: "overhead",
    label: "Optional Overhead",
    prefix: "$",
    info: "Studio rent, insurance, subscriptions for this event period.",
  },
  {
    key: "shippingCost",
    label: "Shipping Cost",
    prefix: "$",
    info: "Cost to ship raw materials in, or to fulfill an online order — per item.",
  },
  {
    key: "additionalCosts",
    label: "Additional Costs",
    prefix: "$",
    info: "Gas, parking, hired help, samples. Split across expected sales.",
  },
];

// ---------- Component ----------

function PricingCalculator() {
  const { user, loading: authLoading } = useAuth();
  const [calcs, setCalcs] = useState<Calc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Inputs>(blank);
  const [name, setName] = useState("Untitled calculation");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const results = useMemo(() => compute(inputs), [inputs]);

  // Load list when signed in
  useEffect(() => {
    if (!user) return;
    setLoadingList(true);
    supabase
      .from("academy_pricing_calculations")
      .select("id, name, inputs, is_favorite, updated_at")
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
              inputs: { ...blank, ...(c.inputs as Partial<Inputs>) },
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
        const parsed = JSON.parse(raw);
        if (parsed?.inputs) setInputs({ ...blank, ...parsed.inputs });
        if (parsed?.name) setName(parsed.name);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    if (user) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ inputs, name }));
        setSavedAt(new Date());
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [inputs, name, user]);

  const setField = (k: keyof Inputs, v: string) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const loadCalc = (c: Calc) => {
    setActiveId(c.id);
    setName(c.name);
    setInputs({ ...blank, ...c.inputs });
  };

  const newCalc = () => {
    setActiveId(null);
    setName("Untitled calculation");
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
        .from("academy_pricing_calculations")
        .update({ name, inputs: inputs as unknown as never })
        .eq("id", activeId);
      if (error) {
        toast.error("Save failed.");
      } else {
        setSavedAt(new Date());
        setCalcs((list) =>
          list.map((c) =>
            c.id === activeId
              ? { ...c, name, inputs, updated_at: new Date().toISOString() }
              : c,
          ),
        );
        toast.success("Saved.");
      }
    } else {
      const { data, error } = await supabase
        .from("academy_pricing_calculations")
        .insert({
          user_id: user.id,
          name,
          inputs: inputs as unknown as never,
        })
        .select("id, name, inputs, is_favorite, updated_at")
        .single();
      if (error || !data) {
        toast.error("Save failed.");
      } else {
        const created: Calc = {
          id: data.id as string,
          name: data.name as string,
          inputs: { ...blank, ...(data.inputs as Partial<Inputs>) },
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
    if (!user) return;
    const { data, error } = await supabase
      .from("academy_pricing_calculations")
      .insert({
        user_id: user.id,
        name: `${c.name} (copy)`,
        inputs: c.inputs as unknown as never,
      })
      .select("id, name, inputs, is_favorite, updated_at")
      .single();
    if (error || !data) {
      toast.error("Duplicate failed.");
      return;
    }
    const created: Calc = {
      id: data.id as string,
      name: data.name as string,
      inputs: { ...blank, ...(data.inputs as Partial<Inputs>) },
      is_favorite: false,
      updated_at: data.updated_at as string,
    };
    setCalcs((l) => [created, ...l]);
    toast.success("Duplicated.");
  };

  const remove = async (c: Calc) => {
    if (!user) return;
    if (!confirm(`Delete "${c.name}"?`)) return;
    const { error } = await supabase
      .from("academy_pricing_calculations")
      .delete()
      .eq("id", c.id);
    if (error) {
      toast.error("Delete failed.");
      return;
    }
    setCalcs((l) => l.filter((x) => x.id !== c.id));
    if (activeId === c.id) newCalc();
    toast.success("Deleted.");
  };

  const toggleFavorite = async (c: Calc) => {
    if (!user) return;
    const next = !c.is_favorite;
    setCalcs((l) =>
      l.map((x) => (x.id === c.id ? { ...x, is_favorite: next } : x)),
    );
    const { error } = await supabase
      .from("academy_pricing_calculations")
      .update({ is_favorite: next })
      .eq("id", c.id);
    if (error) {
      toast.error("Couldn't update favorite.");
      setCalcs((l) =>
        l.map((x) => (x.id === c.id ? { ...x, is_favorite: !next } : x)),
      );
    }
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · money & pricing"
        title="Pricing calculator"
        description="Plug in your costs and we'll work out break-even, recommended, premium, and bundle pricing in real time."
        actions={
          <div className="flex flex-wrap gap-2">
            <button onClick={newCalc} className="ac-btn-ghost">
              <Plus className="h-4 w-4" /> New
            </button>
            <button
              onClick={() => window.print()}
              className="ac-btn-ghost"
              title="Use 'Save as PDF' in the print dialog"
            >
              <FileDown className="h-4 w-4" /> Export PDF
            </button>
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={save}
              disabled={saving || authLoading}
              className="ac-btn"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save calculation"}
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

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {/* Inputs */}
          <section className="ac-card p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="ac-number">01</span>
              <h2
                style={{ fontFamily: "Fraunces, serif" }}
                className="text-xl"
              >
                Your numbers
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={inputs[f.key]}
                  onChange={(v) => setField(f.key, v)}
                />
              ))}
            </div>
          </section>

          {/* Results */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              label="Total cost per item"
              value={money(results.totalCost)}
              tone="neutral"
            />
            <ResultCard
              label="Break-even price"
              value={money(results.breakEven)}
              tone="neutral"
              hint="Covers cost + card fees only."
            />
            <ResultCard
              label="Recommended price"
              value={money(results.recommended)}
              tone="hero"
              hint="Hits your margin after fees."
            />
            <ResultCard
              label="Premium price"
              value={money(results.premium)}
              tone="accent"
              hint="+25% — for limited / signature pieces."
            />
            <ResultCard
              label="Bundle price (3-pack)"
              value={money(results.bundle)}
              tone="accent"
              hint="3 items at 15% off."
            />
            <ResultCard
              label="Profit per item"
              value={money(results.profitPerItem)}
              tone={results.profitPerItem > 0 ? "good" : "warn"}
            />
            <ResultCard
              label="Profit per event"
              value={money(results.profitPerEvent)}
              tone={results.profitPerEvent > 0 ? "good" : "warn"}
              hint="Based on expected sales."
            />
            <ResultCard
              label="Revenue goal"
              value={money(results.revenueGoal)}
              tone="neutral"
              hint="Recommended price × expected sales."
            />
          </section>

          {/* Saved list */}
          <section className="ac-card ac-no-print p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                style={{ fontFamily: "Fraunces, serif" }}
                className="text-xl"
              >
                Saved calculations
              </h2>
              <span className="text-xs text-[var(--ac-ink-mute)]">
                {user ? `${calcs.length} saved` : "Sign in to sync"}
              </span>
            </div>
            {!user && !authLoading && (
              <p className="rounded-sm border border-dashed border-[var(--ac-rule)] bg-[var(--ac-cream-deep)]/40 p-4 text-sm text-[var(--ac-ink-soft)]">
                Your work is being saved on this device.{" "}
                <Link
                  to="/login"
                  className="text-[var(--ac-terracotta)] underline"
                >
                  Sign in
                </Link>{" "}
                to save multiple named calculations and access them anywhere.
              </p>
            )}
            {user && loadingList && (
              <p className="text-sm text-[var(--ac-ink-mute)]">Loading…</p>
            )}
            {user && !loadingList && calcs.length === 0 && (
              <p className="text-sm text-[var(--ac-ink-mute)]">
                No saved calculations yet. Hit “Save calculation” above.
              </p>
            )}
            {user && calcs.length > 0 && (
              <ul className="divide-y divide-[var(--ac-rule-soft)]">
                {calcs.map((c) => {
                  const r = compute(c.inputs);
                  const active = activeId === c.id;
                  return (
                    <li
                      key={c.id}
                      className={`flex flex-wrap items-center gap-3 py-3 ${
                        active ? "opacity-100" : ""
                      }`}
                    >
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
                          {c.inputs.productName || "—"} ·{" "}
                          {money(r.recommended)} recommended ·{" "}
                          {money(r.profitPerItem)} profit
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
            <p className="ac-eyebrow">pricing tips</p>
            <h3
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-2 text-lg leading-tight"
            >
              Charge for the whole craft, not the wax.
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--ac-ink-soft)]">
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Always pay yourself.
                </strong>{" "}
                Free labor hides a failing business. Use $25/hr minimum.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Margin ≠ markup.
                </strong>{" "}
                A 50% margin means cost is half of price (2× markup), not 1.5×.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Round up, not down.
                </strong>{" "}
                $24 reads cheaper than $23.50. Confidence sells.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Anchor with a premium tier.
                </strong>{" "}
                A higher-priced “signature” option makes your recommended price
                feel like the smart pick.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Bundles move slow stock.
                </strong>{" "}
                Discount 10–20%; never reveal individual unit math on the sign.
              </li>
              <li>
                <strong className="text-[var(--ac-ink)]">
                  Booth fees are real costs.
                </strong>{" "}
                Split them across realistic — not hopeful — sales counts.
              </li>
            </ul>
          </div>

          <div className="rounded-sm border border-[var(--ac-rule-soft)] bg-[var(--ac-cream-deep)]/50 p-5">
            <p className="ac-eyebrow">rule of thumb</p>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-2 text-base italic leading-snug"
            >
              “If you wouldn't buy your own product at full price, raise it
              until you would.”
            </p>
          </div>
        </aside>
      </div>

      <div className="ac-no-print mt-12 border-t border-[var(--ac-rule-soft)] pt-6 text-center">
        <Link
          to="/academy/categories"
          className="text-sm text-[var(--ac-terracotta)] hover:underline"
        >
          ← Back to categories
        </Link>
      </div>
    </div>
  );
}

// ---------- Subcomponents ----------

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: (typeof fields)[number];
  value: string;
  onChange: (v: string) => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const isText = field.type === "text";
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="ac-eyebrow">{field.label}</span>
        <button
          type="button"
          onClick={() => setShowInfo((v) => !v)}
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="relative rounded-full text-[var(--ac-ink-mute)] hover:text-[var(--ac-ink)]"
          aria-label={`What is ${field.label}?`}
        >
          <Info className="h-3.5 w-3.5" />
          {showInfo && (
            <span className="absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-sm border border-[var(--ac-rule-soft)] bg-white p-2.5 text-left text-[11px] leading-snug text-[var(--ac-ink-soft)] shadow-md">
              {field.info}
            </span>
          )}
        </button>
      </div>
      <div className="relative">
        {field.prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--ac-ink-mute)]">
            {field.prefix}
          </span>
        )}
        <input
          type={isText ? "text" : "number"}
          inputMode={isText ? "text" : "decimal"}
          step={isText ? undefined : "any"}
          min={isText ? undefined : 0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isText ? "Lavender soy candle, 8oz" : "0"}
          className={`w-full rounded-full border border-[var(--ac-rule)] bg-white py-2.5 text-sm text-[var(--ac-ink)] shadow-sm transition focus:border-[var(--ac-ink)] focus:outline-none ${
            field.prefix ? "pl-7" : "pl-4"
          } ${field.suffix ? "pr-14" : "pr-4"}`}
        />
        {field.suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--ac-ink-mute)]">
            {field.suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function ResultCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: "neutral" | "hero" | "accent" | "good" | "warn";
}) {
  const styles: Record<typeof tone, string> = {
    neutral: "bg-white border-[var(--ac-rule-soft)]",
    hero:
      "bg-[var(--ac-ink)] text-[var(--ac-paper)] border-[var(--ac-ink)]",
    accent:
      "bg-[var(--ac-cream-deep)] border-[var(--ac-rule)]",
    good:
      "bg-[var(--ac-forest)]/10 border-[var(--ac-forest)]/30",
    warn:
      "bg-[var(--ac-terracotta)]/10 border-[var(--ac-terracotta)]/30",
  };
  return (
    <div className={`rounded-sm border p-4 ${styles[tone]}`}>
      <p
        className={`text-[11px] uppercase tracking-[0.18em] ${
          tone === "hero"
            ? "text-[var(--ac-terracotta-soft)]"
            : "text-[var(--ac-ink-mute)]"
        }`}
      >
        {label}
      </p>
      <p
        style={{ fontFamily: "Fraunces, serif" }}
        className="mt-2 text-3xl leading-none"
      >
        {value}
      </p>
      {hint && (
        <p
          className={`mt-2 text-[11px] leading-snug ${
            tone === "hero"
              ? "text-[var(--ac-paper)]/70"
              : "text-[var(--ac-ink-mute)]"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
