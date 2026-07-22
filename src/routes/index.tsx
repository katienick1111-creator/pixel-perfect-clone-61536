import { createFileRoute } from "@tanstack/react-router";

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

const NAV = ["HOME", "SHOP", "COLLECTIONS", "CREATE", "ABOUT", "PORTFOLIO", "CONTACT"];

function MybHome() {
  return (
    <div className="myp">
      <Defs />
      <Grunge />
      <Header />
      <main className="wrap">
        <Hero />
        <Trust />
        <OneDesign />
        <BuildProfit />
        <Collections />
      </main>
      <Footer />
    </div>
  );
}

/* reusable SVG filter + symbol definitions */
function Defs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="myp-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves={3} seed={7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={5} />
        </filter>
        <filter id="myp-torn">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves={4} seed={3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} />
        </filter>
        <symbol id="myp-crown" viewBox="0 0 64 48">
          <path d="M6 42 L4 14 L20 28 L32 6 L44 28 L60 14 L58 42 Z" fill="currentColor" stroke="#0d0d0d" strokeWidth={3} strokeLinejoin="round" />
          <circle cx="4" cy="12" r="3.4" fill="currentColor" stroke="#0d0d0d" strokeWidth={2.4} />
          <circle cx="32" cy="4" r="3.4" fill="currentColor" stroke="#0d0d0d" strokeWidth={2.4} />
          <circle cx="60" cy="12" r="3.4" fill="currentColor" stroke="#0d0d0d" strokeWidth={2.4} />
        </symbol>
        <symbol id="myp-arrow" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="myp-star" viewBox="0 0 48 48">
          <path d="M24 2 L29 18 L46 18 L32 28 L37 45 L24 34 L11 45 L16 28 L2 18 L19 18 Z" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinejoin="round" />
        </symbol>
      </defs>
    </svg>
  );
}

function Grunge() {
  return (
    <div className="grunge">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <span key={n} className={`splat sp${n}`} />
      ))}
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="navbar">
        <div className="headrow">
          <div className="logo">
            <svg className="crown" viewBox="0 0 64 48">
              <use href="#myp-crown" color="#ffd21e" />
            </svg>
            <div className="mk">
              <div className="myb">
                <span className="m">M</span>
                <span className="y">Y</span>
                <span className="b">B</span>
              </div>
              <div className="t1">MIND YA BIZ</div>
              <div className="t2">MERCH · MINDSET · HUSTLE</div>
            </div>
          </div>
          <nav className="desk">
            {NAV.map((item) => (
              <a key={item} href="#" className={item === "HOME" ? "active" : undefined}>
                {item}
              </a>
            ))}
          </nav>
          <div className="actions">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span className="cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="18" cy="21" r="1.5" />
                <path d="M2 3h3l2.4 12.3a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L23 7H6" />
              </svg>
              <span className="badge">2</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div style={{ position: "relative" }}>
        <svg viewBox="0 0 64 48" style={{ position: "absolute", top: "-8px", left: "20px", width: "86px", transform: "rotate(-6deg)" }}>
          <use href="#myp-crown" color="#8b3ffb" />
        </svg>
        <svg viewBox="0 0 24 24" style={{ position: "absolute", top: "-6px", left: "2px", width: "22px", height: "22px" }} stroke="#0d0d0d" strokeWidth={2.4} strokeLinecap="round">
          <path d="M4 8 L9 11 M2 15 L8 15 M6 20 L10 16" />
        </svg>
        <svg viewBox="0 0 24 24" style={{ position: "absolute", top: "-6px", left: "90px", width: "22px", height: "22px" }} stroke="#0d0d0d" strokeWidth={2.4} strokeLinecap="round">
          <path d="M20 8 L15 11 M22 15 L16 15 M18 20 L14 16" />
        </svg>

        <h1 className="hl rough">
          <span className="l1">FIND</span>
          <span className="l2">OPPORTUNITY</span>
          <span className="l3">
            IN THE <span className="cy">CHAOS.</span>
          </span>
        </h1>

        <div className="blacktag">
          <div className="inner">
            <span className="txt">
              Helping small businesses build brands that <span className="pill-out">hit different</span>
            </span>
          </div>
        </div>
        <svg viewBox="0 0 96 64" style={{ position: "absolute", right: "-30px", bottom: "-6px", width: "70px", height: "44px" }} fill="none" stroke="#0d0d0d" strokeWidth={4} strokeLinecap="round">
          <path d="M6 10 C40 2 82 14 86 46" />
          <path d="M86 46 L74 36 M86 46 L92 30" />
        </svg>

        <svg viewBox="0 0 64 64" style={{ position: "absolute", left: "-4px", bottom: "-70px", width: "64px", height: "64px" }} fill="none" stroke="#0d0d0d" strokeWidth={4} strokeLinecap="round">
          <circle cx="32" cy="32" r="27" />
          <path d="M22 24 l7 7 M29 24 l-7 7 M35 24 l7 7 M42 24 l-7 7" />
          <path d="M20 40 Q32 52 44 40" />
        </svg>
      </div>

      <div style={{ position: "relative" }}>
        <div className="sticky">
          <p>
            BIG ENERGY.
            <br />
            BIGGER PLANS.
            <br />
            REAL IMPACT.
          </p>
          <span className="u" />
        </div>
        <div className="neonwrap">
          <div className="neon">
            <svg className="crown" viewBox="0 0 64 48">
              <use href="#myp-crown" color="#ff6ab8" />
            </svg>
            <span className="ring1" />
            <span className="ring2" />
            <div className="txt">
              <div className="a">MIND</div>
              <div className="b">YA</div>
              <div className="c">BIZ</div>
            </div>
            <div className="sub">MERCH · MINDSET · HUSTLE</div>
          </div>
        </div>
        <div className="scene">
          <div className="wall">
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="deskbar" />
          <div className="laptop">
            <div className="lid">
              <div className="b">
                <span className="p">M</span>Y<span className="c">B</span>
              </div>
              <div className="s">CHAOS CREATES OPPORTUNITY</div>
            </div>
          </div>
          <div className="plant">
            <span className="leaf" />
            <span className="pot" />
          </div>
          <div className="mug">
            <span>
              MIND
              <br />
              YA BIZ
            </span>
          </div>
        </div>
        <svg viewBox="0 0 48 48" style={{ position: "absolute", right: "-6px", bottom: "-14px", width: "40px", height: "40px" }}>
          <use href="#myp-star" color="#8b3ffb" />
        </svg>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="trust">
      <div className="tag" style={{ background: "#17c3ce", transform: "rotate(-2deg)" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth={2.4}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 1-3.5 4-3.5s4 1.5 4 3.5" />
        </svg>
        <span>
          REAL
          <br />
          PEOPLE.
        </span>
      </div>
      <div className="tag" style={{ background: "#ffd21e", transform: "rotate(1.5deg)" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth={2.4}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
        <span>
          REAL
          <br />
          BUSINESSES.
        </span>
      </div>
      <div className="tag" style={{ background: "#ec1e79", transform: "rotate(-1deg)" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        <span style={{ color: "#fff" }}>
          REAL
          <br />
          RESULTS.
        </span>
      </div>
    </section>
  );
}

function OneDesign() {
  return (
    <section className="section">
      <div className="od">
        <div className="panel">
          <h2>
            <span className="a">ONE DESIGN.</span>
            <span className="b">YOUR WAY.</span>
          </h2>
          <span className="ubar" />
          <ul className="checks">
            {["Add your logo", "Change colors", "Make it yours", "Endless possibilities"].map((li) => (
              <li key={li}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path d="M4 12l5 5L20 6" />
                </svg>
                {li}
              </li>
            ))}
          </ul>
          <button className="gbtn yellow">
            SHOP DESIGNS
            <svg viewBox="0 0 24 24">
              <use href="#myp-arrow" />
            </svg>
          </button>
        </div>

        <div className="line">
          <div className="cord" />
          <svg viewBox="0 0 96 80" style={{ position: "absolute", left: "-40px", top: "20px", width: "70px", height: "60px", zIndex: 3 }} fill="none" stroke="#17c3ce" strokeWidth={5} strokeLinecap="round">
            <path d="M4 20 C40 6 84 22 84 60" />
            <path d="M84 60 L72 50 M84 60 L92 44" />
          </svg>
          <div className="garments">
            {/* black tee */}
            <div className="garment">
              <svg className="hanger" viewBox="0 0 100 40" fill="none" stroke="#8a6a3a" strokeWidth={3}>
                <path d="M50 6 a5 5 0 1 1 3 4" />
                <path d="M50 12 L8 34 H92 Z" fill="#a5804a" fillOpacity={0.15} />
              </svg>
              <div className="body">
                <svg viewBox="0 0 120 130" fill="none">
                  <path d="M40 10 L26 18 L8 32 L20 50 L32 42 L32 122 L88 122 L88 42 L100 50 L112 32 L94 18 L80 10 Q60 26 40 10 Z" fill="#141414" stroke="#000" strokeWidth={2} />
                  <path d="M40 10 Q60 26 80 10" fill="none" stroke="#333" strokeWidth={1.5} />
                </svg>
                <div className="lbl" style={{ color: "#fff" }}>
                  <div>YOUR</div>
                  <div className="big" style={{ color: "#17c3ce" }}>LOGO</div>
                  <div>HERE</div>
                </div>
              </div>
            </div>
            {/* white tee */}
            <div className="garment">
              <svg className="hanger" viewBox="0 0 100 40" fill="none" stroke="#8a6a3a" strokeWidth={3}>
                <path d="M50 6 a5 5 0 1 1 3 4" />
                <path d="M50 12 L8 34 H92 Z" fill="#a5804a" fillOpacity={0.15} />
              </svg>
              <div className="body">
                <svg viewBox="0 0 120 130" fill="none">
                  <path d="M40 10 L26 18 L8 32 L20 50 L32 42 L32 122 L88 122 L88 42 L100 50 L112 32 L94 18 L80 10 Q60 26 40 10 Z" fill="#efe9db" stroke="#c9c2b0" strokeWidth={2} />
                  <path d="M40 10 Q60 26 80 10" fill="none" stroke="#c9c2b0" strokeWidth={1.5} />
                </svg>
                <div className="lbl" style={{ color: "#141414" }}>
                  <div>YOUR</div>
                  <div className="big" style={{ color: "#ec1e79" }}>COLORS</div>
                  <div>HERE</div>
                </div>
              </div>
            </div>
            {/* teal hoodie */}
            <div className="garment">
              <svg className="hanger" viewBox="0 0 100 40" fill="none" stroke="#8a6a3a" strokeWidth={3}>
                <path d="M50 6 a5 5 0 1 1 3 4" />
                <path d="M50 12 L8 34 H92 Z" fill="#a5804a" fillOpacity={0.15} />
              </svg>
              <div className="body">
                <svg viewBox="0 0 120 132" fill="none">
                  <path d="M42 14 L24 22 L6 38 L18 56 L30 48 L30 124 L90 124 L90 48 L102 56 L114 38 L96 22 L78 14 Q60 32 42 14 Z" fill="#0f6b74" stroke="#093f46" strokeWidth={2} />
                  <path d="M42 14 Q60 36 78 14 Q60 30 42 14 Z" fill="#0c565e" />
                  <path d="M54 40 L54 72 M66 40 L66 72" stroke="#093f46" strokeWidth={2.5} />
                </svg>
                <div className="lbl" style={{ color: "#fff" }}>
                  <div>YOUR</div>
                  <div className="big" style={{ color: "#ffd21e" }}>BRAND</div>
                  <div>HERE</div>
                </div>
              </div>
            </div>
            {/* tote */}
            <div className="garment">
              <svg className="hanger" viewBox="0 0 100 40" fill="none" stroke="#8a6a3a" strokeWidth={3}>
                <path d="M50 6 a5 5 0 1 1 3 4" />
              </svg>
              <div className="body">
                <svg viewBox="0 0 120 132" fill="none">
                  <rect x="26" y="40" width="68" height="88" rx="3" fill="#e7dcc4" stroke="#c9bfa2" strokeWidth={2} />
                  <path d="M42 40 Q42 14 60 14 Q78 14 78 40" fill="none" stroke="#c9bfa2" strokeWidth={3} />
                </svg>
                <div className="lbl" style={{ color: "#141414" }}>
                  <div>YOUR</div>
                  <div className="big" style={{ color: "#ec1e79" }}>VIBE</div>
                  <div>HERE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ribbon">
        <svg viewBox="0 0 48 48" style={{ width: 26, height: 26 }}>
          <use href="#myp-star" color="#17c3ce" />
        </svg>
        <p>
          YOUR BRAND. YOUR COLORS. <span className="pk">YOUR WAY.</span>
        </p>
      </div>
    </section>
  );
}

function BuildProfit() {
  return (
    <section className="section">
      <div className="bp">
        <div className="pinkpanel">
          <h2>
            DON'T HAVE TIME
            <br />
            FOR THIS <span className="hl">SH#T?</span>
          </h2>
          <div className="lines">
            <p>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <circle cx="12" cy="13" r="3.5" />
                <path d="M8 7l1.5-3h5L16 7" />
              </svg>
              Logo, napkin sketch, blurry photo, crazy idea.
            </p>
            <p>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4}>
                <path d="M13 2 L4 14 h7 l-2 8 9-12 h-7 z" />
              </svg>
              We'll take it from there.
            </p>
            <p>
              <svg viewBox="0 0 64 48">
                <use href="#myp-crown" color="#ffd21e" />
              </svg>
              Custom design. Branded merch. All yours.
            </p>
          </div>
          <button className="gbtn inkbtn">
            LET'S MAKE IT HAPPEN
            <svg viewBox="0 0 24 24">
              <use href="#myp-arrow" />
            </svg>
          </button>
        </div>

        <div>
          <div className="flowhead">
            <h3>
              WE BUILD. <span className="pk">YOU PROFIT.</span>
            </h3>
            <svg className="crown" viewBox="0 0 64 48">
              <use href="#myp-crown" color="#ffd21e" />
            </svg>
          </div>
          <div className="flow">
            {/* idea */}
            <div className="step">
              <div className="polaroid r1">
                <span className="tape tl" />
                <div className="pic">
                  <svg viewBox="0 0 100 84" fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round" style={{ width: "82%" }}>
                    <path d="M16 40 Q50 8 84 40" />
                    <circle cx="38" cy="26" r="1" />
                    <circle cx="55" cy="22" r="1" />
                    <circle cx="68" cy="30" r="1" />
                    <path d="M14 44 Q50 54 86 44" />
                    <path d="M16 52 Q30 48 44 54 T86 52" />
                    <rect x="16" y="56" width="68" height="8" rx="2" />
                    <path d="M16 68 Q50 80 84 68 L84 64 L16 64 Z" />
                  </svg>
                </div>
                <div className="cap">
                  <div className="c">YOUR IDEA</div>
                  <div className="subh">Crazy idea!</div>
                </div>
              </div>
              <svg className="arrow" viewBox="0 0 24 24">
                <use href="#myp-arrow" />
              </svg>
            </div>
            {/* sketch */}
            <div className="step">
              <div className="polaroid r2">
                <span className="tape tr" />
                <div className="pic">
                  <svg viewBox="0 0 100 84" fill="none" stroke="#2a2a2a" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: "84%" }}>
                    <path d="M14 42 Q50 6 86 42 Z" fill="#f0e2c8" />
                    <circle cx="40" cy="26" r="1.3" fill="#2a2a2a" />
                    <circle cx="56" cy="22" r="1.3" fill="#2a2a2a" />
                    <circle cx="68" cy="30" r="1.3" fill="#2a2a2a" />
                    <path d="M12 46 Q50 58 88 46 L88 42 L12 42 Z" fill="#5aa84f" />
                    <rect x="14" y="50" width="72" height="10" rx="3" fill="#8a4a2a" />
                    <path d="M14 62 Q50 76 86 62 L86 58 L14 58 Z" fill="#f0e2c8" />
                  </svg>
                </div>
                <div className="cap">
                  <div className="c">OUR SKETCH</div>
                </div>
              </div>
              <svg className="arrow" viewBox="0 0 24 24">
                <use href="#myp-arrow" />
              </svg>
            </div>
            {/* design */}
            <div className="step">
              <div className="polaroid r3">
                <span className="tape tl" />
                <div className="pic" style={{ flexDirection: "column", gap: 2 }}>
                  <svg viewBox="0 0 100 60" style={{ width: "70%" }}>
                    <path d="M14 30 Q50 4 86 30 Z" fill="#e6a23c" />
                    <path d="M10 34 Q50 46 90 34 L90 30 L10 30 Z" fill="#5aa84f" />
                    <rect x="12" y="38" width="76" height="9" rx="3" fill="#7a3f22" />
                    <path d="M12 49 Q50 62 88 49 L88 45 L12 45 Z" fill="#e6a23c" />
                  </svg>
                  <div style={{ fontFamily: "var(--heavy)", textTransform: "uppercase", fontSize: 12, lineHeight: 0.9, textAlign: "center" }}>
                    Burger
                    <br />
                    Spot
                    <div style={{ fontFamily: "var(--marker)", fontSize: 5, letterSpacing: 1 }}>EST. 2025</div>
                  </div>
                </div>
                <div className="cap">
                  <div className="c">OUR DESIGN</div>
                </div>
              </div>
              <svg className="arrow" viewBox="0 0 24 24">
                <use href="#myp-arrow" />
              </svg>
            </div>
            {/* merch */}
            <div className="step">
              <div className="polaroid r4">
                <span className="tape tr" />
                <div className="pic" style={{ background: "#f6f3ec" }}>
                  <svg viewBox="0 0 120 120" style={{ width: "92%" }}>
                    <path d="M42 14 L28 22 L12 36 L24 52 L36 44 L36 112 L84 112 L84 44 L96 52 L108 36 L92 22 L78 14 Q60 28 42 14 Z" fill="#141414" />
                    <g transform="translate(42,42)">
                      <path d="M4 14 Q18 2 32 14 Z" fill="#e6a23c" />
                      <path d="M2 17 Q18 25 34 17 L34 14 L2 14 Z" fill="#5aa84f" />
                      <rect x="3" y="20" width="30" height="5" rx="2" fill="#7a3f22" />
                      <path d="M2 27 Q18 33 34 27 L34 24 L2 24 Z" fill="#e6a23c" />
                    </g>
                    <text x="60" y="86" fill="#fff" fontFamily="Anton" fontSize="9" textAnchor="middle">BURGER SPOT</text>
                  </svg>
                </div>
                <div className="cap">
                  <div className="c">YOUR MERCH</div>
                </div>
              </div>
              <svg className="arrow" viewBox="0 0 24 24">
                <use href="#myp-arrow" />
              </svg>
            </div>
            {/* store */}
            <div className="step">
              <div className="polaroid r5">
                <span className="tape tl" />
                <div className="pic" style={{ background: "#1b1b1b", padding: 6 }}>
                  <svg viewBox="0 0 120 100" style={{ width: "100%" }}>
                    <rect x="4" y="4" width="112" height="92" rx="4" fill="#222" />
                    <rect x="4" y="4" width="112" height="14" rx="4" fill="#333" />
                    <circle cx="12" cy="11" r="2" fill="#e05" />
                    <circle cx="20" cy="11" r="2" fill="#fb3" />
                    <circle cx="28" cy="11" r="2" fill="#4c4" />
                    <rect x="12" y="26" width="28" height="34" rx="2" fill="#0d0d0d" />
                    <rect x="46" y="26" width="28" height="34" rx="2" fill="#0d0d0d" />
                    <rect x="80" y="26" width="28" height="34" rx="2" fill="#0d0d0d" />
                    <rect x="12" y="66" width="96" height="6" rx="3" fill="#ec1e79" />
                    <rect x="12" y="78" width="60" height="5" rx="2.5" fill="#444" />
                  </svg>
                </div>
                <div className="cap">
                  <div className="c">YOUR STORE</div>
                  <div className="sub">LIVE &amp; PRINTING</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Collections() {
  const cols = [
    { c: "c1", title: "CEO", accent: "ENERGY", tc: "#fff", ac: "#ffd21e" },
    { c: "c2", title: "ADHD", accent: "CLUB", tc: "#fff", ac: "#8affff" },
    { c: "c3", title: "WOMAN", accent: "BUILT", tc: "#fff", ac: "#c99bff" },
    { c: "c4", title: "POOLSIDE", accent: "CEO", tc: "#fff", ac: "#ffd21e" },
    { c: "c5", title: "YOUTH", accent: "DROP", tc: "#fff", ac: "#ffd21e" },
  ];
  return (
    <section className="section">
      <div className="colhead">
        <h2 className="rough">
          COLLECTIONS THAT <span className="cy">HIT DIFFERENT.</span>
        </h2>
        <svg viewBox="0 0 96 64" style={{ position: "absolute", left: "44%", top: "2px", width: "60px", height: "34px" }} fill="none" stroke="#0d0d0d" strokeWidth={4} strokeLinecap="round">
          <path d="M6 20 C40 8 82 18 88 46" />
          <path d="M88 46 L76 38 M88 46 L94 30" />
        </svg>
        <a className="viewall" href="#">
          <span style={{ position: "relative" }}>VIEW ALL COLLECTIONS</span>
          <svg viewBox="0 0 24 24" style={{ position: "relative" }}>
            <use href="#myp-arrow" />
          </svg>
        </a>
      </div>
      <div className="colgrid">
        {cols.map((col) => (
          <div key={col.title} className={`col ${col.c}`}>
            <span className="tape" />
            <span className="brick" />
            <span className="fig" />
            <div className="lbl">
              <span className="t" style={{ color: col.tc }}>{col.title}</span>
              <span className="t" style={{ color: col.ac }}>{col.accent}</span>
            </div>
          </div>
        ))}
        <div className="col more">
          <span className="plus">+</span>
          <div className="txt">
            &amp; MORE
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

function Footer() {
  return (
    <footer>
      <div className="footrow">
        <a href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ec1e79" strokeWidth={2.2}>
            <path d="M4 6l4-3 4 3 4-3 4 3v4l-3 1v9H7v-9L4 10z" />
          </svg>
          <span>MERCH</span>
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="#17c3ce" strokeWidth={2.2}>
            <rect x="3" y="4" width="18" height="12" rx="1" />
            <path d="M8 20h8M12 16v4" />
          </svg>
          <span>WEBSITES</span>
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="#8b3ffb" strokeWidth={2.2}>
            <path d="M6 7h12l1 13H5z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span>STORE SETUP</span>
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="#17c3ce" strokeWidth={2.2}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
          </svg>
          <span>SYSTEMS</span>
        </a>
        <a href="#">
          <svg viewBox="0 0 64 48" style={{ width: 30 }}>
            <use href="#myp-crown" color="#ffd21e" />
          </svg>
          <span>BRANDING</span>
        </a>
        <a href="#">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ec1e79" strokeWidth={2.2}>
            <path d="M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z" />
          </svg>
          <span>SUPPORT</span>
        </a>
      </div>
    </footer>
  );
}
