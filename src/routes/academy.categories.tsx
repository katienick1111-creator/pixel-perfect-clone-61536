import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { academyCategories } from "@/data/academy";

export const Route = createFileRoute("/academy/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Trovin Academy" },
      {
        name: "description",
        content:
          "Eight chapters covering the full vendor life: getting started, festivals, booth design, pricing, marketing, business tools, stories, and downloads.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div>
      <AcademyPageHeader
        eyebrow="catalog"
        title="Eight chapters. One vendor life."
        description="Each chapter pairs essays, tools, and printables. Start where you are, jump around as you grow."
      />

      <div className="space-y-px overflow-hidden rounded-sm border border-[var(--ac-rule)] bg-[var(--ac-rule)]">
        {academyCategories.map((c) => (
          <Link
            key={c.slug}
            to="/academy/c/$slug"
            params={{ slug: c.slug }}
            className="group grid items-center gap-6 bg-[var(--ac-paper)] p-6 transition hover:bg-white md:grid-cols-[60px_1.2fr_2fr_auto]"
          >
            <p className="ac-number text-2xl">{c.number}</p>
            <h2
              style={{ fontFamily: "Fraunces, serif" }}
              className="text-2xl leading-tight"
            >
              {c.title}
            </h2>
            <p className="text-sm text-[var(--ac-ink-soft)]">
              {c.longDescription}
            </p>
            <span className="inline-flex items-center gap-1 text-sm text-[var(--ac-terracotta)] opacity-70 transition group-hover:opacity-100">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
