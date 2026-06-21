import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  Search,
  Download,
  Heart,
  Gauge,
  Users,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Tent,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

const navItems: { to: LinkProps["to"]; label: string; icon: typeof Home }[] = [
  { to: "/academy", label: "Home", icon: Home },
  { to: "/academy/categories", label: "Categories", icon: LayoutGrid },
  { to: "/academy/booth", label: "Booth Setup", icon: Tent },
  { to: "/academy/must-haves", label: "Must-Haves", icon: ShoppingBag },
  { to: "/academy/search", label: "Search", icon: Search },
  { to: "/academy/downloads", label: "Downloads", icon: Download },
  { to: "/academy/favorites", label: "Favorites", icon: Heart },
  { to: "/academy/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/academy/community", label: "Community", icon: Users },
  { to: "/academy/admin", label: "Admin", icon: Settings },
];

export function AcademyShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="academy min-h-screen">
      <AcademyHeader onMenu={() => setOpen(true)} />
      <div className="mx-auto flex max-w-[1240px] gap-10 px-5 py-8 lg:px-10 lg:py-12">
        <aside className="hidden w-52 shrink-0 lg:block">
          <SideNav pathname={pathname} />
        </aside>
        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden ac-no-print">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[var(--ac-paper)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="ac-eyebrow">menu</p>
              <button onClick={() => setOpen(false)} className="rounded-full p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6">
              <SideNav pathname={pathname} onClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AcademyHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="ac-no-print sticky top-0 z-40 border-b border-[var(--ac-rule-soft)] bg-[var(--ac-paper)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="hidden items-center gap-1.5 text-xs text-[var(--ac-ink-mute)] hover:text-[var(--ac-ink)] md:inline-flex">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Trovin'
          </Link>
        </div>

        <Link to="/academy" className="flex items-center gap-3">
          <span className="font-serif text-[11px] tracking-[0.3em] text-[var(--ac-terracotta)]">
            TROVIN
          </span>
          <span className="h-3 w-px bg-[var(--ac-rule)]" />
          <span style={{ fontFamily: "Fraunces, serif" }} className="text-xl italic">
            Academy
          </span>
        </Link>

        <Link to="/academy/dashboard" className="ac-btn !py-2 !px-4 text-xs">
          Dashboard
        </Link>
      </div>
    </header>
  );
}

function SideNav({
  pathname,
  onClick,
}: {
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      <p className="ac-eyebrow mb-3 px-3">the academy</p>
      {navItems.map((it, idx) => {
        const active =
          it.to === "/academy"
            ? pathname === "/academy"
            : pathname.startsWith(String(it.to));
        return (
          <Link
            key={it.label}
            to={it.to}
            onClick={onClick}
            className={`group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition ${
              active
                ? "bg-[var(--ac-ink)] text-[var(--ac-paper)]"
                : "text-[var(--ac-ink-soft)] hover:bg-[var(--ac-cream-deep)] hover:text-[var(--ac-ink)]"
            }`}
          >
            <span
              className={`text-[10px] tabular-nums ${
                active ? "text-[var(--ac-terracotta-soft)]" : "text-[var(--ac-ink-mute)]"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <it.icon className="h-4 w-4 opacity-80" />
            <span className="font-medium tracking-tight">{it.label}</span>
          </Link>
        );
      })}

      <div className="mt-8 rounded-sm border border-[var(--ac-rule-soft)] bg-white p-4">
        <p className="ac-eyebrow">tip of the week</p>
        <p className="mt-2 font-serif text-base italic leading-snug">
          "Price the experience, not the inventory."
        </p>
        <p className="mt-3 text-[11px] text-[var(--ac-ink-mute)]">
          — Maven & Moth · 6 yrs vending
        </p>
      </div>
    </nav>
  );
}

export function AcademyPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-10 border-b border-[var(--ac-rule)] pb-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="ac-eyebrow">{eyebrow}</p>
          <h1
            style={{ fontFamily: "Fraunces, serif" }}
            className="mt-3 text-4xl leading-[1.05] md:text-5xl"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ac-ink-soft)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
