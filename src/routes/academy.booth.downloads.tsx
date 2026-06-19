import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download as DownloadIcon, Printer } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { downloadDocs, type DownloadDoc } from "@/data/booth";

export const Route = createFileRoute("/academy/booth/downloads")({
  head: () => ({
    meta: [
      { title: "Booth Download Library — Trovin Academy" },
      { name: "description", content: "Printable PDFs: planning workbook, layout guides, signage guides, lighting plans, packing and setup checklists." },
    ],
  }),
  component: Downloads,
});

function Downloads() {
  const [active, setActive] = useState<DownloadDoc | null>(null);

  if (active) {
    return (
      <article>
        <div className="ac-no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setActive(null)} className="ac-btn-ghost">← Library</button>
          <button onClick={() => window.print()} className="ac-btn"><Printer className="h-4 w-4" /> Print / Save as PDF</button>
        </div>
        <div className="ac-card mx-auto max-w-3xl p-10 print:border-0 print:p-0 print:shadow-none">
          <p className="text-[11px] uppercase tracking-widest text-[var(--ac-terracotta)]">Trovin Academy · Booth Setup</p>
          <h1 style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-3xl">{active.title}</h1>
          <p className="mt-3 text-sm text-[var(--ac-ink-soft)]">{active.description}</p>

          <div className="mt-8 space-y-8">
            {active.sections.map((s, i) => (
              <section key={i}>
                <h2 className="border-b border-[var(--ac-rule)] pb-1 font-serif text-lg">{s.heading}</h2>
                <ul className="mt-3 space-y-2">
                  {s.items.map((it, j) => (
                    <li key={j} className="flex items-start gap-3 border-b border-dashed border-[var(--ac-rule-soft)] pb-2">
                      <span className="mt-1 inline-block h-3.5 w-3.5 rounded-sm border border-[var(--ac-rule)]" />
                      <span className="text-sm">{it}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <footer className="mt-12 border-t border-[var(--ac-rule)] pt-4 text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">
            trovin academy · printable · v1
          </footer>
        </div>
      </article>
    );
  }

  return (
    <div>
      <AcademyPageHeader
        eyebrow="download library"
        title="14 Printable PDFs"
        description="Open any doc, then click Print → Save as PDF. Designed to look beautiful on paper."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {downloadDocs.map((d) => (
          <button key={d.slug} onClick={() => setActive(d)} className="ac-card group flex flex-col p-6 text-left transition hover:-translate-y-0.5">
            <DownloadIcon className="h-5 w-5 text-[var(--ac-terracotta)]" />
            <h3 style={{ fontFamily: "Fraunces, serif" }} className="mt-3 text-lg">{d.title}</h3>
            <p className="mt-1 text-xs text-[var(--ac-ink-soft)]">{d.description}</p>
            <span className="mt-3 text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{d.sections.length} sections</span>
          </button>
        ))}
      </div>
    </div>
  );
}
