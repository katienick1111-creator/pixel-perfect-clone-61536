import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { MybPage } from "@/components/myb/shell";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Your Merch — Mind Ya Biz" },
      {
        name: "description",
        content:
          "Tell Mind Ya Biz what you want and we'll make it happen — or upload your own design to put on custom merch. T-shirts, hoodies, mugs, totes and more.",
      },
      { property: "og:title", content: "Create Your Merch — Mind Ya Biz" },
    ],
  }),
  component: CreatePage,
});

type Product = { key: string; label: string; icon: ReactNode };

const PRODUCTS: Product[] = [
  {
    key: "tshirt",
    label: "T-SHIRT",
    icon: (
      <path d="M22 10 L14 15 L7 22 L13 30 L18 26 L18 50 L42 50 L42 26 L47 30 L53 22 L46 15 L38 10 Q30 18 22 10 Z" />
    ),
  },
  {
    key: "hoodie",
    label: "HOODIE",
    icon: (
      <>
        <path d="M23 12 L14 17 L7 24 L13 32 L18 28 L18 52 L42 52 L42 28 L47 32 L53 24 L46 17 L37 12 Q30 20 23 12 Z" />
        <path d="M23 12 Q30 22 37 12" />
        <path d="M27 26 L27 40 M33 26 L33 40" />
      </>
    ),
  },
  {
    key: "mug",
    label: "MUG",
    icon: (
      <>
        <rect x="14" y="18" width="26" height="28" rx="3" />
        <path d="M40 24 q10 0 10 8 t-10 8" />
      </>
    ),
  },
  {
    key: "tote",
    label: "TOTE BAG",
    icon: (
      <>
        <rect x="15" y="20" width="30" height="30" rx="3" />
        <path d="M22 20 Q22 8 30 8 Q38 8 38 20" />
      </>
    ),
  },
  {
    key: "hat",
    label: "HAT",
    icon: (
      <>
        <path d="M12 40 Q12 20 30 20 Q48 20 48 40 Z" />
        <path d="M8 40 L52 40" />
      </>
    ),
  },
  {
    key: "tumbler",
    label: "TUMBLER",
    icon: (
      <>
        <path d="M20 14 L40 14 L37 50 L23 50 Z" />
        <rect x="19" y="10" width="22" height="5" rx="2" />
      </>
    ),
  },
  {
    key: "bandanna",
    label: "BANDANNA",
    icon: (
      <>
        <path d="M8 22 L52 22 L30 48 Z" />
        <path d="M18 22 L30 34 L42 22" />
      </>
    ),
  },
  {
    key: "socks",
    label: "SOCKS",
    icon: (
      <>
        <path d="M20 10 L28 10 L28 34 L20 44 L13 38 L20 30 Z" />
        <path d="M34 10 L42 10 L42 30 L49 38 L42 44 L34 34 Z" />
      </>
    ),
  },
];

function CreatePage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <MybPage active="CREATE">
      <main className="wrap">
        <div className="cwrap">
          <section className="chero">
            <svg className="crown" viewBox="0 0 64 48">
              <use href="#myp-crown" color="#8b3ffb" />
            </svg>
            <div className="icons">🎨 ✨ 🔨</div>
            <h1>
              <span className="a">LET'S CREATE</span> <span className="b">TOGETHER</span>
            </h1>
            <p>Tell us what you want &amp; we'll make it happen — or upload your own design to put on merch!</p>
          </section>

          <form className="formcard" onSubmit={(e) => e.preventDefault()}>
            <span className="tape a" />
            <span className="tape b" />

            <div className="frow">
              <div className="field">
                <label className="flabel" htmlFor="c-name">YOUR NAME</label>
                <input id="c-name" className="finput" placeholder="First & Last" />
              </div>
              <div className="field">
                <label className="flabel" htmlFor="c-email">EMAIL</label>
                <input id="c-email" type="email" className="finput" placeholder="you@email.com" />
              </div>
            </div>
            <div className="field">
              <label className="flabel" htmlFor="c-phone">PHONE</label>
              <input id="c-phone" type="tel" className="finput" placeholder="(555) 123-4567" />
            </div>

            <div className="divider2">
              <span>WHAT DO YOU WANT?</span>
            </div>

            <div className="sublabel">
              <svg viewBox="0 0 64 48" style={{ width: 24 }}>
                <use href="#myp-crown" color="#ffd21e" />
              </svg>
              PICK A PRODUCT
            </div>
            <div className="prodgrid">
              {PRODUCTS.map((p) => (
                <button
                  type="button"
                  key={p.key}
                  className={`prod${selected.includes(p.key) ? " sel" : ""}`}
                  aria-pressed={selected.includes(p.key)}
                  onClick={() => toggle(p.key)}
                >
                  <svg viewBox="0 0 60 60" fill="none" stroke="#0d0d0d" strokeWidth={2.6} strokeLinejoin="round">
                    {p.icon}
                  </svg>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <div className="idea">
              <div className="sublabel">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ec1e79" strokeWidth={2.4}>
                  <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
                TELL US YOUR IDEA
              </div>
              <textarea
                className="textarea"
                placeholder="Describe what you're looking for — colors, theme, text, branding, vibes..."
              />
            </div>

            <div className="submit">
              <button type="submit">
                LET'S MAKE IT HAPPEN
                <svg viewBox="0 0 24 24">
                  <use href="#myp-arrow" />
                </svg>
              </button>
              <div className="note">we reply within 24 hours — pinky promise.</div>
            </div>
          </form>
        </div>
      </main>
    </MybPage>
  );
}
