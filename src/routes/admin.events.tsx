import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { listEventsAdmin, upsertEvent, deleteEvent } from "@/lib/admin.functions";

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
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-events"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<Ev | null>(null);
  const [tagsStr, setTagsStr] = useState("");

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

      {isLoading ? <p className="text-ink-soft">Loading…</p> : (
        <div className="grid gap-3">
          {data?.events.map((e: any) => (
            <div key={e.id} className="flex items-center gap-4 rounded-xl border border-line bg-paper p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                {e.image_url && <img src={e.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg truncate">{e.name}</h3>
                <p className="text-sm text-ink-soft truncate">{e.neighborhood} · {e.starts_at ? new Date(e.starts_at).toLocaleDateString() : "no date"}</p>
              </div>
              <button onClick={() => openEdit(e)} className="p-2 text-navy hover:bg-cream-deep rounded-full"><Pencil className="h-4 w-4" /></button>
              <button onClick={async () => { if (confirm("Delete event?")) { await delFn({ data: { id: e.id } }); qc.invalidateQueries({ queryKey: ["admin-events"] }); }}} className="p-2 text-danger hover:bg-danger/10 rounded-full"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {data?.events.length === 0 && <p className="text-ink-soft text-sm py-12 text-center">No events yet.</p>}
        </div>
      )}

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
    </div>
  );
}

const ic = "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-teal";
function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs uppercase tracking-wider text-ink-mute mb-1">{label}</span>{children}</label>;
}
