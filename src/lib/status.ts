import type { ProjectStatus } from "@/types/database";
import type { StatusTone, WorkBucket } from "@/types/domain";
import { ACTIVE_STATUSES, CLOSED_STATUSES } from "./constants";

/**
 * Doer-facing status copy.
 *
 * "paid" reads as "Ready to start", never as anything about money. The doer's
 * payout is fixed at claim time and has nothing to do with the client's payment
 * clearing; conflating the two would leak the shape of the client-side flow.
 */
const DISPLAY: Record<ProjectStatus, { tone: StatusTone; label: string }> = {
  draft: { tone: "assigned", label: "Assigned" },
  submitted: { tone: "assigned", label: "Assigned" },
  claimed: { tone: "assigned", label: "Assigned" },
  quoted: { tone: "assigned", label: "Assigned" },
  paid: { tone: "assigned", label: "Ready to start" },
  in_progress: { tone: "progress", label: "In progress" },
  in_review: { tone: "review", label: "With your supervisor" },
  delivered: { tone: "review", label: "Awaiting approval" },
  approved: { tone: "approved", label: "Approved" },
  cancelled: { tone: "changes", label: "Cancelled" },
};

/**
 * A missing working link is a STATE, not a failed validation.
 *
 * This is the single most useful pattern borrowed from how Fiverr models an order
 * that is waiting on requirements. Surfacing "Link needed" as a badge on the card
 * and in the workbench header means the doer discovers the blocker while scanning
 * their list, rather than by pressing a button and being refused. The blocker
 * becomes something to resolve rather than an error they triggered.
 */
export function statusDisplay(
  status: ProjectStatus,
  workingDocUrl?: string | null,
): { tone: StatusTone; label: string } {
  if (status === "in_progress" && !workingDocUrl?.trim()) {
    return { tone: "changes", label: "Link needed" };
  }
  return DISPLAY[status] ?? { tone: "assigned", label: "Assigned" };
}

export function bucketStatuses(bucket: WorkBucket): readonly ProjectStatus[] {
  return bucket === "active" ? ACTIVE_STATUSES : CLOSED_STATUSES;
}

export function isActiveStatus(status: ProjectStatus): boolean {
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

/**
 * Which workbench actions are available.
 *
 * The working-link rule: the doer pastes their own link through set_working_doc,
 * which is doer-scoped in the database. We then hold back progress updates and
 * submission until that link exists. Starting work is deliberately not blocked,
 * because start_work gates only on status and ownership, so blocking it here would
 * strand a project that nobody could advance.
 */
export function workbenchGates(project: { status: ProjectStatus; workingDocUrl: string | null }) {
  const hasWorkingDoc = Boolean(project.workingDocUrl?.trim());
  return {
    hasWorkingDoc,
    canSetWorkingDoc: ["paid", "in_progress", "in_review"].includes(project.status),
    canStart: project.status === "paid",
    canSetProgress: hasWorkingDoc && ["in_progress", "in_review"].includes(project.status),
    canSubmit: hasWorkingDoc && project.status === "in_progress",
    /**
     * Stated as a consequence, not a refusal. Naming what stays frozen is what makes
     * the gate feel like a step rather than a wall.
     */
    blockedReason: hasWorkingDoc
      ? null
      : "Nothing moves until your working link is in. Add it to update progress or submit.",
  };
}
