import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "trovin:passport:v1";
const EVENT = "trovin:passport:changed";

export const POINTS = {
  check_in: 10,
  social_share: 15,
  review: 20,
  purchase: 25,
} as const;

export type Tier = "free" | "starter" | "plus" | "pro";
export type PassportAction = keyof typeof POINTS | "redeem";

export type LedgerEntry = {
  id: string;
  action: PassportAction;
  points: number; // + earned, - spent
  vendorId: string | null;
  vendorName?: string | null;
  timestamp: number;
};

export type CheckIn = {
  id: string;
  customerId: string;
  vendorId: string;
  vendorName: string;
  timestamp: number;
};

export type Reward = {
  id: string;
  name: string;
  pointsCost: number;
  type: "merch" | "visa";
  imageUrl?: string;
};

export type Redemption = {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  status: "requested" | "fulfilled";
  timestamp: number;
};

export type PassportMe = {
  id: string;
  role: "customer" | "vendor";
  name: string;
  personalQrToken: string;
};

export type PassportVendor = {
  id: string;
  name: string;
  tier: Tier;
  isLive: boolean;
  placeName: string;
  endTime: string; // HH:MM
};

export type PassportState = {
  me: PassportMe;
  vendor: PassportVendor;
  ledger: LedgerEntry[];
  checkIns: CheckIn[];
  rewards: Reward[];
  redemptions: Redemption[];
};

const seedRewards: Reward[] = [
  { id: "r-sticker", name: "Trovin' Sticker Pack", pointsCost: 100, type: "merch" },
  { id: "r-coffee", name: "Coffee Credit ($2.50)", pointsCost: 250, type: "merch" },
  { id: "r-tote", name: "Trovin' Canvas Tote", pointsCost: 350, type: "merch" },
  { id: "r-visa5", name: "$5 Visa Gift Card", pointsCost: 500, type: "visa" },
  { id: "r-visa10", name: "$10 Visa Gift Card", pointsCost: 1000, type: "visa" },
];

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function defaultState(): PassportState {
  return {
    me: {
      id: uid(),
      role: "customer",
      name: "You",
      personalQrToken: uid(),
    },
    vendor: {
      id: "me-vendor",
      name: "Your Booth",
      tier: "free",
      isLive: false,
      placeName: "",
      endTime: "17:00",
    },
    ledger: [],
    checkIns: [],
    rewards: seedRewards,
    redemptions: [],
  };
}

function read(): PassportState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const d = defaultState();
    return {
      ...d,
      ...parsed,
      me: { ...d.me, ...(parsed.me ?? {}) },
      vendor: { ...d.vendor, ...(parsed.vendor ?? {}) },
      rewards: parsed.rewards?.length ? parsed.rewards : d.rewards,
      ledger: parsed.ledger ?? [],
      checkIns: parsed.checkIns ?? [],
      redemptions: parsed.redemptions ?? [],
    };
  } catch {
    return defaultState();
  }
}

function write(state: PassportState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(EVENT));
}

const tierActions: Record<Tier, Array<keyof typeof POINTS>> = {
  free: ["check_in"],
  starter: ["check_in"],
  plus: ["check_in", "social_share", "review"],
  pro: ["check_in", "social_share", "review", "purchase"],
};

export function isActionActive(tier: Tier, action: keyof typeof POINTS) {
  return tierActions[tier].includes(action);
}

export function balanceOf(ledger: LedgerEntry[]) {
  return ledger.reduce((acc, e) => acc + e.points, 0);
}

const sameDay = (a: number, b: number) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
};

export function usePassport() {
  const [state, setState] = useState<PassportState>(defaultState);

  useEffect(() => {
    setState(read());
    const onChange = () => setState(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const mutate = useCallback((updater: (s: PassportState) => PassportState) => {
    setState((prev) => {
      const next = updater(prev);
      try { write(next); } catch { /* noop */ }
      return next;
    });
  }, []);

  const balance = balanceOf(state.ledger);

  // TODO(backend): move to server fn — enforce server-side
  const scanCustomer = useCallback((token: string): { ok: boolean; awarded: number; message: string; duplicate?: boolean } => {
    const cur = read();
    if (token.trim() !== cur.me.personalQrToken) {
      return { ok: false, awarded: 0, message: "Token not recognized. Have the customer open My QR." };
    }
    const today = Date.now();
    const already = cur.checkIns.some(
      (c) => c.customerId === cur.me.id && c.vendorId === cur.vendor.id && sameDay(c.timestamp, today)
    );
    if (already) {
      return { ok: true, awarded: 0, duplicate: true, message: "Already checked in here today — no extra points." };
    }
    const checkIn: CheckIn = {
      id: uid(),
      customerId: cur.me.id,
      vendorId: cur.vendor.id,
      vendorName: cur.vendor.name,
      timestamp: today,
    };
    const entry: LedgerEntry = {
      id: uid(),
      action: "check_in",
      points: POINTS.check_in,
      vendorId: cur.vendor.id,
      vendorName: cur.vendor.name,
      timestamp: today,
    };
    const next = { ...cur, checkIns: [checkIn, ...cur.checkIns], ledger: [entry, ...cur.ledger] };
    write(next);
    setState(next);
    return { ok: true, awarded: POINTS.check_in, message: `+${POINTS.check_in} points — checked in!` };
  }, []);

  // TODO(backend): move to server fn
  const awardExtra = useCallback((action: keyof typeof POINTS): { ok: boolean; awarded: number; message: string } => {
    const cur = read();
    if (!isActionActive(cur.vendor.tier, action)) {
      return { ok: false, awarded: 0, message: "This action isn't available on your tier." };
    }
    if (action === "review") {
      // Reviews queue for moderation — no points yet
      return { ok: true, awarded: 0, message: "Review submitted for approval." };
    }
    const entry: LedgerEntry = {
      id: uid(),
      action,
      points: POINTS[action],
      vendorId: cur.vendor.id,
      vendorName: cur.vendor.name,
      timestamp: Date.now(),
    };
    const next = { ...cur, ledger: [entry, ...cur.ledger] };
    write(next);
    setState(next);
    return { ok: true, awarded: POINTS[action], message: `+${POINTS[action]} points awarded!` };
  }, []);

  // TODO(backend): move to server fn
  const redeem = useCallback((rewardId: string): { ok: boolean; message: string } => {
    const cur = read();
    const reward = cur.rewards.find((r) => r.id === rewardId);
    if (!reward) return { ok: false, message: "Reward not found." };
    const bal = balanceOf(cur.ledger);
    if (bal < reward.pointsCost) return { ok: false, message: "Not enough points yet." };
    const entry: LedgerEntry = {
      id: uid(),
      action: "redeem",
      points: -reward.pointsCost,
      vendorId: null,
      vendorName: reward.name,
      timestamp: Date.now(),
    };
    const redemption: Redemption = {
      id: uid(),
      rewardId: reward.id,
      rewardName: reward.name,
      pointsSpent: reward.pointsCost,
      status: "requested",
      timestamp: Date.now(),
    };
    const next = { ...cur, ledger: [entry, ...cur.ledger], redemptions: [redemption, ...cur.redemptions] };
    write(next);
    setState(next);
    return { ok: true, message: `Redemption requested — ${reward.name}.` };
  }, []);

  const setVendor = useCallback((patch: Partial<PassportVendor>) => {
    mutate((s) => ({ ...s, vendor: { ...s.vendor, ...patch } }));
  }, [mutate]);

  const setRewards = useCallback((rewards: Reward[]) => {
    mutate((s) => ({ ...s, rewards }));
  }, [mutate]);

  const resetDemo = useCallback(() => {
    const fresh = defaultState();
    write(fresh);
    setState(fresh);
  }, []);

  return {
    state, balance, mutate, scanCustomer, awardExtra, redeem,
    setVendor, setRewards, resetDemo, isActionActive,
  };
}

export const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  starter: "Starter · $29/mo",
  plus: "Plus · $59/mo",
  pro: "Pro · $99/mo",
};

export const ACTION_LABEL: Record<PassportAction, string> = {
  check_in: "Check-in",
  social_share: "Social share",
  review: "Review",
  purchase: "Purchase",
  redeem: "Redemption",
};
