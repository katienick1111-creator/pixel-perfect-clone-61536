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
  Shield,
} from "lucide-react";
import trovinLogo from "@/assets/trovin-logo.png";
import trovinBadge from "@/assets/trovin-badge.png";
import { useAuth } from "@/hooks/useAuth";


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
      <SiteFooter />
      <MobileNav />
    </div>
  );
}

function SiteFooter() {
  const cols: { title: string; links: { to: LinkProps["to"]; label: string }[] }[] = [
    {
      title: "Explore",
      links: [
        { to: "/", label: "Discover" },
        { to: "/events", label: "Events" },
        { to: "/map", label: "Map" },
        { to: "/following", label: "Following" },
      ],
    },
    {
      title: "For vendors",
      links: [
        { to: "/vendor", label: "Vendor Portal" },
        { to: "/vendor", label: "List your booth" },
        { to: "/vendor", label: "Pricing" },
      ],
    },
    {
      title: "Trovin'",
      links: [
        { to: "/profile", label: "Your profile" },
        { to: "/", label: "About" },
        { to: "/", label: "Press kit" },
        { to: "/", label: "Contact" },
      ],
    },
  ];

  return (
    <footer className="mt-16 hidden border-t border-line bg-navy text-cream lg:block">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={trovinBadge}
                alt="Trovin'"
                className="h-12 w-12 rounded-full shadow-brand-md"
              />
              <p className="font-script text-3xl leading-none text-gold-200">
                find more. miss less.
              </p>
            </div>
            <p className="mt-4 max-w-sm text-sm text-cream/75">
              Trovin' is a love letter to the makers, farmers, and food trucks
              that turn a Saturday morning into the best part of your week.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/20 bg-navy-700 px-3 py-2 text-xs text-cream/80">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              Currently roaming Chicago, IL
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-gold-200">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-cream/80 transition hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Trovin'. Made with cream & gold.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Cookies</a>
            <a href="#" className="hover:text-gold">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-navy/90 bg-navy text-cream shadow-brand-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={trovinBadge}
            alt="Trovin'"
            className="h-11 w-11 rounded-full ring-2 ring-gold/60"
          />
          <div className="leading-tight">
            <p className="font-script text-2xl leading-none text-gold-200">
              Trovin'
            </p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-cream/70">
              find more · miss less
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-cream/20 bg-navy-700 px-3 py-2 text-sm font-medium text-cream/85 transition hover:border-gold hover:text-cream md:inline-flex">
            <MapPin className="h-4 w-4 text-gold" />
            Chicago, IL
            <ChevronRight className="h-4 w-4 -rotate-90 text-cream/50" />
          </button>
          <AuthChip />
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
function AuthChip() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) {
    return (
      <Link to="/login" className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold-400">
        Sign in
      </Link>
    );
  }
  return (
    <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-2 text-sm font-semibold text-navy hover:bg-gold-400">
      <Shield className="h-4 w-4" /> Admin
    </Link>
  );
}

function SideNav() {

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
