import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listShoppers } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/shoppers")({
  component: ShoppersAdmin,
});

function ShoppersAdmin() {
  const fn = useServerFn(listShoppers);
  const { data, isLoading } = useQuery({ queryKey: ["admin-shoppers"], queryFn: () => fn() });

  return (
    <div>
      <p className="font-script text-2xl text-teal">the crowd —</p>
      <h1 className="font-display text-4xl">Shoppers</h1>
      {isLoading ? <p className="mt-6 text-ink-soft">Loading…</p> : (
        <div className="mt-6 overflow-hidden rounded-xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="bg-cream-deep text-left text-xs uppercase tracking-wider text-ink-mute">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Following</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.shoppers.map((s: any) => (
                <tr key={s.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium">{s.display_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{s.email}</td>
                  <td className="px-4 py-3">{s.follow_count}</td>
                  <td className="px-4 py-3 text-ink-soft">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {data?.shoppers.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-ink-soft">No shoppers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
