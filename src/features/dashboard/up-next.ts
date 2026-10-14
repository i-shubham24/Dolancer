import type { DoerProject } from "@/types/domain";

/**
 * The one task to look at next: the nearest deadline among work the doer can act
 * on. Work sitting with the supervisor only takes the slot when nothing else does,
 * because there is nothing for the doer to do on it.
 */
export function pickUpNext(projects: DoerProject[]): DoerProject | null {
  const byDeadline = (a: DoerProject, b: DoerProject) => {
    if (!a.deliveryAt) return 1;
    if (!b.deliveryAt) return -1;
    return +new Date(a.deliveryAt) - +new Date(b.deliveryAt);
  };
  const actionable = projects.filter((p) => p.status === "in_progress" || p.status === "paid");
  return [...(actionable.length > 0 ? actionable : projects)].sort(byDeadline)[0] ?? null;
}
