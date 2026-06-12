import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, QrCode, Wallet, Gift, ScanLine, Store, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "Loyalty — Trovin' Bytes" },
      { name: "description", content: "Earn Bytes at every Trovin' booth. Redeem for rewards." },
    ],
  }),
  component: LoyaltyLayout,
});

const tabs = [
  { to: "/loyalty/qr" as const, label: "My QR", icon: QrCode },
  { to: "/loyalty/wallet" as const, label: "Wallet", icon: Wallet },
  { to: "/loyalty/rewards" as const, label: "Rewards", icon: Gift },
  { to: "/loyalty/scan" as const, label: "Scan", icon: ScanLine },
  { to: "/loyalty/vendor" as const, label: "Booth", icon: Store },
];

function LoyaltyLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = path === "/loyalty" || path === "/loyalty/";

  return (
    <div className="min-h-screen bg-cream text-navy pb-24">
      <header className="sticky top-0 z-30 border-b border-line bg-navy text-cream">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2.5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream/85 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Trovin'
          </Link>
          <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-navy">
            bytes
          </span>
          <Link to="/loyalty/admin" className="inline-flex items-center gap-1 text-[10px] font-semibold text-cream/70 hover:text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-6">
        <Outlet />
      </main>

      {!isLanding && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-paper">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {tabs.map((t) => {
              const active = path.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition ${
                    active ? "text-navy" : "text-ink-mute hover:text-navy"
                  }`}
                >
                  <t.icon className={`h-5 w-5 ${active ? "text-gold-600" : ""}`} />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
