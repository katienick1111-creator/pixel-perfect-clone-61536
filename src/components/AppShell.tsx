import {
  Link,
  useRouterState,
  type LinkProps,
} from "@tanstack/react-router";
import {
  Bell,
  MapPin,
  ChevronRight,
  Compass,
  CalendarDays,
  Map as MapIcon,
  Heart,
  Store,
  House,
  User,
} from "lucide-react";
import trovinLogo from "@/assets/trovin-logo.png";
import trovinBadge from "@/assets/trovin-badge.png";

type IconType = typeof Compass;

const sideItems: { to: LinkProps["to"]; icon: IconType; label: string; badge?: string }[] = [
  { to: "/", icon: Compass, label: "Discover" },
  { to: "/events", icon: CalendarDays, label: "Events", badge: "12" },
  { to: "/map", icon: MapIcon, label: "Map" },
  { to: "/following", icon: Heart, label: "Following", badge: "3" },
  { to: "/vendor", icon: Store, label: "Vendor Portal" },
];

const mobileItems: { to: LinkProps["to"]; icon: IconType; label: string }[] = [
  { to: "/", icon: House, label: "Home" },
  { to: "/events", icon: CalendarDays, label: "Events" },
  { to: "/map", icon: MapIcon, label: "Map" },
  { to: "/following", icon: Heart, label: "Saved" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <Header />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-6 lg:px-8 lg:py-10">
        <SideNav />
        <main className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={trovinBadge}
            alt="Trovin'"
            className="h-11 w-11 rounded-full shadow-brand-sm"
          />
          <img
            src={trovinLogo}
            alt="Trovin' — Find more. Miss less."
            className="hidden h-11 w-auto md:block"
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink-soft transition hover:border-teal hover:text-navy md:inline-flex">
            <MapPin className="h-4 w-4 text-teal" />
            Chicago, IL
            <ChevronRight className="h-4 w-4 -rotate-90 text-ink-mute" />
          </button>
          <button
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-navy transition hover:border-teal"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-gold" />
          </button>
          <Link
            to="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-cream"
          >
            JM
          </Link>
        </div>
      </div>
    </header>
  );
}

function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 flex flex-col gap-1">
        {sideItems.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.label}
              to={it.to}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-navy text-cream shadow-brand-sm"
                  : "text-ink-soft hover:bg-paper hover:text-navy"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <it.icon className="h-4 w-4" />
                {it.label}
              </span>
              {it.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    active ? "bg-cream/15 text-cream" : "bg-cream-deep text-ink-soft"
                  }`}
                >
                  {it.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="relative mt-6 rounded-lg border border-line bg-paper p-4 shadow-brand-sm">
          <span className="absolute -top-2 -right-2 -rotate-6 rounded-sm bg-gold/80 px-1.5 py-0.5 font-script text-[11px] text-navy shadow-brand-sm">
            today!
          </span>
          <p className="font-script text-3xl text-teal leading-none">
            Let's go Trovin'.
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            218 vendors are out today across 11 events in Chicago.
          </p>
        </div>
      </nav>
    </aside>
  );
}

function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-30 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-[28px] border border-line/80 bg-paper/95 px-2 py-2 shadow-brand-lg backdrop-blur">
        {mobileItems.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.label}
              to={it.to}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-medium transition ${
                active ? "text-teal" : "text-ink-mute"
              }`}
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                  active ? "bg-teal-200/55 text-teal" : "text-ink-mute"
                }`}
              >
                <it.icon className="h-5 w-5" />
              </span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHeader({
  scribble,
  title,
  subtitle,
}: {
  scribble: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="font-script text-2xl leading-none text-teal">{scribble}</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>}
    </div>
  );
}
