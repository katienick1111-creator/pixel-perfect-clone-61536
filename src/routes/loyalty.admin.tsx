import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useLoyalty, type Reward } from "@/hooks/useLoyalty";

export const Route = createFileRoute("/loyalty/admin")({
  component: LoyaltyAdminPage,
});

function LoyaltyAdminPage() {
  const { state, setRewards } = useLoyalty();
  const [draft, setDraft] = useState<Reward>({ id: "", name: "", bytesCost: 100, type: "merch" });

  const add = () => {
    if (!draft.name.trim()) return toast.error("Name required.");
    if (draft.bytesCost <= 0) return toast.error("Cost must be > 0.");
    const next: Reward = { ...draft, id: `r-${Date.now()}` };
    setRewards([next, ...state.rewards]);
    setDraft({ id: "", name: "", bytesCost: 100, type: "merch" });
    toast.success("Reward added");
  };

  const remove = (id: string) => {
    setRewards(state.rewards.filter((r) => r.id !== id));
    toast.success("Removed");
  };

  return (
    <div>
      <p className="font-script text-2xl text-teal leading-none">demo admin —</p>
      <h1 className="mt-1 font-display text-3xl">Rewards catalog</h1>
      <p className="mt-1 text-xs text-ink-mute">
        Local-only for now. When loyalty moves to the backend, this becomes admin-role-gated.
      </p>

      <section className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-mute">add reward</p>
        <div className="mt-2 grid gap-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Name"
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min={1}
              value={draft.bytesCost}
              onChange={(e) => setDraft({ ...draft, bytesCost: parseInt(e.target.value || "0", 10) })}
              className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            />
            <select
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as Reward["type"] })}
              className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
            >
              <option value="merch">merch</option>
              <option value="visa">visa</option>
            </select>
          </div>
          <input
            value={draft.imageUrl ?? ""}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
            placeholder="Image URL (optional)"
            className="rounded-lg border border-line bg-cream px-3 py-2 text-sm"
          />
          <button onClick={add} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy text-cream px-3 py-2.5 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </section>

      <section className="mt-4 space-y-2">
        {state.rewards.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">{r.name}</p>
              <p className="text-[11px] text-ink-mute uppercase tracking-wider">{r.type} · {r.bytesCost} B</p>
            </div>
            <button onClick={() => remove(r.id)} className="rounded-full border border-line p-2 text-ink-soft hover:text-coral hover:border-coral">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
