import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * The loud stat block: a flat colour field, an oversized ghosted icon bleeding off
 * the corner, and a number large enough to read across the room.
 *
 * This is the counterweight to StatTile, which is deliberately quiet. Use ColorStat
 * for the two or three figures a doer opens the app to check, and StatTile for
 * everything secondary. If every figure is loud, none of them are.
 */

const TONES = {
  lime: "bg-lime text-ink",
  coral: "bg-coral text-ink",
  blue: "bg-blue text-inverse",
  purple: "bg-purple text-inverse",
  ink: "bg-ink text-inverse",
} as const;

export type ColorStatTone = keyof typeof TONES;

export function ColorStat({
  label,
  value,
  subtext,
  icon,
  tone = "lime",
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
  const inverse = tone === "blue" || tone === "purple" || tone === "ink";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-line-card p-5 shadow-soft-md",
        "transition-shadow duration-[200ms] ease-spring",
        "hover:shadow-soft-lg",
        TONES[tone],
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -bottom-6 -right-5 -z-10 [&>svg]:h-32 [&>svg]:w-32",
            inverse ? "opacity-[0.18]" : "opacity-[0.13]",
          )}
        >
          {icon}
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        {icon ? (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl border border-line-card [&>svg]:h-4 [&>svg]:w-4",
              inverse ? "bg-white/15" : "bg-surface/70",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span
          className={cn(
            "text-xs font-extrabold uppercase tracking-[0.05em]",
            inverse ? "text-white/95" : "text-ink",
          )}
        >
          {label}
        </span>
      </div>

      {loading ? (
        <div
          className={cn(
            "mt-4 h-10 w-32 animate-pulse rounded-md",
            inverse ? "bg-white/25" : "bg-ink/15",
          )}
          aria-hidden="true"
        />
      ) : (
        <p className="mt-3 break-words text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums sm:text-5xl">{value}</p>
      )}

      {subtext ? (
        <p
          className={cn(
            "mt-2.5 text-xs font-semibold leading-snug",
            inverse ? "text-white/90" : "text-ink-2",
          )}
        >
          {subtext}
        </p>
      ) : null}
    </motion.div>
  );
}
