import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  EyeOff,
  Pause,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Wallet,
  XCircle,
  type LucideIcon,
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
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl">
          A better <span className="fresh-highlight fresh-underline fresh-underline-pink">way to earn</span>
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 sm:gap-8">
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Built to protect you                                               */
/* ------------------------------------------------------------------ */

const SHIELD_MS = 5200;

const SHIELDS: { icon: LucideIcon; title: string; line: string }[] = [
  {
    icon: EyeOff,
    title: "Your name stays private",
    line: "The client never learns your name, where you live or what you are paid.",
  },
  {
    icon: SlidersHorizontal,
    title: "You decide when you work",
    line: "Say yes or not now to any offer, and switch offers off with one tap.",
  },
  {
    icon: Wallet,
    title: "Good work is always paid",
    line: "If the client changes their mind after you delivered what was asked, you are still paid.",
  },
];

/** What the client sees about the doer: the area of work, and nothing else. */
function PrivacyScene() {
  const rows = [
    { label: "Name", hidden: true },
    { label: "City", hidden: true },
    { label: "Your pay", hidden: true },
    { label: "Skill area", value: "Writing & Content" },
  ];
  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_18px_44px_-20px_rgba(10,26,68,0.35)]">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-3">What the client sees</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <UserRound className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[15px] font-extrabold text-ink">A Dolancer doer</p>
          <p className="text-xs font-semibold text-ink-muted">Checked by a supervisor</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((row, index) => (
          <motion.li
            key={row.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-[13px]"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.25 }}
          >
            <span className="font-semibold text-ink-2">{row.label}</span>
            {row.hidden ? (
              <span className="flex items-center gap-1.5 font-bold text-ink-3">
                <EyeOff className="h-3.5 w-3.5" /> Hidden
              </span>
            ) : (
              <span className="font-extrabold text-[#0a65c0]">{row.value}</span>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/** An offer with a real choice on it, and the switch that turns offers off. */
function ChoiceScene() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setOn(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="w-full max-w-[320px] space-y-3">
      <div className="rounded-2xl bg-white p-4 shadow-[0_18px_44px_-20px_rgba(10,26,68,0.35)]">
        <p className="text-[14px] font-extrabold text-ink">Social captions for a skincare brand</p>
        <p className="mt-0.5 text-xs font-semibold text-ink-muted">₹3,500 · due in 4 days</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <motion.span
            className="flex h-9 items-center justify-center rounded-xl border-2 border-[#0a65c0] text-[13px] font-extrabold text-[#0a65c0]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.2, repeat: 1, delay: 0.6 }}
          >
            Not now
          </motion.span>
          <span className="flex h-9 items-center justify-center rounded-xl bg-[#0a65c0] text-[13px] font-extrabold text-white">Accept</span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-full bg-white py-2 pl-4 pr-2 shadow-[0_10px_30px_-16px_rgba(10,26,68,0.35)]">
        <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
          <span className={cn("h-2 w-2 rounded-full transition-colors", on ? "bg-emerald-500" : "bg-slate-400")} />
          {on ? "Available" : "Not available"}
        </span>
        <span className={cn("relative h-6 w-11 rounded-full transition-colors duration-300", on ? "bg-emerald-500" : "bg-slate-300")}>
          <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all duration-300", on ? "left-6" : "left-1")} />
        </span>
      </div>
    </div>
  );
}

/** A payout that still goes out after the client changed plans. */
function PaidScene() {
  const lines = [
    { label: "Work delivered as briefed", done: true },
    { label: "Client changed their plans", done: false },
  ];
  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-white p-5 shadow-[0_18px_44px_-20px_rgba(10,26,68,0.35)]">
      <ul className="space-y-2">
        {lines.map((line, index) => (
          <motion.li
            key={line.label}
            className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-[13px] font-bold text-ink"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.5 }}
          >
            {line.done ? <BadgeCheck className="h-4 w-4 text-[#0a65c0]" /> : <XCircle className="h-4 w-4 text-ink-3" />}
            {line.label}
          </motion.li>
        ))}
      </ul>
      <motion.div
        className="mt-4 flex items-center justify-between rounded-2xl bg-[#e8f1fa] px-4 py-3"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 20 }}
      >
        <span>
          <span className="block text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#0a65c0]">Your pay</span>
          <span className="block text-[22px] font-extrabold tracking-[-0.03em] text-ink">₹8,500</span>
        </span>
        <span className="rounded-full bg-[#0a65c0] px-3 py-1 text-xs font-extrabold text-white">Still paid</span>
      </motion.div>
    </div>
  );
}

const SHIELD_SCENES = [PrivacyScene, ChoiceScene, PaidScene];

/**
 * The three protections every doer gets, shown working rather than described: pick
 * one (or let it play) and the panel beside it shows what that looks like on the job.
 */
function Protections() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const stopped = hovering || Boolean(reduceMotion);

  useEffect(() => {
    if (stopped) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % SHIELDS.length), SHIELD_MS);
    return () => window.clearTimeout(timer);
  }, [active, stopped]);

  const Scene = SHIELD_SCENES[active] ?? PrivacyScene;

  return (
    <div className="mt-20 sm:mt-28">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">
          Built to <span className="fresh-highlight fresh-underline fresh-underline-pink">protect you</span>
        </h2>
        <p className="mt-3 text-base font-medium text-ink-2 sm:text-lg">Three things every doer gets, from the first task.</p>
      </div>

      <div
        className="mx-auto grid max-w-5xl items-stretch gap-4 rounded-[32px] border border-line-card/70 bg-white p-3 shadow-soft-md sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
        onMouseLeave={() => setHovering(false)}
      >
        <ul className="flex flex-col gap-2" role="tablist" aria-label="Protections">
          {SHIELDS.map((shield, index) => {
            const on = index === active;
            return (
              <li key={shield.title} className="flex-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onMouseEnter={() => {
                    setHovering(true);
                    setActive(index);
                  }}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={cn(
                    "relative flex h-full w-full items-start gap-4 overflow-hidden rounded-3xl p-5 text-left transition-colors duration-300",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a65c0]",
                    on ? "bg-[#e8f1fa]" : "bg-transparent hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
                      on ? "bg-[#0a65c0] text-white" : "bg-[#e8f1fa] text-[#0a65c0]",
                    )}
                  >
                    <shield.icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-lg font-extrabold tracking-[-0.02em] text-ink">{shield.title}</span>
                    <span className="mt-1 block text-[15px] font-medium leading-relaxed text-ink-2">{shield.line}</span>
                  </span>
                  {on && !reduceMotion ? (
                    <motion.span
                      key={`${active}-${stopped}`}
                      className="absolute bottom-0 left-0 h-1 bg-[#0a65c0]"
                      initial={{ width: stopped ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: stopped ? 0 : SHIELD_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#eef5fd] via-[#f5f9ff] to-[#e3eefb] p-6" aria-hidden="true">
          <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[18px] border-[#0a65c0]/[0.06]" />
          <span className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full border-[18px] border-[#0a65c0]/[0.05]" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className="relative flex w-full justify-center"
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function WhyDolancer() {
  return (
    <section id="why-dolancer" aria-label="Why Dolancer" className="scroll-mt-24">
      <div className="fresh-container pb-16 pt-2 sm:pb-24 sm:pt-4">
        <Difference />
        <Protections />
      </div>
    </section>
  );
}
