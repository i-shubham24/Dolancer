/**
 * Calendar date maths in the viewer's own timezone.
 *
 * Deadlines arrive as UTC timestamps and are laid out on the viewer's local days,
 * matching how lib/datetime renders them everywhere else. Weeks start on Monday.
 */

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Monday of the week that holds `date`. */
export function startOfWeek(date: Date): Date {
  const day = (date.getDay() + 6) % 7; // Monday = 0
  return addDays(startOfDay(date), -day);
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/** A stable local-day key, e.g. "2026-10-14". */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** The local day a dayKey names. */
export function parseDayKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

/** The seven days of the week holding `date`, Monday first. */
export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

/** Every day shown on a month grid: whole weeks, Monday first, covering the month. */
export function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = startOfWeek(first);
  const end = addDays(startOfWeek(last), 6);
  const days: Date[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) days.push(day);
  return days;
}

const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-IN", options);
const DAY_SHORT = fmt({ weekday: "short", day: "numeric", month: "short" });
const DAY_LONG = fmt({ weekday: "long", day: "numeric", month: "long" });
const MONTH_YEAR = fmt({ month: "long", year: "numeric" });
const TIME = fmt({ hour: "numeric", minute: "2-digit", hour12: true });

/** "Wed 15 Oct" */
export const formatDayShort = (date: Date) => DAY_SHORT.format(date).replace(",", "");
/** "Wednesday, 15 October" */
export const formatDayLong = (date: Date) => DAY_LONG.format(date);
/** "October 2026" */
export const formatMonthYear = (date: Date) => MONTH_YEAR.format(date);
/** "6:00 pm" in en-IN, shown as "6:00 PM". */
export const formatTime = (date: Date) => TIME.format(date).toUpperCase();

/** "Today", "Tomorrow", or "Wed 15 Oct". */
export function formatDayRelative(date: Date, now = new Date()): string {
  if (sameDay(date, now)) return "Today";
  if (sameDay(date, addDays(now, 1))) return "Tomorrow";
  if (sameDay(date, addDays(now, -1))) return "Yesterday";
  return formatDayShort(date);
}

/** A local "YYYY-MM-DD" value for a date input. */
export function toDateInput(date: Date): string {
  return dayKey(date);
}

/** Combine date and time input values into a local Date, or null if either is invalid. */
export function fromDateTimeInputs(day: string, time: string): Date | null {
  const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!dayMatch || !timeMatch) return null;
  const date = new Date(
    Number(dayMatch[1]),
    Number(dayMatch[2]) - 1,
    Number(dayMatch[3]),
    Number(timeMatch[1]),
    Number(timeMatch[2]),
  );
  return Number.isNaN(date.getTime()) ? null : date;
}
