import { useEffect } from "react";

/**
 * Single-shot loader takeover referencing https://www.aardvarkbookclub.com/
 *
 * index.html already paints the full loader (palette colour, logo, dots,
 * blobs) before the bundle loads. This component renders nothing new - it
 * simply holds that same frame for a beat, then irises it out with the Web
 * Animations API and removes it. One continuous window: no second copy, no
 * restarted animation phases, no jitter.
 */
const IRIS_OPEN = "circle(142% at 50% 50%)";
const IRIS_CLOSED = "circle(0% at 50% 50%)";

export function SplashLoader() {
  useEffect(() => {
    const boot = document.getElementById("boot-splash");
    if (!boot) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      boot.remove();
    };

    const timer = setTimeout(() => {
      try {
        if (reduceMotion || typeof boot.animate !== "function") {
          const fade = reduceMotion && typeof boot.animate === "function"
            ? boot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" })
            : null;
          if (fade) {
            fade.onfinish = finish;
            setTimeout(finish, 350);
          } else {
            finish();
          }
          return;
        }
        const exit = boot.animate([{ clipPath: IRIS_OPEN }, { clipPath: IRIS_CLOSED }], {
          duration: 1000,
          easing: "cubic-bezier(0.76, 0, 0.24, 1)",
          fill: "forwards",
        });
        exit.onfinish = finish;
        // Safety net so the page is never trapped behind the splash.
        setTimeout(finish, 1500);
      } catch {
        finish();
      }
    }, reduceMotion ? 150 : 400);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
