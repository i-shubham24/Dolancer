import { supabase } from "@/lib/supabase";
import { callBooleanRpc, type RpcResult } from "@/lib/rpc";
import { selectColumns, pageLimit, cursorPage } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import { demoClaim, demoPoolView, demoRespond, isDemo } from "@/lib/demo-data";
import type { DoerPoolRow } from "@/types/database";
import type { PoolOffer } from "@/types/domain";

const POOL_COLUMNS = selectColumns(
  "id",
  "category",
  "status",
  "doer_payout_paise",
  "delivery_at",
  "created_at",
  "doer_brief",
);

export type PoolSort = "newest" | "payout" | "deadline";

const PAGE_SIZE = 20;

const CLAIM_REJECTED = "Someone else claimed this first. It is no longer available.";

/** The demo board in the requested order. It is small, so it is always one page. */
function sortDemoOffers(offers: PoolOffer[], sort: PoolSort): PoolOffer[] {
  if (sort === "payout") return offers.sort((a, b) => b.payoutPaise - a.payoutPaise);
  if (sort === "deadline") {
    // Offers without a deadline sink, matching nullsFirst: false below.
    const due = (offer: PoolOffer) => offer.deliveryAt ?? "9999";
    return offers.sort((a, b) => due(a).localeCompare(due(b)));
  }
  return offers;
}

/**
 * Read the claim pool.
 *
 * The view does the gatekeeping, not this query. doer_pool already requires
 * profiles.available, a doer_skills category match against the project, and (for a
 * doer below L2) that the head-start window from claim_pool_config has elapsed. So
 * an empty result is a legitimate state with several possible causes, not an error,
 * and the empty states in the UI have to distinguish them.
 *
 * Note what is absent: no client price, no client identity, no supervisor identity.
 * There is nothing more to ask this view for, which is what makes the anonymity
 * guarantee structural rather than a matter of discipline.
 */
export async function fetchPool(input: {
  cursor?: string | null;
  sort?: PoolSort;
}): Promise<{ items: PoolOffer[]; nextCursor: string | null }> {
  const sort = input.sort ?? "newest";

  if (isDemo()) {
    return demoRespond(() => ({ items: sortDemoOffers(demoPoolView(), sort), nextCursor: null }));
  }

  let query = supabase.from("doer_pool").select(POOL_COLUMNS).limit(pageLimit(PAGE_SIZE));

  // Only the created_at ordering supports the keyset cursor. The other sorts are a
  // single page, which is honest for a pool that is rarely deep.
  if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
    if (input.cursor) query = query.lt("created_at", input.cursor);
  } else if (sort === "payout") {
    query = query.order("doer_payout_paise", { ascending: false });
  } else {
    query = query.order("delivery_at", { ascending: true, nullsFirst: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = ((data as unknown as DoerPoolRow[] | null) ?? []).map(
    (row): PoolOffer => ({
      id: row.id,
      category: row.category,
      status: row.status,
      payoutPaise: toPaise(row.doer_payout_paise),
      deliveryAt: row.delivery_at,
      createdAt: row.created_at,
      brief: row.doer_brief,
    }),
  );

  if (sort !== "newest") return { items: rows.slice(0, PAGE_SIZE), nextCursor: null };
  return cursorPage(rows, PAGE_SIZE, (row) => row.createdAt);
}

/**
 * Claim a project. First qualified claim wins.
 *
 * The RPC returns false when the update matched nothing, which means someone else
 * took it, or an eligibility gate failed. That is not an error and gets its own
 * message. A thrown error is different: the RPC raises for suspension, unapproved
 * KYC, and incomplete training, and those messages are worth surfacing as they are.
 *
 * The parameter is p_id. Not p_project_id.
 */
export async function claimProject(projectId: string): Promise<RpcResult<true>> {
  if (isDemo()) {
    return demoRespond(
      (): RpcResult<true> =>
        demoClaim(projectId)
          ? { ok: true, data: true }
          : { ok: false, kind: "rejected", message: CLAIM_REJECTED },
    );
  }
  return callBooleanRpc("claim_project_as_doer", { p_id: projectId }, CLAIM_REJECTED);
}
