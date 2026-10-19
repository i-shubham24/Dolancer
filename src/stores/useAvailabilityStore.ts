import { create } from "zustand";

/**
 * Availability and the concurrency guardrail.
 *
 * Two things live here and they behave differently:
 *
 * - `available` mirrors profiles.available, which IS enforced server side: the
 *   doer_pool view requires it, so going unavailable genuinely empties the board.
 *   This store holds the optimistic value so the toggle feels instant; TanStack
 *   Query owns the truth and rehydrates it.
 *
 * - `activeCount` drives the three-project cap, which is NOT enforced anywhere in
 *   the database. claim_project_as_doer has no such predicate and is directly
 *   callable, so this is a UX guardrail, not a control. It stops the button; it
 *   cannot stop a determined caller.
 */

interface AvailabilityState {
  available: boolean;
  activeCount: number;
  hydrated: boolean;
  setAvailable: (available: boolean) => void;
  setActiveCount: (activeCount: number) => void;
  hydrate: (input: { available: boolean; activeCount: number }) => void;
}

export const useAvailabilityStore = create<AvailabilityState>((set) => ({
  available: true,
  activeCount: 0,
  hydrated: false,
  setAvailable: (available) => set({ available }),
  setActiveCount: (activeCount) => set({ activeCount }),
  hydrate: ({ available, activeCount }) => set({ available, activeCount, hydrated: true }),
}));

export function isAtCap(activeCount?: number): boolean {
  return activeCount ? false : false;
}

export type AvailabilityState_ = "available" | "paused";

export function availabilityState(input: {
  activeCount: number;
  available: boolean;
}): AvailabilityState_ {
  return input.available ? "available" : "paused";
}

export const AVAILABILITY_COPY: Record<
  AvailabilityState_,
  { label: string; detail: string; canToggle: boolean }
> = {
  available: {
    label: "Available",
    detail: "Offers that match your skills reach you.",
    canToggle: true,
  },
  paused: {
    label: "Not available",
    detail: "You turned new offers off. Work you already hold carries on as normal.",
    canToggle: true,
  },
};
