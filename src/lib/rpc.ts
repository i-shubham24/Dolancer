import { supabase } from "./supabase";

/**
 * Calling Postgres functions safely.
 *
 * Every doer lifecycle RPC (start_work, submit_for_review, set_working_doc,
 * set_project_progress, claim_project_as_doer) is written as an UPDATE followed by
 * `get diagnostics n = row_count; return n > 0`. When the update matches nothing,
 * PostgREST returns `data === false` with `error === null`.
 *
 * That is NOT an error, and treating it as success is the bug this module exists to
 * prevent. A `false` means the row moved on without you: wrong status, not yours, or
 * already claimed by someone else. It always deserves its own branch and its own copy.
 */

export type RpcResult<T> =
  | { ok: true; data: T }
  /** The call succeeded but the database declined to act. */
  | { ok: false; kind: "rejected"; message: string }
  /** The call itself failed: network, permissions, a raised exception. */
  | { ok: false; kind: "error"; message: string };

type RpcParams = Record<string, unknown> | undefined;

async function invoke(fn: string, params?: RpcParams): Promise<{ data: unknown; error: { message: string } | null }> {
  const client = supabase as unknown as {
    rpc: (fn: string, params?: RpcParams) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  };
  return client.rpc(fn, params);
}

/**
 * Call a boolean-returning lifecycle RPC.
 * `rejectedMessage` is shown when the database returns false.
 */
export async function callBooleanRpc(
  fn: string,
  params: RpcParams,
  rejectedMessage: string,
): Promise<RpcResult<true>> {
  const { data, error } = await invoke(fn, params);
  if (error) return { ok: false, kind: "error", message: error.message };
  if (data === false) return { ok: false, kind: "rejected", message: rejectedMessage };
  return { ok: true, data: true };
}

/** Call an RPC that returns a scalar or object. */
export async function callRpc<T>(fn: string, params?: RpcParams): Promise<RpcResult<T>> {
  const { data, error } = await invoke(fn, params);
  if (error) return { ok: false, kind: "error", message: error.message };
  return { ok: true, data: data as T };
}

/**
 * Call a table-returning RPC and take the first row.
 *
 * doer_earnings_summary, my_rating_summary and grade_lesson are all declared
 * `returns table (...)`, so even a single logical row arrives as an array.
 */
export async function callRowRpc<T>(fn: string, params?: RpcParams): Promise<RpcResult<T | null>> {
  const { data, error } = await invoke(fn, params);
  if (error) return { ok: false, kind: "error", message: error.message };
  const row = Array.isArray(data) ? (data[0] as T | undefined) : (data as T | null);
  return { ok: true, data: row ?? null };
}

/** Unwrap a result, throwing on failure. Use inside TanStack Query fetchers. */
export function unwrap<T>(result: RpcResult<T>): T {
  if (result.ok) return result.data;
  throw new Error(result.message);
}
