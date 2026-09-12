/**
 * Date and time formatting.
 *
 * Deadlines are stored in UTC and are always displayed in the viewer's local
 * timezone, so a client's deadline renders correctly for a doer in another country.
 * Relative arithmetic is plain millisecond math and rendering is Intl, which keeps
 * timezone handling correct without shipping a date library or a timezone database.
 */

export const DEFAULT_TIME_ZONE = "Asia/Kolkata";

function zone(timeZone?: string): string {
  if (timeZone) return timeZone;
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(iso: string | null | undefined, timeZone?: string): string {
  const date = parse(iso);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: zone(timeZone),
  }).format(date);
}

export function formatDateTime(iso: string | null | undefined, timeZone?: string): string {
  const date = parse(iso);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: zone(timeZone),
  }).format(date);
}

/** Coarse relative deadline copy, e.g. "3 days left", "2 hours left", "Overdue". */
export function relativeDeadline(iso: string | null | undefined): string {
  const date = parse(iso);
  if (!date) return "No deadline set";
  if (date.getTime() < Date.now()) return "Overdue";
  return `${strictDistance(date)} left`;
}

/**
 * Largest-unit distance like "3 days" or "2 hours". Thresholds mirror the
 * strict formatter this replaced, so every consumer reads identically.
 */
function strictDistance(date: Date): string {
  const seconds = Math.max(0, Math.floor((date.getTime() - Date.now()) / 1000));
  const unit = (value: number, singular: string) =>
    `${value} ${value === 1 ? singular : `${singular}s`}`;
  if (seconds < 60) return unit(seconds, "second");
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return unit(minutes, "minute");
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return unit(hours, "hour");
  const days = Math.floor(hours / 24);
  if (days < 30) return unit(days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return unit(months, "month");
  return unit(Math.floor(months / 12), "year");
}

export type DeadlineUrgency = "none" | "comfortable" | "soon" | "urgent" | "overdue";

/**
 * How much trouble the deadline is in.
 *
 * Drives the visual weight of a deadline badge. Urgency is never conveyed by colour
 * alone, so every consumer pairs this with the text from relativeDeadline.
 */
export function deadlineUrgency(iso: string | null | undefined): DeadlineUrgency {
  const date = parse(iso);
  if (!date) return "none";
  const remainingMs = date.getTime() - Date.now();
  if (remainingMs < 0) return "overdue";
  const hours = remainingMs / 3_600_000;
  if (hours <= 12) return "urgent";
  if (hours <= 48) return "soon";
  return "comfortable";
}

/**
 * Live countdown parts for a deadline, for a ticking workbench timer.
 * Returns null once the deadline has passed.
 */
export function countdownParts(
  iso: string | null | undefined,
): { days: number; hours: number; minutes: number; seconds: number } | null {
  const date = parse(iso);
  if (!date) return null;
  const remainingMs = date.getTime() - Date.now();
  if (remainingMs <= 0) return null;

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}
