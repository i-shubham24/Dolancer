import * as React from "react";
import { cn } from "@/lib/cn";

/** Category pill: a quiet metadata label in the shared soft system. */
export function CategoryPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-card bg-slate-100/80 px-2.5 py-0.5",
        "text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-600",
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
        "inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5",
        "text-[11px] font-bold text-[#0A65C0]",
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
        "inline-flex items-center rounded-full border border-line-card bg-slate-50 px-2.5 py-0.5",
        "text-[11px] font-medium text-slate-500",
        className,
      )}
    >
      {children}
    </span>
  );
}
