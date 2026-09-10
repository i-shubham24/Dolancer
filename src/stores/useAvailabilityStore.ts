import { create } from "zustand";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";

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

export function isAtCap(activeCount: number): boolean {
  return activeCount >= MAX_ACTIVE_PROJECTS;
}

/**
 * Three states, not two.
 *
 * "At capacity" is set by the system when all slots are full. "Paused" is a choice
 * the doer made while they still had room. Collapsing both into one "Busy" label
 * makes the automatic flip read as the platform overriding a personal decision,
 * which is exactly the wrong feeling for the one control that governs their income.
 * The distinction also tells them which one they can undo.
 */
export type AvailabilityState_ = "available" | "paused" | "at-capacity";

export function availabilityState(input: {
  activeCount: number;
  available: boolean;
}): AvailabilityState_ {
  if (isAtCap(input.activeCount)) return "at-capacity";
  return input.available ? "available" : "paused";
}

export const AVAILABILITY_COPY: Record<
  AvailabilityState_,
  { label: string; detail: string; canToggle: boolean }
> = {
  available: {
    label: "Available",
    detail: "Matching work shows on your board.",
    canToggle: true,
  },
  paused: {
    label: "Paused",
    detail: "You have hidden the board. Work you already hold is unaffected.",
    canToggle: true,
  },
  "at-capacity": {
    label: "At capacity",
    detail:
      // Borrowed from how Fiverr handles a full queue. Naming the consequence that
      // does NOT happen is what stops the cap reading as a penalty.
      `You are holding ${MAX_ACTIVE_PROJECTS} projects, so the board is hidden. This does not affect your standing or your rating.`,
    canToggle: false,
  },
};
