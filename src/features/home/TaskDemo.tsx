import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Clock, ExternalLink, Pause, Play, ReceiptText } from "lucide-react";
import { CARD } from "@/components/app/card-styles";
import { CategoryTile } from "@/components/app/ui";
import { SupervisorAvatar } from "@/components/app/SupervisorAvatar";
import { CountUp } from "@/components/common/CountUp";
import { cn } from "@/lib/cn";

const SCENE_MS = 5200;

const SCENES = [
  { title: "An offer arrives", line: "A supervisor sends work that fits your skills. The pay is fixed before you say yes." },
  { title: "Your supervisor guides you", line: "Ask anything in the chat. You never deal with the client." },
  { title: "Do the work", line: "Work in the company workspace and update your progress as you go." },
  { title: "Submit for review", line: "Tick your checklist and send it. Your supervisor checks it." },
  { title: "Get paid", line: "Once it is approved, the money goes to your bank with a receipt." },
];

const rupees = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function OfferScene() {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setAccepted(true), 2200);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="w-full max-w-[300px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.4)]">
      <div className="flex items-center gap-3">
        <CategoryTile category="Writing & Content" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-extrabold">Blog posts on cloud costs</p>
          <p className="text-[11.5px] font-semibold text-ink-muted">Writing & Content</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-panel/70 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">You earn</p>
          <p className="text-[16px] font-extrabold">₹8,500</p>
        </div>
        <div className="rounded-xl bg-panel/70 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">Due</p>
          <p className="flex items-center gap-1 text-[13.5px] font-extrabold">
            <Clock className="h-3.5 w-3.5 text-ink-muted" />5 days
          </p>
        </div>
      </div>
      <motion.div
        className={cn("mt-3 flex h-10 items-center justify-center gap-1.5 rounded-xl text-[13px] font-extrabold text-white", accepted ? "bg-success-dot" : "bg-primary")}
        animate={accepted ? { scale: [1, 0.94, 1] } : { scale: [1, 1.03, 1] }}
        transition={accepted ? { duration: 0.35 } : { duration: 1.2, repeat: Infinity }}
      >
        {accepted ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3} /> Accepted
          </>
        ) : (
          "Accept offer"
        )}
      </motion.div>
    </div>
  );
}

function ChatScene() {
  const bubbles = [
    { mine: false, text: "Welcome aboard. The style guide is in the brief." },
    { mine: true, text: "Thanks! Should examples name a cloud provider?" },
    { mine: false, text: "Keep them general where you can." },
  ];
  return (
    <div className="w-full max-w-[320px] space-y-2">
      {bubbles.map((bubble, index) => (
        <motion.div
          key={bubble.text}
          className={cn("flex items-end gap-2", bubble.mine ? "justify-end" : "justify-start")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 1.1, duration: 0.35 }}
        >
          {bubble.mine ? null : <SupervisorAvatar size="sm" className="scale-90" />}
          <span
            className={cn(
              "max-w-[78%] rounded-2xl px-3 py-2 text-[12.5px] font-medium leading-snug",
              bubble.mine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-white text-ink shadow-sm",
            )}
          >
            {bubble.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function WorkScene() {
  return (
    <div className="w-full max-w-[300px] space-y-3 rounded-2xl bg-white p-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.4)]">
      <div className="flex items-center gap-2 rounded-xl bg-info-bg px-3 py-2 text-[12.5px] font-bold text-primary">
        <ExternalLink className="h-3.5 w-3.5" />
        Company workspace
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10.5px]">Ready</span>
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-bold text-ink-muted">Progress</p>
          <CountUp value={60} format={(value) => `${Math.round(value)}%`} delay={0.3} duration={1.6} className="text-[18px] font-extrabold tabular-nums" />
        </div>
        <span className="mt-1.5 block h-2.5 overflow-hidden rounded-full bg-panel">
          <motion.span
            className="block h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.3, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      </div>
      <p className="text-[11.5px] font-semibold text-ink-muted">Posts one to five drafted</p>
    </div>
  );
}

function SubmitScene() {
  const ticks = ["Working link added", "Progress at 100%", "Checked against the brief"];
  return (
    <div className="w-full max-w-[300px] space-y-2 rounded-2xl bg-white p-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.4)]">
      {ticks.map((tick, index) => (
        <motion.div
          key={tick}
          className="flex items-center gap-2.5 rounded-xl bg-panel/60 px-3 py-2 text-[12.5px] font-bold"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.6 }}
        >
          <motion.span
            className="flex h-5 w-5 items-center justify-center rounded-md bg-success-dot text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.45 + index * 0.6, type: "spring", stiffness: 400, damping: 18 }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </motion.span>
          {tick}
        </motion.div>
      ))}
      <motion.div
        className="mt-1 flex h-10 items-center justify-center rounded-xl bg-highlight-light text-[13px] font-extrabold text-highlight"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3 }}
      >
        Sent for review
      </motion.div>
    </div>
  );
}

function PaidScene() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.4)]">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-bg text-success-ink">
          <ReceiptText className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[12px] font-bold text-ink-muted">Payout released</p>
          <CountUp value={7650} format={rupees} delay={0.3} duration={1.4} className="text-[24px] font-extrabold tabular-nums tracking-[-0.03em]" />
        </div>
      </div>
      <dl className="mt-3 space-y-1.5 border-t border-line-subtle pt-3 text-[12.5px]">
        <div className="flex justify-between">
          <dt className="font-semibold text-ink-2">Task pay</dt>
          <dd className="font-bold">₹8,500</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-semibold text-ink-2">Tax withheld</dt>
          <dd className="font-bold text-warning-ink">- ₹850</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-extrabold">To your bank</dt>
          <dd className="font-extrabold">₹7,650</dd>
        </div>
      </dl>
    </div>
  );
}

const STAGES = [OfferScene, ChatScene, WorkScene, SubmitScene, PaidScene];

/**
 * A short walk through one task, from offer to payout, played with pieces of the real
 * app rather than a video. It moves on by itself, pauses on hover or with the button,
 * and each step can be picked directly.
 */
export function TaskDemo({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(Boolean(reduceMotion));
  const [hover, setHover] = useState(false);
  const running = !paused && !hover;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setScene((current) => (current + 1) % SCENES.length), SCENE_MS);
    return () => window.clearTimeout(timer);
  }, [scene, running]);

  const Stage = STAGES[scene] ?? OfferScene;
  const current = SCENES[scene] ?? SCENES[0]!;

  return (
    <section
      className={cn(CARD, "gap-4 overflow-hidden p-0", className)}
      aria-labelledby="task-demo"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h2 id="task-demo" className="text-[17px] font-extrabold tracking-[-0.02em]">
            See how a task works
          </h2>
          <p className="text-xs font-semibold text-ink-muted">Five steps, from offer to payout</p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play the walkthrough" : "Pause the walkthrough"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel text-ink-2 hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 px-5" role="tablist" aria-label="Walkthrough steps">
        {SCENES.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={index === scene}
            aria-label={`${index + 1}. ${item.title}`}
            onClick={() => setScene(index)}
            className="group py-2 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="block h-1.5 overflow-hidden rounded-full bg-panel">
              {index < scene ? (
                <span className="block h-full w-full rounded-full bg-primary" />
              ) : index === scene ? (
                <motion.span
                  key={`${scene}-${running}`}
                  className="block h-full rounded-full bg-primary"
                  initial={{ width: running ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: running ? SCENE_MS / 1000 : 0, ease: "linear" }}
                />
              ) : null}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5">
        <div className="flex min-h-[250px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-br from-info-bg to-panel p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`stage-${scene}`}
              className="flex w-full justify-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <Stage />
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`text-${scene}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[84px] gap-3.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
              {scene + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[18px] font-extrabold leading-tight tracking-[-0.025em]">{current.title}</span>
              <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-2">{current.line}</span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
