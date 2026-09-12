/**
 * Hover/focus preloading for lazy route chunks.
 *
 * Every route except landing, sign-in and dashboard is a separate chunk behind
 * Suspense. Touching one here on pointer-enter or focus means the chunk is
 * usually already cached by the time the tap lands, so navigation reads as
 * instant. Each import stays a static string so the bundler keeps them as
 * split points. Calls are safe to repeat; loaded chunks resolve from cache.
 */
const LOADERS: Record<string, () => Promise<unknown>> = {
  "/work": () => import("@/features/work/WorkPage"),
  "/pool": () => import("@/features/pool/PoolPage"),
  "/earnings": () => import("@/features/earnings/EarningsPage"),
  "/notifications": () => import("@/features/notifications/NotificationsPage"),
  "/verification": () => import("@/features/verification/VerificationPage"),
  "/skills": () => import("@/features/skills/SkillsPage"),
  "/training": () => import("@/features/training/TrainingPage"),
  "/refer": () => import("@/features/referrals/ReferPage"),
  "/tickets": () => import("@/features/tickets/TicketsPage"),
  "/profile": () => import("@/features/profile/ProfilePage"),
  "/admin": () => import("@/features/admin/AdminPage"),
};

export function preloadRoute(to: string): void {
  try {
    void LOADERS[to]?.();
  } catch {
    // Preloading is best-effort. Navigation still loads the chunk on demand.
  }
}

/** Preload the workbench detail chunk for a project card. */
export function preloadWorkbench(): void {
  try {
    void import("@/features/work/WorkbenchPage");
  } catch {
    // Best-effort, same as above.
  }
}
