import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isDemo } from "@/lib/demo-auth";

/**
 * The two setup steps the server does not record: agreeing to the guidelines, and
 * pressing Start earning at the end of setup, after which sign-in lands on the
 * dashboard instead of the welcome page.
 *
 * Kept on the device until the database has columns for them. The demo keeps them
 * for the tab only, so a fresh visit can walk through setup again.
 */
interface OnboardingState {
  guidelinesAt: string | null;
  started: boolean;
  acceptGuidelines: () => void;
  markStarted: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      guidelinesAt: null,
      started: false,
      acceptGuidelines: () => set({ guidelinesAt: new Date().toISOString() }),
      markStarted: () => set({ started: true }),
    }),
    {
      name: "dolancer.onboarding",
      storage: createJSONStorage(() => (isDemo() ? sessionStorage : localStorage)),
    },
  ),
);
