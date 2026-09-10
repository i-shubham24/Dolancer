/**
 * Build a PostgREST select list.
 *
 * Refuses a wildcard on purpose. Several tables here revoke the default all-column
 * grant (kyc.national_id_doc_ref and messages.relayed_from_message_id are admin
 * only), so `select *` does not merely over-fetch, it errors. Listing columns also
 * makes it reviewable that no client-identifying field is ever requested.
 */
export function selectColumns(...columns: readonly string[]): string {
  if (columns.length === 0) throw new Error("selectColumns needs at least one column");
  for (const column of columns) {
    if (!column || column.trim() === "" || column.includes("*")) {
      throw new Error(`Invalid select column: "${column}". Wildcards are not allowed.`);
    }
  }
  return columns.join(", ");
}

/**
 * Cursor pagination. Fetch one extra row to learn whether another page exists,
 * without a count query.
 */
export function pageLimit(size: number): number {
  return size + 1;
}

export function cursorPage<T>(
  rows: readonly T[],
  size: number,
  getCursor: (row: T) => string,
): { items: T[]; nextCursor: string | null } {
  const hasMore = rows.length > size;
  const items = hasMore ? rows.slice(0, size) : [...rows];
  const last = items[items.length - 1];
  return { items, nextCursor: hasMore && last ? getCursor(last) : null };
}
