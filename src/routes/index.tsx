import { createFileRoute } from "@tanstack/react-router";
import trovinLogo from "@/assets/trovin-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trovin' — Find more. Miss less." },
      { name: "description", content: "Trovin' brand foundation — design tokens, typography, and identity." },
      { property: "og:title", content: "Trovin' — Find more. Miss less." },
      { property: "og:description", content: "Trovin' brand foundation — design tokens, typography, and identity." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const swatches = [
  { name: "Navy", className: "bg-navy", token: "--navy" },
  { name: "Teal", className: "bg-teal", token: "--teal" },
  { name: "Gold", className: "bg-gold", token: "--gold" },
  { name: "Cream", className: "bg-cream border border-line", token: "--cream" },
  { name: "Cream Deep", className: "bg-cream-deep", token: "--cream-deep" },
  { name: "Ink", className: "bg-ink", token: "--ink" },
];

function Index() {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 md:py-24">
        <section className="flex flex-col items-center gap-6 text-center">
          <img
            src={trovinLogo}
            alt="Trovin' — Find more. Miss less."
            className="w-full max-w-md"
          />
          <p className="font-script text-3xl text-teal md:text-4xl">
            Brand foundation ready.
          </p>
        </section>

        <section className="grid gap-3">
          <h2 className="font-display text-2xl">Palette</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {swatches.map((s) => (
              <div key={s.name} className="flex flex-col gap-2">
                <div className={`h-20 rounded-md shadow-brand-sm ${s.className}`} />
                <div className="text-sm">
                  <div className="font-medium">{s.name}</div>
                  <div className="font-mono text-xs text-ink-mute">{s.token}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="font-display text-2xl">Typography</h2>
          <div className="grid gap-4 rounded-lg border border-line bg-paper p-6 shadow-brand-sm">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-mute">Display — Fraunces</div>
              <p className="font-display text-4xl">Find more. Miss less.</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-mute">Body — DM Sans</div>
              <p className="font-body text-base text-ink-soft">
                The quick brown fox jumps over the lazy dog while planning the next detour.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-mute">Script — Caveat Brush</div>
              <p className="font-script text-3xl text-teal">handwritten accents</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-mute">Mono — JetBrains Mono</div>
              <p className="font-mono text-sm">const brand = "trovin";</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
