import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { usePopupStore, type Popup } from "@/stores/usePopupStore";
import { KIND_STYLE } from "./kinds";

const SHOW_FOR_MS = 7000;

/**
 * The pop-up stack at the top right. Each card waits seven seconds, pauses while
 * the pointer is over it, and can be closed or followed to where it points.
 */
export function PopupStack() {
  const popups = usePopupStore((state) => state.popups);
  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-3 top-[4.25rem] z-[70] flex flex-col items-end gap-2.5 sm:inset-x-auto sm:right-5 sm:top-5"
    >
      <AnimatePresence initial={false}>
        {popups.map((popup) => (
          <PopupCard key={popup.id} popup={popup} />
        ))}
      </AnimatePresence>
    </section>
  );
}

function PopupCard({ popup }: { popup: Popup }) {
  const reduceMotion = useReducedMotion();
  const dismiss = usePopupStore((state) => state.dismiss);
  const [paused, setPaused] = useState(false);
  const style = KIND_STYLE[popup.kind];

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => dismiss(popup.id), SHOW_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [paused, popup.id, dismiss]);

  return (
    <motion.div
      layout={!reduceMotion}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="status"
      className="pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-white shadow-[0_18px_44px_-14px_rgba(11,31,58,0.38)] ring-1 ring-ink/[0.06] sm:w-[360px]"
    >
      <div className="flex items-start gap-3 p-3.5 pr-10">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style.tile)} aria-hidden="true">
          <style.icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-ink-muted">
            {style.label} <span className="font-semibold normal-case tracking-normal">· just now</span>
          </p>
          <p className="mt-0.5 text-[13.5px] font-extrabold leading-snug text-ink">{popup.title}</p>
          {popup.body ? <p className="mt-0.5 line-clamp-2 text-xs font-medium text-ink-2">{popup.body}</p> : null}
          {popup.href ? (
            <Link
              to={popup.href}
              onClick={() => dismiss(popup.id)}
              className="group mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
            >
              Open
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={() => dismiss(popup.id)}
        aria-label="Close"
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-panel hover:text-ink"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      {!reduceMotion ? (
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-primary/70"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: paused ? 1 : 0 }}
          transition={paused ? { duration: 0.2 } : { duration: SHOW_FOR_MS / 1000, ease: "linear" }}
        />
      ) : null}
    </motion.div>
  );
}
