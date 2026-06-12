import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Gift, CreditCard, Package } from "lucide-react";
import { useLoyalty } from "@/hooks/useLoyalty";

export const Route = createFileRoute("/loyalty/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const { state, balance, redeem } = useLoyalty();

  const onRedeem = (id: string) => {
    const res = redeem(id);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-script text-2xl text-teal leading-none">cash 'em in —</p>
          <h1 className="mt-1 font-display text-3xl">Rewards</h1>
        </div>
        <p className="font-mono text-sm text-ink-soft">{balance} B</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {state.rewards.map((r) => {
          const afford = balance >= r.bytesCost;
          const Icon = r.type === "visa" ? CreditCard : Package;
          return (
            <div key={r.id} className="rounded-2xl border border-line bg-paper p-4 flex flex-col">
              <div className="grid h-20 place-items-center rounded-xl bg-cream-deep">
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt={r.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <Icon className="h-8 w-8 text-navy/60" />
                )}
              </div>
              <p className="mt-2 text-sm font-semibold leading-tight">{r.name}</p>
              <p className="text-[11px] text-ink-mute uppercase tracking-wider">{r.type}</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="font-mono text-sm font-bold text-navy">{r.bytesCost} B</span>
                <button
                  disabled={!afford}
                  onClick={() => onRedeem(r.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                    afford ? "bg-navy text-cream hover:bg-navy-700" : "bg-cream-deep text-ink-mute cursor-not-allowed"
                  }`}
                >
                  {afford ? "Redeem" : "Locked"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {state.redemptions.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-xl">Your redemptions</h2>
          <div className="mt-2 space-y-2">
            {state.redemptions.map((r) => (
              <div key={r.id} className="flex items-center gap-2 rounded-xl border border-line bg-paper p-3">
                <Gift className="h-4 w-4 text-gold-600" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{r.rewardName}</p>
                  <p className="text-[11px] text-ink-mute">{new Date(r.timestamp).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-gold/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
