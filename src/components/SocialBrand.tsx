import type { VendorSocials } from "@/hooks/useVendorProfile";

export type SocialKey = keyof VendorSocials;

export const socialMeta: Record<
  SocialKey,
  { label: string; placeholder: string; prefix: string; color: string }
> = {
  instagram: { label: "Instagram", placeholder: "yourhandle", prefix: "@", color: "#E1306C" },
  tiktok:    { label: "TikTok",    placeholder: "yourhandle", prefix: "@", color: "#000000" },
  facebook:  { label: "Facebook",  placeholder: "yourpage",   prefix: "/", color: "#1877F2" },
  x:         { label: "X",         placeholder: "yourhandle", prefix: "@", color: "#000000" },
  youtube:   { label: "YouTube",   placeholder: "@yourchan",  prefix: "",  color: "#FF0000" },
  website:   { label: "Website",   placeholder: "yoursite.com", prefix: "", color: "#0A7674" },
};

export function socialUrl(key: SocialKey, handle: string): string {
  const h = handle.trim().replace(/^@+/, "");
  if (!h) return "#";
  switch (key) {
    case "instagram": return `https://instagram.com/${h}`;
    case "tiktok":    return `https://tiktok.com/@${h}`;
    case "facebook":  return `https://facebook.com/${h.replace(/^\//, "")}`;
    case "x":         return `https://x.com/${h}`;
    case "youtube":   return `https://youtube.com/${h.startsWith("@") ? h : "@" + h}`;
    case "website":   return /^https?:\/\//i.test(handle) ? handle : `https://${h}`;
  }
}

export function SocialBrand({ brand, size = 18 }: { brand: SocialKey; size?: number }) {
  const s = size;
  switch (brand) {
    case "instagram":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <defs>
            <radialGradient id="igG" cx="0.3" cy="1.1" r="1.2">
              <stop offset="0" stopColor="#FEDA77" />
              <stop offset="0.35" stopColor="#F58529" />
              <stop offset="0.6" stopColor="#DD2A7B" />
              <stop offset="0.85" stopColor="#8134AF" />
              <stop offset="1" stopColor="#515BD4" />
            </radialGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#igG)" />
          <rect x="5.75" y="5.75" width="12.5" height="12.5" rx="4" fill="none" stroke="#fff" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
          <circle cx="17" cy="7" r="1.05" fill="#fff" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <path d="M14 3h2.6c.2 1.7 1.1 3.1 2.9 3.6.5.1 1 .2 1.5.2v2.7c-1.6 0-3.1-.4-4.4-1.2v6.4a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.2-.9-.2a2.7 2.7 0 1 0 2.7 2.7V3z" fill="#000" />
          <path d="M14.6 3.6h2c.3 1.5 1.2 2.6 2.6 3.1v.7c-1.5-.2-2.9-.9-4-2v6.5a4.7 4.7 0 1 1-4.7-4.7v.7a4 4 0 1 0 4 4V3.6z" fill="#25F4EE" opacity=".85" transform="translate(-.6 -.4)" />
          <path d="M14.6 3.6h2c.3 1.5 1.2 2.6 2.6 3.1v.7c-1.5-.2-2.9-.9-4-2v6.5a4.7 4.7 0 1 1-4.7-4.7v.7a4 4 0 1 0 4 4V3.6z" fill="#FE2C55" opacity=".85" transform="translate(.6 .4)" />
          <path d="M14 3h2.6c.2 1.7 1.1 3.1 2.9 3.6.5.1 1 .2 1.5.2v2.7c-1.6 0-3.1-.4-4.4-1.2v6.4a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.2-.9-.2a2.7 2.7 0 1 0 2.7 2.7V3z" fill="#fff" opacity=".0" />
        </svg>
      );
    case "facebook":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#1877F2" />
          <path d="M13.5 21.9V14h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.5-1.5H17V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H8v3h2.6v7.9c.5.1 1 .1 1.5.1s.9 0 1.4-.1z" fill="#fff" />
        </svg>
      );
    case "x":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#000" />
          <path d="M16.4 5h2.3l-5 5.7L20 19h-4.6l-3.6-4.7L7.6 19H5.3l5.4-6.1L5 5h4.7l3.2 4.3L16.4 5zm-.8 12.5h1.3L8.5 6.4H7.1l8.5 11.1z" fill="#fff" />
        </svg>
      );
    case "youtube":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
          <path d="M10 9v6l5-3-5-3z" fill="#fff" />
        </svg>
      );
    case "website":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9.5" fill="#0A7674" />
          <path d="M12 2.5c2.5 2.5 4 5.8 4 9.5s-1.5 7-4 9.5C9.5 19 8 15.7 8 12s1.5-7 4-9.5z" fill="none" stroke="#fff" strokeWidth="1.4" />
          <path d="M2.5 12h19M4 7.5h16M4 16.5h16" stroke="#fff" strokeWidth="1.4" />
        </svg>
      );
  }
}
