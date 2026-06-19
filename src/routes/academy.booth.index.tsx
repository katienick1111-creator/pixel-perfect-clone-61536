import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Download, Image as ImageIcon, LayoutGrid, Sparkles, Tent } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { boothChapters, boothLayouts } from "@/data/booth";

export const Route = createFileRoute("/academy/booth/")({
  head: () => ({
    meta: [
      { title: "Booth Setup Masterclass — Trovin Academy" },
      {
        name: "description",
        content:
          "A full vendor booth masterclass: lessons, 21 annotated layouts, interactive planners, downloads, and an inspiration gallery.",
      },
      { property: "og:title", content: "Booth Setup Masterclass — Trovin Academy" },
      {
        property: "og:description",
        content:
          "Learn to build a booth that attracts more customers and increases sales. Course, layouts, tools, downloads.",
      },
    ],
  }),
  component: BoothHome,
});

function BoothHome() {
  const featuredLayouts = boothLayouts.slice(0, 6);
  return (
    <div>
      <AcademyPageHeader
        eyebrow="masterclass no. 02"
        title="Booth Setup Masterclass"
        description="Everything we know about turning ten square feet into a storefront that pulls people in. Course-style lessons, annotated layouts, interactive planners, and a download library."
        actions={
          <>
            <Link to="/academy/booth/chapters/$slug" params={{ slug: "booth-basics" }} className="ac-btn">
              Start the course <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/academy/booth/tools/planner" className="ac-btn-ghost">
              <Sparkles className="h-4 w-4" /> Booth designer
            </Link>
          </>
        }
      />

      {/* Section nav */}
      <section className="grid gap-4 md:grid-cols-4">
        <SectionCard to="/academy/booth/layouts" icon={LayoutGrid} title="Layout Library" desc="21 annotated booth layouts." />
        <SectionCard to="/academy/booth/tools" icon={Tent} title="Interactive Tools" desc="Planner, checklist, timeline." />
        <SectionCard to="/academy/booth/gallery" icon={ImageIcon} title="Inspiration Gallery" desc="Hundreds of real booths." />
        <SectionCard to="/academy/booth/downloads" icon={Download} title="Download Library" desc="14 printable PDFs." />
      </section>

      {/* Chapters */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-[var(--ac-rule)] pb-3">
          <div>
            <p className="ac-eyebrow">the syllabus</p>
            <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-3xl">
              Nine chapters, written for vendors
            </h2>
          </div>
          <Link to="/academy/booth/chapters/$slug" params={{ slug: "booth-basics" }} className="hidden text-sm underline underline-offset-4 md:inline-block">
            Start at chapter one
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {boothChapters.map((c) => (
            <Link
              key={c.slug}
              to="/academy/booth/chapters/$slug"
              params={{ slug: c.slug }}
              className="ac-card group flex flex-col p-6 transition hover:-translate-y-0.5"
            >
              <span className="ac-number">{c.number}</span>
              <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-3 text-xl">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ac-ink-soft)]">{c.summary}</p>
              <p className="mt-4 text-[11px] uppercase tracking-widest text-[var(--ac-ink-mute)]">
                {c.lessons.length} lessons · ~{c.lessons.reduce((s, l) => s + l.readMinutes, 0)} min read
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ac-terracotta)] underline-offset-4 group-hover:underline">
                <BookOpen className="h-3.5 w-3.5" /> Read chapter
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured layouts */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-[var(--ac-rule)] pb-3">
          <div>
            <p className="ac-eyebrow">layout library</p>
            <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-3xl">
              Annotated booth layouts
            </h2>
          </div>
          <Link to="/academy/booth/layouts" className="text-sm underline underline-offset-4">
            See all {boothLayouts.length}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredLayouts.map((l) => (
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
                <p className="text-[11px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{l.size}</p>
                <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-lg">
                  {l.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--ac-ink-soft)]">{l.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionCard({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: typeof Tent;
  title: string;
  desc: string;
}) {
  return (
    <Link to={to} className="ac-card group flex items-start gap-3 p-5 transition hover:-translate-y-0.5">
      <Icon className="mt-1 h-5 w-5 text-[var(--ac-terracotta)]" />
      <div>
        <p className="font-serif text-base">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ac-ink-soft)]">{desc}</p>
      </div>
    </Link>
  );
}

// Tiny SVG thumbnail of a layout — reused on the home page.
function LayoutThumb({ layout }: { layout: { width: number; height: number; zones: { x: number; y: number; w: number; h: number; kind: string }[] } }) {
  const colors: Record<string, string> = {
    product: "#E8B7AB",
    flow: "#B7CFC5",
    checkout: "#1A1A1A",
    storage: "#D9D2C4",
    signage: "#C8553D",
    upsell: "#EFE7D6",
    waiting: "#E8E0D3",
    impulse: "#2E5E4E",
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
