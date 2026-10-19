import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";
import { availabilityState, AVAILABILITY_COPY } from "@/stores/useAvailabilityStore";
import { useAvailability } from "./queries";

const DOT = {
  available: "bg-success-dot status-dot-pulse",
  paused: "bg-neutral-dot",
} as const;

/**
 * Available or Paused toggle, supporting both expanded left navigation and collapsed icon view.
 */
export function AvailabilityToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { available, activeCount, isLoading, isSaving, setAvailable } = useAvailability();

  if (isLoading) {
    return (
      <div
        className={cn(
          "skeleton rounded-xl",
          collapsed ? "mx-auto h-10 w-10" : "h-11 w-full",
        )}
        aria-hidden="true"
      />
    );
  }

  const state = availabilityState({ activeCount, available });
  const copy = AVAILABILITY_COPY[state];
  const on = available;

  if (collapsed) {
    return null;
  }

  return (
    <div
      title={copy.detail}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl bg-white px-3.5 ring-1 ring-ink/[0.05] shadow-xs transition-colors",
        isSaving && "opacity-70",
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", DOT[state])} />
        <span className="truncate text-[13px] font-bold tracking-[-0.01em] text-ink">{copy.label}</span>
      </div>
      <Switch.Root
        checked={on}
        onCheckedChange={setAvailable}
        disabled={isSaving}
        aria-label={`Available for new work: ${on ? "on" : "off"}. ${copy.detail}`}
        className={cn(
          "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          on ? "bg-success-dot" : "bg-muted",
        )}
      >
        <Switch.Thumb className="block h-4 w-4 translate-x-[3px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform data-[state=checked]:translate-x-[19px]" />
      </Switch.Root>
    </div>
  );
}
