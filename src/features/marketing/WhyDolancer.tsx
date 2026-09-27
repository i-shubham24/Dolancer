import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  EyeOff,
  Pause,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Pair {
  bad: string;
  good: string;
  detail: string;
}

const PAIRS: Pair[] = [
  {
    bad: "Writing dozens of unpaid proposals",
    good: "Pre-funded offers waiting for you",
    detail: "No bidding. Your supervisor sends each offer with the pay on it.",
  },
  {
    bad: "Chasing invoices, late payments, haggling",
    good: "Payouts fixed and agreed upfront",
    detail: "The payout is fixed before you accept. It never changes.",
  },
  {
    bad: "Absorbing client friction & scope creep",
    good: "Dedicated supervisor manages the client",
    detail: "Your supervisor checks the work and talks to the client.",
  },
  {
    bad: "Chasing unpaid invoices for 60 days",
    good: "Instant direct bank deposit upon sign-off",
    detail: "Approved work is paid straight to your bank or UPI.",
  },
];

const CYCLE_MS = 4500;

function glowMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function Difference() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const stopped = paused || hovering || reduceMotion;

  useEffect(() => {
    if (stopped) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % PAIRS.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
    // `active` restarts the window on every manual pick so the progress
    // bar and the timer never drift apart and feel stuck.
  }, [stopped, active]);

  return (
    <div>
      <style>{`@keyframes whyFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
      <div className="text-center max-w-2xl mx-auto -translate-y-1 pb-2">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em]">
          A structurally{" "}
          <span className="fresh-highlight fresh-underline fresh-underline-pink">
            better way to work
          </span>
        </h2>
      </div>

      <div className="hidden sm:grid grid-cols-2 gap-6 max-w-4xl mx-auto mt-6 mb-2 px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-muted">Traditional Platforms</p>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-primary">The Dolancer Way</p>
      </div>

      <div
        className="mt-10 max-w-4xl mx-auto space-y-3"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {PAIRS.map((pair, index) => {
          const selected = index === active;
          return (
            <button
              key={pair.good}
              type="button"
              onClick={() => {
                setActive(index);
                // A tap fires mouseenter with no mouseleave after it, which
                // would latch hover-pause on forever. Release it on every pick.
                setHovering(false);
              }}
              aria-expanded={selected}
              className={cn(
                "w-full text-left rounded-3xl border p-3 sm:p-4 transition-all duration-300 cursor-pointer",
                selected
                  ? "border-primary/30 bg-surface shadow-soft-md"
                  : "border-line-card bg-surface/60 hover:bg-surface hover:border-line-card hover:shadow-soft-sm",
              )}
            >
              <span className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
                <span
                  className={cn(
                    "flex-1 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all duration-300",
                    selected ? "bg-subtle opacity-60" : "bg-subtle/70",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-bg">
                    <XCircle className="h-4 w-4 text-danger-ink" />
                  </span>
                  <span className="text-md font-semibold text-ink-2 line-through decoration-danger-dot/40">
                    {pair.bad}
                  </span>
                </span>

                <span className="flex items-center justify-center shrink-0" aria-hidden="true">
                  <ArrowRight className="hidden sm:block h-5 w-5 text-ink-3" />
                  <ArrowDown className="sm:hidden h-5 w-5 text-ink-3" />
                </span>

                <span
                  className={cn(
                    "flex-1 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all duration-300",
                    selected
                      ? "bg-primary-light border border-primary/25 shadow-soft-xs"
                      : "bg-surface-2 border border-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                      selected ? "bg-primary text-inverse" : "bg-primary-light text-primary",
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-md font-extrabold text-ink">{pair.good}</span>
                </span>
              </span>

              <AnimatePresence initial={false}>
                {selected && (
                  <motion.span
                    key="detail"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="flex items-center gap-2.5 px-2 pt-3 pb-1 text-md font-semibold leading-relaxed text-ink-2">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                      {pair.detail}
                    </span>
                    {!reduceMotion && (
                      <span className="mx-2 mb-1 block h-1 overflow-hidden rounded-full bg-subtle">
                        <span
                          key={active}
                          className="block h-full w-full origin-left rounded-full bg-primary"
                          style={{
                            animation: `whyFill ${CYCLE_MS}ms linear forwards`,
                            animationPlayState: stopped ? "paused" : "running",
                          }}
                        />
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {!reduceMotion && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-line-card bg-surface px-3.5 py-1.5 text-xs font-bold text-ink-2 hover:text-ink transition-colors shadow-soft-xs cursor-pointer"
          >
            {paused ? (
              <>
                <Play className="h-3.5 w-3.5 text-primary" />
                <span>Auto-play tour</span>
              </>
            ) : (
              <>
                <Pause className="h-3.5 w-3.5 text-primary" />
                <span>Pause tour</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

const PRINCIPLES = [
  {
    title: "You stay anonymous",
    body: "Clients never learn your name, where you are, what you are paid, or that you work through us. They see a discipline and nothing else. This protects you as much as it protects them.",
    bg: "bg-[#d7d9ff]",
    icon: EyeOff,
  },
  {
    title: "You are not an employee",
    body: "You choose what to accept and when to stop. Nothing is assigned to you against your will, and pausing is a switch you control.",
    bg: "bg-[#a7f3d0]",
    icon: SlidersHorizontal,
  },
  {
    title: "You are always paid",
    body: "If work you delivered was sound and the client changed their mind, that is our problem to absorb, not yours. If we ever part ways, anything you have earned is still paid out.",
    bg: "bg-[#fecdd3]",
    icon: Wallet,
  },
];

function Principles() {
  const reduceMotion = useReducedMotion();
  const [spotlight, setSpotlight] = useState(0);

  return (
    <div className="mt-20 sm:mt-28">
      <div className="text-center max-w-2xl mx-auto mb-12 -translate-y-1">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em]">
          Three rules we will not{" "}
          <span className="fresh-highlight fresh-underline fresh-underline-pink">
            compromise on
          </span>
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {PRINCIPLES.map((card, index) => {
          const Icon = card.icon;
          const lit = index === spotlight;
          return (
            <motion.button
              key={card.title}
              type="button"
              onClick={() => setSpotlight(index)}
              onMouseMove={glowMove}
              aria-pressed={lit}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-7 text-left cursor-pointer transition-all duration-300",
                card.bg,
                lit
                  ? "shadow-soft-lg ring-2 ring-ink/15 scale-[1.01]"
                  : "shadow-soft-sm opacity-80 hover:opacity-100 hover:shadow-soft-md",
              )}
              style={{
                backgroundImage:
                  "radial-gradient(220px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.55), transparent 70%)",
              }}
            >
              <span
                className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/25"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -bottom-16 -right-4 h-40 w-40 rounded-full bg-white/20"
                aria-hidden="true"
              />
              <span className="relative flex items-start justify-between">
                <span className="text-xs font-bold tracking-[0.08em] text-ink/50 font-mono">
                  0{index + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-inverse shadow-soft-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="h-5 w-5" />
                </span>
              </span>
              <span className="relative mt-10 block text-xl font-extrabold leading-tight tracking-[-0.03em] text-ink">
                {card.title}
              </span>
              <span className="relative mt-3 block text-sm leading-relaxed text-ink/75 font-medium">
                {card.body}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function WhyDolancer() {
  return (
    <section id="why-dolancer" aria-label="Why Dolancer" className="scroll-mt-24">
      <div className="fresh-container py-16 sm:py-24">
        <Difference />
        <Principles />
      </div>
    </section>
  );
}
