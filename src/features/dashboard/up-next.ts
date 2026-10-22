import type { DoerProject } from "@/types/domain";

/** Work the doer can do now: ready to start, or under way. */
const WORKABLE: DoerProject["status"][] = ["paid", "in_progress"];
/** Accepted, but the client has not paid yet, so it cannot be started. */
const WAITING_TO_START: DoerProject["status"][] = ["claimed", "quoted"];

/**
 * The next task to finish and submit: the nearest deadline among work the doer can
 * do now, or, when there is none, among work they have accepted but cannot start
 * yet. Work already submitted never takes the slot, since there is nothing left to
 * do on it until the supervisor answers.
 */
export function pickUpNext(projects: DoerProject[]): DoerProject | null {
  const byDeadline = (a: DoerProject, b: DoerProject) => {
    if (!a.deliveryAt) return 1;
    if (!b.deliveryAt) return -1;
    return +new Date(a.deliveryAt) - +new Date(b.deliveryAt);
  };
  const workable = projects.filter((p) => WORKABLE.includes(p.status));
  const pool = workable.length > 0 ? workable : projects.filter((p) => WAITING_TO_START.includes(p.status));
  return [...pool].sort(byDeadline)[0] ?? null;
}
