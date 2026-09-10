import { supabase } from "@/lib/supabase";
import { callRowRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import { fetchProjects } from "@/features/work/api";
import type {
  DoerApplicationRow,
  EarningsSummaryRow,
  KycRow,
  LessonRow,
  ProfileRow,
  DoerPoolRow,
} from "@/types/database";
import type { DoerGateState, DoerProject, EarningsSummary, PoolOffer } from "@/types/domain";

export async function fetchProfile(): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select(selectColumns("full_name", "whatsapp", "country", "available"))
    .limit(1);
  if (error) throw new Error(error.message);
  const row = (data as unknown as ProfileRow[] | null)?.[0];
  return row ?? { full_name: null, whatsapp: null, country: null, available: true };
}

export async function setAvailability(available: boolean): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const id = userData.user?.id;
  if (!id) throw new Error("Not signed in");
  const { error } = await supabase.from("profiles").update({ available }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Active work, delegated to the work feature so the column list lives in one place. */
export async function fetchActiveProjects(): Promise<DoerProject[]> {
  return fetchProjects("active");
}

export async function fetchEarningsSummary(): Promise<EarningsSummary> {
  const row = unwrap(await callRowRpc<EarningsSummaryRow>("doer_earnings_summary"));
  return {
    grossPaise: toPaise(row?.gross_paise),
    taxWithheldPaise: toPaise(row?.tax_withheld_paise),
    netPaise: toPaise(row?.net_paise),
  };
}

/**
 * A small slice of the claim pool for the dashboard.
 *
 * The view already applies availability, skill matching and the L1 head-start
 * window, so an empty result is a legitimate state and not an error.
 */
export async function fetchPoolPreview(limit = 3): Promise<PoolOffer[]> {
  const { data, error } = await supabase
    .from("doer_pool")
    .select(
      selectColumns(
        "id",
        "category",
        "status",
        "doer_payout_paise",
        "delivery_at",
        "created_at",
        "doer_brief",
      ),
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data as unknown as DoerPoolRow[] | null) ?? []).map((row) => ({
    id: row.id,
    category: row.category,
    status: row.status,
    payoutPaise: toPaise(row.doer_payout_paise),
    deliveryAt: row.delivery_at,
    createdAt: row.created_at,
    brief: row.doer_brief,
  }));
}

/**
 * The readiness state behind the dashboard checklist.
 *
 * Every read is tolerated failing: a doer whose skills query blips should still see
 * a working dashboard, so each branch resolves to a safe default rather than
 * rejecting the whole screen.
 */
export async function fetchGateState(role: string | null): Promise<DoerGateState> {
  const [applicationResult, kycResult, skillsResult, lessonsResult, progressResult] =
    await Promise.allSettled([
      supabase
        .from("doer_applications")
        .select(selectColumns("id", "bio", "status", "created_at"))
        .limit(1),
      supabase.from("kyc").select(selectColumns("status")).limit(1),
      supabase.from("doer_skills").select(selectColumns("skill_id")).limit(50),
      supabase.from("lessons").select(selectColumns("id", "title", "module_order")).limit(100),
      supabase.from("lesson_progress").select(selectColumns("lesson_id")).limit(200),
    ]);

  const application =
    applicationResult.status === "fulfilled"
      ? ((applicationResult.value.data as unknown as DoerApplicationRow[] | null)?.[0] ?? null)
      : null;

  const kyc =
    kycResult.status === "fulfilled"
      ? ((kycResult.value.data as unknown as KycRow[] | null)?.[0] ?? null)
      : null;

  const skillCount =
    skillsResult.status === "fulfilled"
      ? ((skillsResult.value.data as unknown[] | null)?.length ?? 0)
      : 0;

  const lessons =
    lessonsResult.status === "fulfilled"
      ? ((lessonsResult.value.data as unknown as LessonRow[] | null) ?? [])
      : [];

  const completedIds = new Set(
    progressResult.status === "fulfilled"
      ? ((progressResult.value.data as unknown as { lesson_id: string }[] | null) ?? []).map(
          (row) => row.lesson_id,
        )
      : [],
  );

  // An empty published-lesson list counts as done, matching the server-side check.
  const trainingDone = lessons.every((lesson) => completedIds.has(lesson.id));
  const kycDone = kyc?.status === "approved";
  const skillsDone = skillCount > 0;
  const isDoer = role === "doer";

  const applicationStatus: DoerGateState["applicationStatus"] = application
    ? application.status
    : "none";

  const steps = [isDoer, kycDone, skillsDone, trainingDone];
  const stepsDone = steps.filter(Boolean).length;

  return {
    isDoer,
    applicationSubmitted: application !== null,
    applicationStatus,
    kycDone,
    skillsDone,
    trainingDone,
    stepsDone,
    totalSteps: steps.length,
    unlocked: isDoer && kycDone && skillsDone && trainingDone,
  };
}
