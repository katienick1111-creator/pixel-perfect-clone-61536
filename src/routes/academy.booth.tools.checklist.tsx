import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Printer, Save, Trash2, X } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/booth/tools/checklist")({
  head: () => ({
    meta: [
      { title: "Booth Setup Checklist — Trovin Academy" },
      { name: "description", content: "A sectioned, savable booth setup checklist with progress tracking." },
    ],
  }),
  component: ChecklistTool,
});

type Item = { id: string; text: string; done: boolean };
type Section = { id: string; title: string; items: Item[] };
type Data = { sections: Section[] };

const id = () => Math.random().toString(36).slice(2, 9);

const defaultData: Data = {
  sections: [
    { id: id(), title: "Equipment", items: ["Tent", "Weights x4", "Sidewalls", "Tables x2", "Tablecloths/drape", "Risers", "Chair"].map((t) => ({ id: id(), text: t, done: false })) },
    { id: id(), title: "Display", items: ["Hero focal piece", "Color-blocked groupings", "Three height tiers", "Price tags on every item"].map((t) => ({ id: id(), text: t, done: false })) },
    { id: id(), title: "Signage", items: ["Back banner", "QR code at register", "Sale signs (if any)"].map((t) => ({ id: id(), text: t, done: false })) },
    { id: id(), title: "Lighting", items: ["2x clip-on LEDs", "Warm-white string lights", "Battery station charged"].map((t) => ({ id: id(), text: t, done: false })) },
    { id: id(), title: "Cash & Tech", items: ["Cash float", "Card reader paired", "Backup phone charger", "Email signup tablet/sheet"].map((t) => ({ id: id(), text: t, done: false })) },
    { id: id(), title: "Personal", items: ["Water", "Snacks", "Sunscreen", "Comfortable shoes"].map((t) => ({ id: id(), text: t, done: false })) },
  ],
};

const LS_KEY = "trovin.academy.booth.checklist";

function ChecklistTool() {
  const { user } = useAuth();
  const [data, setData] = useState<Data>(defaultData);
  const [name, setName] = useState("Booth Setup Checklist");
  const [rowId, setRowId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Load
  useEffect(() => {
    if (user) {
      supabase
        .from("academy_booth_checklists")
        .select("id, name, data")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data: row }) => {
          if (row) {
            setRowId(row.id as string);
            setName((row.name as string) ?? "Booth Setup Checklist");
            const d = row.data as unknown as Data;
            if (d?.sections?.length) setData(d);
          }
        });
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.data) setData(parsed.data);
          if (parsed?.name) setName(parsed.name);
        }
      } catch {}
    }
  }, [user]);

  // Autosave (debounced)
  useEffect(() => {
    const t = setTimeout(async () => {
      if (user) {
        if (rowId) {
          await supabase.from("academy_booth_checklists").update({ name, data: data as any }).eq("id", rowId);
        } else {
          const { data: created } = await supabase
            .from("academy_booth_checklists")
            .insert({ user_id: user.id, name, data: data as any })
            .select("id")
            .maybeSingle();
          if (created) setRowId(created.id as string);
        }
        setSavedAt(new Date());
      } else {
        try {
          localStorage.setItem(LS_KEY, JSON.stringify({ name, data }));
          setSavedAt(new Date());
        } catch {}
      }
    }, 700);
    return () => clearTimeout(t);
  }, [data, name, user, rowId]);

  const stats = useMemo(() => {
    const all = data.sections.flatMap((s) => s.items);
    const done = all.filter((i) => i.done).length;
    return { done, total: all.length };
  }, [data]);

  const update = (fn: (d: Data) => Data) => setData((d) => fn(structuredClone(d)));

  const addItem = (sid: string) => update((d) => {
    const s = d.sections.find((s) => s.id === sid);
    if (s) s.items.push({ id: id(), text: "New item", done: false });
    return d;
  });
  const toggle = (sid: string, iid: string) => update((d) => {
    const it = d.sections.find((s) => s.id === sid)?.items.find((i) => i.id === iid);
    if (it) it.done = !it.done;
    return d;
  });
  const remove = (sid: string, iid: string) => update((d) => {
    const s = d.sections.find((s) => s.id === sid);
    if (s) s.items = s.items.filter((i) => i.id !== iid);
    return d;
  });
  const setText = (sid: string, iid: string, text: string) => update((d) => {
    const it = d.sections.find((s) => s.id === sid)?.items.find((i) => i.id === iid);
    if (it) it.text = text;
    return d;
  });
  const addSection = () => update((d) => {
    d.sections.push({ id: id(), title: "New Section", items: [] });
    return d;
  });
  const setSectionTitle = (sid: string, title: string) => update((d) => {
    const s = d.sections.find((s) => s.id === sid);
    if (s) s.title = title;
    return d;
  });
  const removeSection = (sid: string) => update((d) => {
    d.sections = d.sections.filter((s) => s.id !== sid);
    return d;
  });

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div>
      <AcademyPageHeader
        eyebrow="setup checklist"
        title="Booth Setup Checklist"
        description="Customizable, savable, printable. Auto-saves as you go."
        actions={
          <>
            <button onClick={() => window.print()} className="ac-btn-ghost"><Printer className="h-4 w-4" /> Print</button>
            {savedAt && <span className="ac-chip">Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          </>
        }
      />

      <div className="ac-no-print mb-6 flex flex-wrap items-center gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} className="ac-input max-w-md flex-1" />
      </div>

      <div className="ac-card mb-6 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Progress</span>
          <span className="text-sm font-medium">{stats.done} / {stats.total} ({pct}%)</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ac-cream-deep)]">
          <div className="h-full bg-[var(--ac-forest)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {data.sections.map((s) => (
          <section key={s.id} className="ac-card p-5">
            <div className="ac-no-print mb-3 flex items-center justify-between gap-3">
              <input value={s.title} onChange={(e) => setSectionTitle(s.id, e.target.value)} className="ac-input font-serif text-lg" />
              <button onClick={() => removeSection(s.id)} className="rounded p-1 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]" aria-label="Remove section">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="hidden font-serif text-lg print:block">{s.title}</h3>
            <ul className="mt-2 space-y-1.5">
              {s.items.map((it) => (
                <li key={it.id} className="flex items-center gap-3 border-b border-dashed border-[var(--ac-rule-soft)] py-1.5">
                  <button onClick={() => toggle(s.id, it.id)} aria-label="Toggle" className={`flex h-5 w-5 items-center justify-center rounded-sm border ${it.done ? "border-[var(--ac-forest)] bg-[var(--ac-forest)]" : "border-[var(--ac-rule)]"}`}>
                    {it.done && <span className="text-[10px] text-white">✓</span>}
                  </button>
                  <input
                    value={it.text}
                    onChange={(e) => setText(s.id, it.id, e.target.value)}
                    className={`ac-input flex-1 !border-0 !bg-transparent !px-0 ${it.done ? "line-through opacity-60" : ""}`}
                  />
                  <button onClick={() => remove(s.id, it.id)} aria-label="Remove" className="ac-no-print rounded p-1 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => addItem(s.id)} className="ac-no-print ac-btn-ghost mt-3 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </section>
        ))}

        <button onClick={addSection} className="ac-no-print ac-btn-ghost"><Plus className="h-4 w-4" /> Add section</button>
      </div>
    </div>
  );
}
