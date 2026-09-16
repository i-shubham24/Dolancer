import { motion } from "framer-motion";
import { Check, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

export type LifecycleStep = "assigned" | "accepted" | "in_progress" | "in_review" | "approved";

const STEPS: { id: LifecycleStep; label: string }[] = [
  { id: "assigned", label: "Offer received" },
  { id: "accepted", label: "Accepted" },
  { id: "in_progress", label: "Working" },
  { id: "in_review", label: "In review" },
  { id: "approved", label: "Approved" },
];

export function LifecycleRail({ currentStep }: { currentStep: LifecycleStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="relative py-4">
      {/* Background Track */}
      <div className="absolute left-4 top-1/2 -mt-px h-0.5 w-[calc(100%-2rem)] bg-line-subtle" />
      
      {/* Progress Track */}
      <motion.div
        className="absolute left-4 top-1/2 -mt-px h-0.5 bg-primary origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: currentIndex / (STEPS.length - 1) }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "var(--color-primary)" : "var(--color-surface)",
                  borderColor: isCompleted || isCurrent ? "var(--color-primary)" : "var(--color-line)",
                }}
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  (isCompleted || isCurrent) ? "text-inverse" : "text-ink-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <MoreHorizontal className="h-4 w-4 animate-pulse" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-line-subtle" />
                )}
              </motion.div>
              <span className={cn(
                "text-xs font-bold transition-colors duration-300 hidden sm:block",
                isCurrent ? "text-primary" : isCompleted ? "text-ink" : "text-ink-muted"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
