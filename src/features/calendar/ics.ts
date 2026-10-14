import type { CalendarEvent } from "./events";

/**
 * An .ics file of deadlines and reminders, for Google Calendar, Outlook or a phone.
 *
 * Only the doer's own dates go in: offers are not theirs until accepted, and past
 * payouts are history rather than plans. Times are written in UTC so the importing
 * calendar shows them in its own timezone.
 */

function stamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** RFC 5545 asks for lines of at most 75 octets, continued with a leading space. */
function fold(line: string): string {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    parts.push(rest.slice(0, 73));
    rest = rest.slice(73);
  }
  parts.push(rest);
  return parts.join("\r\n ");
}

export function buildIcs(events: CalendarEvent[], origin: string): string {
  const now = stamp(new Date());
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dolancer//Doer calendar//EN", "CALSCALE:GREGORIAN"];

  for (const event of events) {
    if (event.kind !== "deadline" && event.kind !== "reminder") continue;
    const end = new Date(event.at.getTime() + 30 * 60_000);
    const summary = event.kind === "deadline" ? `Due: ${event.title}` : event.title;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.id}@dolancer`,
      `DTSTAMP:${now}`,
      `DTSTART:${stamp(event.at)}`,
      `DTEND:${stamp(end)}`,
      fold(`SUMMARY:${escapeText(summary)}`),
      fold(`DESCRIPTION:${escapeText(event.note)}`),
      ...(event.href ? [fold(`URL:${origin}${event.href}`)] : []),
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      fold(`DESCRIPTION:${escapeText(summary)}`),
      event.kind === "deadline" ? "TRIGGER:-PT24H" : "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(events: CalendarEvent[]): number {
  const count = events.filter((event) => event.kind === "deadline" || event.kind === "reminder").length;
  const blob = new Blob([buildIcs(events, window.location.origin)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "dolancer-dates.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return count;
}
