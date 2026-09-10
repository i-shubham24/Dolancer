import { cn } from "@/lib/cn";

/**
 * Two or three mutually exclusive views, as one bordered pill with the active
 * segment lifted onto a white chip.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: readonly { id: T; label: string; count?: number }[];
  value: T;
  onChange: (next: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border-[1.5px] border-ink bg-subtle p-1 shadow-offset-xs",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold tracking-[-0.01em] transition-all duration-[120ms]",
              selected
                ? "border-[1.5px] border-ink bg-surface shadow-offset-xs"
                : "border-[1.5px] border-transparent text-ink-2 hover:text-ink",
            )}
          >
            {option.label}
            {typeof option.count === "number" ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                  selected ? "bg-coral text-ink" : "bg-muted text-ink-2",
                )}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
