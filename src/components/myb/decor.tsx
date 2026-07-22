/**
 * Mind Ya Biz — hand-drawn / graffiti decoration primitives.
 * Everything here is pure CSS/SVG (no image assets) so the collage look
 * from the mockup is fully recreated in code.
 */
import type { CSSProperties, ReactNode } from "react";

/* ---------- little doodles ---------- */

export function Crown({
  className = "",
  color = "#8b3ffb",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 64 48" className={className} style={style} fill="none" aria-hidden>
      <path
        d="M6 42 L4 14 L20 28 L32 6 L44 28 L60 14 L58 42 Z"
        fill={color}
        stroke="#0d0d0d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="12" r="3.5" fill={color} stroke="#0d0d0d" strokeWidth="2.5" />
      <circle cx="32" cy="4" r="3.5" fill={color} stroke="#0d0d0d" strokeWidth="2.5" />
      <circle cx="60" cy="12" r="3.5" fill={color} stroke="#0d0d0d" strokeWidth="2.5" />
    </svg>
  );
}

export function Smiley({
  className = "",
  color = "#0d0d0d",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} fill="none" aria-hidden>
      <circle cx="32" cy="32" r="27" stroke={color} strokeWidth="4" />
      <path d="M22 24 l7 7 M29 24 l-7 7" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M35 24 l7 7 M42 24 l-7 7" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M20 40 Q32 52 44 40" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function StarBurst({
  className = "",
  color = "#17c3ce",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} fill="none" aria-hidden>
      <path
        d="M24 2 L29 18 L46 18 L32 28 L37 45 L24 34 L11 45 L16 28 L2 18 L19 18 Z"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand-drawn curved arrow. Rotate/scale via className. */
export function DoodleArrow({
  className = "",
  color = "#0d0d0d",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 96 64" className={className} style={style} fill="none" aria-hidden>
      <path
        d="M6 12 C40 4 78 16 84 44"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M84 44 L72 34 M84 44 L90 28"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- sticky note ---------- */

export function StickyNote({
  children,
  color = "#ffd21e",
  rotate = -3,
  taped = true,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  rotate?: number;
  taped?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative ${taped ? "myb-tape" : ""} ${className}`}
      style={{
        background: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "3px 5px 0 rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </div>
  );
}

/* ---------- neon MIND YA BIZ sign ---------- */

export function NeonSign({ className = "" }: { className?: string }) {
  return (
    <div
      className={`myb-flicker relative flex aspect-square items-center justify-center rounded-full ${className}`}
      style={{
        background: "radial-gradient(circle at 50% 40%, #241033 0%, #120a1c 70%, #0a0710 100%)",
        boxShadow:
          "0 0 0 4px rgba(255,255,255,0.03), inset 0 0 60px rgba(0,0,0,0.6), 0 12px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* glowing rings */}
      <span
        className="absolute inset-[6%] rounded-full"
        style={{ boxShadow: "0 0 6px #ff2fa0, 0 0 16px #ff2fa0", border: "3px solid #ff2fa0" }}
      />
      <span
        className="absolute inset-[15%] rounded-full"
        style={{ boxShadow: "0 0 6px #23e0e8, 0 0 16px #23e0e8", border: "2px solid #23e0e8" }}
      />
      {/* text stack */}
      <div className="relative z-10 text-center leading-[0.82]" style={{ fontFamily: "var(--font-graffiti)" }}>
        <div className="myb-neon text-[13cqw] tracking-wide" style={{ ["--neon" as string]: "#ff2fa0" }}>
          MIND
        </div>
        <div className="myb-neon text-[15cqw] tracking-wide" style={{ ["--neon" as string]: "#ffe14d", color: "#fff" }}>
          YA
        </div>
        <div className="myb-neon text-[13cqw] tracking-wide" style={{ ["--neon" as string]: "#23e0e8" }}>
          BIZ
        </div>
      </div>
      <div
        className="myb-neon absolute bottom-[14%] left-0 right-0 text-center text-[4.4cqw] tracking-[0.12em]"
        style={{ fontFamily: "var(--font-marker)", ["--neon" as string]: "#23e0e8" }}
      >
        MERCH · MINDSET · HUSTLE
      </div>
    </div>
  );
}

/* ---------- garment mockups (tee / hoodie / tote) ---------- */

type GarmentKind = "tee" | "hoodie" | "tote";

export function Garment({
  kind,
  color,
  label,
  labelColor = "#17c3ce",
  className = "",
}: {
  kind: GarmentKind;
  color: string;
  label: ReactNode;
  labelColor?: string;
  className?: string;
}) {
  const stroke = "#0d0d0d";
  return (
    <div className={`relative ${className}`}>
      {/* clothespin */}
      <span className="absolute left-1/2 top-0 z-10 h-4 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#caa96a] shadow" />
      <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-[3px_6px_0_rgba(0,0,0,0.14)]" fill="none">
        {kind === "tee" && (
          <path
            d="M40 12 L28 20 L8 34 L20 52 L32 44 L32 128 L88 128 L88 44 L100 52 L112 34 L92 20 L80 12 Q60 26 40 12 Z"
            fill={color}
            stroke={stroke}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )}
        {kind === "hoodie" && (
          <>
            <path
              d="M42 16 L24 24 L6 40 L18 58 L30 50 L30 130 L90 130 L90 50 L102 58 L114 40 L96 24 L78 16 Q60 34 42 16 Z"
              fill={color}
              stroke={stroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M42 16 Q60 40 78 16 Q60 30 42 16 Z" fill={color} stroke={stroke} strokeWidth="3" />
            <path d="M54 40 L54 70 M66 40 L66 70" stroke={stroke} strokeWidth="2.5" />
          </>
        )}
        {kind === "tote" && (
          <>
            <rect x="24" y="40" width="72" height="90" rx="4" fill={color} stroke={stroke} strokeWidth="3" />
            <path d="M40 40 Q40 12 60 12 Q80 12 80 40" fill="none" stroke={stroke} strokeWidth="3" />
          </>
        )}
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center leading-[0.85]"
        style={{ fontFamily: "var(--font-graffiti)", color: labelColor }}
      >
        {label}
      </div>
    </div>
  );
}

/* ---------- brush highlight word ---------- */

export function Hi({
  children,
  color = "#ec1e79",
}: {
  children: ReactNode;
  color?: string;
}) {
  return <span style={{ color }}>{children}</span>;
}
