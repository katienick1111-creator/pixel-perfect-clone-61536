import { createFileRoute, Link } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/academy/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Trovin Academy" }] }),
  component: () => (
    <div>
      <AcademyPageHeader
        eyebrow="your favorites"
        title="Saved for the season."
        description="Bookmark articles, tools, and downloads. They land here."
      />
      <div className="ac-card flex flex-col items-center gap-3 p-12 text-center">
        <Heart className="h-8 w-8 text-[var(--ac-terracotta)]" />
        <p className="text-sm text-[var(--ac-ink-soft)]">
          You haven't favorited anything yet.
        </p>
        <Link to="/academy/categories" className="ac-btn mt-2">
          Browse categories
        </Link>
      </div>
    </div>
  ),
});
