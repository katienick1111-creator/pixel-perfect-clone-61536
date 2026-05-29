import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Check, EyeOff, QrCode, Download, Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { listVendorsAdmin, upsertVendor, deleteVendor } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/vendors")({
  component: VendorsAdmin,
});


type Vendor = {
  id?: string;
  name: string;
  tagline: string;
  category: string;
  image_url: string | null;
  scribble: string | null;
  payments: string[];
  status: "pending" | "approved" | "hidden";
  featured: boolean;
};

const empty: Vendor = {
  name: "",
  tagline: "",
  category: "Craft",
  image_url: "",
  scribble: "",
  payments: ["Card", "Cash"],
  status: "pending",
  featured: false,
};

function VendorsAdmin() {
  const listFn = useServerFn(listVendorsAdmin);
  const saveFn = useServerFn(upsertVendor);
  const delFn = useServerFn(deleteVendor);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["admin-vendors"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [qrVendor, setQrVendor] = useState<Vendor | null>(null);
  const [saving, setSaving] = useState(false);


  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-vendors"] });
    qc.invalidateQueries({ queryKey: ["admin-overview"] });
    qc.invalidateQueries({ queryKey: ["public-vendors"] });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await saveFn({
        data: {
          ...editing,
          image_url: editing.image_url?.trim() ? editing.image_url : null,
          scribble: editing.scribble?.trim() ? editing.scribble : null,
        },
      });
      setEditing(null);
      refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this vendor?")) return;
    await delFn({ data: { id } });
    refresh();
  };

  const quickStatus = async (v: any, status: Vendor["status"]) => {
    await saveFn({ data: { ...v, status } });
    refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="font-script text-2xl text-teal">the lineup —</p>
          <h1 className="font-display text-4xl">Vendors</h1>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy text-cream px-4 py-2 text-sm font-semibold hover:bg-navy-700"
        >
          <Plus className="h-4 w-4" /> Add vendor
        </button>
      </div>

      {isLoading ? (
        <p className="text-ink-soft">Loading…</p>
      ) : (
        <div className="grid gap-3">
          {data?.vendors.map((v: any) => (
            <div key={v.id} className="flex items-center gap-4 rounded-xl border border-line bg-paper p-4 shadow-brand-sm">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                {v.image_url && <img src={v.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg truncate">{v.name}</h3>
                  <StatusPill status={v.status} />
                  {v.featured && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-navy">FEATURED</span>}
                </div>
                <p className="text-sm text-ink-soft truncate">{v.category} · {v.tagline || "—"}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {v.status !== "approved" && (
                  <button onClick={() => quickStatus(v, "approved")} title="Approve" className="rounded-full p-2 text-teal hover:bg-teal/10">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                {v.status !== "hidden" && (
                  <button onClick={() => quickStatus(v, "hidden")} title="Hide" className="rounded-full p-2 text-ink-mute hover:bg-cream-deep">
                    <EyeOff className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => setQrVendor(v)} title="QR code" className="rounded-full p-2 text-navy hover:bg-cream-deep">
                  <QrCode className="h-4 w-4" />
                </button>
                <button onClick={() => setEditing(v)} title="Edit" className="rounded-full p-2 text-navy hover:bg-cream-deep">
                  <Pencil className="h-4 w-4" />
                </button>

                <button onClick={() => remove(v.id)} title="Delete" className="rounded-full p-2 text-danger hover:bg-danger/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {data?.vendors.length === 0 && (
            <p className="text-ink-soft text-sm py-12 text-center">No vendors yet. Add the first one.</p>
          )}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/40 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-paper p-6 shadow-brand-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">{editing.id ? "Edit vendor" : "New vendor"}</h2>
            <div className="space-y-3">
              <Field label="Name">
                <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} maxLength={120} />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} maxLength={280} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {["Antiques", "Craft", "Food", "Collectibles", "Farmers"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select className={inputCls} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Vendor["status"] })}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </Field>
              </div>
              <Field label="Image URL">
                <input className={inputCls} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://…" />
              </Field>
              <Field label="Scribble (tag on photo)">
                <input className={inputCls} value={editing.scribble ?? ""} onChange={(e) => setEditing({ ...editing, scribble: e.target.value })} maxLength={40} />
              </Field>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Featured on homepage
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border border-line px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="rounded-full bg-navy text-cream px-5 py-2 text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-teal";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-ink-mute mb-1">{label}</span>
      {children}
    </label>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-teal text-cream",
    pending: "bg-gold text-navy",
    hidden: "bg-ink-mute/20 text-ink-soft",
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${map[status] ?? ""}`}>{status}</span>;
}
