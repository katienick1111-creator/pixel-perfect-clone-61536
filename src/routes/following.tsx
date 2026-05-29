import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Sparkles, CalendarDays, Heart } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { VendorCard } from "@/components/VendorCard";
import { vendors } from "@/data/trovin";

export const Route = createFileRoute("/following")({
  head: () => ({
    meta: [
      { title: "Following — Trovin'" },
      {
        name: "description",
        content:
          "Your followed vendors, recent drops, and saved events all in one place.",
      },
      { property: "og:title", content: "Following — Trovin'" },
      {
        property: "og:description",
        content: "Vendors you follow, fresh drops, and saved events.",
      },
    ],
    links: [{ rel: "canonical", href: "/following" }],
  }),
  component: FollowingPage,
});

const initial = { v1: true, v3: true, v5: true, v2: true } as Record<string, boolean>;

const drops = [
  {
    id: "d1",
    icon: Sparkles,
    title: "Maven & Moth restocked brass candlesticks",
    detail: "12 min ago • Booth 142",
  },
  {
    id: "d2",
    icon: Heart,
    title: "Smoke & Sown added a Sunday brunch menu",
    detail: "1 hr ago • West Loop Food Yard",
  },
  {
    id: "d3",
    icon: CalendarDays,
    title: "Greenline Farm is at Logan Sq. tomorrow",
    detail: "Sun 8a – 1p",
  },
  {
    id: "d4",
    icon: Bell,
    title: "Paper Crane Press dropped a new zine run",
    detail: "Yesterday • Aisle B 14",
  },
];

function FollowingPage() {
  const [following, setFollowing] = useState<Record<string, boolean>>(initial);
  const followed = vendors.filter((v) => following[v.id]);

  return (
    <AppShell>
      <PageHeader
        scribble="your people —"
        title="Following"
        subtitle={`${followed.length} vendors • ${drops.length} fresh drops since yesterday`}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section>
          <h2 className="mb-3 font-display text-xl">Vendors you follow</h2>
          {followed.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-ink-soft">
              You're not following anyone yet. Head back to Discover and tap a
              heart.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {followed.map((v) => (
                <VendorCard
                  key={v.id}
                  vendor={v}
                  following={true}
                  onToggle={() =>
                    setFollowing((f) => ({ ...f, [v.id]: !f[v.id] }))
                  }
                />
              ))}
            </div>
          )}
        </section>

        <aside className="relative rounded-2xl border border-line bg-paper p-5 shadow-brand-sm">
          <span className="absolute -top-3 left-5 -rotate-2 rounded-sm bg-teal-200/80 px-2 py-0.5 font-script text-sm text-teal shadow-brand-sm">
            fresh drops
          </span>
          <h3 className="mb-3 font-display text-lg">Activity</h3>
          <ul className="space-y-3">
            {drops.map((d) => (
              <li
                key={d.id}
                className="flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-cream-deep/60"
              >
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-200/60 text-teal">
                  <d.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy">{d.title}</p>
                  <p className="text-xs text-ink-soft">{d.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
