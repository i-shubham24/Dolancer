import { supabase } from "@/lib/supabase";
import { callBooleanRpc, type RpcResult } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import { bucketStatuses } from "@/lib/status";
import { demo, demoRespond, isDemo } from "@/lib/demo-data";
import type { ProjectStatus, ProjectsDoerRow } from "@/types/database";
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
  if (isDemo()) {
    const statuses = bucketStatuses(bucket);
    return demoRespond(() =>
      demo.projects
        .filter((project) => statuses.includes(project.status))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  }

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
  if (isDemo()) {
    return demoRespond(() => demo.projects.find((project) => project.id === projectId) ?? null);
  }

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

const REJECTED = {
  start: "This project is not ready to start. It may have already moved on.",
  submit: "This could not be submitted. It may already be with your supervisor.",
  workingDoc: "The link could not be saved. This project may no longer be active.",
  progress: "Progress could not be updated. This project may no longer be active.",
} as const;

/**
 * The demo stand-in for those guarded UPDATEs: change the project only from a
 * status the real RPC accepts, and report the same rejection otherwise.
 */
function demoTransition(
  projectId: string,
  from: readonly ProjectStatus[],
  change: (project: DoerProject) => void,
  rejectedMessage: string,
): Promise<RpcResult<true>> {
  return demoRespond((): RpcResult<true> => {
    const project = demo.projects.find((entry) => entry.id === projectId);
    if (!project || !from.includes(project.status)) {
      return { ok: false, kind: "rejected", message: rejectedMessage };
    }
    change(project);
    project.updatedAt = new Date().toISOString();
    return { ok: true, data: true };
  });
}

export async function startWork(projectId: string): Promise<RpcResult<true>> {
  if (isDemo()) {
    return demoTransition(
      projectId,
      ["paid"],
      (project) => {
        project.status = "in_progress";
      },
      REJECTED.start,
    );
  }
  return callBooleanRpc("start_work", { p_id: projectId }, REJECTED.start);
}

export async function submitForReview(projectId: string): Promise<RpcResult<true>> {
  if (isDemo()) {
    return demoTransition(
      projectId,
      ["in_progress"],
      (project) => {
        project.status = "in_review";
      },
      REJECTED.submit,
    );
  }
  return callBooleanRpc("submit_for_review", { p_id: projectId }, REJECTED.submit);
}

/**
 * The doer sets their own working link. Blank clears it.
 * The database validates that it is https and under 2048 characters.
 */
export async function setWorkingDoc(
  projectId: string,
  url: string,
): Promise<RpcResult<true>> {
  if (isDemo()) {
    return demoTransition(
      projectId,
      ["paid", "in_progress", "in_review"],
      (project) => {
        project.workingDocUrl = url.trim() || null;
      },
      REJECTED.workingDoc,
    );
  }
  return callBooleanRpc(
    "set_working_doc",
    { p_id: projectId, p_url: url.trim() },
    REJECTED.workingDoc,
  );
}

/** Note the name: set_project_progress, not set_progress. */
export async function setProgress(
  projectId: string,
  pct: number,
): Promise<RpcResult<true>> {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  if (isDemo()) {
    return demoTransition(
      projectId,
      ["in_progress", "in_review"],
      (project) => {
        project.progressPct = clamped;
      },
      REJECTED.progress,
    );
  }
  return callBooleanRpc(
    "set_project_progress",
    { p_id: projectId, p_pct: clamped },
    REJECTED.progress,
  );
}
