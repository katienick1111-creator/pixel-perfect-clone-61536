import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { galleryImages } from "@/data/booth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/academy/booth/gallery")({
  head: () => ({
    meta: [
      { title: "Booth Inspiration Gallery — Trovin Academy" },
      { name: "description", content: "Browse real vendor booths by category: food, craft, boutique, jewelry, candle, plants, coffee, bakery, and more." },
    ],
  }),
  component: Gallery,
});

const cats = ["All", "food", "craft", "boutique", "jewelry", "candle", "plants", "coffee", "bakery", "art", "kids", "seasonal", "holiday", "luxury", "minimalist", "farmers-market", "modern", "rustic", "industrial"] as const;

const LS_KEY = "trovin.academy.gallery.favs";

function Gallery() {
  const { user } = useAuth();
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase.from("academy_gallery_favorites").select("image_slug").then(({ data }) => {
        if (data) setFavs(new Set(data.map((d) => d.image_slug as string)));
      });
    } else {
      try { const raw = localStorage.getItem(LS_KEY); if (raw) setFavs(new Set(JSON.parse(raw))); } catch {}
    }
  }, [user]);

  const toggleFav = async (slug: string) => {
    const next = new Set(favs);
    const had = next.has(slug);
    if (had) next.delete(slug); else next.add(slug);
    setFavs(next);
    if (user) {
      if (had) {
        await supabase.from("academy_gallery_favorites").delete().eq("image_slug", slug).eq("user_id", user.id);
      } else {
        const { error } = await supabase.from("academy_gallery_favorites").insert({ user_id: user.id, image_slug: slug });
        if (error) toast.error("Couldn't save favorite.");
      }
    } else {
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch {}
    }
  };

  const list = cat === "All" ? galleryImages : galleryImages.filter((g) => g.category === cat);
  const active = open ? galleryImages.find((g) => g.slug === open) : null;

  return (
    <div>
      <AcademyPageHeader
        eyebrow="inspiration gallery"
        title="Real Booths, Categorized"
        description="Save the ones that match your brand. Use them as moodboard reference when you sketch your next layout."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cat === c ? "ac-btn !py-1.5 !px-3 text-xs" : "ac-btn-ghost !py-1.5 !px-3 text-xs"}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((img) => {
          const isFav = favs.has(img.slug);
          return (
            <div key={img.slug} className="ac-card group relative overflow-hidden p-0">
              <button onClick={() => setOpen(img.slug)} className="block w-full">
                <img src={img.src} alt={img.title} loading="lazy" className="aspect-[4/3] w-full object-cover transition group-hover:scale-105" />
              </button>
              <div className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-serif text-sm">{img.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{img.category}</p>
                </div>
                <button onClick={() => toggleFav(img.slug)} aria-label="Favorite" className="rounded-full border border-[var(--ac-rule-soft)] p-1.5">
                  <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-[var(--ac-terracotta)] text-[var(--ac-terracotta)]" : "text-[var(--ac-ink-mute)]"}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl bg-[var(--ac-paper)] p-0">
          {active && (
            <div>
              <img src={active.src} alt={active.title} className="w-full" />
              <div className="p-5">
                <p className="font-serif text-lg">{active.title}</p>
                <p className="mt-1 text-xs text-[var(--ac-ink-soft)]">{active.credit}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
