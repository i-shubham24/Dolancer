import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** A tick the person sets themselves: a soft row with a box that fills when ticked. */
export function TickBox({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[13.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
        checked ? "bg-success-bg text-ink" : "bg-panel/60 text-ink-2 hover:bg-panel",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors",
          checked ? "bg-success-dot text-white" : "bg-white ring-2 ring-line-card",
        )}
        aria-hidden="true"
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}
