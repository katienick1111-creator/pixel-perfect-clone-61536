import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePassport, TIER_LABEL, type Tier } from "@/hooks/usePassport";
import { MapPin, Users, ScanLine, BarChart3, Clock } from "lucide-react";

export const Route = createFileRoute("/passport/vendor")({
  component: VendorPassportPage,
});

const tiers: Tier[] = ["free", "starter", "plus", "pro"];

function VendorPassportPage() {
  const { state, setVendor } = usePassport();
  const v = state.vendor;

  const today = new Date();
  const todays = state.checkIns.filter((c) => {
    const d = new Date(c.timestamp);
    return d.toDateString() === today.toDateString();
  });

  const peakBuckets = new Array(12).fill(0); // 9am..9pm
  state.checkIns.forEach((c) => {
    const h = new Date(c.timestamp).getHours();
    const idx = Math.max(0, Math.min(11, h - 9));
    peakBuckets[idx]++;
  });
  const maxPeak = Math.max(1, ...peakBuckets);

  return (
    <div>
      <p className="font-script text-2xl text-coral leading-none">your booth —</p>
      <h1 className="mt-1 font-display text-3xl">Passport dashboard</h1>

      <section className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">membership tier</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => { setVendor({ tier: t }); toast.success(`Tier set to ${TIER_LABEL[t]}`); }}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold text-left ${
                v.tier === t ? "border-navy bg-navy text-cream" : "border-line bg-cream hover:bg-cream-deep"
              }`}
            >
              {TIER_LABEL[t]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-soft">
          Tier controls which earning actions fire after a scan. Point values never change.
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">I'm here now</p>
        <div className="mt-2 grid gap-2">
          <label className="text-xs font-semibold">Booth name
            <input
              value={v.name}
              onChange={(e) => setVendor({ name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold">Where
            <input
              value={v.placeName}
              onChange={(e) => setVendor({ placeName: e.target.value })}
              placeholder="Randolph Street Market"
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold">End time
            <input
              type="time"
              value={v.endTime}
              onChange={(e) => setVendor({ endTime: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            />
          </label>
          <button
            onClick={() => { setVendor({ isLive: !v.isLive }); toast.success(v.isLive ? "Ended live session" : "You're live!"); }}
            className={`mt-1 rounded-full px-3 py-2.5 text-sm font-bold ${
              v.isLive ? "bg-coral text-cream" : "bg-teal text-cream"
            }`}
          >
            {v.isLive ? "End session" : "Go live"}
          </button>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={ScanLine} label="Today" value={todays.length} tint="bg-gold/20" />
        <Stat icon={Users} label="All-time" value={state.checkIns.length} tint="bg-teal/20" />
        <Stat icon={MapPin} label="Status" value={v.isLive ? "Live" : "Off"} tint="bg-coral/20" />
      </section>

      {v.tier === "pro" && (
        <section className="mt-4 rounded-2xl border border-line bg-paper p-4">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
            <BarChart3 className="h-3.5 w-3.5" /> peak hours (pro)
          </p>
          <div className="mt-3 flex h-24 items-end gap-1">
            {peakBuckets.map((n, i) => (
              <div key={i} className="flex-1 rounded-t bg-navy" style={{ height: `${(n / maxPeak) * 100}%`, minHeight: 2 }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-ink-mute">
            <span>9a</span><span>12p</span><span>3p</span><span>6p</span><span>9p</span>
          </div>
        </section>
      )}

      <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-ink-mute">
        <Clock className="h-3 w-3" /> demo data — values reset with "reset demo"
      </p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tint }: any) {
  return (
    <div className={`rounded-2xl border border-line p-3 ${tint}`}>
      <Icon className="h-4 w-4 text-navy" />
      <p className="mt-1 font-display text-2xl leading-none">{value}</p>
      <p className="text-[10px] text-ink-soft uppercase tracking-wider">{label}</p>
    </div>
  );
}
