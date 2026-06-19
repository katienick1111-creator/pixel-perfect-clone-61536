import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Download, Heart, Target, Wallet, PackageCheck } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { academyTools } from "@/data/academy";

export const Route = createFileRoute("/academy/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Trovin Academy" },
      { name: "description", content: "Your saved tools, goals, and recent activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [recent, setRecent] = useState<{ slug: string; savedAt: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const items: { slug: string; savedAt: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith("trovin.academy.worksheet.")) continue;
      try {
        const v = JSON.parse(localStorage.getItem(k) ?? "{}");
        if (v.savedAt) {
          items.push({ slug: k.replace("trovin.academy.worksheet.", ""), savedAt: v.savedAt });
        }
      } catch {
        /* noop */
      }
    }
    items.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    setRecent(items);
  }, []);

  return (
    <div>
      <AcademyPageHeader
        eyebrow="member dashboard"
        title="Your vendor headquarters."
        description="Everything you've saved, started, or favorited. Pick up where you left off."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Target, label: "Active goals", value: "0" },
          { icon: Wallet, label: "Logged this month", value: "$0" },
          { icon: PackageCheck, label: "Tools in progress", value: String(recent.length) },
          { icon: Heart, label: "Favorites", value: "0" },
        ].map((s) => (
          <div key={s.label} className="ac-card p-5">
            <s.icon className="h-5 w-5 text-[var(--ac-terracotta)]" />
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-3 text-3xl"
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-[var(--ac-ink-mute)]">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="ac-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="ac-eyebrow">recent activity</p>
            <Link to="/academy/categories" className="text-xs text-[var(--ac-terracotta)] hover:underline">
              Browse all
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[var(--ac-rule-soft)] p-8 text-center">
              <BookOpen className="mx-auto h-6 w-6 text-[var(--ac-ink-mute)]" />
              <p className="mt-3 text-sm text-[var(--ac-ink-soft)]">
                Nothing here yet. Open a tool and your progress shows up here.
              </p>
              <Link to="/academy/tools/packing" className="ac-btn mt-4">
                Start with the packing checklist
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--ac-rule-soft)]">
              {recent.map((r) => {
                const tool = academyTools.find((t) => t.slug === r.slug);
                return (
                  <li key={r.slug} className="flex items-center justify-between py-3">
                    <div>
                      <p style={{ fontFamily: "Fraunces, serif" }} className="text-lg">
                        {tool?.title ?? r.slug}
                      </p>
                      <p className="text-xs text-[var(--ac-ink-mute)]">
                        Saved {new Date(r.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to="/academy/tools/packing"
                      className="text-sm text-[var(--ac-terracotta)] hover:underline"
                    >
                      Resume
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="ac-card p-6">
          <p className="ac-eyebrow">quick links</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/academy/downloads" className="flex items-center gap-2 hover:underline">
                <Download className="h-4 w-4" /> Download library
              </Link>
            </li>
            <li>
              <Link to="/academy/favorites" className="flex items-center gap-2 hover:underline">
                <Heart className="h-4 w-4" /> Your favorites
              </Link>
            </li>
            <li>
              <Link to="/academy/community" className="flex items-center gap-2 hover:underline">
                <BookOpen className="h-4 w-4" /> Community feed
              </Link>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
