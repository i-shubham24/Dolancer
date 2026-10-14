import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { TimelineStep } from "@/lib/status";

const STEPS: { id: TimelineStep; label: string }[] = [
  { id: "offer", label: "Offer" },
  { id: "accepted", label: "Accepted" },
  { id: "working", label: "Working" },
  { id: "review", label: "Review" },
  { id: "approved", label: "Approved" },
];

/** Five steps from offer to approval, the line filling up to where the task is now. */
export function Timeline({ current }: { current: TimelineStep }) {
  const reduceMotion = useReducedMotion();
  const index = STEPS.findIndex((step) => step.id === current);
  const fill = index / (STEPS.length - 1);

  return (
    <ol className="relative grid grid-cols-5" aria-label="Task timeline">
      <span className="absolute left-[10%] right-[10%] top-[15px] h-[3px] rounded-full bg-panel" aria-hidden="true" />
      <motion.span
        className="absolute left-[10%] top-[15px] h-[3px] origin-left rounded-full bg-primary"
        style={{ width: "80%" }}
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: fill }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      {STEPS.map((step, position) => {
        const done = position < index;
        const now = position === index;
        return (
          <li key={step.id} className="relative flex flex-col items-center gap-2" aria-current={now ? "step" : undefined}>
            <motion.span
              initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.25 + position * 0.08 }}
              className={cn(
                "relative z-10 flex h-[33px] w-[33px] items-center justify-center rounded-full text-xs font-extrabold",
                done && "bg-primary text-white",
                now && "bg-white text-primary ring-[3px] ring-primary",
                !done && !now && "bg-white text-ink-3 ring-2 ring-line-subtle",
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : position + 1}
              {now && !reduceMotion ? (
                <motion.span
                  className="absolute inset-0 rounded-full ring-[3px] ring-primary"
                  animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  aria-hidden="true"
                />
              ) : null}
            </motion.span>
            <span className={cn("text-[11.5px] font-bold", now ? "text-primary" : done ? "text-ink" : "text-ink-3")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
