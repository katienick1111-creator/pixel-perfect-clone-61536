import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Store, CalendarDays, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Trovin'" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const rolesFn = useServerFn(getMyRoles);

  const { data: rolesData, isLoading: rolesLoading, error } = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => rolesFn(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || (user && rolesLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-cream text-ink-soft">Loading…</div>;
  }
  if (!user) return null;

  const isAdmin = rolesData?.roles.includes("admin");
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-navy px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl">Not so fast</h1>
          <p className="mt-3 text-ink-soft text-sm">
            You're signed in but don't have admin access. Ask the existing admin to add you,
            or {error ? "try again" : "head back home"}.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/" className="rounded-full bg-navy text-cream px-5 py-2 text-sm">Home</Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-full border border-line px-5 py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nav = [
    { to: "/admin" as const, label: "Overview", icon: LayoutDashboard },
    { to: "/admin/vendors" as const, label: "Vendors", icon: Store },
    { to: "/admin/events" as const, label: "Events", icon: CalendarDays },
    { to: "/admin/shoppers" as const, label: "Shoppers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-cream text-navy">
      <header className="sticky top-0 z-20 border-b border-line bg-navy text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="font-script text-2xl text-gold-200">Trovin' admin</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-cream/70 hidden md:inline">{user.email}</span>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}
              className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 px-3 py-1.5 hover:border-gold"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-navy text-cream" : "text-ink-soft hover:bg-paper"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1"><Outlet /></main>
      </div>
    </div>
  );
}
