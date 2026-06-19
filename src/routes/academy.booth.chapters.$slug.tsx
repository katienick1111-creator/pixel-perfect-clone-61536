import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { boothChapters } from "@/data/booth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/academy/booth/chapters/$slug")({
  head: ({ params }) => {
    const c = boothChapters.find((c) => c.slug === params.slug);
    return {
      meta: [
        { title: c ? `${c.title} — Booth Setup Masterclass` : "Chapter — Trovin Academy" },
        { name: "description", content: c?.summary ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const chapter = boothChapters.find((c) => c.slug === params.slug);
    if (!chapter) throw notFound();
    return { chapter };
  },
  errorComponent: ({ error, reset }) => (
    <div className="ac-card p-8">
      <p className="ac-eyebrow">error</p>
      <h1 className="mt-2 font-serif text-2xl">Something went wrong</h1>
      <p className="mt-2 text-sm text-[var(--ac-ink-soft)]">{(error as Error).message}</p>
      <button onClick={reset} className="ac-btn mt-4">Try again</button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="ac-card p-8">
      <p className="ac-eyebrow">404</p>
      <h1 className="mt-2 font-serif text-2xl">Chapter not found</h1>
      <Link to="/academy/booth" className="ac-btn-ghost mt-4 inline-flex">Back to masterclass</Link>
    </div>
  ),
  component: ChapterPage,
});

const LS_KEY = "trovin.academy.booth.progress";

function ChapterPage() {
  const { chapter } = Route.useLoaderData();
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Load progress
  useEffect(() => {
    if (user) {
      supabase
        .from("academy_booth_progress")
        .select("lesson_slug")
        .then(({ data }) => {
          if (data) setCompleted(new Set(data.map((d) => d.lesson_slug as string)));
        });
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setCompleted(new Set(JSON.parse(raw)));
      } catch {}
    }
  }, [user]);

  const toggle = async (lessonSlug: string) => {
    const next = new Set(completed);
    const isDone = next.has(lessonSlug);
    if (isDone) next.delete(lessonSlug);
    else next.add(lessonSlug);
    setCompleted(next);

    if (user) {
      if (isDone) {
        await supabase.from("academy_booth_progress").delete().eq("lesson_slug", lessonSlug).eq("user_id", user.id);
      } else {
        const { error } = await supabase
          .from("academy_booth_progress")
          .upsert({ user_id: user.id, lesson_slug: lessonSlug, completed_at: new Date().toISOString() }, { onConflict: "user_id,lesson_slug" });
        if (error) toast.error("Couldn't save progress.");
      }
    } else {
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch {}
    }
  };

  const idx = boothChapters.findIndex((c) => c.slug === chapter.slug);
  const prev = idx > 0 ? boothChapters[idx - 1] : null;
  const next = idx < boothChapters.length - 1 ? boothChapters[idx + 1] : null;
  const doneCount = chapter.lessons.filter((l) => completed.has(l.slug)).length;

  return (
    <article>
      <Link to="/academy/booth" className="ac-eyebrow inline-flex items-center gap-1.5 hover:text-[var(--ac-ink)]">
        <ArrowLeft className="h-3 w-3" /> masterclass
      </Link>
      <AcademyPageHeader
        eyebrow={`chapter ${chapter.number}`}
        title={chapter.title}
        description={chapter.summary}
        actions={
          <span className="ac-chip">
            {doneCount} / {chapter.lessons.length} complete
          </span>
        }
      />

      <div className="space-y-12">
        {chapter.lessons.map((l) => {
          const done = completed.has(l.slug);
          return (
            <section key={l.slug} id={l.slug} className="ac-card scroll-mt-24 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--ac-rule-soft)] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[var(--ac-ink-mute)]">{l.readMinutes} min read</p>
                  <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-1 text-2xl leading-tight">
                    {l.title}
                  </h2>
                </div>
                <button onClick={() => toggle(l.slug)} className={done ? "ac-btn" : "ac-btn-ghost"}>
                  {done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  {done ? "Completed" : "Mark complete"}
                </button>
              </div>
              <div className="prose prose-sm mt-5 max-w-none text-[var(--ac-ink-soft)]">
                {l.body.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-4 text-[15px] leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <nav className="ac-no-print mt-16 flex items-center justify-between border-t border-[var(--ac-rule)] pt-6">
        {prev ? (
          <Link to="/academy/booth/chapters/$slug" params={{ slug: prev.slug }} className="ac-btn-ghost">
            <ArrowLeft className="h-4 w-4" /> {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to="/academy/booth/chapters/$slug" params={{ slug: next.slug }} className="ac-btn">
            {next.title} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link to="/academy/booth" className="ac-btn">
            Finish <CheckCircle2 className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
