import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Start every navigation at the top.
 *
 * A single-page app keeps the scroll position across route changes, so following a
 * link from halfway down one page drops you halfway down the next one, which reads
 * as a broken page rather than a new one.
 *
 * Two exceptions are deliberate. An in-page hash is left alone, since the browser is
 * already handling it and overriding would break every anchor link. And a POP, which
 * is the back and forward buttons, keeps its position: returning to where you were
 * is the whole point of going back.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    const navigation = window.performance?.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation?.type === "back_forward") return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
