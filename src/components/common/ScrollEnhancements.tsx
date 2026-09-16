import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

function getScrollProgress() {
  const root = document.documentElement;
  const scrollable = root.scrollHeight - root.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

/**
 * Decorative page-scroll progress bar.
 *
 * The entire component is decorative. The visual bar is hidden from the
 * accessibility tree with aria-hidden. There is no progressbar role because a
 * page-scroll indicator is not a meaningful widget for screen readers and
 * placing one inside an aria-hidden parent is an accessibility violation.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      frame.current = null;
      setProgress(getScrollProgress());
    };
    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/**
 * Scroll reveal controller.
 *
 * This component must be mounted inside a layout that contains the #main
 * element (MarketingLayout or AppShell), not at the App root. Mounting at the
 * App root causes the controller to run before the router renders a layout,
 * which means #main does not exist and reveals never attach.
 *
 * Content is visible by default. The scroll-reveal CSS class is progressive
 * enhancement only. If IntersectionObserver is unsupported or the controller
 * fails to mount, all text remains visible. Under prefers-reduced-motion, all
 * elements are immediately marked visible without animation.
 */
export function ScrollRevealController() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const root = document.querySelector("#main");
    if (!root) return;

    const mark = (element: HTMLElement) => {
      if (element.dataset.scrollRevealReady === "true") return;
      element.dataset.scrollRevealReady = "true";
      element.classList.add("scroll-reveal");
      if (reduceMotion) element.classList.add("is-visible");
    };

    const candidates = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, p"));
    candidates.forEach(mark);

    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    candidates.forEach((element) => observer.observe(element));

    const mutationObserver = new MutationObserver(() => {
      root.querySelectorAll<HTMLElement>("h1, h2, h3, p").forEach((element) => {
        if (element.dataset.scrollRevealReady === "true") return;
        mark(element);
        observer.observe(element);
      });
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [reduceMotion]);

  return null;
}
