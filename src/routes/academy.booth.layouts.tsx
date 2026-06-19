import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { boothLayouts } from "@/data/booth";

export const Route = createFileRoute("/academy/booth/layouts")({
  head: () => ({
    meta: [
      { title: "Booth Layout Library — Trovin Academy" },
      { name: "description", content: "21 annotated vendor booth layouts: 10x10, 10x20, corner, island, indoor, outdoor, food, coffee, jewelry, candle, and more." },
    ],
  }),
  component: LayoutLibrary,
});

const sizeFilters = ["All", "10x10", "10x20", "Corner", "Island", "Indoor", "Outdoor", "Mobile"] as const;

function LayoutLibrary() {
  const [size, setSize] = useState<(typeof sizeFilters)[number]>("All");
  const list = size === "All" ? boothLayouts : boothLayouts.filter((l) => l.size === size);

  return (
    <div>
      <AcademyPageHeader
        eyebrow="layout library"
        title="21 Annotated Booth Layouts"
        description="Every layout shows the eight zones — product, customer flow, checkout, storage, signage, upsell, waiting, impulse — so you can copy what works and adapt it to your booth."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {sizeFilters.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={size === s ? "ac-btn !py-1.5 !px-3 text-xs" : "ac-btn-ghost !py-1.5 !px-3 text-xs"}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((l) => (
          <Link
            key={l.slug}
            to="/academy/booth/layouts/$slug"
            params={{ slug: l.slug }}
            className="ac-card group block overflow-hidden p-0 transition hover:-translate-y-0.5"
          >
            <div className="border-b border-[var(--ac-rule-soft)] bg-[var(--ac-paper-2)] p-4">
              <LayoutThumb layout={l} />
            </div>
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{l.size} · {l.category}</p>
              <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-lg">{l.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--ac-ink-soft)]">{l.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LayoutThumb({ layout }: { layout: (typeof boothLayouts)[number] }) {
  const colors: Record<string, string> = {
    product: "#E8B7AB", flow: "#B7CFC5", checkout: "#1A1A1A", storage: "#D9D2C4",
    signage: "#C8553D", upsell: "#EFE7D6", waiting: "#E8E0D3", impulse: "#2E5E4E",
  };
  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className="h-32 w-full">
      <rect x={0} y={0} width={layout.width} height={layout.height} fill="#FAF7F2" stroke="#1A1A1A" strokeWidth={0.6} />
      {layout.zones.map((z, i) => (
        <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} fill={colors[z.kind] ?? "#ccc"} opacity={0.85} />
      ))}
    </svg>
  );
}
