import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Start every navigation at the top.
 *
 * A single-page app keeps the scroll position across route changes, so following a
 * link from halfway down one page drops you halfway down the next one, which reads
 * as a broken page rather than a new one.
 *
 * Two exceptions are deliberate. An in-page hash scrolls to its section instead,
 * because client-side navigation never triggers the browser's native anchor jump.
 * And a POP, which is the back and forward buttons, keeps its position: returning
 * to where you were is the whole point of going back.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const navigation = window.performance?.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === "back_forward") return;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}
