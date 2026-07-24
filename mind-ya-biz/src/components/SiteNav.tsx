"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS: { label: string; href: string }[] = [
  { label: "Shop", href: "/storefronts" },
  { label: "Storefronts", href: "/storefronts" },
  { label: "Rewards", href: "#" },
  { label: "Wear It Forward", href: "#" },
  { label: "Challenges", href: "#" },
  { label: "Events", href: "#" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Mind Ya Biz home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-cream pop-hover pop">
        <span className="font-display text-lg leading-none">
          <span className="text-pink">M</span>
          <span className="text-cream">Y</span>
          <span className="text-teal">B</span>
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-lg tracking-wide">MIND YA BIZ</span>
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
            Merch · Mindset · Hustle
          </span>
        </span>
      )}
    </Link>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-ink transition hover:bg-ink hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="hidden rounded-full border-2 border-ink px-4 py-2 text-sm font-extrabold transition hover:bg-ink hover:text-cream sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/#create-store"
            className="hidden rounded-full bg-purple px-4 py-2 text-sm font-extrabold text-white pop pop-hover md:inline-flex"
          >
            Create Your Store
          </Link>
          <button
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white pop-hover"
          >
            <span aria-hidden>🛒</span>
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink text-[11px] font-extrabold text-white">
              2
            </span>
          </button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-white lg:hidden"
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t-2 border-ink bg-cream px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-bold hover:bg-ink hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="#" className="flex-1 rounded-full border-2 border-ink px-4 py-2.5 text-center text-sm font-extrabold">
                Sign In
              </Link>
              <Link href="/#create-store" className="flex-1 rounded-full bg-purple px-4 py-2.5 text-center text-sm font-extrabold text-white pop">
                Create Your Store
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
