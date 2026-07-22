import { Shirt, Monitor, ShoppingBag, Settings, Crown, Heart } from "lucide-react";

const ITEMS = [
  { icon: Shirt, label: "MERCH", color: "#ec1e79" },
  { icon: Monitor, label: "WEBSITES", color: "#17c3ce" },
  { icon: ShoppingBag, label: "STORE SETUP", color: "#8b3ffb" },
  { icon: Settings, label: "SYSTEMS", color: "#17c3ce" },
  { icon: Crown, label: "BRANDING", color: "#ffd21e" },
  { icon: Heart, label: "SUPPORT", color: "#ec1e79" },
];

export function MybFooter() {
  return (
    <footer className="relative bg-myb-ink text-white">
      {/* spray specks */}
      <span
        className="myb-spray pointer-events-none absolute left-6 top-3 h-16 w-16 opacity-70"
        style={{ ["--spray" as string]: "#ec1e79" }}
      />
      <span
        className="myb-spray pointer-events-none absolute right-8 bottom-2 h-14 w-14 opacity-70"
        style={{ ["--spray" as string]: "#ffd21e" }}
      />
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-5 sm:justify-between">
        {ITEMS.map(({ icon: Icon, label, color }) => (
          <a
            key={label}
            href="#"
            className="group flex items-center gap-2 transition hover:-translate-y-0.5"
          >
            <Icon className="h-6 w-6" strokeWidth={2.25} style={{ color }} />
            <span
              className="text-[15px] tracking-wide text-white/90 group-hover:text-white"
              style={{ fontFamily: "var(--font-graffiti)" }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </footer>
  );
}
