import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Heart, Check, ArrowLeft } from "lucide-react";
import {
  getVendorPublic,
  isFollowingVendor,
  followVendor,
  unfollowVendor,
} from "@/lib/public.functions";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/v/$vendorId")({
  component: VendorFollowPage,
});

function VendorFollowPage() {
  const { vendorId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const getV = useServerFn(getVendorPublic);
  const isF = useServerFn(isFollowingVendor);
  const follow = useServerFn(followVendor);
  const unfollow = useServerFn(unfollowVendor);

  const vendorQ = useQuery({
    queryKey: ["public-vendor", vendorId],
    queryFn: () => getV({ data: { id: vendorId } }),
  });

  const followQ = useQuery({
    queryKey: ["is-following", vendorId, user?.id],
    queryFn: () => isF({ data: { id: vendorId } }),
    enabled: !!user,
  });

  const vendor = vendorQ.data?.vendor;
  const following = followQ.data?.following ?? false;

  const onFollow = async () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/v/${vendorId}` } as any });
      return;
    }
    if (following) {
      await unfollow({ data: { id: vendorId } });
    } else {
      await follow({ data: { id: vendorId } });
    }
    qc.invalidateQueries({ queryKey: ["is-following", vendorId] });
  };

  if (vendorQ.isLoading) {
    return <Shell><p className="text-ink-soft">Loading…</p></Shell>;
  }

  if (!vendor) {
    return (
      <Shell>
        <p className="font-script text-3xl text-teal">oh no —</p>
        <h1 className="font-display text-3xl mt-1">Vendor not found</h1>
        <p className="text-ink-soft mt-2">This vendor may not be approved yet.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-navy text-cream px-5 py-2 text-sm font-semibold">
          Back home
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-navy mb-4">
        <ArrowLeft className="h-4 w-4" /> Trovin'
      </Link>

      <div className="overflow-hidden rounded-2xl bg-paper border border-line shadow-brand-md">
        <div className="relative aspect-[4/3] bg-cream-deep">
          {vendor.image_url && (
            <img src={vendor.image_url} alt={vendor.name} className="absolute inset-0 h-full w-full object-cover" />
          )}
          {vendor.scribble && (
            <span className="absolute top-3 left-3 -rotate-3 rounded-sm bg-gold px-2 py-1 font-script text-lg text-navy shadow-brand-sm">
              {vendor.scribble}
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-mute">{vendor.category}</p>
          <h1 className="font-display text-3xl mt-1">{vendor.name}</h1>
          {vendor.tagline && <p className="text-ink-soft mt-2">{vendor.tagline}</p>}

          <button
            onClick={onFollow}
            disabled={authLoading}
            className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
              following
                ? "bg-teal text-cream hover:bg-teal-700"
                : "bg-gold text-navy hover:bg-gold-400"
            } disabled:opacity-60`}
          >
            {following ? <><Check className="h-4 w-4" /> Following</> : <><Heart className="h-4 w-4" /> Follow {vendor.name}</>}
          </button>

          {!user && !authLoading && (
            <p className="text-xs text-ink-mute mt-3 text-center">
              You'll be asked to sign in or create an account.
            </p>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-navy">
      <div className="mx-auto max-w-md px-4 py-8">{children}</div>
    </div>
  );
}
