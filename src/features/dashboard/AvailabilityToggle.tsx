import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { availabilityState, AVAILABILITY_COPY } from "@/stores/useAvailabilityStore";
import { useAvailability } from "./queries";

const DOT = {
  available: "bg-success-dot status-dot-pulse",
  paused: "bg-neutral-dot",
  "at-capacity": "bg-warning-dot",
} as const;

/**
 * Available or Not available, as one slim pill for the top bar.
 *
 * One of the few client controls with a real server effect: doer_pool requires
 * profiles.available, so switching off genuinely empties the board. With every slot
 * full the switch turns itself off and cannot be turned back on; a small 3/3 count
 * says why, and the tooltip carries the full sentence.
 */
export function AvailabilityToggle() {
  const { available, activeCount, isLoading, isSaving, setAvailable } = useAvailability();

  if (isLoading) {
    return <div className="skeleton h-11 w-40 rounded-full" aria-hidden="true" />;
  }

  const state = availabilityState({ activeCount, available });
  const copy = AVAILABILITY_COPY[state];
  const full = state === "at-capacity";
  const on = available && !full;

  return (
    <div
      title={copy.detail}
      className={cn(
        "inline-flex h-11 items-center gap-2.5 rounded-full pl-4 pr-1.5 ring-1 transition-colors",
        full ? "bg-warning-bg ring-warning-dot/20" : "bg-white ring-ink/[0.05]",
        isSaving && "opacity-70",
      )}
    >
      <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", DOT[state])} />
      <span className={cn("whitespace-nowrap text-[13px] font-bold tracking-[-0.01em]", full && "text-warning-ink")}>{copy.label}</span>
      {full ? (
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-extrabold tabular-nums text-warning-ink" aria-hidden="true">
          {Math.min(activeCount, MAX_ACTIVE_PROJECTS)}/{MAX_ACTIVE_PROJECTS}
        </span>
      ) : null}
      <Switch.Root
        checked={on}
        onCheckedChange={setAvailable}
        disabled={isSaving || full}
        aria-label={`Available for new work: ${on ? "on" : "off"}. ${copy.detail}`}
        className={cn(
          "relative mr-1 h-[22px] w-[38px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          on ? "bg-success-dot" : full ? "bg-warning-dot/30" : "bg-muted",
          full && "cursor-not-allowed",
        )}
      >
        <Switch.Thumb className="block h-4 w-4 translate-x-[3px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
}
