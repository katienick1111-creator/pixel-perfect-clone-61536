import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Lock, MapPin, Sparkles } from "lucide-react";
import { events } from "@/data/trovin";
import trovinBadge from "@/assets/trovin-badge.png";

const heroImage = events[0].image;

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to Trover — find more, miss less" },
      {
        name: "description",
        content:
          "Sign up or continue as a guest. Save your favorite vendors and never lose track of a great booth again.",
      },
      { property: "og:title", content: "Welcome to Trover" },
      {
        property: "og:description",
        content:
          "Ever find a great vendor, then never know where to find them again?",
      },
      { property: "og:image", content: heroImage },
    ],
  }),
  component: WelcomePage,
});

type Mode = "signup" | "signin";

function WelcomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Wire to Lovable Cloud auth once enabled
    localStorage.setItem(
      "trovin-member",
      JSON.stringify({ email, name: name || email.split("@")[0], guest: false }),
    );
    navigate({ to: "/" });
  };

  const handleGuest = () => {
    localStorage.setItem(
      "trovin-member",
      JSON.stringify({ guest: true, name: "Guest Trover" }),
    );
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-cream-deep text-navy">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-0 lg:grid-cols-[1.05fr_1fr]">
        {/* === LEFT: photo collage === */}
        <aside className="relative hidden overflow-hidden bg-navy lg:block">
          <img
            src={heroImage}
            alt="A bustling Chicago flea market"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-navy/30 to-transparent" />

          {/* paper torn edge */}
          <span className="absolute -right-3 top-0 h-full w-6 bg-cream-deep [clip-path:polygon(100%_0,0_2%,100%_5%,0_8%,100%_11%,0_14%,100%_17%,0_20%,100%_23%,0_26%,100%_29%,0_32%,100%_35%,0_38%,100%_41%,0_44%,100%_47%,0_50%,100%_53%,0_56%,100%_59%,0_62%,100%_65%,0_68%,100%_71%,0_74%,100%_77%,0_80%,100%_83%,0_86%,100%_89%,0_92%,100%_95%,0_98%,100%_100%)]" />

          {/* sticker quote */}
          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-cream">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm hover:bg-cream/20"
            >
              <img src={trovinBadge} alt="" className="h-5 w-5" />
              Trovin'
            </Link>

            <div className="max-w-md space-y-6">
              <p className="font-script text-5xl leading-[0.95] text-cream md:text-6xl">
                Ever find a
                <br />
                <span className="text-gold">great vendor</span>,
                <br />
                then never
                <br />
                know where to
                <br />
                find them again?
              </p>

              {/* polaroid quote card */}
              <div className="inline-block rotate-[-3deg] rounded-sm bg-paper p-3 pb-5 text-navy shadow-brand-lg">
                <div className="aspect-[4/3] w-56 overflow-hidden rounded-sm bg-navy">
                  <img
                    src={events[1]?.image ?? heroImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 px-1 font-script text-lg leading-tight">
                  the one that got away.
                </p>
                <p className="px-1 text-[10px] uppercase tracking-wider text-ink-mute">
                  never again.
                </p>
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cream/70">
              <MapPin className="h-3.5 w-3.5" />
              Chicago · IL · est. 2026
            </p>
          </div>
        </aside>

        {/* === RIGHT: welcome + form === */}
        <section className="relative flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
          {/* paper texture blobs */}
          <span className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <span className="pointer-events-none absolute -left-10 bottom-10 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />

          <div className="relative mx-auto w-full max-w-md">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft hover:text-navy lg:hidden"
            >
              <img src={trovinBadge} alt="" className="h-5 w-5" />
              Trovin'
            </Link>

            <p className="font-script text-3xl leading-none text-teal -rotate-2 origin-left">
              welcome to
            </p>
            <h1 className="mt-1 font-script text-[clamp(3.5rem,11vw,5.5rem)] leading-[0.85] text-navy">
              Trover<span className="text-gold">!</span>
            </h1>

            <p className="mt-4 max-w-sm font-display text-base leading-snug text-ink-soft">
              Save the booths you love. Get a ping when they're back out. Spend
              the day, not a fortune.
            </p>

            {/* mode toggle */}
            <div className="mt-7 inline-flex rounded-full border-2 border-navy/15 bg-paper p-1 shadow-brand-sm">
              {(["signup", "signin"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${
                    mode === m
                      ? "bg-navy text-cream shadow-brand-sm"
                      : "text-ink-soft hover:text-navy"
                  }`}
                >
                  {m === "signup" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {mode === "signup" && (
                <Field
                  label="Your name"
                  icon={Sparkles}
                  type="text"
                  value={name}
                  onChange={setName}
                  placeholder="Jamie M."
                />
              )}
              <Field
                label="Email"
                icon={Mail}
                type="email"
                required
                value={email}
                onChange={setEmail}
                placeholder="you@trovin.fun"
              />
              <Field
                label="Password"
                icon={Lock}
                type="password"
                required
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />

              <button
                type="submit"
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-cream transition hover:bg-navy-700"
              >
                {mode === "signup" ? "Become a Trover" : "Take me back in"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* divider */}
            <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-mute">
              <span className="h-px flex-1 bg-line" />
              or just peek around
              <span className="h-px flex-1 bg-line" />
            </div>

            <button
              type="button"
              onClick={handleGuest}
              className="group inline-flex w-full items-center justify-between rounded-full border-2 border-dashed border-navy/40 bg-paper px-6 py-3.5 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-cream"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gold group-hover:bg-cream" />
                Continue as guest
              </span>
              <span className="font-script text-base text-gold group-hover:text-cream">
                no signup →
              </span>
            </button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-mute">
              By continuing you agree to play nice with our makers.
              <br />
              Read the{" "}
              <a href="#" className="underline decoration-dotted hover:text-navy">
                house rules
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon: typeof Mail;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-4 h-4 w-4 text-ink-mute" />
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border-2 border-navy/15 bg-paper py-3 pl-11 pr-4 font-display text-sm text-navy placeholder:text-ink-mute/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </span>
    </label>
  );
}
