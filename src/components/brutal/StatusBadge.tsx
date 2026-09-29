import { cn } from "@/lib/cn";
import type { StatusTone } from "@/types/domain";

const TONES: Record<StatusTone | "neutral", { wrap: string; dot: string; pulse: boolean }> = {
  assigned: { wrap: "bg-blue-50 text-[#0A65C0] border-blue-200/80", dot: "bg-[#0A65C0]", pulse: true },
  progress: { wrap: "bg-amber-50 text-amber-900 border-amber-200/80", dot: "bg-amber-500", pulse: true },
  review: { wrap: "bg-indigo-50 text-indigo-900 border-indigo-200/80", dot: "bg-indigo-600", pulse: true },
  changes: { wrap: "bg-rose-50 text-rose-900 border-rose-200/80", dot: "bg-rose-500", pulse: false },
  approved: { wrap: "bg-emerald-50 text-emerald-900 border-emerald-200/80", dot: "bg-emerald-500", pulse: false },
  neutral: { wrap: "bg-slate-100 text-slate-700 border-slate-200/80", dot: "bg-slate-400", pulse: false },
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
        "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-[5px]",
        "text-2xs font-bold leading-tight tracking-[0.02em]",
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
