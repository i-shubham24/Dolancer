/**
 * Indian financial year helpers (April to March).
 *
 * The ledger carries only released payouts, so FY filtering is purely a
 * client-side view over dates the database already gave us. Summary figures
 * stay cumulative and are labelled as such.
 */

export function fyStartYear(date: Date): number {
  return date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
}

export function fyLabel(startYear: number): string {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

export function currentFyStartYear(now: Date = new Date()): number {
  return fyStartYear(now);
}

/** Distinct FY start years present in the given ISO dates, newest first. */
export function fyOptions(isoDates: string[]): number[] {
  const years = new Set<number>();
  for (const iso of isoDates) {
    const time = Date.parse(iso);
    if (!Number.isNaN(time)) years.add(fyStartYear(new Date(time)));
  }
  return [...years].sort((a, b) => b - a);
}

export function inFinancialYear(iso: string, startYear: number): boolean {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return false;
  return fyStartYear(new Date(time)) === startYear;
}
