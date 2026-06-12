import { createFileRoute } from "@tanstack/react-router";
import { usePassport, ACTION_LABEL } from "@/hooks/usePassport";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/passport/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const { balance, state } = usePassport();

  return (
    <div>
      <div className="rounded-2xl border-2 border-line bg-navy text-cream p-5 shadow-brand-lg">
        <p className="font-mono text-[10px] uppercase tracking-widest text-cream/60">balance</p>
        <p className="mt-1 font-display text-5xl">{balance} <span className="text-gold">pts</span></p>
        <p className="mt-1 text-xs text-cream/70">≈ ${(balance / 100).toFixed(2)} of reward value</p>
      </div>

      <h2 className="mt-6 font-display text-2xl">History</h2>
      <div className="mt-3 space-y-2">
        {state.ledger.length === 0 && (
          <div className="rounded-xl border border-dashed border-line bg-paper p-6 text-center text-sm text-ink-soft">
            No activity yet. Get scanned at a booth to earn your first points.
          </div>
        )}
        {state.ledger.map((e) => {
          const positive = e.points > 0;
          return (
            <div key={e.id} className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
              <div className={`grid h-9 w-9 place-items-center rounded-full ${positive ? "bg-teal/20 text-teal" : "bg-coral/20 text-coral"}`}>
                {positive ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{ACTION_LABEL[e.action]}</p>
                <p className="truncate text-[11px] text-ink-mute">
                  {e.vendorName ?? "—"} · {new Date(e.timestamp).toLocaleString()}
                </p>
              </div>
              <p className={`font-mono text-sm font-bold ${positive ? "text-teal" : "text-coral"}`}>
                {positive ? "+" : ""}{e.points}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
