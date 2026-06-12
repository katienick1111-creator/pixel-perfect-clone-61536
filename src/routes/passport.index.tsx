import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Wallet, Gift, ScanLine, Store, Sparkles } from "lucide-react";
import { usePassport } from "@/hooks/usePassport";

export const Route = createFileRoute("/passport/")({
  component: PassportLanding,
});

function PassportLanding() {
  const { balance, state, resetDemo } = usePassport();
  return (
    <div>
      <div className="text-center">
        <p className="font-script text-3xl text-teal leading-none">earn as you go —</p>
        <h1 className="mt-1 font-display text-4xl">Trovin' Passport</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Get checked in at any booth. Stack points. Cash them in for real stuff.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-line bg-paper p-5 shadow-brand-md">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">your balance</p>
        <p className="mt-1 font-display text-5xl text-navy">{balance} <span className="text-gold-600">pts</span></p>
        <p className="mt-1 text-xs text-ink-soft">= ${(balance / 100).toFixed(2)} of reward value</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Tile to="/passport/qr" icon={QrCode} title="My QR" desc="Show this at a booth" tint="bg-gold/20" />
        <Tile to="/passport/wallet" icon={Wallet} title="Wallet" desc="See your history" tint="bg-teal/20" />
        <Tile to="/passport/rewards" icon={Gift} title="Rewards" desc="Spend your points" tint="bg-coral/20" />
        <Tile to="/passport/scan" icon={ScanLine} title="Scan" desc="Vendor side" tint="bg-navy/10" />
        <Tile to="/passport/vendor" icon={Store} title="Booth setup" desc="Tier + live status" tint="bg-paper" />
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-paper p-5">
        <p className="font-script text-2xl text-coral leading-none">how it works —</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Check-in = <b>10 points</b>. Vendors scan you — never the other way around.</li>
          <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> Higher-tier booths unlock social (+15), reviews (+20), purchases (+25).</li>
          <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Same booth, same day = one check-in. No farming.</li>
          <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-navy" /> 1 point = $0.01 of reward value. Trovin' pays out, not vendors.</li>
        </ul>
      </section>

      <div className="mt-6 text-center text-[10px] text-ink-mute">
        <p>demo data only · token <span className="font-mono">{state.me.personalQrToken.slice(0, 8)}…</span></p>
        <button onClick={resetDemo} className="mt-1 underline hover:text-navy">reset demo</button>
      </div>
    </div>
  );
}

function Tile({ to, icon: Icon, title, desc, tint }: any) {
  return (
    <Link to={to} className={`rounded-2xl border border-line p-4 ${tint} hover:shadow-brand-md transition`}>
      <Icon className="h-6 w-6 text-navy" />
      <p className="mt-2 font-display text-lg leading-tight">{title}</p>
      <p className="text-[11px] text-ink-soft">{desc}</p>
    </Link>
  );
}
