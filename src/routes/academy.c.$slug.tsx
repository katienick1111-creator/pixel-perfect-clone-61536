import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, FileDown, BookOpen, Sparkles } from "lucide-react";
import { AcademyPageHeader } from "@/components/AcademyShell";
import { academyCategories, academyTools } from "@/data/academy";

export const Route = createFileRoute("/academy/c/$slug")({
  loader: ({ params }) => {
    const category = academyCategories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.title} — Trovin Academy` },
          { name: "description", content: loaderData.category.longDescription },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="ac-eyebrow">404</p>
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="mt-4 text-4xl">
        Chapter not found
      </h1>
      <Link to="/academy/categories" className="ac-btn mt-6">
        Back to categories
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="py-20 text-center">
      <h1 style={{ fontFamily: "Fraunces, serif" }} className="text-3xl">
        Something went sideways
      </h1>
      <button onClick={reset} className="ac-btn mt-6">Try again</button>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const tools = academyTools.filter((t) => t.category === category.slug);

  return (
    <div>
      <AcademyPageHeader
        eyebrow={`chapter ${category.number}`}
        title={category.title}
        description={category.longDescription}
        actions={
          <Link to="/academy/downloads" className="ac-btn-ghost">
            <FileDown className="h-4 w-4" /> Printables
          </Link>
        }
      />

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--ac-terracotta)]" />
          <p className="ac-eyebrow">interactive tools</p>
        </div>
        {tools.length === 0 ? (
          <p className="text-sm text-[var(--ac-ink-mute)]">
            Tools for this chapter ship next.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tools.map((t) => {
              const ready = t.status === "ready";
              return (
                <Link
                  key={t.slug}
                  to={ready ? "/academy/tools/packing" : "/academy/c/$slug"}
                  params={{ slug: category.slug }}
                  className="ac-card flex items-center justify-between p-5 transition hover:-translate-y-0.5"
                >
                  <div>
                    <p style={{ fontFamily: "Fraunces, serif" }} className="text-lg">
                      {t.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--ac-ink-mute)]">
                      {ready ? "Ready · autosaves" : "Coming soon"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[var(--ac-terracotta)]" />
          <p className="ac-eyebrow">essays & playbooks</p>
        </div>
        <div className="ac-card p-6">
          <p className="text-sm text-[var(--ac-ink-soft)]">
            New essays publish weekly. Subscribe inside your dashboard to get
            notified when this chapter drops fresh writing.
          </p>
          <Link to="/academy/dashboard" className="ac-btn mt-4">
            Go to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
