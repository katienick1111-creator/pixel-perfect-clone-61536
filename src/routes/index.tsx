import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";
import {
  Users,
  Briefcase,
  Target,
  Check,
  Camera,
  Zap,
  ArrowRight,
} from "lucide-react";
import { MybHeader } from "@/components/myb/MybHeader";
import { MybFooter } from "@/components/myb/MybFooter";
import {
  Crown,
  Smiley,
  StarBurst,
  DoodleArrow,
  StickyNote,
  NeonSign,
  Garment,
} from "@/components/myb/decor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mind Ya Biz — Find Opportunity in the Chaos" },
      {
        name: "description",
        content:
          "Mind Ya Biz (MYB) — merch, mindset & hustle. Custom branded merch and designs that hit different. Find opportunity in the chaos.",
      },
      { property: "og:title", content: "Mind Ya Biz — Find Opportunity in the Chaos" },
    ],
  }),
  component: MybHome,
});

/* helper for CSS custom properties in style objects */
const v = (obj: Record<string, string | number>) => obj as CSSProperties;

function MybHome() {
  return (
    <div className="myb-paper-bg min-h-screen text-myb-ink">
      <MybHeader />
      <main className="mx-auto max-w-[1180px] px-4">
        <Hero />
        <TrustTags />
        <OneDesign />
        <BuildProfit />
        <Collections />
      </main>
      <MybFooter />
    </div>
  );
}

/* =========================================================
 * HERO
 * ======================================================= */
function Hero() {
  return (
    <section className="relative pb-8 pt-8">
      {/* background spray splatters */}
      <span
        className="myb-spray pointer-events-none absolute -left-6 top-24 h-40 w-40 opacity-40"
        style={v({ "--spray": "#17c3ce" })}
      />
      <span
        className="myb-spray pointer-events-none absolute right-4 top-6 h-32 w-32 opacity-40"
        style={v({ "--spray": "#ffd21e" })}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT — headline */}
        <div className="relative">
          <Crown className="absolute -top-2 left-2 h-12 w-16 rotate-[-8deg]" color="#8b3ffb" />
          <Smiley className="absolute -left-1 top-72 hidden h-12 w-12 rotate-[-10deg] md:block" color="#0d0d0d" />

          <h1
            className="mt-10 uppercase leading-[0.82]"
            style={v({ fontFamily: "var(--font-heavy)", letterSpacing: "-0.01em" })}
          >
            <span className="block text-[clamp(2.6rem,7vw,5.4rem)] text-myb-ink">FIND</span>
            <span className="block text-[clamp(3.1rem,9vw,7rem)] text-myb-pink">OPPORTUNITY</span>
            <span className="block text-[clamp(2.6rem,7vw,5.4rem)]">
              <span className="text-myb-ink">IN THE </span>
              <span className="text-myb-cyan">CHAOS.</span>
            </span>
          </h1>

          {/* black tag */}
          <div className="relative mt-6 inline-block max-w-md -rotate-1">
            <div
              className="rounded-md bg-myb-ink px-5 py-3 text-white"
              style={v({ fontFamily: "var(--font-marker)", boxShadow: "3px 4px 0 rgba(0,0,0,0.2)" })}
            >
              <span className="text-lg leading-snug">
                Helping small businesses build brands that{" "}
                <span className="rounded-full border-2 border-myb-pink px-2 text-myb-pink">
                  hit different
                </span>
              </span>
            </div>
            <DoodleArrow className="absolute -right-16 top-2 hidden h-12 w-20 rotate-[8deg] md:block" color="#0d0d0d" />
          </div>
        </div>

        {/* RIGHT — neon sign + sticky + scene */}
        <div className="relative">
          <StickyNote
            color="#ffd21e"
            rotate={4}
            className="absolute -right-2 -top-2 z-20 w-40 px-4 py-3"
          >
            <p className="leading-tight" style={v({ fontFamily: "var(--font-graffiti)", fontSize: 22 })}>
              BIG ENERGY.
              <br />
              BIGGER PLANS.
              <br />
              REAL IMPACT.
            </p>
            <span className="mt-1 block h-1 w-10 bg-myb-ink" />
          </StickyNote>

          <div className="ml-2 mt-11 w-[56%] max-w-[250px] [container-type:inline-size]">
            <NeonSign />
          </div>

          {/* laptop + mug workspace scene (CSS) */}
          <WorkspaceScene className="mt-4" />
          <StarBurst className="absolute -right-2 bottom-10 h-10 w-10" color="#8b3ffb" />
        </div>
      </div>
    </section>
  );
}

function WorkspaceScene({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={v({
        background: "linear-gradient(160deg,#2a2036 0%,#1a1420 60%,#0f0b16 100%)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
        aspectRatio: "16/7",
      })}
    >
      {/* wall art tiles */}
      <div className="absolute inset-0 opacity-30">
        <div className="grid h-full grid-cols-6 gap-1 p-1">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="rounded-sm"
              style={v({
                background: ["#3a2b4a", "#402a3c", "#2c3a44"][i % 3],
              })}
            />
          ))}
        </div>
      </div>
      {/* laptop */}
      <div className="absolute bottom-2 left-6 h-[58%] w-[46%]">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-[#8a5a3c] text-center shadow-lg">
          <div style={v({ fontFamily: "var(--font-graffiti)", color: "#f3eee1", fontSize: 26 })}>
            <span className="text-myb-pink">M</span>Y<span className="text-myb-cyan">B</span>
          </div>
          <div className="mt-1 rounded bg-black/40 px-1.5 py-0.5 text-[7px] text-white/80" style={v({ fontFamily: "var(--font-marker)" })}>
            CHAOS CREATES OPPORTUNITY
          </div>
        </div>
        <div className="mx-auto h-1.5 w-[120%] -translate-x-[8%] rounded-b bg-[#5a3a26]" />
      </div>
      {/* mug */}
      <div className="absolute bottom-3 right-8 flex h-[42%] w-[16%] flex-col items-center justify-center rounded-md rounded-t-sm bg-black text-center">
        <span style={v({ fontFamily: "var(--font-marker)", color: "#fff", fontSize: 8, lineHeight: 1.1 })}>
          MIND
          <br />
          YA BIZ
        </span>
      </div>
      {/* lamp glow */}
      <span className="absolute right-2 top-0 h-16 w-16 rounded-full bg-amber-200/20 blur-2xl" />
    </div>
  );
}

/* =========================================================
 * TRUST TAGS
 * ======================================================= */
function TrustTags() {
  const tags = [
    { icon: Users, label: "REAL PEOPLE.", color: "#17c3ce", rotate: -2 },
    { icon: Briefcase, label: "REAL BUSINESSES.", color: "#ffd21e", rotate: 1.5 },
    { icon: Target, label: "REAL RESULTS.", color: "#ec1e79", light: true, rotate: -1 },
  ];
  return (
    <section className="flex flex-wrap items-center gap-4 pb-10">
      {tags.map((t) => (
        <div
          key={t.label}
          className="myb-tape relative flex items-center gap-2 px-4 py-2"
          style={v({
            background: t.color,
            transform: `rotate(${t.rotate}deg)`,
            boxShadow: "2px 3px 0 rgba(0,0,0,0.18)",
          })}
        >
          <t.icon className="h-5 w-5" strokeWidth={2.5} color={t.light ? "#fff" : "#0d0d0d"} />
          <span
            className={t.light ? "text-white" : "text-myb-ink"}
            style={v({ fontFamily: "var(--font-graffiti)", fontSize: 18 })}
          >
            {t.label}
          </span>
        </div>
      ))}
    </section>
  );
}

/* =========================================================
 * ONE DESIGN. YOUR WAY.
 * ======================================================= */
function OneDesign() {
  const garments = [
    { kind: "tee" as const, color: "#141414", label: ["YOUR", "LOGO", "HERE"], labelColor: "#17c3ce" },
    { kind: "tee" as const, color: "#ece5d5", label: ["YOUR", "COLORS", "HERE"], labelColor: "#ec1e79" },
    { kind: "hoodie" as const, color: "#0f6b74", label: ["YOUR", "BRAND", "HERE"], labelColor: "#ffd21e" },
    { kind: "tote" as const, color: "#e7dcc4", label: ["YOUR", "VIBE", "HERE"], labelColor: "#ec1e79" },
  ];
  return (
    <section className="pb-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
        {/* black panel */}
        <div
          className="myb-torn-y relative bg-myb-ink px-7 py-8 text-white"
          style={v({ boxShadow: "4px 6px 0 rgba(0,0,0,0.2)" })}
        >
          <h2 className="uppercase leading-[0.85]" style={v({ fontFamily: "var(--font-heavy)" })}>
            <span className="block text-4xl md:text-5xl">ONE DESIGN.</span>
            <span className="block text-4xl text-myb-cyan md:text-5xl">YOUR WAY.</span>
          </h2>
          <span className="mt-1 block h-1.5 w-40 rounded bg-myb-purple" />
          <ul className="mt-5 space-y-2" style={v({ fontFamily: "var(--font-marker)" })}>
            {["Add your logo", "Change colors", "Make it yours", "Endless possibilities"].map((li) => (
              <li key={li} className="flex items-center gap-2 text-lg">
                <Check className="h-5 w-5 text-myb-yellow" strokeWidth={3} />
                {li}
              </li>
            ))}
          </ul>
          <GraffitiButton className="mt-6 bg-myb-yellow text-myb-ink">
            SHOP DESIGNS <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </GraffitiButton>
        </div>

        {/* clothesline of garments */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-3 h-[3px] bg-[#caa96a]" />
          <div className="relative grid grid-cols-2 gap-4 pt-3 sm:grid-cols-4">
            {garments.map((g, i) => (
              <div key={i} className="myb-sway" style={v({ "--sway": `${i % 2 ? -2 : 2}deg`, animationDelay: `${i * 0.4}s` })}>
                <Garment
                  kind={g.kind}
                  color={g.color}
                  labelColor={g.labelColor}
                  className="aspect-[6/7]"
                  label={
                    <div style={v({ fontSize: "clamp(14px,3.4vw,22px)" })}>
                      {g.label.map((l, j) => (
                        <div key={j}>{l}</div>
                      ))}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ribbon */}
      <div className="mt-8 flex items-center justify-center gap-3 rounded-md bg-myb-ink px-6 py-3">
        <StarBurst className="h-6 w-6" color="#17c3ce" />
        <p className="text-center" style={v({ fontFamily: "var(--font-graffiti)", fontSize: 24 })}>
          <span className="text-white">YOUR BRAND. YOUR COLORS. </span>
          <span className="text-myb-pink">YOUR WAY.</span>
        </p>
      </div>
    </section>
  );
}

/* =========================================================
 * DON'T HAVE TIME + WE BUILD YOU PROFIT
 * ======================================================= */
function BuildProfit() {
  const steps = [
    { cap: "YOUR IDEA", node: <BurgerDoodle />, sub: "Crazy idea!" },
    { cap: "OUR SKETCH", node: <BurgerDoodle clean /> },
    { cap: "OUR DESIGN", node: <BurgerBrand /> },
    { cap: "YOUR MERCH", node: <BurgerTee /> },
    { cap: "YOUR STORE", node: <StoreScreen />, sub: "LIVE & PRINTING" },
  ];
  return (
    <section className="pb-12">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.7fr]">
        {/* pink panel */}
        <div className="relative bg-myb-pink px-7 py-7 text-white" style={v({ boxShadow: "4px 6px 0 rgba(0,0,0,0.2)" })}>
          <h2 className="uppercase leading-[0.85]" style={v({ fontFamily: "var(--font-heavy)" })}>
            <span className="block text-3xl md:text-4xl">DON'T HAVE TIME</span>
            <span className="block text-3xl md:text-4xl">
              FOR THIS <span className="bg-myb-yellow px-1 text-myb-ink">SH#T?</span>
            </span>
          </h2>
          <div className="mt-5 space-y-3" style={v({ fontFamily: "var(--font-marker)" })}>
            <p className="flex items-start gap-2 text-base">
              <Camera className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2.5} />
              Logo, napkin sketch, blurry photo, crazy idea.
            </p>
            <p className="flex items-start gap-2 text-base">
              <Zap className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={2.5} />
              We'll take it from there.
            </p>
            <p className="flex items-start gap-2 text-base">
              <Crown className="mt-0.5 h-5 w-5 shrink-0" color="#ffd21e" />
              Custom design. Branded merch. All yours.
            </p>
          </div>
          <GraffitiButton className="mt-6 bg-myb-ink text-white">
            LET'S MAKE IT HAPPEN <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </GraffitiButton>
        </div>

        {/* process flow */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 style={v({ fontFamily: "var(--font-heavy)" })} className="text-2xl uppercase md:text-3xl">
              WE BUILD. <span className="text-myb-pink">YOU PROFIT.</span>
            </h3>
            <Crown className="h-7 w-9" color="#ffd21e" />
          </div>
          <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s.cap} className="flex items-center gap-1">
                <Polaroid caption={s.cap} sub={s.sub}>
                  {s.node}
                </Polaroid>
                {i < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 shrink-0 text-myb-pink" strokeWidth={3} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Polaroid({ children, caption, sub }: { children: ReactNode; caption: string; sub?: string }) {
  return (
    <figure className="w-[120px] shrink-0 rounded-sm bg-white p-2 shadow-[3px_4px_0_rgba(0,0,0,0.14)]">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-[#f3f0e8]">
        {children}
      </div>
      <figcaption className="pt-1.5 text-center">
        <div className="text-[11px] leading-tight text-myb-ink" style={v({ fontFamily: "var(--font-graffiti)", letterSpacing: "0.03em" })}>
          {caption}
        </div>
        {sub && (
          <div className="text-[8px] uppercase tracking-wide text-myb-ink/60" style={v({ fontFamily: "var(--font-marker)" })}>
            {sub}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

/* burger evolution nodes */
function BurgerDoodle({ clean = false }: { clean?: boolean }) {
  return (
    <span
      className="text-4xl"
      style={v({ filter: clean ? "none" : "grayscale(1) contrast(0.9)", opacity: clean ? 1 : 0.75 })}
    >
      🍔
    </span>
  );
}
function BurgerBrand() {
  return (
    <div className="text-center">
      <span className="text-2xl">🍔</span>
      <div style={v({ fontFamily: "var(--font-heavy)", fontSize: 9 })} className="uppercase leading-tight">
        Burger
        <br />
        Spot
      </div>
    </div>
  );
}
function BurgerTee() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-myb-ink">
      <div className="text-center">
        <span className="text-xl">🍔</span>
        <div style={v({ fontFamily: "var(--font-heavy)", fontSize: 8, color: "#fff" })} className="uppercase">
          Burger Spot
        </div>
      </div>
    </div>
  );
}
function StoreScreen() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-0.5 bg-myb-ink p-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="rounded-[2px] bg-white/15" />
      ))}
    </div>
  );
}

/* =========================================================
 * COLLECTIONS
 * ======================================================= */
function Collections() {
  const cols = [
    { title: "CEO", accent: "ENERGY", from: "#6b7d1f", to: "#c9d64a", tc: "#fff", ac: "#ffd21e" },
    { title: "ADHD", accent: "CLUB", from: "#0f6b74", to: "#3fb6bf", tc: "#fff", ac: "#17f0ff" },
    { title: "WOMAN", accent: "BUILT", from: "#4a1f7a", to: "#8b3ffb", tc: "#fff", ac: "#c99bff" },
    { title: "POOLSIDE", accent: "CEO", from: "#134e6f", to: "#2a9db5", tc: "#fff", ac: "#ffd21e" },
    { title: "YOUTH", accent: "DROP", from: "#b30f5f", to: "#ec1e79", tc: "#fff", ac: "#ffd21e" },
  ];
  return (
    <section className="pb-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="uppercase" style={v({ fontFamily: "var(--font-heavy)" })}>
          <span className="text-3xl md:text-4xl">COLLECTIONS THAT </span>
          <span className="text-3xl text-myb-cyan md:text-4xl">HIT DIFFERENT.</span>
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border-2 border-myb-purple bg-myb-purple px-4 py-2 text-white transition hover:-translate-y-0.5"
          style={v({ fontFamily: "var(--font-graffiti)", fontSize: 15 })}
        >
          VIEW ALL COLLECTIONS <ArrowRight className="h-4 w-4" strokeWidth={3} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cols.map((c, i) => (
          <div
            key={c.title}
            className="relative overflow-hidden rounded-sm shadow-[3px_5px_0_rgba(0,0,0,0.16)]"
            style={v({
              background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
              transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`,
              aspectRatio: "3/4",
            })}
          >
            {/* faux brick texture */}
            <span
              className="absolute inset-0 opacity-15"
              style={v({
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 22px), repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 34px)",
              })}
            />
            <div className="absolute inset-x-0 bottom-0 p-3 text-center leading-[0.85]">
              <div style={v({ fontFamily: "var(--font-graffiti)", color: c.tc, fontSize: "clamp(18px,4vw,26px)" })}>
                {c.title}
              </div>
              <div style={v({ fontFamily: "var(--font-graffiti)", color: c.ac, fontSize: "clamp(18px,4vw,26px)" })}>
                {c.accent}
              </div>
            </div>
          </div>
        ))}

        {/* & MORE COMING SOON */}
        <div
          className="relative flex flex-col items-center justify-center rounded-sm bg-myb-ink p-3 text-center shadow-[3px_5px_0_rgba(0,0,0,0.16)]"
          style={v({ transform: "rotate(1.5deg)", aspectRatio: "3/4" })}
        >
          <span className="text-4xl text-myb-yellow" style={v({ fontFamily: "var(--font-heavy)" })}>
            +
          </span>
          <div className="mt-1 text-white" style={v({ fontFamily: "var(--font-graffiti)", fontSize: 18, lineHeight: 1 })}>
            & MORE
            <br />
            COMING
            <br />
            SOON
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
 * shared button
 * ======================================================= */
function GraffitiButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-md px-6 py-3 transition hover:-translate-y-0.5 ${className}`}
      style={v({ fontFamily: "var(--font-graffiti)", fontSize: 20, boxShadow: "3px 4px 0 rgba(0,0,0,0.25)" })}
    >
      {children}
    </button>
  );
}
