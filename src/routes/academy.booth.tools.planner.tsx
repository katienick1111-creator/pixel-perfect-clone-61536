import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Plus, Printer, RotateCw, Save, Trash2 } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/booth/tools/planner")({
  head: () => ({
    meta: [
      { title: "Booth Designer — Trovin Academy" },
      { name: "description", content: "Drag-and-drop booth designer. Lay out your booth to scale, save, duplicate, and print." },
    ],
  }),
  component: PlannerTool,
});

type ItemKind =
  | "table-6"
  | "table-4"
  | "shelf"
  | "rack"
  | "chair"
  | "register"
  | "signage"
  | "storage"
  | "cube"
  | "plant"
  | "arrow";

type Item = {
  id: string;
  kind: ItemKind;
  x: number; // feet
  y: number;
  w: number;
  h: number;
  rot: 0 | 90;
  source?: "user" | "ai";
};

type Data = { items: Item[]; width: number; height: number; notes: string };

const palette: { kind: ItemKind; label: string; w: number; h: number; color: string }[] = [
  { kind: "table-6", label: "Table 6ft", w: 6, h: 2.5, color: "#F5E6E0" },
  { kind: "table-4", label: "Table 4ft", w: 4, h: 2.5, color: "#F5E6E0" },
  { kind: "shelf", label: "Shelf", w: 4, h: 1.5, color: "#E6E0F0" },
  { kind: "rack", label: "Garment Rack", w: 5, h: 2, color: "#F5F0E0" },
  { kind: "chair", label: "Chair", w: 1.5, h: 1.5, color: "#D0F0E8" },
  { kind: "register", label: "Register", w: 2, h: 1.5, color: "#4A5560" },
  { kind: "signage", label: "Signage", w: 6, h: 0.6, color: "#F5C8C0" },
  { kind: "storage", label: "Storage", w: 2, h: 1.5, color: "#C8D8E8" },
  { kind: "cube", label: "Display Cube", w: 2, h: 2, color: "#F0D8E0" },
  { kind: "plant", label: "Plant", w: 1.5, h: 1.5, color: "#C8E0D0" },
  { kind: "arrow", label: "Flow Arrow", w: 3, h: 0.5, color: "#D0F0E8" },
];

const sizes: Record<string, { w: number; h: number }> = {
  "10x10": { w: 10, h: 10 },
  "10x20": { w: 20, h: 10 },
  "Corner": { w: 10, h: 10 },
  "Island": { w: 10, h: 10 },
};

const id = () => Math.random().toString(36).slice(2, 9);
const defaultData: Data = { items: [], width: 10, height: 10, notes: "" };

const LS_KEY = "trovin.academy.booth.designs";

type SavedDesign = { id: string; name: string; size: string; is_favorite: boolean; data: Data };

function PlannerTool() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState("Untitled Booth");
  const [size, setSize] = useState<string>("10x10");
  const [data, setData] = useState<Data>(defaultData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offX: number; offY: number } | null>(null);

  // Load list
  useEffect(() => {
    if (user) {
      supabase
        .from("academy_booth_designs")
        .select("id, name, size, is_favorite, data")
        .order("is_favorite", { ascending: false })
        .order("updated_at", { ascending: false })
        .then(({ data: rows }) => {
          if (rows) {
            const list = rows.map((r) => ({
              id: r.id as string,
              name: r.name as string,
              size: r.size as string,
              is_favorite: !!r.is_favorite,
              data: r.data as unknown as Data,
            }));
            setDesigns(list);
            if (list.length && !activeId) loadDesign(list[0]);
          }
        });
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          const p = JSON.parse(raw);
          if (p.name) setName(p.name);
          if (p.size) setSize(p.size);
          if (p.data) setData(p.data);
        }
      } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Autosave
  useEffect(() => {
    const t = setTimeout(async () => {
      if (user) {
        const payload = { name, size, data: data as any };
        if (activeId) {
          await supabase.from("academy_booth_designs").update(payload).eq("id", activeId);
        } else {
          const { data: created } = await supabase
            .from("academy_booth_designs")
            .insert({ user_id: user.id, ...payload })
            .select("id")
            .maybeSingle();
          if (created) setActiveId(created.id as string);
        }
        setSavedAt(new Date());
      } else {
        try { localStorage.setItem(LS_KEY, JSON.stringify({ name, size, data })); setSavedAt(new Date()); } catch {}
      }
    }, 700);
    return () => clearTimeout(t);
  }, [data, name, size, user, activeId]);

  // Keyboard delete + rotate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== selectedId) }));
        setSelectedId(null);
      } else if (e.key.toLowerCase() === "r") {
        rotateSel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const loadDesign = (d: SavedDesign) => {
    setActiveId(d.id);
    setName(d.name);
    setSize(d.size);
    setData(d.data?.items ? d.data : defaultData);
  };

  const newDesign = () => {
    setActiveId(null);
    setName("Untitled Booth");
    setSize("10x10");
    setData({ ...defaultData, ...sizes["10x10"] });
  };

  const duplicate = async () => {
    if (!user) { toast.error("Sign in to duplicate."); return; }
    const { data: row } = await supabase
      .from("academy_booth_designs")
      .insert({ user_id: user.id, name: `${name} (copy)`, size, data: data as any })
      .select("id, name, size, is_favorite, data")
      .maybeSingle();
    if (row) {
      const d: SavedDesign = { id: row.id as string, name: row.name as string, size: row.size as string, is_favorite: !!row.is_favorite, data: row.data as unknown as Data };
      setDesigns((arr) => [d, ...arr]);
      loadDesign(d);
      toast.success("Duplicated.");
    }
  };

  const deleteDesign = async () => {
    if (!user || !activeId) return;
    await supabase.from("academy_booth_designs").delete().eq("id", activeId);
    setDesigns((arr) => arr.filter((d) => d.id !== activeId));
    newDesign();
  };

  const toggleFav = async () => {
    if (!user || !activeId) return;
    const cur = designs.find((d) => d.id === activeId);
    const next = !cur?.is_favorite;
    await supabase.from("academy_booth_designs").update({ is_favorite: next }).eq("id", activeId);
    setDesigns((arr) => arr.map((d) => d.id === activeId ? { ...d, is_favorite: next } : d));
  };

  const addItem = (kind: ItemKind) => {
    const p = palette.find((p) => p.kind === kind)!;
    setData((d) => ({
      ...d,
      items: [...d.items, { id: id(), kind, x: 1, y: 1, w: p.w, h: p.h, rot: 0, source: "user" }],
    }));
  };

  // Snap helper (0.5 ft)
  const snap = (n: number) => Math.round(n * 2) / 2;

  // Drag handling — pointer events on each item
  const onPointerDown = (e: React.PointerEvent, itemId: string) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const item = data.items.find((i) => i.id === itemId);
    if (!item) return;
    setSelectedId(itemId);
    const rect = canvas.getBoundingClientRect();
    const ftPerPx = data.width / rect.width;
    const px = (e.clientX - rect.left) * ftPerPx;
    const py = (e.clientY - rect.top) * ftPerPx;
    dragRef.current = { id: itemId, offX: px - item.x, offY: py - item.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ftPerPx = data.width / rect.width;
    const px = (e.clientX - rect.left) * ftPerPx;
    const py = (e.clientY - rect.top) * ftPerPx;
    setData((d) => ({
      ...d,
      items: d.items.map((i) => i.id === drag.id
        ? { ...i, x: Math.max(0, Math.min(d.width - i.w, snap(px - drag.offX))), y: Math.max(0, Math.min(d.height - i.h, snap(py - drag.offY))) }
        : i),
    }));
  };
  const onPointerUp = () => { dragRef.current = null; };

  const rotateSel = () => {
    if (!selectedId) return;
    setData((d) => ({
      ...d,
      items: d.items.map((i) => i.id === selectedId ? { ...i, rot: i.rot === 0 ? 90 : 0, w: i.h, h: i.w } : i),
    }));
  };

  // Resize canvas with booth size
  useEffect(() => {
    const s = sizes[size];
    if (s) setData((d) => ({ ...d, width: s.w, height: s.h }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const selected = data.items.find((i) => i.id === selectedId);

  return (
    <div>
      <AcademyPageHeader
        eyebrow="booth designer"
        title="Drag-and-Drop Booth Planner"
        description="Build your booth to scale. Drag items in from the palette, snap to a 6-inch grid, rotate with R, delete with Backspace."
        actions={
          <>
            <button onClick={() => window.print()} className="ac-btn-ghost"><Printer className="h-4 w-4" /> Print</button>
            {savedAt && <span className="ac-chip">Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          </>
        }
      />

      {/* Top bar */}
      <div className="ac-no-print mb-6 flex flex-wrap items-center gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="ac-input max-w-xs flex-1" />
        <select value={size} onChange={(e) => setSize(e.target.value)} className="ac-input w-32">
          {Object.keys(sizes).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={newDesign} className="ac-btn-ghost"><Plus className="h-4 w-4" /> New</button>
        {user && (
          <>
            <button onClick={duplicate} className="ac-btn-ghost"><Copy className="h-4 w-4" /> Duplicate</button>
            {activeId && <button onClick={deleteDesign} className="ac-btn-ghost"><Trash2 className="h-4 w-4" /> Delete</button>}
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Palette */}
        <aside className="ac-no-print ac-card p-4">
          <p className="ac-eyebrow">add items</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {palette.map((p) => (
              <button key={p.kind} onClick={() => addItem(p.kind)} className="ac-btn-ghost !justify-start !py-1.5 text-xs">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: p.color }} /> {p.label}
              </button>
            ))}
          </div>
          {selected && (
            <div className="mt-6 border-t border-[var(--ac-rule-soft)] pt-4">
              <p className="ac-eyebrow">selected</p>
              <p className="mt-1 text-sm font-medium">{palette.find((p) => p.kind === selected.kind)?.label}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[var(--ac-ink-soft)]">Width (ft)</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={data.width}
                    value={selected.w}
                    onChange={(e) => {
                      const v = Math.max(0.5, Math.min(data.width, snap(parseFloat(e.target.value) || 0.5)));
                      setData((d) => ({ ...d, items: d.items.map((i) => i.id === selectedId ? { ...i, w: v, x: Math.min(i.x, d.width - v) } : i) }));
                    }}
                    className="ac-input w-full text-xs py-1"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[var(--ac-ink-soft)]">Height (ft)</label>
                  <input
                    type="number"
                    step={0.5}
                    min={0.5}
                    max={data.height}
                    value={selected.h}
                    onChange={(e) => {
                      const v = Math.max(0.5, Math.min(data.height, snap(parseFloat(e.target.value) || 0.5)));
                      setData((d) => ({ ...d, items: d.items.map((i) => i.id === selectedId ? { ...i, h: v, y: Math.min(i.y, d.height - v) } : i) }));
                    }}
                    className="ac-input w-full text-xs py-1"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={rotateSel} className="ac-btn-ghost text-xs"><RotateCw className="h-3.5 w-3.5" /> Rotate</button>
                <button onClick={() => { setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== selected.id) })); setSelectedId(null); }} className="ac-btn-ghost text-xs"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}

          {designs.length > 0 && (
            <div className="mt-6 border-t border-[var(--ac-rule-soft)] pt-4">
              <p className="ac-eyebrow">saved designs</p>
              <ul className="mt-3 space-y-1">
                {designs.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => loadDesign(d)}
                      className={`w-full truncate rounded-sm px-2 py-1.5 text-left text-xs ${activeId === d.id ? "bg-[var(--ac-ink)] text-[var(--ac-paper)]" : "hover:bg-[var(--ac-cream-deep)]"}`}
                    >
                      {d.is_favorite ? "★ " : ""}{d.name}
                    </button>
                  </li>
                ))}
              </ul>
              {activeId && <button onClick={toggleFav} className="ac-btn-ghost mt-3 w-full text-xs">{designs.find((d) => d.id === activeId)?.is_favorite ? "Unfavorite" : "Favorite"}</button>}
            </div>
          )}

          {!user && (
            <p className="mt-6 border-t border-[var(--ac-rule-soft)] pt-4 text-xs text-[var(--ac-ink-soft)]">
              Sign in to save unlimited booth designs to your account.
            </p>
          )}
        </aside>

        {/* Canvas */}
        <div className="ac-card overflow-hidden p-0">
          <div className="border-b border-[var(--ac-rule-soft)] bg-[var(--ac-paper-2)] px-4 py-2 text-xs text-[var(--ac-ink-soft)]">
            {data.width} ft × {data.height} ft · {data.items.length} items
          </div>
          <div
            ref={canvasRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={() => setSelectedId(null)}
            className="relative mx-auto aspect-[1/1] w-full touch-none select-none bg-[var(--ac-paper)]"
            style={{ aspectRatio: `${data.width} / ${data.height}`, backgroundImage: "linear-gradient(#D9D2C4 1px, transparent 1px), linear-gradient(90deg, #D9D2C4 1px, transparent 1px)", backgroundSize: `${100 / data.width}% ${100 / data.height}%` }}
          >
            {data.items.map((it) => {
              const p = palette.find((p) => p.kind === it.kind)!;
              const isSel = selectedId === it.id;
              const isDark = it.kind === "register" || it.kind === "storage";
              return (
                <div
                  key={it.id}
                  onPointerDown={(e) => onPointerDown(e, it.id)}
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute flex cursor-move items-center justify-center text-[9px] font-medium ${isSel ? "ring-2 ring-[var(--ac-terracotta)]" : "ring-1 ring-[#1A1A1A]/40"}`}
                  style={{
                    left: `${(it.x / data.width) * 100}%`,
                    top: `${(it.y / data.height) * 100}%`,
                    width: `${(it.w / data.width) * 100}%`,
                    height: `${(it.h / data.height) * 100}%`,
                    backgroundColor: p.color,
                    color: isDark ? "#FAF7F2" : "#1A1A1A",
                  }}
                >
                  {p.label}
                </div>
              );
            })}
            {data.items.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-xs text-[var(--ac-ink-mute)]">
                Pick an item from the palette to start building your booth.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
