import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r) => r.role as string) };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [vendors, events, shoppers] = await Promise.all([
      supabaseAdmin.from("vendors").select("status", { count: "exact", head: false }),
      supabaseAdmin.from("events").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    const counts = { pending: 0, approved: 0, hidden: 0 };
    for (const v of vendors.data ?? []) {
      counts[v.status as keyof typeof counts]++;
    }
    return {
      vendorCounts: counts,
      eventCount: events.count ?? 0,
      shopperCount: shoppers.count ?? 0,
    };
  });

export const listVendorsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { vendors: data ?? [] };
  });

const vendorInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  tagline: z.string().max(280).default(""),
  category: z.string().min(1).max(40),
  image_url: z.string().url().max(500).nullable().optional(),
  scribble: z.string().max(40).nullable().optional(),
  payments: z.array(z.string().max(20)).max(10).default([]),
  status: z.enum(["pending", "approved", "hidden"]).default("pending"),
  featured: z.boolean().default(false),
});

export const upsertVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => vendorInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const payload = { ...data, updated_at: new Date().toISOString() };
    const { data: out, error } = data.id
      ? await supabaseAdmin.from("vendors").update(payload).eq("id", data.id).select().single()
      : await supabaseAdmin.from("vendors").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return { vendor: out };
  });

export const deleteVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("vendors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listEventsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .order("starts_at", { ascending: true, nullsFirst: false });
    if (error) throw new Error(error.message);
    return { events: data ?? [] };
  });

const eventInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  neighborhood: z.string().max(120).default(""),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
  image_url: z.string().url().max(500).nullable().optional(),
  tags: z.array(z.string().max(40)).max(20).default([]),
});

export const upsertEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => eventInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { data: out, error } = data.id
      ? await supabaseAdmin.from("events").update(data).eq("id", data.id).select().single()
      : await supabaseAdmin.from("events").insert(data).select().single();
    if (error) throw new Error(error.message);
    return { event: out };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("events").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const moderateEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "approved", "rejected"]),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("events")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listShoppers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, email, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const { data: follows } = await supabaseAdmin
      .from("follows")
      .select("shopper_id");
    const followCounts = new Map<string, number>();
    for (const f of follows ?? []) {
      followCounts.set(f.shopper_id, (followCounts.get(f.shopper_id) ?? 0) + 1);
    }

    return {
      shoppers: (profiles ?? []).map((p) => ({
        ...p,
        follow_count: followCounts.get(p.id) ?? 0,
      })),
    };
  });

// --- Event lineup (event_vendors) ---

export const listEventLineup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ event_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const [{ data: lineup, error: e1 }, { data: vendors, error: e2 }] = await Promise.all([
      supabaseAdmin.from("event_vendors").select("*").eq("event_id", data.event_id),
      supabaseAdmin.from("vendors").select("id, name, category, image_url, status").eq("status", "approved").order("name"),
    ]);
    if (e1) throw new Error(e1.message);
    if (e2) throw new Error(e2.message);
    return { lineup: lineup ?? [], vendors: vendors ?? [] };
  });

const lineupInput = z.object({
  event_id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  open_today: z.boolean().default(true),
  hours: z.string().max(60).nullable().optional(),
  booth: z.string().max(40).nullable().optional(),
});

export const upsertEventVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => lineupInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("event_vendors")
      .upsert(data, { onConflict: "event_id,vendor_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeEventVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ event_id: z.string().uuid(), vendor_id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("event_vendors")
      .delete()
      .eq("event_id", data.event_id)
      .eq("vendor_id", data.vendor_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

