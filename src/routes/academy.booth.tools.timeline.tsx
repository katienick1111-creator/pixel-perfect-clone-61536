import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";

export const Route = createFileRoute("/academy/booth/tools/timeline")({
  head: () => ({
    meta: [
      { title: "Setup Timeline — Trovin Academy" },
      { name: "description", content: "Generate a reverse-order setup schedule from your event start time and booth complexity." },
    ],
  }),
  component: TimelineTool,
});

type Complexity = "simple" | "standard" | "complex";

const tasksByComplexity: Record<Complexity, { mins: number; task: string }[]> = {
  simple: [
    { mins: 60, task: "Arrive at venue & park" },
    { mins: 45, task: "Unload + walk gear to booth" },
    { mins: 35, task: "Tent up & weighted (4 corners)" },
    { mins: 25, task: "Tables + tablecloths" },
    { mins: 15, task: "Product on display" },
    { mins: 8, task: "Signage + price tags" },
    { mins: 3, task: "Card reader + cash float ready" },
    { mins: 1, task: "Take pre-event photo for IG" },
  ],
  standard: [
    { mins: 90, task: "Arrive at venue & park" },
    { mins: 75, task: "Unload + walk gear to booth (2 trips)" },
    { mins: 60, task: "Tent up & weighted, sidewalls on" },
    { mins: 45, task: "Tables + drapes + risers" },
    { mins: 35, task: "Lighting hung & tested" },
    { mins: 25, task: "Product on display — back wall first" },
    { mins: 18, task: "Front-edge display + impulse" },
    { mins: 12, task: "Signage + price tags + QR" },
    { mins: 6, task: "Storage tucked out of sight" },
    { mins: 3, task: "Card reader + cash float ready" },
    { mins: 1, task: "Take pre-event photo for IG" },
  ],
  complex: [
    { mins: 150, task: "Arrive at venue & park (allow for line-up)" },
    { mins: 135, task: "Unload trailer + stage at booth" },
    { mins: 105, task: "Tent + sidewalls + weights" },
    { mins: 85, task: "Pipe-and-drape back wall" },
    { mins: 70, task: "Tables, drapes, risers, shelving" },
    { mins: 55, task: "Lighting (ambient + accent + front-edge)" },
    { mins: 45, task: "Power station + cable management" },
    { mins: 35, task: "Product on display — back wall" },
    { mins: 25, task: "Hero focal display + lifestyle vignette" },
    { mins: 18, task: "Front-edge + impulse + bundle" },
    { mins: 12, task: "Signage + price tags + QR" },
    { mins: 7, task: "Storage tucked behind drape" },
    { mins: 3, task: "Card reader + cash float ready" },
    { mins: 1, task: "Pre-event photo + door open" },
  ],
};

const LS_KEY = "trovin.academy.booth.timeline";

function TimelineTool() {
  const [eventTime, setEventTime] = useState("10:00");
  const [complexity, setComplexity] = useState<Complexity>("standard");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.eventTime) setEventTime(p.eventTime);
        if (p.complexity) setComplexity(p.complexity);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ eventTime, complexity })); } catch {}
  }, [eventTime, complexity]);

  const schedule = useMemo(() => {
    const [h, m] = eventTime.split(":").map(Number);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return [];
    const base = new Date();
    base.setHours(h, m, 0, 0);
    return tasksByComplexity[complexity].map((t) => {
      const at = new Date(base.getTime() - t.mins * 60 * 1000);
      return {
        ...t,
        at: at.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        before: t.mins >= 60 ? `T-${Math.floor(t.mins / 60)}h${t.mins % 60 ? ` ${t.mins % 60}m` : ""}` : `T-${t.mins}m`,
      };
    });
  }, [eventTime, complexity]);

  return (
    <div>
      <AcademyPageHeader
        eyebrow="setup timeline"
        title="Reverse-Order Setup Schedule"
        description="Enter when your booth opens. We'll build a schedule backward from that moment so you arrive on time, every time."
        actions={<button onClick={() => window.print()} className="ac-btn-ghost"><Printer className="h-4 w-4" /> Print</button>}
      />

      <div className="ac-no-print ac-card mb-8 flex flex-wrap items-end gap-6 p-5">
        <label className="block">
          <span className="ac-eyebrow">event opens at</span>
          <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="ac-input mt-2 w-40" />
        </label>
        <label className="block">
          <span className="ac-eyebrow">booth complexity</span>
          <select value={complexity} onChange={(e) => setComplexity(e.target.value as Complexity)} className="ac-input mt-2">
            <option value="simple">Simple (1 table + product)</option>
            <option value="standard">Standard (tent + 2 tables + signage)</option>
            <option value="complex">Complex (full build, drape, lighting)</option>
          </select>
        </label>
      </div>

      <ol className="space-y-2">
        {schedule.map((s, i) => (
          <li key={i} className="ac-card flex items-center gap-4 p-4">
            <span className="w-16 font-serif text-lg italic text-[var(--ac-terracotta)]">{s.at}</span>
            <span className="w-20 text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{s.before}</span>
            <span className="flex-1 text-sm">{s.task}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
