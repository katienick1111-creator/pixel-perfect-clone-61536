import { createFileRoute } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Users } from "lucide-react";

export const Route = createFileRoute("/academy/community")({
  head: () => ({ meta: [{ title: "Community — Trovin Academy" }] }),
  component: () => (
    <div>
      <AcademyPageHeader
        eyebrow="community"
        title="Where vendors trade tips and stories."
        description="Booth photos, success stories, Q&A, event reviews, and the featured vendor of the week."
      />
      <div className="ac-card flex flex-col items-center gap-3 p-12 text-center">
        <Users className="h-8 w-8 text-[var(--ac-terracotta)]" />
        <p style={{ fontFamily: "Fraunces, serif" }} className="text-2xl">
          Opening soon
        </p>
        <p className="max-w-md text-sm text-[var(--ac-ink-soft)]">
          We're moderating the first wave of vendor stories. Doors open in the
          next drop.
        </p>
      </div>
    </div>
  ),
});
