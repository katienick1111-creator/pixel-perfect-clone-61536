import { createFileRoute, Link } from "@tanstack/react-router";
import {
  QrCode,
  Wallet,
  Gift,
  ScanLine,
  Store,
  Sparkles,
  Crown,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { usePassport, ACTION_LABEL } from "@/hooks/usePassport";

export const Route = createFileRoute("/passport/")({
  component: PassportLanding,
});

type CustomerTier = "bronze" | "silver" | "gold" | "platinum";

const TIER_META: Record<
  CustomerTier,
  { label: string; min: number; color: string; bg: string; border: string }
> = {
  bronze: {
    label: "Bronze",
    min: 0,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  silver: {
    label: "Silver",
    min: 100,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  gold: {
    label: "Gold",
    min: 500,
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  platinum: {
    label: "Platinum",
    min: 1000,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
};

function customerTier(lifetimePoints: number): CustomerTier {
  if (lifetimePoints >= 1000) return "platinum";
  if (lifetimePoints >= 500) return "gold";
  if (lifetimePoints >= 100) return "silver";
  return "bronze";
}

function PassportLanding() {
  const { balance, state, resetDemo } = usePassport();

  const lifetimePoints = state.ledger.reduce(
    (sum, e) => sum + (e.points > 0 ? e.points : 0),
    0
  );
  const tier = customerTier(lifetimePoints);
  const tierMeta = TIER_META[tier];

  // Next reward to aim for
  const sortedRewards = [...state.rewards].sort(
    (a, b) => a.pointsCost - b.pointsCost
  );
  const nextReward =
    sortedRewards.find((r) => balance < r.pointsCost) ??
    sortedRewards[sortedRewards.length - 1];
  const progress = nextReward
    ? Math.min(100, Math.round((balance / nextReward.pointsCost) * 100))
    : 0;
  const canAffordNext = nextReward ? balance >= nextReward.pointsCost : false;

  // Recent activity (last 3)
  const recent = state.ledger.slice(0, 3);

  return (
    <div>
      {/* Passport Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-gold-300 bg-navy p-5 text-cream shadow-brand-lg">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-gold/5" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="font-script text-2xl leading-none text-gold">
              Trovin&apos;
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/60">
              Member Passport
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tierMeta.bg} ${tierMeta.border} ${tierMeta.color}`}
          >
            <Crown className="h-3 w-3" />
            {tierMeta.label}
          </div>
        </div>

        <div className="relative mt-4">
          <p className="font-display text-3xl">
            {balance} <span className="text-gold">pts</span>
          </p>
          <p className="mt-0.5 text-xs text-cream/60">
            ≈ ${(balance / 100).toFixed(2)} reward value
          </p>
        </div>

        <div className="relative mt-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-cream/50">
              Member
            </p>
            <p className="text-sm font-semibold">{state.me.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-cream/50">
              Since
            </p>
            <p className="text-sm font-semibold">
              {new Date().toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="relative mt-3 border-t border-cream/10 pt-3">
          <Link
            to="/passport/qr"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gold hover:text-gold-300"
          >
            <QrCode className="h-3.5 w-3.5" /> Open My QR
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Next Reward */}
      <div className="mt-4 rounded-2xl border border-line bg-paper p-5 shadow-brand-sm">
        <div className="flex items-center justify-between">
          <p className="font-script text-xl text-coral leading-none">
            next reward —
          </p>
          {canAffordNext && (
            <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal">
              Unlocked
            </span>
          )}
        </div>

        {nextReward ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-cream-deep">
                <Gift className="h-6 w-6 text-navy/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">
                  {nextReward.name}
                </p>
                <p className="text-[11px] text-ink-mute">
                  {nextReward.pointsCost.toLocaleString()} pts
                  {canAffordNext
                    ? " · ready to redeem"
                    : ` · ${(nextReward.pointsCost - balance).toLocaleString()} to go`}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-ink-mute mb-1">
                <span>{balance.toLocaleString()} pts</span>
                <span>{nextReward.pointsCost.toLocaleString()} pts</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-cream-deep">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    canAffordNext ? "bg-teal" : "bg-gold"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-center text-[11px] text-ink-soft">
                {canAffordNext
                  ? "You have enough points — head to Rewards to claim it!"
                  : `${progress}% toward ${nextReward.name}`}
              </p>
            </div>

            <Link
              to="/passport/rewards"
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-navy py-2.5 text-xs font-semibold text-cream hover:bg-navy-700 transition"
            >
              <Zap className="h-3.5 w-3.5" /> Browse all rewards
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">
            No rewards available right now.
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatBox label="Lifetime" value={lifetimePoints.toLocaleString()} unit="pts" />
        <StatBox
          label="Check-ins"
          value={state.checkIns.length.toString()}
          unit="booths"
        />
        <StatBox
          label="Redeemed"
          value={state.redemptions.length.toString()}
          unit="rewards"
        />
      </div>

      {/* Recent Activity */}
      <section className="mt-5">
        <div className="flex items-center justify-between">
          <p className="font-script text-xl text-teal leading-none">recent —</p>
          <Link
            to="/passport/wallet"
            className="text-[10px] font-semibold text-ink-mute hover:text-navy"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-line bg-paper p-5 text-center">
            <p className="text-sm text-ink-soft">
              No activity yet. Visit a booth and get scanned to earn points.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {recent.map((e) => {
              const positive = e.points > 0;
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3"
                >
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full ${
                      positive
                        ? "bg-teal/20 text-teal"
                        : "bg-coral/20 text-coral"
                    }`}
                  >
                    {positive ? (
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{ACTION_LABEL[e.action]}</p>
                    <p className="truncate text-[11px] text-ink-mute">
                      {e.vendorName ?? "—"}
                    </p>
                  </div>
                  <p
                    className={`font-mono text-sm font-bold ${
                      positive ? "text-teal" : "text-coral"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {e.points}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Tile
          to="/passport/qr"
          icon={QrCode}
          title="My QR"
          desc="Show at a booth"
          tint="bg-gold/15"
        />
        <Tile
          to="/passport/wallet"
          icon={Wallet}
          title="Wallet"
          desc="Full history"
          tint="bg-teal/15"
        />
        <Tile
          to="/passport/rewards"
          icon={Gift}
          title="Rewards"
          desc="Spend points"
          tint="bg-coral/15"
        />
        <Tile
          to="/passport/scan"
          icon={ScanLine}
          title="Scan"
          desc="Vendor side"
          tint="bg-navy/10"
        />
        <Tile
          to="/passport/vendor"
          icon={Store}
          title="Booth"
          desc="Setup & tiers"
          tint="bg-paper"
        />
      </div>

      {/* How it works */}
      <section className="mt-5 rounded-2xl border border-line bg-paper p-5">
        <p className="font-script text-2xl text-coral leading-none">
          how it works —
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Check-in ={" "}
            <b>10 points</b>. Vendors scan you.
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> Higher-tier
            booths unlock social (+15), reviews (+20), purchases (+25).
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> Same booth,
            same day = one check-in.
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-navy" /> 1 point ={" "}
            $0.01 reward value.
          </li>
        </ul>
      </section>

      <div className="mt-6 text-center text-[10px] text-ink-mute">
        <p>
          demo data only · token{" "}
          <span className="font-mono">
            {state.me.personalQrToken.slice(0, 8)}…
          </span>
        </p>
        <button
          onClick={resetDemo}
          className="mt-1 underline hover:text-navy"
        >
          reset demo
        </button>
      </div>
    </div>
  );
}

function Tile({
  to,
  icon: Icon,
  title,
  desc,
  tint,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tint: string;
}) {
  return (
    <Link
      to={to}
      className={`rounded-2xl border border-line p-4 ${tint} transition hover:shadow-brand-md`}
    >
      <Icon className="h-5 w-5 text-navy" />
      <p className="mt-2 font-display text-base leading-tight">{title}</p>
      <p className="text-[11px] text-ink-soft">{desc}</p>
    </Link>
  );
}

function StatBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-3 text-center">
      <p className="font-display text-xl text-navy">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-mute">
        {label}
      </p>
      <p className="text-[10px] text-ink-soft">{unit}</p>
    </div>
  );
}
