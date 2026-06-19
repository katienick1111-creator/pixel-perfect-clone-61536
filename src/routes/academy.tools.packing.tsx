import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Printer, RotateCcw, Save, Trash2 } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { useAcademyWorksheet } from "@/hooks/useAcademyWorksheet";

export const Route = createFileRoute("/academy/tools/packing")({
  head: () => ({
    meta: [
      { title: "Packing Checklist — Trovin Academy" },
      {
        name: "description",
        content:
          "Interactive packing checklist for festival and market vendors. Autosaves, prints, and exports.",
      },
    ],
  }),
  component: PackingTool,
});

type Item = { id: string; label: string; done: boolean };
type Section = { id: string; title: string; items: Item[] };
type State = { eventName: string; eventDate: string; sections: Section[] };

const uid = () => Math.random().toString(36).slice(2, 9);

const defaults: State = {
  eventName: "",
  eventDate: "",
  sections: [
    {
      id: uid(),
      title: "Booth structure",
      items: [
        { id: uid(), label: "10×10 canopy", done: false },
        { id: uid(), label: "Canopy weights (40 lb min per leg)", done: false },
        { id: uid(), label: "Side walls", done: false },
        { id: uid(), label: "Tables (2x 6ft)", done: false },
        { id: uid(), label: "Table covers (front to floor)", done: false },
      ],
    },
    {
      id: uid(),
      title: "Display & signage",
      items: [
        { id: uid(), label: "Hero sign / banner", done: false },
        { id: uid(), label: "Pricing signs", done: false },
        { id: uid(), label: "Risers and props", done: false },
        { id: uid(), label: "Business cards", done: false },
      ],
    },
    {
      id: uid(),
      title: "Sales & payments",
      items: [
        { id: uid(), label: "Square reader (charged)", done: false },
        { id: uid(), label: "Backup phone charger", done: false },
        { id: uid(), label: "Cash float ($150 small bills)", done: false },
        { id: uid(), label: "Receipt printer + paper", done: false },
        { id: uid(), label: "Bags / packaging", done: false },
      ],
    },
    {
      id: uid(),
      title: "Comfort & survival",
      items: [
        { id: uid(), label: "Water + snacks", done: false },
        { id: uid(), label: "Sunscreen + hat", done: false },
        { id: uid(), label: "Folding chair", done: false },
        { id: uid(), label: "First-aid kit", done: false },
      ],
    },
  ],
};

function PackingTool() {
  const { data, setData, savedAt, reset } = useAcademyWorksheet<State>(
    "packing",
    defaults,
  );

  const stats = useMemo(() => {
    const all = data.sections.flatMap((s) => s.items);
    const done = all.filter((i) => i.done).length;
    return { done, total: all.length };
  }, [data.sections]);

  const update = (mut: (d: State) => State) => setData((d) => mut(d));

  return (
    <div>
      <AcademyPageHeader
        eyebrow="tool · festivals & events"
        title="Packing checklist"
        description="Build your booth packing list once, then duplicate it for every event. Autosaves to your device."
        actions={
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="ac-btn-ghost">
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
            <button onClick={reset} className="ac-btn-ghost">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        }
      />

      {/* Save bar */}
      <div className="ac-no-print mb-6 flex items-center justify-between rounded-sm border border-[var(--ac-rule-soft)] bg-white px-4 py-2 text-xs">
        <span className="flex items-center gap-2 text-[var(--ac-ink-mute)]">
          <Save className="h-3.5 w-3.5" />
          {savedAt
            ? `Autosaved · ${savedAt.toLocaleTimeString()}`
            : "Autosave ready"}
        </span>
        <span className="font-medium text-[var(--ac-forest)]">
          {stats.done} of {stats.total} packed
        </span>
      </div>

      {/* Event meta */}
      <section className="ac-card mb-8 grid gap-4 p-6 md:grid-cols-2">
        <label className="block">
          <p className="ac-eyebrow mb-2">event name</p>
          <input
            className="ac-input"
            value={data.eventName}
            placeholder="Randolph Street Market — June 22"
            onChange={(e) =>
              update((d) => ({ ...d, eventName: e.target.value }))
            }
          />
        </label>
        <label className="block">
          <p className="ac-eyebrow mb-2">event date</p>
          <input
            type="date"
            className="ac-input"
            value={data.eventDate}
            onChange={(e) =>
              update((d) => ({ ...d, eventDate: e.target.value }))
            }
          />
        </label>
      </section>

      {/* Sections */}
      <div className="space-y-6">
        {data.sections.map((section, si) => (
          <section key={section.id} className="ac-card p-6">
            <header className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="ac-number">
                  {String(si + 1).padStart(2, "0")}
                </span>
                <input
                  className="border-b border-transparent bg-transparent text-xl font-medium tracking-tight focus:border-[var(--ac-ink)] focus:outline-none"
                  style={{ fontFamily: "Fraunces, serif" }}
                  value={section.title}
                  onChange={(e) =>
                    update((d) => ({
                      ...d,
                      sections: d.sections.map((s) =>
                        s.id === section.id ? { ...s, title: e.target.value } : s,
                      ),
                    }))
                  }
                />
              </div>
              <button
                onClick={() =>
                  update((d) => ({
                    ...d,
                    sections: d.sections.filter((s) => s.id !== section.id),
                  }))
                }
                className="ac-no-print rounded p-2 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]"
                aria-label="Remove section"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </header>

            <ul className="divide-y divide-[var(--ac-rule-soft)]">
              {section.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) =>
                      update((d) => ({
                        ...d,
                        sections: d.sections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items: s.items.map((i) =>
                                  i.id === item.id
                                    ? { ...i, done: e.target.checked }
                                    : i,
                                ),
                              }
                            : s,
                        ),
                      }))
                    }
                    className="h-4 w-4 accent-[var(--ac-forest)]"
                  />
                  <input
                    className={`flex-1 border-b border-transparent bg-transparent py-1 text-sm focus:border-[var(--ac-ink)] focus:outline-none ${
                      item.done ? "text-[var(--ac-ink-mute)] line-through" : ""
                    }`}
                    value={item.label}
                    onChange={(e) =>
                      update((d) => ({
                        ...d,
                        sections: d.sections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items: s.items.map((i) =>
                                  i.id === item.id
                                    ? { ...i, label: e.target.value }
                                    : i,
                                ),
                              }
                            : s,
                        ),
                      }))
                    }
                  />
                  <button
                    onClick={() =>
                      update((d) => ({
                        ...d,
                        sections: d.sections.map((s) =>
                          s.id === section.id
                            ? { ...s, items: s.items.filter((i) => i.id !== item.id) }
                            : s,
                        ),
                      }))
                    }
                    className="ac-no-print rounded p-1 text-[var(--ac-ink-mute)] hover:text-[var(--ac-terracotta)]"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() =>
                update((d) => ({
                  ...d,
                  sections: d.sections.map((s) =>
                    s.id === section.id
                      ? {
                          ...s,
                          items: [...s.items, { id: uid(), label: "New item", done: false }],
                        }
                      : s,
                  ),
                }))
              }
              className="ac-no-print mt-3 inline-flex items-center gap-1.5 text-xs text-[var(--ac-terracotta)] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Add item
            </button>
          </section>
        ))}

        <button
          onClick={() =>
            update((d) => ({
              ...d,
              sections: [
                ...d.sections,
                { id: uid(), title: "New section", items: [] },
              ],
            }))
          }
          className="ac-no-print ac-btn-ghost w-full justify-center"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>
      </div>

      <div className="ac-no-print mt-12 border-t border-[var(--ac-rule-soft)] pt-6 text-center">
        <Link to="/academy/categories" className="text-sm text-[var(--ac-terracotta)] hover:underline">
          ← Back to categories
        </Link>
      </div>
    </div>
  );
}
