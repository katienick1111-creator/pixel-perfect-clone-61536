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
