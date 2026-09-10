import * as React from "react";
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
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border-2 border-ink p-5 shadow-offset-md",
        "transition-all duration-[180ms] ease-spring",
        "hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-lg",
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
              "flex h-8 w-8 items-center justify-center rounded-lg border-[1.5px] border-ink [&>svg]:h-4 [&>svg]:w-4",
              inverse ? "bg-white/15" : "bg-surface/70",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span
          className={cn(
            "text-xs font-extrabold uppercase tracking-[0.05em]",
            inverse ? "text-white/75" : "text-ink/65",
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
        <p className="mt-3 text-5xl font-extrabold leading-none tracking-[-0.045em]">{value}</p>
      )}

      {subtext ? (
        <p
          className={cn(
            "mt-2.5 text-xs font-semibold leading-snug",
            inverse ? "text-white/70" : "text-ink/60",
          )}
        >
          {subtext}
        </p>
      ) : null}
    </div>
  );
}
