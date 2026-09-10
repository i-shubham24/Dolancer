import { formatDistanceToNowStrict, differenceInMilliseconds, isPast } from "date-fns";

/**
 * Date and time formatting.
 *
 * Deadlines are stored in UTC and are always displayed in the viewer's local
 * timezone, so a client's deadline renders correctly for a doer in another country.
 * date-fns handles the relative arithmetic; Intl handles the localized rendering,
 * which is the pairing that keeps timezone handling correct without shipping a
 * whole timezone database.
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
  if (isPast(date)) return "Overdue";
  return `${formatDistanceToNowStrict(date)} left`;
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
  const remainingMs = differenceInMilliseconds(date, new Date());
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
  const remainingMs = differenceInMilliseconds(date, new Date());
  if (remainingMs <= 0) return null;

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}
