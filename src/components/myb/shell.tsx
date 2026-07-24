import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Shared Mind Ya Biz chrome (graffiti/street style). Pure CSS/SVG.
 * All visual rules live scoped under `.myp` in src/styles.css.
 */

const NAV: { label: string; to?: string }[] = [
  { label: "HOME", to: "/" },
  { label: "SHOP" },
  { label: "COLLECTIONS" },
  { label: "CREATE", to: "/create" },
  { label: "ABOUT" },
  { label: "PORTFOLIO" },
  { label: "CONTACT" },
];

/** SVG filter + symbol library used across MYB pages. */
export function MybDefs() {
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
        {/* realistic product render gradients (used on the Create page) */}
        <linearGradient id="myp-gm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#c2c2c2" />
        </linearGradient>
        <linearGradient id="myp-gd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8d8d8" />
          <stop offset="1" stopColor="#a2a2a2" />
        </linearGradient>
        <linearGradient id="myp-gmetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f9296" />
          <stop offset="0.28" stopColor="#eef1f3" />
          <stop offset="0.5" stopColor="#b9bcc0" />
          <stop offset="0.75" stopColor="#e6e9ec" />
          <stop offset="1" stopColor="#7e8185" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MybGrunge() {
  return (
    <div className="grunge">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <span key={n} className={`splat sp${n}`} />
      ))}
    </div>
  );
}

export function MybHeader({ active }: { active?: string }) {
  return (
    <header>
      <div className="navbar">
        <div className="headrow">
          <Link to="/" className="logo">
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
          </Link>
          <nav className="desk">
            {NAV.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} className={item.label === active ? "active" : undefined}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href="#" className={item.label === active ? "active" : undefined}>
                  {item.label}
                </a>
              ),
            )}
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

export function MybFooter() {
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

/** Full page frame: grunge bg + defs + header + content + footer.
 *  variant="dark" flips the page to the blacked-out neon theme. */
export function MybPage({
  active,
  variant,
  children,
}: {
  active?: string;
  variant?: "dark";
  children: ReactNode;
}) {
  return (
    <div className={variant === "dark" ? "myp myp-dark" : "myp"}>
      <MybDefs />
      <MybGrunge />
      <MybHeader active={active} />
      {children}
      <MybFooter />
    </div>
  );
}
