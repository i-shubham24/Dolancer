import type { ProjectStatus } from "./database";

export type WorkBucket = "active" | "closed";

/** Visual status families, mapped from the raw project status. */
export type StatusTone = "assigned" | "progress" | "review" | "changes" | "approved";

export interface DoerGateState {
  /** Role has been flipped to doer by an approved application. */
  isDoer: boolean;
  applicationSubmitted: boolean;
  applicationStatus: "none" | "pending" | "approved" | "rejected";
  kycDone: boolean;
  skillsDone: boolean;
  trainingDone: boolean;
  stepsDone: number;
  totalSteps: number;
  /** Every gate is satisfied, so this doer can claim and earn. */
  unlocked: boolean;
}

export interface EarningsSummary {
  grossPaise: number;
  taxWithheldPaise: number;
  netPaise: number;
}

export interface PoolOffer {
  id: string;
  category: string;
  status: ProjectStatus;
  payoutPaise: number;
  deliveryAt: string | null;
  createdAt: string;
  brief: string | null;
}

export interface DoerProject {
  id: string;
  category: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  workingDocUrl: string | null;
  progressPct: number;
  supervisorId: string | null;
  qcBounceCount: number;
  lastBounceReason: string | null;
  payoutPaise: number;
  brief: string | null;
  deliveryAt: string | null;
  revisionReason: string | null;
  revisionCount: number;
}
