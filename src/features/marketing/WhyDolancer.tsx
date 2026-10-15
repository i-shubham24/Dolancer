import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Pause,
  Play,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";

interface Pair {
  bad: string;
  good: string;
  detail: string;
}

const PAIRS: Pair[] = [
  {
    bad: "Writing many proposals for free",
    good: "Offers come to you",
    detail: "No bidding. Your supervisor sends each offer with the pay on it.",
  },
  {
    bad: "Arguing about price and late payments",
    good: "Pay fixed before you start",
    detail: "Your pay is fixed before you accept. It does not change.",
  },
  {
    bad: "Difficult clients and extra unpaid work",
    good: "A supervisor handles the client",
    detail: "Your supervisor checks the work and talks to the client.",
  },
  {
    bad: "Waiting months to get paid",
    good: "Paid to your bank after approval",
    detail: "Approved work is paid straight to your bank or UPI.",
  },
];

const CYCLE_MS = 4500;

/**
 * Other platforms against Dolancer, one row at a time. It plays by itself; pointing
 * at a row opens it and holds it there, and moving away lets it carry on.
 */
function Difference() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const stopped = paused || hovering || Boolean(reduceMotion);

  useEffect(() => {
    if (stopped) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % PAIRS.length), CYCLE_MS);
    return () => clearInterval(timer);
    // `active` restarts the window on every pick so the bar and the timer agree.
  }, [stopped, active]);

  return (
    <div>
      <style>{`@keyframes whyFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
        <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl leading-[1.15]">
          A better <span className="fresh-highlight fresh-underline fresh-underline-pink">way to earn</span>
        </h2>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 sm:gap-8">
        <p className="text-right text-sm font-extrabold uppercase tracking-[0.12em] text-ink-muted sm:text-base">Other platforms</p>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a65c0] text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-[#0a65c0]/25 sm:h-14 sm:w-14 sm:text-base">
          vs
        </span>
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a65c0] sm:text-base">
          <Logo size="sm" variant="nav" className="h-7 w-7 sm:h-8 sm:w-8" />
          Dolancer
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-5xl space-y-3.5" onMouseLeave={() => setHovering(false)}>
        {PAIRS.map((pair, index) => {
          const selected = index === active;
          return (
            <div
              key={pair.good}
              role="button"
              tabIndex={0}
              aria-expanded={selected}
              onMouseEnter={() => {
                setHovering(true);
                setActive(index);
              }}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(index);
                }
              }}
              className={cn(
                "w-full rounded-[28px] border p-3.5 text-left transition-all duration-300 sm:p-5",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a65c0]",
                selected ? "border-[#0a65c0]/25 bg-white shadow-soft-md sm:scale-[1.01]" : "border-line-card/60 bg-white/70",
              )}
            >
              <span className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:gap-4">
                <span
                  className={cn(
                    "flex flex-1 items-center gap-3.5 rounded-2xl px-4 py-4 transition-all duration-300 sm:px-5",
                    selected ? "bg-subtle/15 opacity-60" : "bg-subtle/20",
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-bg">
                    <XCircle className="h-5 w-5 text-danger-ink" />
                  </span>
                  <span className="text-base font-semibold text-ink-2 line-through decoration-danger-dot/40 sm:text-lg">{pair.bad}</span>
                </span>

                <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
                  <ArrowRight className="hidden h-6 w-6 text-ink-3 sm:block" />
                  <ArrowDown className="h-5 w-5 text-ink-3 sm:hidden" />
                </span>

                <span
                  className={cn(
                    "flex flex-1 items-center gap-3.5 rounded-2xl px-4 py-4 transition-all duration-300 sm:px-5",
                    selected ? "border border-[#0a65c0]/20 bg-[#e8f1fa]" : "border border-transparent bg-surface-2/15",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                      selected ? "bg-[#0a65c0] text-white" : "bg-[#e8f1fa] text-[#0a65c0]",
                    )}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <span className="text-base font-extrabold text-ink sm:text-lg">{pair.good}</span>
                </span>
              </span>

              <AnimatePresence initial={false}>
                {selected ? (
                  <motion.span
                    key="detail"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="flex items-center gap-2.5 px-2 pb-1 pt-3.5 text-base font-semibold leading-relaxed text-ink-2 sm:text-[17px]">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-[#0a65c0]" />
                      {pair.detail}
                    </span>
                    {!reduceMotion ? (
                      <span className="mx-2 mb-1 mt-1 block h-1 overflow-hidden rounded-full bg-subtle">
                        <span
                          key={active}
                          className="block h-full w-full origin-left rounded-full bg-[#0a65c0]"
                          style={{ animation: `whyFill ${CYCLE_MS}ms linear forwards`, animationPlayState: stopped ? "paused" : "running" }}
                        />
                      </span>
                    ) : null}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!reduceMotion ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line-card bg-surface px-3.5 py-1.5 text-xs font-bold text-ink-2 shadow-soft-xs transition-colors hover:text-ink"
          >
            {paused ? <Play className="h-3.5 w-3.5 text-[#0a65c0]" /> : <Pause className="h-3.5 w-3.5 text-[#0a65c0]" />}
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      ) : null}

      {/* Big and bold callout below VS section */}
      <div className="mt-12 sm:mt-16 text-center max-w-3xl mx-auto px-4">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-slate-900 leading-[1.15] font-display">
          What are you waiting for?{" "}
          <span className="block sm:inline text-[#0a65c0]">
            Sign up now on Dolancer.
          </span>
        </h3>
        <p className="mt-3.5 text-base sm:text-lg font-medium text-slate-600 max-w-xl mx-auto">
          No bidding, no proposal writing, and no chasing clients. Your pay is fixed and protected from day one.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a65c0] px-8 py-3.5 text-base font-extrabold text-white shadow-soft-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0854a0] hover:shadow-soft-lg active:translate-y-0"
          >
            Sign up now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-400">
          Free to join · Takes under 2 minutes · No subscription fees
        </p>
      </div>
    </div>
  );
}

export function WhyDolancer() {
  return (
    <section id="why-dolancer" aria-label="Why Dolancer" className="scroll-mt-24">
      <div className="fresh-container pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
        <Difference />
      </div>
    </section>
  );
}

