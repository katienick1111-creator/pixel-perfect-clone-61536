import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ScanLine, ClipboardPaste, Share2, MessageSquare, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useLoyalty, BYTES, isActionActive } from "@/hooks/useLoyalty";

export const Route = createFileRoute("/loyalty/scan")({
  component: ScanPage,
});

function ScanPage() {
  const { state, scanCustomer, awardExtra } = useLoyalty();
  const [token, setToken] = useState("");
  const [lastScan, setLastScan] = useState<{ ok: boolean; awarded: number; message: string; duplicate?: boolean } | null>(null);

  const tier = state.vendor.tier;
  const canSocial = isActionActive(tier, "social_share");
  const canReview = isActionActive(tier, "review");
  const canPurchase = isActionActive(tier, "purchase");

  const onScan = async () => {
    if (!token.trim()) return toast.error("Paste a customer token first.");
    const res = scanCustomer(token);
    setLastScan(res);
    if (res.ok && res.awarded > 0) toast.success(res.message);
    else if (res.ok) toast(res.message);
    else toast.error(res.message);
  };

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setToken(t);
    } catch {
      toast.error("Couldn't read clipboard.");
    }
  };

  const extra = (action: keyof typeof BYTES) => {
    const res = awardExtra(action);
    if (res.ok) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div>
      <div>
        <p className="font-script text-2xl text-coral leading-none">vendor side —</p>
        <h1 className="mt-1 font-display text-3xl">Scan a customer</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Tier: <b className="text-navy uppercase">{tier}</b> · booth <b>{state.vendor.name}</b>
        </p>
      </div>

      <div className="mt-5 rounded-2xl border-2 border-line bg-paper p-4">
        <label className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">customer token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={3}
          placeholder="Paste the customer's QR token here…"
          className="mt-1 w-full rounded-xl border border-line bg-cream p-3 font-mono text-xs"
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button onClick={paste} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2.5 text-xs font-semibold hover:bg-cream-deep">
            <ClipboardPaste className="h-3.5 w-3.5" /> Paste
          </button>
          <button onClick={onScan} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy text-cream px-3 py-2.5 text-xs font-semibold hover:bg-navy-700">
            <ScanLine className="h-3.5 w-3.5" /> Scan
          </button>
        </div>
      </div>

      {lastScan?.ok && (
        <div className={`mt-4 rounded-2xl border-2 p-5 ${lastScan.duplicate ? "border-gold bg-gold/10" : "border-teal bg-teal/10"}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-teal" />
            <p className="font-display text-xl">{lastScan.duplicate ? "Already today" : `+${lastScan.awarded} Bytes`}</p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">{lastScan.message}</p>

          {!lastScan.duplicate && (
            <div className="mt-3 grid gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">extra actions for {tier}</p>
              <ExtraButton enabled={canSocial} icon={Share2} label={`Social share (+${BYTES.social_share})`} onClick={() => extra("social_share")} />
              <ExtraButton enabled={canReview} icon={MessageSquare} label={`Review (queued)`} onClick={() => extra("review")} />
              <ExtraButton enabled={canPurchase} icon={ShoppingBag} label={`Confirm purchase (+${BYTES.purchase})`} onClick={() => extra("purchase")} />
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-center text-[11px] text-ink-mute">
        Customers can't self-check-in. Always scan from the booth side.
      </p>
    </div>
  );
}

function ExtraButton({ enabled, icon: Icon, label, onClick }: any) {
  return (
    <button
      disabled={!enabled}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
        enabled ? "border-line bg-paper text-navy hover:bg-cream-deep" : "border-dashed border-line bg-cream-deep text-ink-mute cursor-not-allowed"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
      {!enabled && <span className="ml-auto text-[10px] uppercase">tier locked</span>}
    </button>
  );
}
