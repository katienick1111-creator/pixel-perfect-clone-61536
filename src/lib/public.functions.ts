import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listApprovedVendors = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("vendors")
    .select("id, name, tagline, category, image_url, scribble, featured")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { vendors: data ?? [] };
});

export const getVendorPublic = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { data: v, error } = await supabaseAdmin
      .from("vendors")
      .select("id, name, tagline, category, image_url, scribble, status, featured")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!v || v.status !== "approved") return { vendor: null };
    return { vendor: v };
  });

export const isFollowingVendor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: row } = await supabaseAdmin
      .from("follows")
      .select("vendor_id")
      .eq("vendor_id", data.id)
      .eq("shopper_id", context.userId)
      .maybeSingle();
    return { following: !!row };
  });

export const followVendor = createServerFn({ method: "POST" })

  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: existing } = await supabaseAdmin
      .from("follows")
      .select("vendor_id")
      .eq("vendor_id", data.id)
      .eq("shopper_id", context.userId)
      .maybeSingle();
    if (existing) return { ok: true };
    const { error } = await supabaseAdmin
      .from("follows")
      .insert({ vendor_id: data.id, shopper_id: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const unfollowVendor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await supabaseAdmin
      .from("follows")
      .delete()
      .eq("vendor_id", data.id)
      .eq("shopper_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// --- Public events ---

export const listPublicEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("id, name, neighborhood, starts_at, ends_at, image_url, tags, hours, description")
    .eq("status", "approved")
    .order("starts_at", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return { events: data ?? [] };
});

const submitEventInput = z.object({
  name: z.string().trim().min(2).max(120),
  neighborhood: z.string().trim().min(1).max(120),
  starts_at: z.string().min(1),
  ends_at: z.string().nullable().optional(),
  hours: z.string().trim().max(60).optional().default(""),
  description: z.string().trim().max(500).optional().default(""),
  image_url: z.string().url().max(500).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  submitter_name: z.string().trim().max(80).optional().default(""),
});

export const submitEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => submitEventInput.parse(d))
  .handler(async ({ context, data }) => {
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const { error } = await supabaseAdmin.from("events").insert({
      name: data.name,
      neighborhood: data.neighborhood,
      starts_at: data.starts_at,
      ends_at: data.ends_at ?? null,
      hours: data.hours || null,
      description: data.description || null,
      image_url: data.image_url || null,
      tags: data.tags,
      status: "pending",
      submitted_by: context.userId,
      submitter_name: data.submitter_name || null,
      submitter_email: user.user?.email ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
