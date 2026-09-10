import { supabase } from "@/lib/supabase";
import { callBooleanRpc, type RpcResult } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import { bucketStatuses } from "@/lib/status";
import type { ProjectsDoerRow } from "@/types/database";
import type { DoerProject, WorkBucket } from "@/types/domain";

export const PROJECT_COLUMNS = selectColumns(
  "id",
  "category",
  "status",
  "created_at",
  "updated_at",
  "working_doc_url",
  "progress_pct",
  "supervisor_id",
  "qc_bounce_count",
  "last_bounce_reason",
  "doer_payout_paise",
  "doer_brief",
  "delivery_at",
  "user_revision_reason",
  "user_revision_count",
);

export function mapProject(row: ProjectsDoerRow): DoerProject {
  return {
    id: row.id,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    workingDocUrl: row.working_doc_url,
    progressPct: row.progress_pct ?? 0,
    supervisorId: row.supervisor_id,
    qcBounceCount: row.qc_bounce_count ?? 0,
    lastBounceReason: row.last_bounce_reason,
    payoutPaise: toPaise(row.doer_payout_paise),
    brief: row.doer_brief,
    deliveryAt: row.delivery_at,
    revisionReason: row.user_revision_reason,
    revisionCount: row.user_revision_count ?? 0,
  };
}

export async function fetchProjects(bucket: WorkBucket): Promise<DoerProject[]> {
  const { data, error } = await supabase
    .from("projects_doer")
    .select(PROJECT_COLUMNS)
    .in("status", [...bucketStatuses(bucket)])
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return ((data as unknown as ProjectsDoerRow[] | null) ?? []).map(mapProject);
}

export async function fetchProject(projectId: string): Promise<DoerProject | null> {
  const { data, error } = await supabase
    .from("projects_doer")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .limit(1);
  if (error) throw new Error(error.message);
  const row = (data as unknown as ProjectsDoerRow[] | null)?.[0];
  return row ? mapProject(row) : null;
}

/*
 * Lifecycle transitions.
 *
 * Every one of these is an UPDATE guarded on status and ownership, returning
 * row_count > 0. A false result means the row moved on without us, which is why
 * each carries its own message rather than a generic failure.
 */

export async function startWork(projectId: string): Promise<RpcResult<true>> {
  return callBooleanRpc(
    "start_work",
    { p_id: projectId },
    "This project is not ready to start. It may have already moved on.",
  );
}

export async function submitForReview(projectId: string): Promise<RpcResult<true>> {
  return callBooleanRpc(
    "submit_for_review",
    { p_id: projectId },
    "This could not be submitted. It may already be with your supervisor.",
  );
}

/**
 * The doer sets their own working link. Blank clears it.
 * The database validates that it is https and under 2048 characters.
 */
export async function setWorkingDoc(
  projectId: string,
  url: string,
): Promise<RpcResult<true>> {
  return callBooleanRpc(
    "set_working_doc",
    { p_id: projectId, p_url: url.trim() },
    "The link could not be saved. This project may no longer be active.",
  );
}

/** Note the name: set_project_progress, not set_progress. */
export async function setProgress(
  projectId: string,
  pct: number,
): Promise<RpcResult<true>> {
  return callBooleanRpc(
    "set_project_progress",
    { p_id: projectId, p_pct: Math.max(0, Math.min(100, Math.round(pct))) },
    "Progress could not be updated. This project may no longer be active.",
  );
}
