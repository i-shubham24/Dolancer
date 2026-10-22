import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isDemo } from "@/lib/demo-auth";

/**
 * The setup step the server does not record: agreeing to the guidelines.
 *
 * Kept on the device until the database has a column for it. The demo keeps it
 * for the tab only, so a fresh visit can walk through setup again.
 */
interface OnboardingState {
  guidelinesAt: string | null;
  acceptGuidelines: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      guidelinesAt: null,
      acceptGuidelines: () => set({ guidelinesAt: new Date().toISOString() }),
    }),
    {
      name: "dolancer.onboarding",
      storage: createJSONStorage(() => (isDemo() ? sessionStorage : localStorage)),
    },
  ),
);
