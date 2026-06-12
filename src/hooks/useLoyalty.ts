import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "trovin:loyalty:v1";
const EVENT = "trovin:loyalty:changed";

export const BYTES = {
  check_in: 10,
  social_share: 15,
  review: 20,
  purchase: 25,
} as const;

export type Tier = "free" | "starter" | "plus" | "pro";
export type LoyaltyAction = keyof typeof BYTES | "redeem";

export type LedgerEntry = {
  id: string;
  action: LoyaltyAction;
  bytes: number; // + earned, - spent
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
  bytesCost: number;
  type: "merch" | "visa";
  imageUrl?: string;
};

export type Redemption = {
  id: string;
  rewardId: string;
  rewardName: string;
  bytesSpent: number;
  status: "requested" | "fulfilled";
  timestamp: number;
};

export type LoyaltyMe = {
  id: string;
  role: "customer" | "vendor";
  name: string;
  personalQrToken: string;
};

export type LoyaltyVendor = {
  id: string;
  name: string;
  tier: Tier;
  isLive: boolean;
  placeName: string;
  endTime: string; // HH:MM
};

export type LoyaltyState = {
  me: LoyaltyMe;
  vendor: LoyaltyVendor;
  ledger: LedgerEntry[];
  checkIns: CheckIn[];
  rewards: Reward[];
  redemptions: Redemption[];
};

const seedRewards: Reward[] = [
  { id: "r-sticker", name: "Trovin' Sticker Pack", bytesCost: 100, type: "merch" },
  { id: "r-coffee", name: "Coffee Credit ($2.50)", bytesCost: 250, type: "merch" },
  { id: "r-tote", name: "Trovin' Canvas Tote", bytesCost: 350, type: "merch" },
  { id: "r-visa5", name: "$5 Visa Gift Card", bytesCost: 500, type: "visa" },
  { id: "r-visa10", name: "$10 Visa Gift Card", bytesCost: 1000, type: "visa" },
];

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function defaultState(): LoyaltyState {
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

function read(): LoyaltyState {
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

function write(state: LoyaltyState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(EVENT));
}

const tierActions: Record<Tier, Array<keyof typeof BYTES>> = {
  free: ["check_in"],
  starter: ["check_in"],
  plus: ["check_in", "social_share", "review"],
  pro: ["check_in", "social_share", "review", "purchase"],
};

export function isActionActive(tier: Tier, action: keyof typeof BYTES) {
  return tierActions[tier].includes(action);
}

export function balanceOf(ledger: LedgerEntry[]) {
  return ledger.reduce((acc, e) => acc + e.bytes, 0);
}

const sameDay = (a: number, b: number) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
};

export function useLoyalty() {
  const [state, setState] = useState<LoyaltyState>(defaultState);

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

  const mutate = useCallback((updater: (s: LoyaltyState) => LoyaltyState) => {
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
      return { ok: true, awarded: 0, duplicate: true, message: "Already checked in here today — no extra Bytes." };
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
      bytes: BYTES.check_in,
      vendorId: cur.vendor.id,
      vendorName: cur.vendor.name,
      timestamp: today,
    };
    const next = { ...cur, checkIns: [checkIn, ...cur.checkIns], ledger: [entry, ...cur.ledger] };
    write(next);
    setState(next);
    return { ok: true, awarded: BYTES.check_in, message: `+${BYTES.check_in} Bytes — checked in!` };
  }, []);

  // TODO(backend): move to server fn
  const awardExtra = useCallback((action: keyof typeof BYTES): { ok: boolean; awarded: number; message: string } => {
    const cur = read();
    if (!isActionActive(cur.vendor.tier, action)) {
      return { ok: false, awarded: 0, message: "This action isn't available on your tier." };
    }
    if (action === "review") {
      // Reviews queue for moderation — no Bytes yet
      return { ok: true, awarded: 0, message: "Review submitted for approval." };
    }
    const entry: LedgerEntry = {
      id: uid(),
      action,
      bytes: BYTES[action],
      vendorId: cur.vendor.id,
      vendorName: cur.vendor.name,
      timestamp: Date.now(),
    };
    const next = { ...cur, ledger: [entry, ...cur.ledger] };
    write(next);
    setState(next);
    return { ok: true, awarded: BYTES[action], message: `+${BYTES[action]} Bytes awarded!` };
  }, []);

  // TODO(backend): move to server fn
  const redeem = useCallback((rewardId: string): { ok: boolean; message: string } => {
    const cur = read();
    const reward = cur.rewards.find((r) => r.id === rewardId);
    if (!reward) return { ok: false, message: "Reward not found." };
    const bal = balanceOf(cur.ledger);
    if (bal < reward.bytesCost) return { ok: false, message: "Not enough Bytes yet." };
    const entry: LedgerEntry = {
      id: uid(),
      action: "redeem",
      bytes: -reward.bytesCost,
      vendorId: null,
      vendorName: reward.name,
      timestamp: Date.now(),
    };
    const redemption: Redemption = {
      id: uid(),
      rewardId: reward.id,
      rewardName: reward.name,
      bytesSpent: reward.bytesCost,
      status: "requested",
      timestamp: Date.now(),
    };
    const next = { ...cur, ledger: [entry, ...cur.ledger], redemptions: [redemption, ...cur.redemptions] };
    write(next);
    setState(next);
    return { ok: true, message: `Redemption requested — ${reward.name}.` };
  }, []);

  const setVendor = useCallback((patch: Partial<LoyaltyVendor>) => {
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

export const ACTION_LABEL: Record<LoyaltyAction, string> = {
  check_in: "Check-in",
  social_share: "Social share",
  review: "Review",
  purchase: "Purchase",
  redeem: "Redemption",
};
