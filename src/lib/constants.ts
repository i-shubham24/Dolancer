/**
 * Platform constants that carry a rule with them.
 */

/**
 * The only string this app may ever use to refer to the person who submitted the
 * work. A doer must never learn a client's name, email, phone, company, or domain.
 * That guarantee is enforced in Postgres RLS, not here, but this constant keeps the
 * UI from ever implying otherwise.
 *
 * Note the PRD does not actually specify this label: section 4.3 defines only the
 * labels a client sees. This fills that gap.
 */
export const CLIENT_LABEL = "Client";

/**
 * Soft concurrency guardrail. There is no database constraint behind this, and
 * claim_project_as_doer is directly callable, so treat it as UX and never as a
 * security control. At the cap we disable claiming and the doer reads as "At capacity".
 */
export const MAX_ACTIVE_PROJECTS = 3;

/** Project statuses that count as active work for the doer. */
export const ACTIVE_STATUSES = [
  "claimed",
  "quoted",
  "paid",
  "in_progress",
  "in_review",
  "delivered",
] as const;

export const CLOSED_STATUSES = ["approved", "cancelled"] as const;

/** Supabase Storage buckets reachable from this client. */
export const BUCKETS = {
  chat: "chat-attachments",
  deliverables: "deliverables",
  kyc: "kyc-docs",
} as const;

/** Chat composer limit, matching the platform rule. */
export const MAX_MESSAGE_LENGTH = 4000;
