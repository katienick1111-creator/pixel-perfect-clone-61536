import Link from "next/link";

const COLS: { title: string; links: string[] }[] = [
  { title: "Shop", links: ["All Storefronts", "New Drops", "Interactive Merch", "Gift Cards"] },
  { title: "The Movement", links: ["How Rewards Work", "Loyalty Tiers", "Challenges", "Refer a Friend"] },
  { title: "Wear It Forward", links: ["QR & NFC Merch", "Become an Ambassador", "Register a Product", "Scan a Tag"] },
  { title: "Business", links: ["Create Your Store", "Pricing", "Business Login", "Contact Sales"] },
];

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t-[3px] border-ink bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream">
                <span className="font-display text-lg">
                  <span className="text-pink">M</span>
                  <span className="text-ink">Y</span>
                  <span className="text-teal">B</span>
                </span>
              </span>
              <span className="font-display text-2xl">MIND YA BIZ</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-cream/75">
              Custom merch storefronts for small businesses — with rewards, referrals, and
              interactive QR + NFC merch that turns every share into something you earn from.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["More than merch. It's a movement.", "Shop small. Earn big."].map((t) => (
                <span key={t} className="rounded-full bg-cream/10 px-3 py-1 text-xs font-bold text-cream/80">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm tracking-wide text-yellow">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-cream/75 transition hover:text-cream">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Mind Ya Biz. Built with the community.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="#" className="hover:text-cream">Privacy</Link>
            <Link href="#" className="hover:text-cream">Terms</Link>
            <Link href="#" className="hover:text-cream">Accessibility</Link>
            <Link href="#" className="hover:text-cream">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
