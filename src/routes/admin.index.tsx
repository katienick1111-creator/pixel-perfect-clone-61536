import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const fn = useServerFn(getAdminOverview);
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: () => fn() });

  if (isLoading) return <p className="text-ink-soft">Loading…</p>;
  if (!data) return null;

  const stats = [
    { label: "Pending vendors", value: data.vendorCounts.pending, accent: "bg-gold text-navy" },
    { label: "Approved vendors", value: data.vendorCounts.approved, accent: "bg-teal text-cream" },
    { label: "Hidden vendors", value: data.vendorCounts.hidden, accent: "bg-paper text-ink-soft" },
    { label: "Events", value: data.eventCount, accent: "bg-coral text-cream" },
    { label: "Shoppers", value: data.shopperCount, accent: "bg-navy text-cream" },
  ];

  return (
    <div>
      <p className="font-script text-2xl text-teal">today's pulse —</p>
      <h1 className="font-display text-4xl">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-6 shadow-brand-md ${s.accent}`}>
            <p className="font-mono text-[11px] uppercase tracking-widest opacity-80">{s.label}</p>
            <p className="mt-2 font-display text-5xl leading-none">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
