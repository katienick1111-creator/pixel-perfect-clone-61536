import { useState } from "react";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import { Crown } from "./decor";

const NAV = ["HOME", "SHOP", "COLLECTIONS", "CREATE", "ABOUT", "PORTFOLIO", "CONTACT"];

/** Circular MYB brand mark, recreated in CSS. */
export function MybLogo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 50% 40%, #1b1b1b 0%, #0b0b0b 100%)",
        boxShadow: "0 0 0 4px #0d0d0d, 0 8px 20px rgba(0,0,0,0.45)",
      }}
    >
      <Crown
        className="absolute left-1/2 top-[6%] h-[22%] w-[34%] -translate-x-1/2"
        color="#ffd21e"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <div className="flex items-baseline" style={{ fontFamily: "var(--font-graffiti)", fontSize: size * 0.3 }}>
          <span style={{ color: "#ec1e79" }}>M</span>
          <span style={{ color: "#f3eee1" }}>Y</span>
          <span style={{ color: "#17c3ce" }}>B</span>
        </div>
        <div
          className="mt-0.5 text-white"
          style={{ fontFamily: "var(--font-marker)", fontSize: size * 0.098, letterSpacing: "0.04em" }}
        >
          MIND YA BIZ
        </div>
        <div
          className="mt-0.5 text-white/55"
          style={{ fontFamily: "var(--font-marker)", fontSize: size * 0.058, letterSpacing: "0.06em" }}
        >
          MERCH·MINDSET·HUSTLE
        </div>
      </div>
    </div>
  );
}

export function MybHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-40 bg-myb-ink text-white">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-2.5">
        {/* logo overlaps the bar */}
        <div className="relative">
          <div className="absolute -top-2 left-0 lg:-top-4">
            <MybLogo size={88} />
          </div>
          <div className="h-[72px] w-[88px]" aria-hidden />
        </div>

        {/* desktop nav */}
        <nav
          className="hidden items-center gap-5 lg:flex"
          style={{ fontFamily: "var(--font-graffiti)", letterSpacing: "0.04em" }}
        >
          {NAV.map((item) => (
            <a
              key={item}
              href="#"
              className={`relative text-[19px] transition hover:text-myb-yellow ${
                item === "HOME" ? "text-myb-yellow" : "text-white/90"
              }`}
            >
              {item}
              {item === "HOME" && (
                <span className="absolute -bottom-1 left-0 h-1 w-full rounded bg-myb-yellow" />
              )}
            </a>
          ))}
        </nav>

        {/* actions */}
        <div className="flex items-center gap-3">
          <button className="hidden text-white/90 transition hover:text-myb-cyan sm:block" aria-label="Account">
            <User className="h-6 w-6" strokeWidth={2.25} />
          </button>
          <button className="relative text-white/90 transition hover:text-myb-yellow" aria-label="Cart">
            <ShoppingCart className="h-6 w-6" strokeWidth={2.25} />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-myb-pink text-[11px] font-bold text-white">
              2
            </span>
          </button>
          <button
            className="lg:hidden text-white"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* mobile nav drawer */}
      {open && (
        <nav
          className="border-t border-white/10 bg-myb-ink px-4 pb-4 pt-2 lg:hidden"
          style={{ fontFamily: "var(--font-graffiti)", letterSpacing: "0.04em" }}
        >
          {NAV.map((item) => (
            <a
              key={item}
              href="#"
              className={`block py-2 text-2xl ${item === "HOME" ? "text-myb-yellow" : "text-white/90"}`}
            >
              {item}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
