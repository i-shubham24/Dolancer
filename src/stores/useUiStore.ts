import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkBucket } from "@/types/domain";

/**
 * Purely presentational state. Nothing here is ever a source of truth about the
 * platform, and nothing here is read back by the backend.
 */
interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  workBucket: WorkBucket;
  /** Readiness prompts the doer has dismissed, keyed by step id. */
  dismissedPrompts: string[];
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setWorkBucket: (bucket: WorkBucket) => void;
  dismissPrompt: (id: string) => void;
  restorePrompts: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      workBucket: "active",
      dismissedPrompts: [],
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setWorkBucket: (workBucket) => set({ workBucket }),
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
        dismissedPrompts: state.dismissedPrompts,
      }),
    },
  ),
);
