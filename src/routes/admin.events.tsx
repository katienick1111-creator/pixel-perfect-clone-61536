import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Check, X, Clock } from "lucide-react";
import {
  listEventsAdmin,
  upsertEvent,
  deleteEvent,
  listEventLineup,
  upsertEventVendor,
  removeEventVendor,
  moderateEvent,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/events")({
  component: EventsAdmin,
});

type Ev = {
  id?: string;
  name: string;
  neighborhood: string;
  starts_at: string | null;
  ends_at: string | null;
  image_url: string | null;
  tags: string[];
};
const empty: Ev = { name: "", neighborhood: "", starts_at: null, ends_at: null, image_url: "", tags: [] };

function EventsAdmin() {
  const listFn = useServerFn(listEventsAdmin);
  const saveFn = useServerFn(upsertEvent);
  const delFn = useServerFn(deleteEvent);
  const modFn = useServerFn(moderateEvent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-events"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<Ev | null>(null);
  const [tagsStr, setTagsStr] = useState("");
  const [lineupFor, setLineupFor] = useState<{ id: string; name: string } | null>(null);

  const openEdit = (e: any) => {
    setEditing(e);
    setTagsStr((e.tags ?? []).join(", "));
  };

  const save = async () => {
    if (!editing) return;
    try {
      await saveFn({
        data: {
          ...editing,
          image_url: editing.image_url?.trim() ? editing.image_url : null,
          tags: tagsStr.split(",").map((t) => t.trim()).filter(Boolean),
        },
      });
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-script text-2xl text-teal">markets —</p>
          <h1 className="font-display text-4xl">Events</h1>
        </div>
        <button onClick={() => { setEditing({ ...empty }); setTagsStr(""); }} className="inline-flex items-center gap-1.5 rounded-full bg-navy text-cream px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add event
        </button>
      </div>

      {(() => {
        const all = data?.events ?? [];
        const pending = all.filter((e: any) => e.status === "pending");
        const others = all.filter((e: any) => e.status !== "pending");
        const moderate = async (id: string, status: "approved" | "rejected") => {
          await modFn({ data: { id, status } });
          qc.invalidateQueries({ queryKey: ["admin-events"] });
          qc.invalidateQueries({ queryKey: ["public-events"] });
        };
        const row = (e: any) => (
          <div key={e.id} className="flex items-center gap-4 rounded-xl border border-line bg-paper p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
              {e.image_url && <img src={e.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg truncate">{e.name}</h3>
                <StatusPill status={e.status} />
              </div>
              <p className="text-sm text-ink-soft truncate">
                {e.neighborhood} · {e.starts_at ? new Date(e.starts_at).toLocaleDateString() : "no date"}
                {e.submitter_name ? ` · submitted by ${e.submitter_name}` : ""}
              </p>
              {e.description && (
                <p className="mt-1 text-xs text-ink-soft line-clamp-2">{e.description}</p>
              )}
            </div>
            {e.status === "pending" && (
              <>
                <button onClick={() => moderate(e.id, "approved")} title="Approve" className="p-2 text-success hover:bg-success/10 rounded-full"><Check className="h-4 w-4" /></button>
                <button onClick={() => moderate(e.id, "rejected")} title="Reject" className="p-2 text-danger hover:bg-danger/10 rounded-full"><X className="h-4 w-4" /></button>
              </>
            )}
            {e.status === "rejected" && (
              <button onClick={() => moderate(e.id, "approved")} title="Approve" className="p-2 text-success hover:bg-success/10 rounded-full"><Check className="h-4 w-4" /></button>
            )}
            <button onClick={() => setLineupFor({ id: e.id, name: e.name })} title="Lineup" className="p-2 text-teal hover:bg-teal/10 rounded-full"><Users className="h-4 w-4" /></button>
            <button onClick={() => openEdit(e)} title="Edit" className="p-2 text-navy hover:bg-cream-deep rounded-full"><Pencil className="h-4 w-4" /></button>
            <button onClick={async () => { if (confirm("Delete event?")) { await delFn({ data: { id: e.id } }); qc.invalidateQueries({ queryKey: ["admin-events"] }); }}} title="Delete" className="p-2 text-danger hover:bg-danger/10 rounded-full"><Trash2 className="h-4 w-4" /></button>
          </div>
        );
        return isLoading ? <p className="text-ink-soft">Loading…</p> : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-navy">
                    <Clock className="h-3.5 w-3.5" /> Pending review · {pending.length}
                  </span>
                </div>
                <div className="grid gap-3">{pending.map(row)}</div>
              </section>
            )}
            <section>
              {pending.length > 0 && (
                <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-mute">All events</h2>
              )}
              <div className="grid gap-3">{others.map(row)}</div>
              {all.length === 0 && <p className="text-ink-soft text-sm py-12 text-center">No events yet.</p>}
            </section>
          </div>
        );
      })()}


      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-paper p-6 shadow-brand-lg" onClick={(ev) => ev.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">{editing.id ? "Edit event" : "New event"}</h2>
            <div className="space-y-3">
              <L label="Name"><input className={ic} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} maxLength={120} /></L>
              <L label="Neighborhood"><input className={ic} value={editing.neighborhood} onChange={(e) => setEditing({ ...editing, neighborhood: e.target.value })} maxLength={120} /></L>
              <div className="grid grid-cols-2 gap-3">
                <L label="Starts"><input type="datetime-local" className={ic} value={editing.starts_at?.slice(0,16) ?? ""} onChange={(e) => setEditing({ ...editing, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></L>
                <L label="Ends"><input type="datetime-local" className={ic} value={editing.ends_at?.slice(0,16) ?? ""} onChange={(e) => setEditing({ ...editing, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></L>
              </div>
              <L label="Image URL"><input className={ic} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></L>
              <L label="Tags (comma-separated)"><input className={ic} value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} /></L>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border border-line px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-full bg-navy text-cream px-5 py-2 text-sm font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}

      {lineupFor && <LineupModal eventId={lineupFor.id} eventName={lineupFor.name} onClose={() => setLineupFor(null)} />}
    </div>
  );
}

function LineupModal({ eventId, eventName, onClose }: { eventId: string; eventName: string; onClose: () => void }) {
  const listFn = useServerFn(listEventLineup);
  const upFn = useServerFn(upsertEventVendor);
  const rmFn = useServerFn(removeEventVendor);
  const qc = useQueryClient();
  const key = ["event-lineup", eventId];

  const { data, isLoading } = useQuery({ queryKey: key, queryFn: () => listFn({ data: { event_id: eventId } }) });

  const inLineup = new Set((data?.lineup ?? []).map((l: any) => l.vendor_id));

  const toggle = async (vendorId: string) => {
    if (inLineup.has(vendorId)) {
      await rmFn({ data: { event_id: eventId, vendor_id: vendorId } });
    } else {
      await upFn({ data: { event_id: eventId, vendor_id: vendorId, open_today: true } });
    }
    qc.invalidateQueries({ queryKey: key });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-paper p-6 shadow-brand-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4">
          <p className="font-script text-2xl text-teal leading-none">the lineup —</p>
          <h2 className="font-display text-2xl">{eventName}</h2>
          <p className="text-xs text-ink-mute mt-1">Tap a vendor to add or remove them from this event.</p>
        </div>

        {isLoading ? (
          <p className="text-ink-soft">Loading…</p>
        ) : data?.vendors.length === 0 ? (
          <p className="text-ink-soft text-sm py-8 text-center">No approved vendors yet. Approve some in Vendors first.</p>
        ) : (
          <div className="overflow-y-auto flex-1 -mx-2 px-2 space-y-2">
            {data?.vendors.map((v: any) => {
              const on = inLineup.has(v.id);
              return (
                <button
                  key={v.id}
                  onClick={() => toggle(v.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    on ? "border-teal bg-teal/5" : "border-line bg-paper hover:border-teal/40"
                  }`}
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                    {v.image_url && <img src={v.image_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base truncate">{v.name}</p>
                    <p className="text-xs text-ink-soft">{v.category}</p>
                  </div>
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${on ? "bg-teal text-cream" : "border border-line text-ink-mute"}`}>
                    {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-full bg-navy text-cream px-5 py-2 text-sm font-semibold">Done</button>
        </div>
      </div>
    </div>
  );
}

const ic = "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-teal";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-wider text-ink-mute mb-1">{label}</span>{children}</label>;
}
