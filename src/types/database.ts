/**
 * Hand-written mirror of the Supabase relations this app reads.
 *
 * These are not generated: PostgREST schema introspection is hardened against the
 * publishable key on this project (it answers "Secret API key required"), so the
 * types are transcribed from the migration SQL and must be updated by hand when the
 * backend changes.
 *
 * Column lists are exact and exhaustive. `select *` is forbidden throughout this
 * codebase because several columns are grant-revoked (kyc.national_id_doc_ref,
 * messages.relayed_from_message_id) and a wildcard select errors outright.
 */

export type ProjectStatus =
  | "draft"
  | "submitted"
  | "claimed"
  | "quoted"
  | "paid"
  | "in_progress"
  | "in_review"
  | "delivered"
  | "approved"
  | "cancelled";

export type KycStatus = "pending" | "submitted" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type UserRole = "user" | "supervisor" | "doer" | "admin";

/**
 * View: doer_pool. Exactly 7 columns.
 *
 * Deliberately carries no client price, no client identity and no supervisor
 * identity. The anonymity guarantee is structural here: there is nothing more to ask
 * for. Visibility already applies profiles.available, a doer_skills category match,
 * and the L1 head-start window from claim_pool_config.
 */
export interface DoerPoolRow {
  id: string;
  category: string;
  status: ProjectStatus;
  /** bigint over the wire, arrives as a string */
  doer_payout_paise: string | number | null;
  delivery_at: string | null;
  created_at: string;
  /** Supervisor-authored redacted brief. Never the client's raw brief. */
  doer_brief: string | null;
}

/** View: projects_doer. Exactly 15 columns, filtered to doer_id = auth.uid(). */
export interface ProjectsDoerRow {
  id: string;
  category: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  working_doc_url: string | null;
  progress_pct: number | null;
  supervisor_id: string | null;
  qc_bounce_count: number | null;
  last_bounce_reason: string | null;
  doer_payout_paise: string | number | null;
  doer_brief: string | null;
  delivery_at: string | null;
  user_revision_reason: string | null;
  user_revision_count: number | null;
}

/** View: ledger_doer. Exactly 5 columns, already filtered to release_doer legs. */
export interface LedgerDoerRow {
  id: string;
  project_id: string;
  entry_type: string;
  amount_paise: string | number;
  created_at: string;
}

/** RPC: doer_earnings_summary(). Table-returning, so it arrives as an array. */
export interface EarningsSummaryRow {
  gross_paise: string | number;
  tax_withheld_paise: string | number;
  net_paise: string | number;
}

/** RPC: my_rating_summary(). */
export interface RatingSummaryRow {
  avg_score: string | number | null;
  rating_count: string | number;
  level: string;
}

/** Table: profiles. Only the columns this app is granted and needs. */
export interface ProfileRow {
  full_name: string | null;
  whatsapp: string | null;
  country: string | null;
  available: boolean;
}

export interface KycRow {
  status: KycStatus;
}

export interface DoerApplicationRow {
  id: string;
  bio: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface SkillRow {
  id: string;
  name: string;
  category: string;
}

export interface LessonRow {
  id: string;
  title: string;
  module_order: number | null;
}

export interface NotificationRow {
  id: string;
  template_type: string;
  deep_link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
}
