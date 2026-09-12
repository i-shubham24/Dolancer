import { useCallback, useState } from "react";

const KEY = "dolancer.board.notify";

/**
 * Board watch preference, stored locally for now.
 *
 * When push alerts land on the backend this becomes the subscription record.
 * Until then it is an honest local preference: the board re-checks on every
 * visit, and a watcher sees new matches first because sorting defaults to
 * newest for them.
 */
export function useBoardNotify(): { watching: boolean; toggle: () => void } {
  const [watching, setWatching] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === "true";
    } catch {
      return false;
    }
  });

  const toggle = useCallback(() => {
    setWatching((current) => {
      const next = !current;
      try {
        if (next) localStorage.setItem(KEY, "true");
        else localStorage.removeItem(KEY);
      } catch {
        // Private mode. The toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return { watching, toggle };
}
