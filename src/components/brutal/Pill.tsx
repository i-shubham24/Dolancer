import * as React from "react";
import { cn } from "@/lib/cn";

/** Category pill: a quiet metadata label in the shared soft system. */
export function CategoryPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-card bg-subtle px-3 py-1",
        "text-2xs font-bold uppercase tracking-[0.04em]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Progress pill: the active work accent. */
export function ProgressPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-transparent bg-accent-light px-2.5 py-[3px]",
        "text-[11.5px] font-bold text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Quiet metadata chip, no black border. */
export function MicroChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-card bg-subtle px-2.5 py-[3px]",
        "text-[11.5px] font-semibold text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
