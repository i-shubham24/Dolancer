import * as React from "react";
import { cn } from "@/lib/cn";

/** Category pill: white, bordered, hard shadow. */
export function CategoryPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-[1.5px] border-ink bg-surface px-3 py-1",
        "text-2xs font-extrabold uppercase tracking-[0.04em] shadow-offset-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Progress pill: lime, the system's "live" accent. */
export function ProgressPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-[1.5px] border-ink bg-lime px-2.5 py-[3px]",
        "text-[11.5px] font-extrabold shadow-offset-sm",
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
        "inline-flex items-center rounded-full border border-line-card bg-[#f6f6f9] px-2.5 py-[3px]",
        "text-[11.5px] font-semibold text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
