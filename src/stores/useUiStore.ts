import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkBucket } from "@/types/domain";

export const PALETTES = ["cobalt"] as const;
export type Palette = (typeof PALETTES)[number];

export const PALETTE_META: Record<
  Palette,
  { label: string; description: string; swatches: [string, string] }
> = {
  cobalt: {
    label: "Cobalt",
    description: "Dolancer signature blue",
    swatches: ["#5A7CFF", "#14b8a6"],
  },
};

/**
 * Purely presentational state. Nothing here is ever a source of truth about the
 * platform, and nothing here is read back by the backend.
 */
interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  workBucket: WorkBucket;
  palette: Palette;
  /** Readiness prompts the doer has dismissed, keyed by step id. */
  dismissedPrompts: string[];
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setWorkBucket: (bucket: WorkBucket) => void;
  setPalette: (palette: Palette) => void;
  dismissPrompt: (id: string) => void;
  restorePrompts: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      workBucket: "active",
      palette: "cobalt",
      dismissedPrompts: [],
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setWorkBucket: (workBucket) => set({ workBucket }),
      setPalette: (palette) => set({ palette }),
      dismissPrompt: (id) =>
        set((state) =>
          state.dismissedPrompts.includes(id)
            ? state
            : { dismissedPrompts: [...state.dismissedPrompts, id] },
        ),
      restorePrompts: () => set({ dismissedPrompts: [] }),
    }),
    {
      name: "dolancer.ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        workBucket: state.workBucket,
        palette: state.palette,
        dismissedPrompts: state.dismissedPrompts,
      }),
    },
  ),
);
