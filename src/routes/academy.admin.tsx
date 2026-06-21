import { createFileRoute, Link } from "@tanstack/react-router";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { Package, FileText, Download, Users } from "lucide-react";

export const Route = createFileRoute("/academy/admin")({
  head: () => ({ meta: [{ title: "Admin — Trovin Academy" }] }),
  component: AdminIndex,
});

function AdminIndex() {
  const tiles = [
    {
      to: "/academy/admin/must-haves",
      title: "Vendor Must-Haves",
      desc: "Add, edit, and feature products in the gear library.",
      icon: Package,
    },
    {
      to: "/academy/articles",
      title: "Articles",
      desc: "Browse the article library (editor coming soon).",
      icon: FileText,
    },
    {
      to: "/academy/downloads",
      title: "Downloads",
      desc: "Browse downloadable resources.",
      icon: Download,
    },
    {
      to: "/academy/community",
      title: "Community",
      desc: "Browse the community feed.",
      icon: Users,
    },
  ];

  return (
    <div>
      <AcademyPageHeader
        eyebrow="admin"
        title="Academy operations."
        description="Manage the resources that power Trovin Academy."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="ac-card group flex items-start gap-4 p-6 transition hover:-translate-y-0.5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ac-cream)] text-[var(--ac-terracotta)]">
              <t.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-serif text-lg text-[var(--ac-ink)]">{t.title}</div>
              <div className="mt-1 text-sm text-[var(--ac-ink-soft)]">{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
