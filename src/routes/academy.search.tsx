import { createFileRoute } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/academy/search")({
  head: () => ({ meta: [{ title: "Search — Trovin Academy" }] }),
  component: () => (
    <div>
      <AcademyPageHeader
        eyebrow="search"
        title="Find anything in the Academy."
        description="Articles, downloads, calculators, worksheets, categories, and tips."
      />
      <div className="ac-card flex items-center gap-3 p-4">
        <SearchIcon className="h-5 w-5 text-[var(--ac-ink-mute)]" />
        <input
          className="w-full bg-transparent text-base focus:outline-none"
          placeholder="Search the Academy…"
        />
      </div>
      <p className="mt-6 text-sm text-[var(--ac-ink-mute)]">
        Full-text indexing across articles and downloads ships in the next drop.
      </p>
    </div>
  ),
});
