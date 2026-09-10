import { cn } from "@/lib/cn";
import type { StatusTone } from "@/types/domain";

const TONES: Record<StatusTone | "neutral", { wrap: string; dot: string; pulse: boolean }> = {
  assigned: { wrap: "bg-info-bg text-info-ink", dot: "bg-info-dot", pulse: true },
  progress: { wrap: "bg-warning-bg text-warning-ink", dot: "bg-warning-dot", pulse: true },
  review: { wrap: "bg-purple-light text-purple", dot: "bg-purple", pulse: true },
  changes: { wrap: "bg-danger-bg text-danger-ink", dot: "bg-danger-dot", pulse: false },
  approved: { wrap: "bg-success-bg text-success-ink", dot: "bg-success-dot", pulse: false },
  neutral: { wrap: "bg-neutral-bg text-neutral-ink", dot: "bg-neutral-dot", pulse: false },
};

/**
 * Status is never conveyed by colour alone: the label is always present, so this
 * stays readable for colour-blind users and in high-contrast modes.
 */
export function StatusBadge({
  tone = "neutral",
  label,
  className,
}: {
  tone?: StatusTone | "neutral";
  label: string;
  className?: string;
}) {
  const spec = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink px-2.5 py-[3px]",
        "text-2xs font-extrabold leading-tight tracking-[0.02em]",
        spec.wrap,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", spec.dot, spec.pulse && "status-dot-pulse")}
      />
      {label}
    </span>
  );
}
