import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

function getScrollProgress() {
  const root = document.documentElement;
  const scrollable = root.scrollHeight - root.clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

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
      <span className="sr-only" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        Page scroll progress: {Math.round(progress * 100)} percent
      </span>
    </div>
  );
}

export function ScrollRevealController() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.querySelector("#main");
    if (!root) return;

    const candidates = Array.from(root.querySelectorAll<HTMLElement>("h1, h2, h3, p"));
    const mark = (element: HTMLElement) => {
      if (element.dataset.scrollRevealReady === "true") return;
      element.dataset.scrollRevealReady = "true";
      element.classList.add("scroll-reveal");
      if (reduceMotion) element.classList.add("is-visible");
    };
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
