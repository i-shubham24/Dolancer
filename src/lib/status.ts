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
 * The working-link rule (PRD FR-DO-012, BR-018): Working artefacts are created and
 * owned by company workspace accounts, never by a doer's personal account. The
 * supervisor provides the link, and the doer cannot start work until it is present.
 */
export function workbenchGates(project: { status: ProjectStatus; workingDocUrl: string | null }) {
  const hasWorkingDoc = Boolean(project.workingDocUrl?.trim());
  return {
    hasWorkingDoc,
    canSetWorkingDoc: false, // PRD BR-018: Supervisor sets this, not the doer.
    canStart: project.status === "paid" && hasWorkingDoc,
    canSetProgress: hasWorkingDoc && ["in_progress", "in_review"].includes(project.status),
    canSubmit: hasWorkingDoc && project.status === "in_progress",
    /**
     * Stated as a consequence, not a refusal.
     */
    blockedReason: hasWorkingDoc
      ? null
      : "Waiting for your supervisor to set up the company workspace. You can start work once the link appears.",
  };
}
