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
    label: "T-Shirt",
    icon: (
      <>
        <path d="M23 8 L15 13 L6 21 L13 31 L18 26 L18 55 L46 55 L46 26 L51 31 L58 21 L49 13 L41 8 Q32 18 23 8 Z" fill="url(#myp-gm)" stroke="#9a9a9a" strokeWidth={1} />
        <path d="M23 8 Q32 18 41 8" fill="none" stroke="#a7a7a7" strokeWidth={1.2} />
        <path d="M22 30 Q21 43 23 54" stroke="#cfcfcf" strokeWidth={1} fill="none" opacity={0.7} />
        <path d="M42 30 Q43 43 41 54" stroke="#b3b3b3" strokeWidth={1} fill="none" opacity={0.7} />
      </>
    ),
  },
  {
    key: "hoodie",
    label: "Hoodie",
    icon: (
      <>
        <path d="M24 12 L14 17 L6 25 L13 34 L18 29 L18 56 L46 56 L46 29 L51 34 L58 25 L50 17 L40 12 Q32 21 24 12 Z" fill="url(#myp-gd)" stroke="#8f8f8f" strokeWidth={1} />
        <path d="M24 12 Q32 24 40 12 L40 18 Q32 27 24 18 Z" fill="#c2c2c2" stroke="#8f8f8f" strokeWidth={1} />
        <path d="M28 30 L28 46 M36 30 L36 46" stroke="#7c7c7c" strokeWidth={1.4} />
        <path d="M23 44 H41 V52 H23 Z" fill="#c8c8c8" stroke="#8f8f8f" strokeWidth={1} opacity={0.7} />
      </>
    ),
  },
  {
    key: "mug",
    label: "Mug",
    icon: (
      <>
        <ellipse cx="27" cy="18" rx="15" ry="4" fill="#e8e8e8" stroke="#9a9a9a" />
        <path d="M12 18 L12 46 Q12 50 16 50 L38 50 Q42 50 42 46 L42 18" fill="url(#myp-gm)" stroke="#9a9a9a" strokeWidth={1} />
        <path d="M42 24 q11 1 11 9 t-11 9" fill="none" stroke="#bdbdbd" strokeWidth={3.4} />
        <path d="M17 22 L17 44" stroke="#fff" strokeWidth={2} opacity={0.5} />
      </>
    ),
  },
  {
    key: "tote",
    label: "Tote Bag",
    icon: (
      <>
        <rect x="15" y="22" width="34" height="34" rx="2" fill="url(#myp-gm)" stroke="#9a9a9a" strokeWidth={1} />
        <path d="M23 22 Q23 9 32 9 Q41 9 41 22" fill="none" stroke="#c9c9c9" strokeWidth={3} />
        <path d="M20 30 L20 50 M44 30 L44 50" stroke="#cfcfcf" opacity={0.5} />
      </>
    ),
  },
  {
    key: "hat",
    label: "Hat",
    icon: (
      <>
        <path d="M14 40 Q14 18 32 18 Q50 18 50 40 Z" fill="url(#myp-gd)" stroke="#8f8f8f" strokeWidth={1} />
        <path d="M14 40 Q10 40 8 44 L50 44 Q52 40 50 40 Z" fill="#c2c2c2" stroke="#8f8f8f" strokeWidth={1} />
        <circle cx="32" cy="17" r="2.4" fill="#c2c2c2" stroke="#8f8f8f" />
        <path d="M23 39 Q23 24 32 24 Q41 24 41 39" stroke="#8f8f8f" opacity={0.5} fill="none" />
      </>
    ),
  },
  {
    key: "tumbler",
    label: "Tumbler",
    icon: (
      <>
        <path d="M22 14 L42 14 L38 54 Q38 56 36 56 L28 56 Q26 56 26 54 Z" fill="url(#myp-gmetal)" stroke="#7c7f82" strokeWidth={1} />
        <rect x="20" y="9" width="24" height="6" rx="2" fill="#6f7376" />
        <rect x="30" y="2" width="4" height="8" rx="1.5" fill="#5c5f62" />
        <path d="M27 18 L25 50" stroke="#fff" strokeWidth={1.4} opacity={0.6} />
      </>
    ),
  },
  {
    key: "bandanna",
    label: "Bandanna",
    icon: (
      <>
        <path d="M8 22 L56 22 L32 52 Z" fill="url(#myp-gm)" stroke="#9a9a9a" strokeWidth={1} />
        <g fill="none" stroke="#b9b9b9" strokeWidth={1.2}>
          <path d="M16 26 l6 6 M24 26 l6 6 M32 26 l6 6 M40 26 l6 6" />
          <circle cx="24" cy="34" r="1.6" />
          <circle cx="34" cy="36" r="1.6" />
          <circle cx="30" cy="42" r="1.6" />
        </g>
      </>
    ),
  },
  {
    key: "socks",
    label: "Socks",
    icon: (
      <>
        <path d="M20 8 L29 8 L29 34 L21 46 L12 39 L20 31 Z" fill="url(#myp-gm)" stroke="#9a9a9a" strokeWidth={1} />
        <path d="M35 8 L44 8 L44 31 L52 39 L43 46 L35 34 Z" fill="url(#myp-gd)" stroke="#9a9a9a" strokeWidth={1} />
        <path d="M20 12 L29 12 M35 12 L44 12" stroke="#8f8f8f" strokeWidth={2} />
      </>
    ),
  },
];

function CreatePage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <MybPage active="CREATE" variant="dark">
      <main className="wrap">
        <div className="cwrap">
          <section className="chero">
            <svg className="drip" viewBox="0 0 64 48">
              <use href="#myp-crown" color="#a24bff" />
            </svg>
            <div className="eyebrow">Custom Merch Lab</div>
            <h1>
              <span className="a">LET'S CREATE</span>
              <br />
              <span className="b">TOGETHER.</span>
            </h1>
            <svg className="brush" viewBox="0 0 420 16" preserveAspectRatio="none">
              <path d="M4 9 Q120 2 210 8 T416 7" stroke="#20e3e3" strokeWidth={6} fill="none" strokeLinecap="round" />
            </svg>
            <p>
              Tell us what you want &amp; we'll make it happen — or upload your own design and we'll slap it on merch that hits.
            </p>
          </section>

          <form className="formcard" onSubmit={(e) => e.preventDefault()}>
            <div className="caution">
              <span>Tell Us What You Want</span>
            </div>
            <div className="stamp">NO BORING MERCH</div>
            <div className="cardbody">
              <div className="frow">
                <div className="field">
                  <label className="flabel" htmlFor="c-name">Your Name</label>
                  <input id="c-name" className="finput" placeholder="First & Last" />
                </div>
                <div className="field">
                  <label className="flabel cy" htmlFor="c-email">Email</label>
                  <input id="c-email" type="email" className="finput" placeholder="you@email.com" />
                </div>
              </div>
              <div className="field">
                <label className="flabel yl" htmlFor="c-phone">Phone</label>
                <input id="c-phone" type="tel" className="finput" placeholder="(555) 123-4567" />
              </div>

              <div className="divider2">
                <span>
                  PICK YOUR <em>WEAPON</em>
                </span>
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
                    <span className="pick">✓</span>
                    <svg viewBox="0 0 64 64">{p.icon}</svg>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="idea">
                <div className="sublabel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ff1e7a" strokeWidth={2.4}>
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                  SPILL THE VISION
                </div>
                <textarea
                  className="textarea"
                  placeholder="Colors, theme, text, attitude, references, the vibe... don't hold back."
                />
                <button type="button" className="upload">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
                  </svg>
                  Upload your own design
                </button>
              </div>

              <div className="submit">
                <button type="submit">
                  MAKE IT HIT
                  <svg viewBox="0 0 24 24">
                    <use href="#myp-arrow" />
                  </svg>
                </button>
                <div className="note">real humans. 24-hour reply. no bots, no boring.</div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </MybPage>
  );
}
