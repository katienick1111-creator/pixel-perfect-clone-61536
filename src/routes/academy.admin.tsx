import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Package, FileText, Download, Users, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { importMustHaveProductsAdmin } from "@/lib/admin.functions";

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
  a.href = url;
  a.download = "must-haves-template.csv";
  a.click();
  URL.revokeObjectURL(url);
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
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60); }

export const Route = createFileRoute("/academy/admin")({
  head: () => ({ meta: [{ title: "Admin — Trovin Academy" }] }),
  component: AdminIndex,
});

function AdminIndex() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const importProducts = useServerFn(importMustHaveProductsAdmin);
  const tiles = [
    {
      to: "/academy/admin/must-haves",
      title: "Vendor Must-Haves",
      desc: "Add, edit, and feature products in the gear library.",
      icon: Package,
    },
    {
      to: "/academy/articles",
      title: "Articles",
      desc: "Browse the article library (editor coming soon).",
      icon: FileText,
    },
    {
      to: "/academy/downloads",
      title: "Downloads",
      desc: "Browse downloadable resources.",
      icon: Download,
    },
    {
      to: "/academy/community",
      title: "Community",
      desc: "Browse the community feed.",
      icon: Users,
    },
  ];

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) { alert("No rows found in CSV."); return; }
      const { data: categories } = await supabase.from("academy_musthave_categories").select("slug");
      const validCats = new Set((categories ?? []).map((c) => c.slug));
      const payload = rows.map((r) => {
        const name = r.name || "";
        return {
          name,
          slug: slugify(name),
          brand: r.brand || null,
          category_slug: r.category_slug || "",
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
      if (!payload.length) { alert("No valid rows. Make sure each row has a name and valid category_slug."); return; }
      const result = await importProducts({ data: { products: payload } });
      alert(`Imported ${result.products.length} product${result.products.length === 1 ? "" : "s"}.`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <AcademyPageHeader
        eyebrow="admin"
        title="Academy operations."
        description="Manage the resources that power Trovin Academy."
      />
      <div className="ac-card mb-4 border-2 border-[var(--ac-terracotta)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ac-terracotta)]">Product upload template</p>
            <h2 className="mt-1 font-serif text-2xl text-[var(--ac-ink)]">Add product visuals, links, and prices</h2>
            <p className="mt-2 text-sm text-[var(--ac-ink-soft)]">Download the CSV, fill in your product rows, then upload it here.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadTemplate} className="ac-btn">
              <Download className="h-4 w-4" /> Download CSV template
            </button>
            <button onClick={() => fileRef.current?.click()} disabled={importing} className="ac-btn-ghost">
              <Upload className="h-4 w-4" /> {importing ? "Importing…" : "Upload CSV"}
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="ac-card group flex items-start gap-4 p-6 transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ac-cream)] text-[var(--ac-terracotta)]">
              <t.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-lg text-[var(--ac-ink)]">{t.title}</div>
              <div className="mt-1 text-sm text-[var(--ac-ink-soft)]">{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
