import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { boothLayouts, type BoothLayout, type LayoutZone } from "@/data/booth";

export const Route = createFileRoute("/academy/booth/layouts/$slug")({
  head: ({ params }) => {
    const l = boothLayouts.find((l) => l.slug === params.slug);
    return {
      meta: [
        { title: l ? `${l.title} — Booth Layout` : "Layout — Trovin Academy" },
        { name: "description", content: l?.summary ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const layout = boothLayouts.find((l) => l.slug === params.slug);
    if (!layout) throw notFound();
    return { layout };
  },
  errorComponent: ({ error, reset }) => (
    <div className="ac-card p-8">
      <h1 className="font-serif text-2xl">Something went wrong</h1>
      <p className="mt-2 text-sm">{(error as Error).message}</p>
      <button onClick={reset} className="ac-btn mt-4">Try again</button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="ac-card p-8">
      <h1 className="font-serif text-2xl">Layout not found</h1>
      <Link to="/academy/booth/layouts" className="ac-btn-ghost mt-4 inline-flex">All layouts</Link>
    </div>
  ),
  component: LayoutDetail,
});

const zoneInfo: Record<LayoutZone["kind"], { label: string; color: string; desc: string }> = {
  product: { label: "Product", color: "#E8B7AB", desc: "Where merchandise lives — walls, shelves, tables." },
  flow: { label: "Customer Flow", color: "#B7CFC5", desc: "The path a customer naturally walks through the booth." },
  checkout: { label: "Checkout", color: "#1A1A1A", desc: "Register, card reader, bagging area." },
  storage: { label: "Storage", color: "#D9D2C4", desc: "Hidden inventory and supplies — never customer-visible." },
  signage: { label: "Signage", color: "#C8553D", desc: "Banner, menu board, brand markers." },
  upsell: { label: "Upsell", color: "#EFE7D6", desc: "Accessories or add-ons priced to bump average order." },
  waiting: { label: "Waiting", color: "#E8E0D3", desc: "Where partners stand, lines form, or pickup happens." },
  impulse: { label: "Impulse", color: "#2E5E4E", desc: "Under-$10 grab items placed at the register or front edge." },
};

function LayoutDetail() {
  const { layout } = Route.useLoaderData() as { layout: BoothLayout };
  const usedZones = Array.from(new Set(layout.zones.map((z) => z.kind))) as LayoutZone["kind"][];

  return (
    <article>
      <Link to="/academy/booth/layouts" className="ac-eyebrow inline-flex items-center gap-1.5 hover:text-[var(--ac-ink)]">
        <ArrowLeft className="h-3 w-3" /> all layouts
      </Link>
      <AcademyPageHeader
        eyebrow={`${layout.size} · ${layout.category}`}
        title={layout.title}
        description={layout.summary}
        actions={
          <button onClick={() => window.print()} className="ac-btn-ghost">
            <Printer className="h-4 w-4" /> Print
          </button>
        }
      />

      <div className="ac-card p-6">
        <BigLayout layout={layout} />
      </div>

      <section className="mt-10">
        <p className="ac-eyebrow">zone legend</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {usedZones.map((k) => {
            const z = zoneInfo[k];
            return (
              <div key={k} className="ac-card flex items-start gap-3 p-4">
                <span className="mt-1 inline-block h-4 w-4 rounded-sm" style={{ backgroundColor: z.color }} />
                <div>
                  <p className="font-serif text-base">{z.label}</p>
                  <p className="mt-0.5 text-xs text-[var(--ac-ink-soft)]">{z.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <p className="ac-eyebrow">annotated zones</p>
        <ul className="mt-4 space-y-2">
          {layout.zones.map((z, i) => (
            <li key={i} className="flex items-start gap-3 border-b border-[var(--ac-rule-soft)] pb-2">
              <span className="mt-1 inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: zoneInfo[z.kind].color }} />
              <div className="flex-1 text-sm">
                <span className="font-medium">{z.label}</span>
                {z.note && <span className="ml-2 text-xs text-[var(--ac-ink-soft)]">— {z.note}</span>}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{zoneInfo[z.kind].label}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function BigLayout({ layout }: { layout: BoothLayout }) {
  return (
    <svg viewBox={`-6 -6 ${layout.width + 12} ${layout.height + 12}`} className="h-auto w-full">
      <rect x={0} y={0} width={layout.width} height={layout.height} fill="#FAF7F2" stroke="#1A1A1A" strokeWidth={0.8} />
      {/* grid */}
      {Array.from({ length: Math.floor(layout.width / 10) + 1 }).map((_, i) => (
        <line key={`vx${i}`} x1={i * 10} y1={0} x2={i * 10} y2={layout.height} stroke="#D9D2C4" strokeWidth={0.3} />
      ))}
      {Array.from({ length: Math.floor(layout.height / 10) + 1 }).map((_, i) => (
        <line key={`hy${i}`} x1={0} y1={i * 10} x2={layout.width} y2={i * 10} stroke="#D9D2C4" strokeWidth={0.3} />
      ))}
      {layout.zones.map((z, i) => (
        <g key={i}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill={zoneInfo[z.kind].color}
            opacity={z.kind === "checkout" || z.kind === "impulse" ? 0.95 : 0.8}
            stroke="#1A1A1A"
            strokeWidth={0.3}
          />
          <text
            x={z.x + z.w / 2}
            y={z.y + z.h / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={Math.min(3, z.w / Math.max(z.label.length, 6) * 1.6)}
            fill={z.kind === "checkout" || z.kind === "impulse" ? "#FAF7F2" : "#1A1A1A"}
            fontFamily="Inter, sans-serif"
          >
            {z.label}
          </text>
        </g>
      ))}
      {/* "front" indicator */}
      <text x={layout.width / 2} y={layout.height + 4} textAnchor="middle" fontSize={3} fill="#8A8378" fontFamily="Fraunces, serif" fontStyle="italic">
        ▲ booth front (aisle)
      </text>
    </svg>
  );
}
