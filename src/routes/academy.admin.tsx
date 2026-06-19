import { createFileRoute } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/academy/admin")({
  head: () => ({ meta: [{ title: "Admin — Trovin Academy" }] }),
  component: () => (
    <div>
      <AcademyPageHeader
        eyebrow="admin"
        title="Academy operations."
        description="Articles, downloads, categories, featured resources, and analytics."
      />
      <div className="ac-card flex flex-col items-center gap-3 p-12 text-center">
        <Settings className="h-8 w-8 text-[var(--ac-terracotta)]" />
        <p className="max-w-md text-sm text-[var(--ac-ink-soft)]">
          Role-gated admin console ships in the next drop.
        </p>
      </div>
    </div>
  ),
});
