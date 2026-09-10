import { supabase } from "@/lib/supabase";
import { callRowRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import type { EarningsSummaryRow, LedgerDoerRow } from "@/types/database";
import type { EarningsSummary } from "@/types/domain";

export interface LedgerRow {
  id: string;
  projectId: string;
  amountPaise: number;
  createdAt: string;
}

/**
 * Lifetime figures.
 *
 * doer_earnings_summary() is a table-returning function, so a single logical row
 * still arrives as an array. It sums release_doer legs as gross and tax legs as
 * withheld, both scoped to the caller, and returns net as the difference.
 */
export async function fetchEarningsSummary(): Promise<EarningsSummary> {
  const row = unwrap(await callRowRpc<EarningsSummaryRow>("doer_earnings_summary"));
  return {
    grossPaise: toPaise(row?.gross_paise),
    taxWithheldPaise: toPaise(row?.tax_withheld_paise),
    netPaise: toPaise(row?.net_paise),
  };
}

/**
 * The payout history.
 *
 * ledger_doer is already filtered to this doer's release_doer legs, so every row
 * here is money that has been released. There is no status column to render and no
 * pending rows to miss: the view cannot contain them.
 *
 * The per-row tax split is deliberately absent. Tax legs are written per
 * beneficiary at release against cumulative financial-year earnings, and
 * ledger_doer does not expose them, so any per-project TDS figure shown here would
 * be a guess. The withheld total comes from the summary instead.
 */
export async function fetchLedger(): Promise<LedgerRow[]> {
  const { data, error } = await supabase
    .from("ledger_doer")
    .select(selectColumns("id", "project_id", "entry_type", "amount_paise", "created_at"))
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  return ((data as unknown as LedgerDoerRow[] | null) ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    amountPaise: toPaise(row.amount_paise),
    createdAt: row.created_at,
  }));
}
