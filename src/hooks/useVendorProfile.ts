import { useEffect, useState } from "react";
import imgCraft from "@/assets/vendor-craft.jpg";
import type { Vendor, Category, Payment } from "@/data/trovin";

const STORAGE_KEY = "trovin:vendor-profile:v1";
const EVENT = "trovin:vendor-profile:changed";

export type VendorProfile = Vendor & {
  openToday: boolean;
  note: string;
};

export const defaultVendorProfile: VendorProfile = {
  id: "me",
  name: "Your Booth",
  tagline: "Tell shoppers what makes you special.",
  category: "Craft",
  event: "Randolph Street Market",
  booth: "Booth ___",
  hours: "10a – 5p today",
  payments: ["Card", "Cash", "Venmo"],
  followers: 0,
  featured: false,
  image: imgCraft,
  scribble: "say hi!",
  tilt: -1,
  openToday: true,
  note: "Fresh drops at 11 — come thru!",
};

function read(): VendorProfile {
  if (typeof window === "undefined") return defaultVendorProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultVendorProfile;
    return { ...defaultVendorProfile, ...JSON.parse(raw) };
  } catch {
    return defaultVendorProfile;
  }
}

export function useVendorProfile() {
  const [profile, setProfile] = useState<VendorProfile>(defaultVendorProfile);

  useEffect(() => {
    setProfile(read());
    const onChange = () => setProfile(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const update = (patch: Partial<VendorProfile>) => {
    setProfile((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  return { profile, update };
}

export type { Category, Payment };
