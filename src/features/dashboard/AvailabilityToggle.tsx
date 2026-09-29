import * as Switch from "@radix-ui/react-switch";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { availabilityState, AVAILABILITY_COPY } from "@/stores/useAvailabilityStore";
import { useAvailability } from "./queries";

const TONE = {
  available: "bg-emerald-50/90 text-emerald-900 border-emerald-200/80 shadow-xs",
  paused: "bg-slate-100/90 text-slate-700 border-slate-200/80 shadow-xs",
  "at-capacity": "bg-amber-50/90 text-amber-900 border-amber-200/80 shadow-xs",
} as const;

const DOT = {
  available: "bg-emerald-500 status-dot-pulse",
  paused: "bg-slate-400",
  "at-capacity": "bg-amber-500",
} as const;

/**
 * Available, Paused, or At capacity.
 *
 * One of the few client controls with a real server effect: doer_pool requires
 * profiles.available, so pausing genuinely empties the board. At capacity the
 * switch is locked and labelled as such rather than showing the doer's own Paused
 * state, because the system set it, not them.
 */
export function AvailabilityToggle({ compact = false }: { compact?: boolean }) {
  const { available, activeCount, isLoading, isSaving, setAvailable } = useAvailability();

  if (isLoading) {
    return <div className="skeleton h-9 w-36 rounded-full" aria-hidden="true" />;
  }

  const state = availabilityState({ activeCount, available });
  const copy = AVAILABILITY_COPY[state];
  const locked = !copy.canToggle;

  return (
    <div className={cn("flex flex-col gap-1.5", compact ? "items-start" : "items-end")}>
      <div
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 shadow-soft-sm backdrop-blur-sm transition-colors",
          TONE[state],
          isSaving && "opacity-70",
        )}
      >
        <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", DOT[state])} />
        <span className="text-xs font-extrabold tracking-[-0.01em]">{copy.label}</span>

        {locked ? (
          <Lock className="h-3 w-3 text-slate-400" aria-hidden="true" />
        ) : (
          <Switch.Root
            checked={available}
            onCheckedChange={setAvailable}
            disabled={isSaving}
            aria-label={"Availability: " + copy.label}
            className={cn(
              "relative h-5 w-9 rounded-full border transition-colors cursor-pointer",
              available ? "bg-emerald-600 border-emerald-600" : "bg-slate-200 border-slate-300",
            )}
          >
            <Switch.Thumb className="block h-3.5 w-3.5 translate-x-[2px] rounded-full bg-white shadow-xs transition-transform data-[state=checked]:translate-x-[18px]" />
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
