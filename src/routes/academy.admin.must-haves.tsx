import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Save, Pencil, X, Star, Download, Upload } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CSV_COLUMNS = [
  "name","brand","category_slug","short_description","full_description","why_recommended",
  "image_url","images","purchase_url","affiliate_url",
  "price_min","price_max","price_display",
  "pros","cons","best_uses","best_for",
  "is_featured","is_staff_pick","is_trovin_recommended",
] as const;

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function downloadTemplate() {
  const header = CSV_COLUMNS.join(",");
  const sample = [
    "EZ-UP Endeavor 10x10","E-Z UP","canopy-tents",
    "Heavy-duty pop-up canopy for outdoor markets.",
    "Sturdy steel frame with vented top for windy conditions.",
    "Trusted by thousands of vendors; survives real market weather.",
    "https://example.com/canopy.jpg",
    "https://example.com/canopy-2.jpg|https://example.com/canopy-3.jpg",
    "https://www.amazon.com/dp/XXXX","",
    "250","350","$250–$350",
    "Sturdy frame|Vented top|Easy setup",
    "Heavy to carry alone",
    "Outdoor markets|Festivals",
    "craft|food|maker",
    "false","true","true",
  ].map(csvEscape).join(",");
  const blob = new Blob([header + "\n" + sample + "\n"], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "must-haves-template.csv";
  a.click(); URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { field += c; }
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (field.length || cur.length) { cur.push(field); rows.push(cur); cur = []; field = ""; }
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.some((v) => v.trim() !== "")).map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, idx) => { o[h] = (r[idx] ?? "").trim(); });
    return o;
  });
}

function toBool(v: string) { return /^(1|true|yes|y)$/i.test(v); }
function toList(v: string) { return v ? v.split(/[|;]/).map((s) => s.trim()).filter(Boolean) : []; }
function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : null; }

export const Route = createFileRoute("/academy/admin/must-haves")({
  head: () => ({ meta: [{ title: "Admin — Vendor Must-Haves" }] }),
  component: AdminMustHaves,
});

type Category = { slug: string; title: string; group_name: string };
type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category_slug: string;
  short_description: string | null;
  full_description: string | null;
  why_recommended: string | null;
  pros: string[];
  cons: string[];
  best_uses: string[];
  best_for: string[];
  price_min: number | null;
  price_max: number | null;
  price_display: string | null;
  image_url: string | null;
  images: string[];
  purchase_url: string | null;
  affiliate_url: string | null;
  is_featured: boolean;
  is_staff_pick: boolean;
  is_trovin_recommended: boolean;
};

const empty = (catSlug: string): Product => ({
  id: "",
  slug: "",
  name: "",
  brand: "",
  category_slug: catSlug,
  short_description: "",
  full_description: "",
  why_recommended: "",
  pros: [],
  cons: [],
  best_uses: [],
  best_for: [],
  price_min: null,
  price_max: null,
  price_display: "",
  image_url: "",
  images: [],
  purchase_url: "",
  affiliate_url: "",
  is_featured: false,
  is_staff_pick: false,
  is_trovin_recommended: false,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function AdminMustHaves() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user, authLoading]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [c, p] = await Promise.all([
        supabase.from("academy_musthave_categories").select("slug,title,group_name").order("group_name").order("sort_order"),
        supabase.from("academy_musthave_products").select("*").order("created_at", { ascending: false }),
      ]);
      setCats((c.data as Category[]) ?? []);
      setProducts((p.data as Product[]) ?? []);
    })();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return q ? products.filter((p) => (p.name + " " + (p.brand ?? "")).toLowerCase().includes(q)) : products;
  }, [products, query]);

  const newProduct = () => {
    const firstCat = cats[0]?.slug ?? "";
    setEditing(empty(firstCat));
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const slug = editing.slug || slugify(editing.name);
    const payload = { ...editing, slug, brand: editing.brand || null, image_url: editing.image_url || null,
      purchase_url: editing.purchase_url || null, affiliate_url: editing.affiliate_url || null,
      short_description: editing.short_description || null, full_description: editing.full_description || null,
      why_recommended: editing.why_recommended || null, price_display: editing.price_display || null,
    };
    if (editing.id) {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("academy_musthave_products").update(rest).eq("id", id);
      if (error) { alert(error.message); setSaving(false); return; }
      setProducts((arr) => arr.map((p) => p.id === id ? { ...p, ...rest } as Product : p));
    } else {
      const { id: _omit, ...rest } = payload;
      void _omit;
      const { data, error } = await supabase.from("academy_musthave_products").insert(rest).select().single();
      if (error) { alert(error.message); setSaving(false); return; }
      setProducts((arr) => [data as Product, ...arr]);
    }
    setSaving(false);
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("academy_musthave_products").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    setProducts((arr) => arr.filter((p) => p.id !== id));
  };

  const toggle = async (id: string, key: "is_featured" | "is_staff_pick" | "is_trovin_recommended") => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const next = !p[key];
    setProducts((arr) => arr.map((x) => x.id === id ? { ...x, [key]: next } : x));
    const patch = { [key]: next } as Partial<Pick<Product, typeof key>>;
    await supabase.from("academy_musthave_products").update(patch as never).eq("id", id);
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) { alert("No rows found in CSV."); return; }
      const validCats = new Set(cats.map((c) => c.slug));
      const payload = rows.map((r) => {
        const name = r.name || "";
        const category_slug = r.category_slug || cats[0]?.slug || "";
        return {
          name,
          slug: slugify(name),
          brand: r.brand || null,
          category_slug,
          short_description: r.short_description || null,
          full_description: r.full_description || null,
          why_recommended: r.why_recommended || null,
          image_url: r.image_url || null,
          images: toList(r.images || ""),
          purchase_url: r.purchase_url || null,
          affiliate_url: r.affiliate_url || null,
          price_min: toNum(r.price_min || ""),
          price_max: toNum(r.price_max || ""),
          price_display: r.price_display || null,
          pros: toList(r.pros || ""),
          cons: toList(r.cons || ""),
          best_uses: toList(r.best_uses || ""),
          best_for: toList(r.best_for || ""),
          is_featured: toBool(r.is_featured || ""),
          is_staff_pick: toBool(r.is_staff_pick || ""),
          is_trovin_recommended: toBool(r.is_trovin_recommended || ""),
        };
      }).filter((p) => p.name && validCats.has(p.category_slug));
      if (!payload.length) { alert("No valid rows. Make sure each row has a 'name' and a valid 'category_slug'."); return; }
      const { data, error } = await supabase.from("academy_musthave_products").insert(payload).select();
      if (error) { alert(error.message); return; }
      setProducts((arr) => [...((data as Product[]) ?? []), ...arr]);
      alert(`Imported ${data?.length ?? 0} product${data?.length === 1 ? "" : "s"}.`);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (authLoading || isAdmin === null) {
    return <p className="text-sm text-[var(--ac-ink-mute)]">Loading…</p>;
  }
  if (!user) {
    return (
      <div className="ac-card p-10 text-center">
        <p>Sign in to access admin tools.</p>
        <Link to="/auth" className="ac-btn mt-4">Sign in</Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="ac-card p-10 text-center">
        <p>Admin access only.</p>
        <Link to="/academy/must-haves" className="ac-btn-ghost mt-4">Back to library</Link>
      </div>
    );
  }

  return (
    <div>
      <AcademyPageHeader
        eyebrow="admin"
        title="Vendor Must-Haves admin."
        description="Add, edit, feature, and remove products. Changes appear instantly in the public library."
        actions={
          <>
            <Link to="/academy/must-haves" className="ac-btn-ghost text-xs">View library</Link>
            <button onClick={downloadTemplate} className="ac-btn-ghost text-xs"><Download className="h-3.5 w-3.5" /> Template</button>
            <button onClick={() => fileRef.current?.click()} disabled={importing} className="ac-btn-ghost text-xs"><Upload className="h-3.5 w-3.5" /> {importing ? "Importing…" : "Upload CSV"}</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }} />
            <button onClick={newProduct} className="ac-btn text-xs"><Plus className="h-3.5 w-3.5" /> New product</button>
          </>
        }
      />

      <div className="ac-card mb-6 border-2 border-[var(--ac-terracotta)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ac-terracotta)]">Bulk upload</p>
            <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-2xl">Upload many products at once</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[var(--ac-ink-soft)]">
              <li>Click <span className="font-semibold text-[var(--ac-ink)]">Download CSV template</span>.</li>
              <li>Open it in Excel / Google Sheets and fill in product rows (name + category_slug required). Use <code>|</code> to separate multiple images, pros, cons, etc.</li>
              <li>Save as CSV and click <span className="font-semibold text-[var(--ac-ink)]">Upload CSV</span>.</li>
            </ol>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={downloadTemplate} className="ac-btn">
              <Download className="h-4 w-4" /> Download CSV template
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={importing} className="ac-btn-ghost">
              <Upload className="h-4 w-4" /> {importing ? "Importing…" : "Upload CSV"}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }} />
          </div>
        </div>
        <details className="mt-4 text-xs text-[var(--ac-ink-soft)]">
          <summary className="cursor-pointer font-medium text-[var(--ac-ink)]">Show valid category slugs ({cats.length})</summary>
          <p className="mt-2 leading-relaxed">{cats.map((c) => c.slug).join(", ")}</p>
        </details>
      </div>


      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="ac-input mb-4 max-w-sm" />


      <div className="ac-card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-[var(--ac-cream-deep)] text-left text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Flags</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-[var(--ac-rule-soft)]">
                <td className="p-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-[var(--ac-ink-mute)]">{p.brand}</p>
                </td>
                <td className="p-3 text-xs">{p.category_slug}</td>
                <td className="p-3 text-xs">{p.price_display ?? `${p.price_min ?? "?"}–${p.price_max ?? "?"}`}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => toggle(p.id, "is_featured")} className={`rounded px-1.5 py-0.5 text-[10px] ${p.is_featured ? "bg-[var(--ac-ink)] text-[var(--ac-paper)]" : "border border-[var(--ac-rule)]"}`}>Feat</button>
                    <button onClick={() => toggle(p.id, "is_staff_pick")} className={`rounded px-1.5 py-0.5 text-[10px] ${p.is_staff_pick ? "bg-[var(--ac-terracotta)] text-white" : "border border-[var(--ac-rule)]"}`}>Pick</button>
                    <button onClick={() => toggle(p.id, "is_trovin_recommended")} className={`rounded px-1.5 py-0.5 text-[10px] ${p.is_trovin_recommended ? "bg-[var(--ac-forest)] text-white" : "border border-[var(--ac-rule)]"}`}><Star className="inline h-2.5 w-2.5" /></button>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(p)} className="ac-btn-ghost !px-2 !py-1 text-xs"><Pencil className="h-3 w-3" /></button>
                  <button onClick={() => remove(p.id)} className="ac-btn-ghost !px-2 !py-1 text-xs"><Trash2 className="h-3 w-3" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-[var(--ac-ink-mute)]">No products yet. Click "New product" to add one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor
          product={editing}
          cats={cats}
          saving={saving}
          onChange={setEditing}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function Editor({
  product, cats, saving, onChange, onSave, onClose,
}: {
  product: Product;
  cats: Category[];
  saving: boolean;
  onChange: (p: Product) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const set = <K extends keyof Product>(k: K, v: Product[K]) => onChange({ ...product, [k]: v });
  const list = (k: "pros" | "cons" | "best_uses" | "best_for" | "images") => (
    <input
      value={product[k].join(", ")}
      onChange={(e) => set(k, e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as any)}
      placeholder="comma, separated, values"
      className="ac-input w-full text-xs"
    />
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="ac-card max-h-[90vh] w-full max-w-3xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--ac-rule-soft)] pb-3">
          <h2 style={{ fontFamily: "Fraunces, serif" }} className="text-2xl">{product.id ? "Edit" : "New"} product</h2>
          <button onClick={onClose} className="rounded-full p-1"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Name *"><input value={product.name} onChange={(e) => set("name", e.target.value)} className="ac-input w-full" /></Field>
          <Field label="Brand"><input value={product.brand ?? ""} onChange={(e) => set("brand", e.target.value)} className="ac-input w-full" /></Field>
          <Field label="Slug (auto)"><input value={product.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(product.name)} className="ac-input w-full" /></Field>
          <Field label="Category *">
            <select value={product.category_slug} onChange={(e) => set("category_slug", e.target.value)} className="ac-input w-full">
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.group_name} — {c.title}</option>)}
            </select>
          </Field>
          <Field label="Image URL"><input value={product.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} className="ac-input w-full" /></Field>
          <Field label="Extra images (comma sep URLs)">{list("images")}</Field>
          <Field label="Purchase URL"><input value={product.purchase_url ?? ""} onChange={(e) => set("purchase_url", e.target.value)} className="ac-input w-full" /></Field>
          <Field label="Affiliate URL"><input value={product.affiliate_url ?? ""} onChange={(e) => set("affiliate_url", e.target.value)} className="ac-input w-full" /></Field>
          <Field label="Price min"><input type="number" value={product.price_min ?? ""} onChange={(e) => set("price_min", e.target.value ? Number(e.target.value) : null)} className="ac-input w-full" /></Field>
          <Field label="Price max"><input type="number" value={product.price_max ?? ""} onChange={(e) => set("price_max", e.target.value ? Number(e.target.value) : null)} className="ac-input w-full" /></Field>
          <Field label="Price display (overrides)"><input value={product.price_display ?? ""} onChange={(e) => set("price_display", e.target.value)} placeholder="e.g. $80–$120" className="ac-input w-full" /></Field>
        </div>

        <Field label="Short description"><textarea rows={2} value={product.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} className="ac-input w-full" /></Field>
        <Field label="Full description"><textarea rows={4} value={product.full_description ?? ""} onChange={(e) => set("full_description", e.target.value)} className="ac-input w-full" /></Field>
        <Field label="Why we recommend it"><textarea rows={2} value={product.why_recommended ?? ""} onChange={(e) => set("why_recommended", e.target.value)} className="ac-input w-full" /></Field>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Pros (comma sep)">{list("pros")}</Field>
          <Field label="Cons (comma sep)">{list("cons")}</Field>
          <Field label="Best uses (comma sep)">{list("best_uses")}</Field>
          <Field label="Best for (vendor types)">{list("best_for")}</Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--ac-rule-soft)] pt-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={product.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={product.is_staff_pick} onChange={(e) => set("is_staff_pick", e.target.checked)} /> Staff pick</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={product.is_trovin_recommended} onChange={(e) => set("is_trovin_recommended", e.target.checked)} /> Trovin Recommended</label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="ac-btn-ghost">Cancel</button>
          <button onClick={onSave} disabled={saving || !product.name || !product.category_slug} className="ac-btn">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block">
      <span className="block text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
