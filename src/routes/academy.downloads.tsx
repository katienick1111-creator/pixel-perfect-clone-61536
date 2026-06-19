import { createFileRoute } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Download } from "lucide-react";

export const Route = createFileRoute("/academy/downloads")({
  head: () => ({ meta: [{ title: "Downloads — Trovin Academy" }] }),
  component: () => (
    <div>
      <AcademyPageHeader
        eyebrow="library"
        title="100+ printable resources."
        description="Checklists, planners, trackers, workbooks, and calendars — every interactive tool also exports as PDF."
      />
      <div className="ac-card flex flex-col items-center gap-3 p-12 text-center">
        <Download className="h-8 w-8 text-[var(--ac-terracotta)]" />
        <p style={{ fontFamily: "Fraunces, serif" }} className="text-2xl">
          Library cataloging in progress
        </p>
        <p className="max-w-md text-sm text-[var(--ac-ink-soft)]">
          Admin tooling for uploading PDFs ships in the next drop. For now,
          every interactive worksheet supports print-to-PDF.
        </p>
      </div>
    </div>
  ),
});
