import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, Clock, LayoutGrid, Lightbulb, Map, Package, Signpost, Sparkles, Users } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";

export const Route = createFileRoute("/academy/booth/tools/")({
  head: () => ({
    meta: [
      { title: "Booth Tools — Trovin Academy" },
      { name: "description", content: "Interactive booth planning tools: drag-and-drop booth designer, setup checklist, packing list, setup timeline, and more." },
    ],
  }),
  component: ToolsIndex,
});

const tools = [
  { to: "/academy/booth/tools/planner", icon: LayoutGrid, title: "Booth Designer", desc: "Drag-and-drop your booth layout to scale.", status: "ready" },
  { to: "/academy/booth/tools/checklist", icon: CheckSquare, title: "Setup Checklist", desc: "Sectioned booth setup checklist with progress.", status: "ready" },
  { to: "/academy/booth/tools/timeline", icon: Clock, title: "Setup Timeline", desc: "Reverse-order schedule from your event start time.", status: "ready" },
  { to: "/academy/tools/packing", icon: Package, title: "Packing Checklist", desc: "The flagship Academy packing tool.", status: "ready" },
  { to: "/academy/booth/tools/planner", icon: Map, title: "Customer Flow Simulator", desc: "Overlays foot-traffic arrows on a layout.", status: "soon" },
  { to: "/academy/booth/tools/planner", icon: Signpost, title: "Sign Placement Tool", desc: "Place signage on your layout.", status: "soon" },
  { to: "/academy/booth/tools/planner", icon: Lightbulb, title: "Lighting Planner", desc: "Position lights, see coverage.", status: "soon" },
  { to: "/academy/booth/tools/planner", icon: Sparkles, title: "Product Placement Planner", desc: "AI-ranked product zones.", status: "soon" },
  { to: "/academy/booth/tools/planner", icon: Users, title: "Display Planner", desc: "Riser-by-riser display sketch.", status: "soon" },
];

function ToolsIndex() {
  return (
    <div>
      <AcademyPageHeader
        eyebrow="interactive tools"
        title="Plan, sketch, and pack — without leaving the booth"
        description="Everything you build here saves to your account so it's there next time."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <Link key={i} to={t.to} className="ac-card group flex flex-col p-6 transition hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <t.icon className="h-5 w-5 text-[var(--ac-terracotta)]" />
              {t.status === "soon" && <span className="ac-chip text-[10px]">coming soon</span>}
            </div>
            <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-3 text-lg">{t.title}</h3>
            <p className="mt-1 text-xs text-[var(--ac-ink-soft)]">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
