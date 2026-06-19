import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Download, Sparkles } from "lucide-react";
import { academyCategories, academyFeaturedTip, academyTools } from "@/data/academy";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Trovin Academy — Built for vendors who don't stop learning" },
      {
        name: "description",
        content:
          "An editorial vendor school: tools, worksheets, and resources to run a market-ready business.",
      },
    ],
  }),
  component: AcademyHome,
});

function AcademyHome() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--ac-rule)] pb-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="ac-eyebrow">issue no. 01 · summer ’26</p>
            <h1
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-4 text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.98] tracking-[-0.025em]"
            >
              The vendor school
              <br />
              <em className="font-light text-[var(--ac-terracotta)]">
                you wish existed
              </em>{" "}
              when you started.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ac-ink-soft)]">
              Trovin Academy is a premium operating system for festival, market,
              and event vendors. Interactive worksheets that autosave. Printable
              planners that travel with you. Lessons from vendors who've done it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/academy/categories" className="ac-btn">
                Start with categories <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/academy/tools/packing" className="ac-btn-ghost">
                <Sparkles className="h-4 w-4" /> Packing tool
              </Link>
              <Link to="/academy/tools/pricing" className="ac-btn-ghost">
                <Sparkles className="h-4 w-4" /> Pricing calculator
              </Link>
            </div>
          </div>

          <aside className="ac-card p-6">
            <p className="ac-eyebrow">{academyFeaturedTip.eyebrow}</p>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-4 text-2xl italic leading-snug"
            >
              "{academyFeaturedTip.body}"
            </p>
            <div className="ac-rule-soft mt-6 pt-4 text-xs text-[var(--ac-ink-mute)]">
              {academyFeaturedTip.byline}
            </div>
          </aside>
        </div>
      </section>

      {/* By the numbers */}
      <section className="grid gap-8 border-b border-[var(--ac-rule-soft)] py-10 sm:grid-cols-4">
        {[
          { n: "100+", l: "printable resources" },
          { n: "10", l: "interactive tools" },
          { n: "8", l: "curated categories" },
          { n: "24/7", l: "autosave on every form" },
        ].map((s) => (
          <div key={s.l}>
            <p
              style={{ fontFamily: "Fraunces, serif" }}
              className="text-4xl text-[var(--ac-terracotta)]"
            >
              {s.n}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-[var(--ac-ink-mute)]">
              {s.l}
            </p>
          </div>
        ))}
      </section>

      {/* Featured categories */}
      <section className="py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="ac-eyebrow">categories</p>
            <h2
              style={{ fontFamily: "Fraunces, serif" }}
              className="mt-2 text-3xl"
            >
              Eight chapters. One vendor life.
            </h2>
          </div>
          <Link
            to="/academy/categories"
            className="hidden text-sm text-[var(--ac-terracotta)] hover:underline md:inline-flex"
          >
            View all <ArrowUpRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--ac-rule)] bg-[var(--ac-rule)] sm:grid-cols-2 lg:grid-cols-4">
          {academyCategories.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              to="/academy/c/$slug"
              params={{ slug: c.slug }}
              className="group block bg-[var(--ac-paper)] p-6 transition hover:bg-white"
            >
              <p className="ac-number">{c.number}</p>
              <h3
                style={{ fontFamily: "Fraunces, serif" }}
                className="mt-3 text-xl"
              >
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--ac-ink-soft)]">
                {c.description}
              </p>
              <p className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[var(--ac-terracotta)] opacity-0 transition group-hover:opacity-100">
                Open chapter <ArrowRight className="h-3 w-3" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools strip */}
      <section className="border-t border-[var(--ac-rule)] py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="ac-eyebrow">interactive tools</p>
            <h2 style={{ fontFamily: "Fraunces, serif" }} className="mt-2 text-3xl">
              Worksheets that work back.
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {academyTools.map((t, i) => {
            const ready = t.status === "ready";
            return (
              <Link
                key={t.slug}
                to={ready ? "/academy/tools/packing" : "/academy/categories"}
                className="ac-card group flex items-start justify-between p-5 transition hover:-translate-y-0.5"
              >
                <div>
                  <p className="text-[10px] tabular-nums text-[var(--ac-ink-mute)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p
                    style={{ fontFamily: "Fraunces, serif" }}
                    className="mt-1 text-lg"
                  >
                    {t.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ac-ink-mute)]">
                    {ready ? "Ready · autosaves" : "Coming this season"}
                  </p>
                </div>
                {ready ? (
                  <span className="rounded-full bg-[var(--ac-forest)] px-2 py-1 text-[10px] uppercase tracking-widest text-white">
                    new
                  </span>
                ) : (
                  <span className="rounded-full border border-[var(--ac-rule-soft)] px-2 py-1 text-[10px] uppercase tracking-widest text-[var(--ac-ink-mute)]">
                    soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Editorial CTA */}
      <section className="ac-card mt-6 mb-2 grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="ac-eyebrow">members get more</p>
          <h2
            style={{ fontFamily: "Fraunces, serif" }}
            className="mt-3 text-3xl"
          >
            Save your worksheets. Track your goals. Stack your wins.
          </h2>
          <p className="mt-3 max-w-xl text-[var(--ac-ink-soft)]">
            Sign in to autosave every tool to your account, favorite the
            resources you love, and build out your member dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/academy/dashboard" className="ac-btn">
            <BookOpen className="h-4 w-4" /> My dashboard
          </Link>
          <Link to="/academy/downloads" className="ac-btn-ghost">
            <Download className="h-4 w-4" /> Library
          </Link>
        </div>
      </section>
    </div>
  );
}
