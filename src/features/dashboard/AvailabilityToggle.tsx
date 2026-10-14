import * as Switch from "@radix-ui/react-switch";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { availabilityState, AVAILABILITY_COPY } from "@/stores/useAvailabilityStore";
import { useAvailability } from "./queries";

const TONE = {
  available: "bg-[var(--dl-card-yellow)]",
  paused: "bg-neutral-bg",
  "at-capacity": "bg-warning-bg",
} as const;

/** Shorter words for the top bar, where the pill sits beside other controls. */
const BAR_LABEL = {
  available: "Open to offers",
  paused: "Offers paused",
  "at-capacity": "At capacity",
} as const;

const DOT = {
  available: "bg-success-dot status-dot-pulse",
  paused: "bg-neutral-dot",
  "at-capacity": "bg-warning-dot",
} as const;

/**
 * Available, Paused, or At capacity.
 *
 * One of the few client controls with a real server effect: doer_pool requires
 * profiles.available, so pausing genuinely empties the board. At capacity the
 * switch is locked and labelled as such rather than showing the doer's own Paused
 * state, because the system set it, not them.
 */
export function AvailabilityToggle({
  compact = false,
  variant = "card",
}: {
  compact?: boolean;
  /** "bar" is the slim pill in the app's top bar; the explanation moves to a tooltip. */
  variant?: "card" | "bar";
}) {
  const { available, activeCount, isLoading, isSaving, setAvailable } = useAvailability();

  if (isLoading) {
    return <div className="skeleton h-9 w-36 rounded-full" aria-hidden="true" />;
  }

  const state = availabilityState({ activeCount, available });
  const copy = AVAILABILITY_COPY[state];
  const locked = !copy.canToggle;

  if (variant === "bar") {
    return (
      <div
        title={copy.detail}
        className={cn(
          "inline-flex h-11 items-center gap-2.5 rounded-full bg-white pl-4 pr-1.5 ring-1 ring-ink/[0.05]",
          isSaving && "opacity-70",
        )}
      >
        <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", DOT[state])} />
        <span className="text-[13px] font-bold tracking-[-0.01em]">{BAR_LABEL[state]}</span>
        {locked ? (
          <span className="flex h-8 w-8 items-center justify-center" aria-hidden="true">
            <Lock className="h-3.5 w-3.5 text-ink/55" />
          </span>
        ) : (
          <Switch.Root
            checked={available}
            onCheckedChange={setAvailable}
            disabled={isSaving}
            aria-label={`Open to offers: ${available ? "on" : "off"}. ${copy.detail}`}
            className={cn(
              "relative mr-1 h-[22px] w-[38px] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              available ? "bg-success-dot" : "bg-muted",
            )}
          >
            <Switch.Thumb className="block h-4 w-4 translate-x-[3px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform data-[state=checked]:translate-x-[19px]" />
          </Switch.Root>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", compact ? "items-start" : "items-end")}>
      <div
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border border-line-card bg-surface/90 px-3 py-1.5 shadow-soft-md backdrop-blur-sm",
          TONE[state],
          isSaving && "opacity-70",
        )}
      >
        <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", DOT[state])} />
        <span className="text-xs font-extrabold tracking-[-0.01em]">{copy.label}</span>

        {locked ? (
          <Lock className="h-3 w-3 text-ink/55" aria-hidden="true" />
        ) : (
          <Switch.Root
            checked={available}
            onCheckedChange={setAvailable}
            disabled={isSaving}
            aria-label={"Availability: " + copy.label}
            className={cn(
              "relative h-5 w-9 rounded-full border border-line-card transition-colors",
              available ? "bg-surface" : "bg-muted",
            )}
          >
            <Switch.Thumb className="block h-3 w-3 translate-x-[3px] rounded-full bg-ink transition-transform data-[state=checked]:translate-x-[18px]" />
          </Switch.Root>
        )}
      </div>

      <p
        className={cn(
          "max-w-[17rem] text-[11px] leading-snug text-ink-muted",
          compact ? "text-left" : "text-right",
        )}
      >
        {copy.detail}
      </p>
    </div>
  );
}
