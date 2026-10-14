/**
 * What this device keeps for the signed-in doer: drafts, reminders, the work timer,
 * chat read marks, their own skills, setup progress. On a shared computer the next
 * person must not see any of it, so it is all removed when the account signs out.
 * Display preferences (sidebar, dashboard tab) are not personal and stay.
 */
const USER_KEYS = [
  "dolancer.availability.autoOff",
  "dolancer.board.notify",
  "dolancer.chat.read",
  "dolancer.onboarding",
  "dolancer.reminders",
  "dolancer.skills.extras",
  "dolancer.timer",
];
const USER_PREFIXES = ["dolancer.chat.draft."];

export function purgeUserData(): void {
  for (const pick of [() => window.localStorage, () => window.sessionStorage]) {
    try {
      const store = pick();
      // Collect first: removing while stepping through the keys can skip some.
      const doomed = Object.keys(store).filter(
        (key) => USER_KEYS.includes(key) || USER_PREFIXES.some((prefix) => key.startsWith(prefix)),
      );
      for (const key of doomed) store.removeItem(key);
    } catch {
      // Storage blocked: nothing was kept there to begin with.
    }
  }
}
