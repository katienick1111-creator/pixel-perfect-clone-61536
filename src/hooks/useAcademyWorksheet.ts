import { useCallback, useEffect, useRef, useState } from "react";

const KEY = (slug: string) => `trovin.academy.worksheet.${slug}`;

/**
 * Autosaves worksheet state to localStorage with debounce.
 * Database sync is wired up server-side (see academy_worksheets table)
 * and is invoked when the user is signed in via a future server fn.
 */
export function useAcademyWorksheet<T>(slug: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const loadedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(KEY(slug));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setData({ ...initial, ...parsed.data });
          if (parsed.savedAt) setSavedAt(new Date(parsed.savedAt));
        }
      }
    } catch {
      /* noop */
    }
    loadedRef.current = true;
  }, [slug]);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (typeof window === "undefined") return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const now = new Date();
      localStorage.setItem(
        KEY(slug),
        JSON.stringify({ data, savedAt: now.toISOString() }),
      );
      setSavedAt(now);
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [slug, data]);

  const reset = useCallback(() => {
    setData(initial);
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEY(slug));
    }
    setSavedAt(null);
  }, [initial, slug]);

  return { data, setData, savedAt, reset };
}
