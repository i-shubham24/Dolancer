import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Clean executive metric card: minimalist, high-contrast typography,
 * subtle category icon chip, and balanced spacing.
 */

const TONE_BADGE = {
  accent: "bg-blue-50 text-[#0A65C0] border-blue-100",
  primary: "bg-indigo-50 text-indigo-600 border-indigo-100",
  secondary: "bg-slate-100 text-slate-600 border-slate-200/80",
  highlight: "bg-sky-50 text-sky-600 border-sky-100",
  ink: "bg-slate-900 text-white border-slate-800",
} as const;

export type ColorStatTone = keyof typeof TONE_BADGE;

export function ColorStat({
  label,
  value,
  subtext,
  icon,
  tone = "accent",
  loading = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: ColorStatTone;
  loading?: boolean;
  className?: string;
}) {
  const badgeStyle = TONE_BADGE[tone] ?? TONE_BADGE.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-line-card bg-surface p-5 shadow-soft-sm transition-all duration-200 hover:border-slate-300 hover:shadow-soft-md",
        className,
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          {icon ? (
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border shadow-2xs [&>svg]:h-3.5 [&>svg]:w-3.5",
                badgeStyle,
              )}
            >
              {icon}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-3.5 h-8 w-28 animate-pulse rounded-md bg-slate-100" aria-hidden="true" />
        ) : (
          <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-[28px]">
            {value}
          </div>
        )}
      </div>

      {subtext ? (
        <p className="mt-2.5 text-xs font-normal leading-relaxed text-slate-500">
          {subtext}
        </p>
      ) : null}
    </motion.div>
  );
}
