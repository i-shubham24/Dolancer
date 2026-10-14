import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { CalendarPlus, ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useReminders } from "@/stores/useReminderStore";
import { Segments } from "@/components/app/ui";
import { CARD, cardMotion, gridMotion } from "@/components/app/card-styles";
import { KIND_META, useCalendarEvents, type CalendarEvent, type CalendarKind } from "./events";
import {
  WEEKDAYS,
  addDays,
  dayKey,
  formatDayLong,
  formatDayRelative,
  formatMonthYear,
  formatTime,
  monthGrid,
  sameDay,
  startOfDay,
  weekDays,
} from "./dates";
import { ReminderDialog, ReminderForm } from "./ReminderForm";
import { EventRow } from "./EventRow";
import { downloadIcs } from "./ics";

type View = "month" | "week" | "list";
const KINDS: CalendarKind[] = ["deadline", "reminder", "payout", "offer"];

function groupByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayKey(event.at);
    const list = map.get(key);
    if (list) list.push(event);
    else map.set(key, [event]);
  }
  return map;
}

function chipText(event: CalendarEvent): string {
  if (event.kind === "deadline") return `Due: ${event.title}`;
  if (event.kind === "offer") return `Offer: ${event.title}`;
  if (event.kind === "reminder") return `${formatTime(event.at)} ${event.title}`;
  return event.title;
}

/**
 * The doer's calendar: deadlines, payouts, their own reminders, and the deadlines
 * of offers they could still accept, so a clash shows before they commit.
 */
export function CalendarPage() {
  const reduceMotion = useReducedMotion();
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);
  const [view, setView] = useState<View>("month");
  const [direction, setDirection] = useState(0);
  const [shown, setShown] = useState<Record<CalendarKind, boolean>>({
    deadline: true,
    reminder: true,
    payout: true,
    offer: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { events, activeProjects, isLoading } = useCalendarEvents({ offers: true });
  const { remove } = useReminders();

  const visible = useMemo(() => events.filter((event) => shown[event.kind]), [events, shown]);
  const byDay = useMemo(() => groupByDay(visible), [visible]);
  const selectedEvents = byDay.get(dayKey(selected)) ?? [];
  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.kind !== "offer" && event.kind !== "payout" && event.at.getTime() >= Date.now())
        .slice(0, 5),
    [events],
  );

  function move(step: number) {
    setDirection(step);
    if (view === "week") {
      const next = addDays(selected, step * 7);
      setSelected(next);
      setCursor(new Date(next.getFullYear(), next.getMonth(), 1));
    } else {
      setCursor((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));
    }
  }

  function goToday() {
    setDirection(0);
    setSelected(today);
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function exportIcs() {
    const count = downloadIcs(events);
    toast.success(count > 0 ? `Saved ${count} date${count === 1 ? "" : "s"} to a calendar file` : "Saved an empty calendar file", {
      description: "Open the file to add these dates to Google Calendar, Outlook or your phone.",
    });
  }

  const title = view === "week" ? `Week of ${formatDayRelative(weekDays(selected)[0]!)}` : formatMonthYear(cursor);
  const periodKey = view === "week" ? dayKey(weekDays(selected)[0]!) : `${cursor.getFullYear()}-${cursor.getMonth()}`;

  return (
    <div className="space-y-5">
      <ReminderDialog open={dialogOpen} onOpenChange={setDialogOpen} projects={activeProjects} />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">Calendar</p>
          <h1 className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] sm:text-[30px]">{formatMonthYear(cursor)}</h1>
          <p className="mt-1 text-sm font-medium text-ink-2 sm:text-md">
            Your deadlines, reminders and payouts in one place.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={exportIcs} title="Downloads a file you can open in Google Calendar, Outlook or your phone">
            <Download className="h-4 w-4" aria-hidden="true" />
            Save to my calendar
          </Button>
          <Button className="flex-1 sm:flex-none" onClick={() => setDialogOpen(true)}>
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Add reminder
          </Button>
        </div>
      </header>

      <motion.div
        className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"
        variants={gridMotion}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        <motion.section variants={cardMotion} className={cn(CARD, "p-4 sm:p-5")} aria-label="Calendar">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label={view === "week" ? "Previous week" : "Previous month"}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line-subtle transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label={view === "week" ? "Next week" : "Next month"}
                className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-line-subtle transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={goToday}
              className="h-9 rounded-full px-4 text-[13px] font-bold ring-[1.5px] ring-ink transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
            >
              Today
            </button>
            <h2 className="ml-1 text-[15px] font-extrabold tracking-[-0.02em]" aria-live="polite">
              {title}
            </h2>
            <div className="flex-1" />
            <Segments
              label="Calendar view"
              value={view}
              onChange={(next) => {
                setDirection(0);
                setView(next);
              }}
              options={[
                { id: "month", label: "Month" },
                { id: "week", label: "Week" },
                { id: "list", label: "List" },
              ]}
            />
          </div>

          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={`${view}-${periodKey}`}
                custom={direction}
                initial={reduceMotion ? false : { opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: direction * -28 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {view === "list" ? (
                  <ListView events={visible} loading={isLoading} />
                ) : (
                  <GridView
                    days={view === "week" ? weekDays(selected) : monthGrid(cursor.getFullYear(), cursor.getMonth())}
                    month={view === "week" ? null : cursor.getMonth()}
                    tall={view === "week"}
                    byDay={byDay}
                    today={today}
                    selected={selected}
                    onSelect={setSelected}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Show on the calendar">
            {KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                aria-pressed={shown[kind]}
                onClick={() => setShown((current) => ({ ...current, [kind]: !current[kind] }))}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold transition-all",
                  "focus-visible:outline-2 focus-visible:outline-primary",
                  shown[kind] ? "bg-panel text-ink-2" : "bg-transparent text-ink-3 line-through ring-1 ring-line-subtle",
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-[3px]", KIND_META[kind].dot)} aria-hidden="true" />
                {KIND_META[kind].label}
              </button>
            ))}
          </div>
        </motion.section>

        <div className="grid content-start gap-4 md:grid-cols-2 xl:grid-cols-1">
          <motion.section variants={cardMotion} className={CARD} aria-labelledby="day-title">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">
              {sameDay(selected, today) ? "Today" : formatDayRelative(selected) === "Tomorrow" ? "Tomorrow" : "Selected day"}
            </p>
            <h2 id="day-title" className="mb-3 mt-0.5 text-xl font-extrabold tracking-[-0.03em]">
              {formatDayLong(selected)}
            </h2>
            <AnimatePresence mode="popLayout" initial={false}>
              {selectedEvents.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-panel/60 px-3 py-4 text-center text-xs font-semibold text-ink-muted"
                >
                  Nothing on this day.
                </motion.p>
              ) : (
                selectedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout={!reduceMotion}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="mb-2 flex items-center gap-1.5"
                  >
                    <div className="min-w-0 flex-1">
                      <EventRow event={event} showDay={false} />
                    </div>
                    {event.reminderId ? (
                      <button
                        type="button"
                        onClick={() => {
                          remove(event.reminderId!);
                          toast("Reminder removed");
                        }}
                        aria-label={`Remove reminder: ${event.title}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-ink-3 transition-colors hover:bg-danger-bg hover:text-danger-ink"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.section>

          <motion.section variants={cardMotion} className={CARD} aria-labelledby="coming-up">
            <h2 id="coming-up" className="mb-3 text-[15px] font-extrabold tracking-[-0.02em]">
              Coming up
            </h2>
            {upcoming.length === 0 ? (
              <p className="rounded-xl bg-panel/60 px-3 py-4 text-center text-xs font-semibold text-ink-muted">
                No deadlines or reminders ahead.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </motion.section>

          <motion.section variants={cardMotion} className={cn(CARD, "md:col-span-2 xl:col-span-1")} aria-labelledby="new-reminder">
            <h2 id="new-reminder" className="mb-3 text-[15px] font-extrabold tracking-[-0.02em]">
              New reminder
            </h2>
            <ReminderForm projects={activeProjects} defaultDay={selected < today ? today : selected} />
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}

function GridView({
  days,
  month,
  tall,
  byDay,
  today,
  selected,
  onSelect,
}: {
  days: Date[];
  /** The month being shown, so spill-over days can fade. Null in week view. */
  month: number | null;
  tall: boolean;
  byDay: Map<string, CalendarEvent[]>;
  today: Date;
  selected: Date;
  onSelect: (day: Date) => void;
}) {
  const reduceMotion = useReducedMotion();
  const limit = tall ? 6 : 2;
  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
      {WEEKDAYS.map((day) => (
        <div key={day} className="pb-1 text-center text-[10.5px] font-bold uppercase text-ink-3 sm:text-[11px]">
          <span className="sm:hidden">{day[0]}</span>
          <span className="hidden sm:inline">{day}</span>
        </div>
      ))}
      {days.map((day, cell) => {
        const key = dayKey(day);
        const items = byDay.get(key) ?? [];
        const isToday = sameDay(day, today);
        const isSelected = sameDay(day, selected);
        const outside = month !== null && day.getMonth() !== month;
        const kinds = [...new Set(items.map((item) => item.kind))];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(day)}
            aria-pressed={isSelected}
            aria-label={`${formatDayLong(day)}${items.length ? `, ${items.length} item${items.length === 1 ? "" : "s"}` : ""}`}
            className={cn(
              "flex min-w-0 flex-col gap-1 rounded-xl p-1.5 text-left transition-[background-color,box-shadow] sm:rounded-[14px] sm:p-2",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
              tall ? "min-h-[220px]" : "min-h-[58px] sm:min-h-[104px]",
              outside ? "bg-transparent outline outline-1 -outline-offset-1 outline-dashed outline-line-subtle" : "bg-panel/55 hover:bg-panel",
              isSelected && !isToday && "bg-white ring-2 ring-ink/70",
              isToday && "bg-white ring-2 ring-primary",
            )}
          >
            <span className="flex items-center justify-between gap-1">
              <span
                className={cn(
                  "text-[12.5px] font-bold",
                  outside ? "text-ink-3" : "text-ink-2",
                  isToday && "rounded-full bg-primary px-1.5 text-white",
                )}
              >
                {day.getDate()}
              </span>
              {isToday ? <span className="hidden text-[10px] font-bold text-primary sm:inline">Today</span> : null}
            </span>
            <span className="hidden min-w-0 flex-col gap-1 sm:flex">
              {items.slice(0, limit).map((item, index) => (
                <motion.span
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.1 + cell * 0.012 + index * 0.05 }}
                  className={cn("rounded-[7px] px-1.5 py-1 text-[10.5px] font-bold leading-[1.25]", KIND_META[item.kind].chip)}
                >
                  <span className={cn("break-words", tall ? "line-clamp-4" : "line-clamp-2")}>{chipText(item)}</span>
                </motion.span>
              ))}
              {items.length > limit ? (
                <span className="px-1 text-[10.5px] font-bold text-ink-muted">+{items.length - limit} more</span>
              ) : null}
            </span>
            {kinds.length > 0 ? (
              <span className="flex gap-[3px] sm:hidden" aria-hidden="true">
                {kinds.map((kind) => (
                  <span key={kind} className={cn("h-[5px] w-[5px] rounded-full", KIND_META[kind].dot)} />
                ))}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ListView({ events, loading }: { events: CalendarEvent[]; loading: boolean }) {
  const start = startOfDay(new Date()).getTime();
  const ahead = events.filter((event) => event.at.getTime() >= start);
  const groups = [...groupByDay(ahead).entries()];

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-12 w-full rounded-xl" />
      </div>
    );
  }
  if (groups.length === 0) {
    return (
      <p className="rounded-xl bg-panel/60 px-3 py-10 text-center text-sm font-semibold text-ink-muted">
        Nothing ahead. Accepted tasks and your reminders show here.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {groups.map(([key, items]) => (
        <div key={key} className="grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
          <p className="pt-2 text-[13px] font-extrabold text-ink">{formatDayRelative(items[0]!.at)}</p>
          <div className="flex flex-col gap-2">
            {items.map((event) => (
              <EventRow key={event.id} event={event} showDay={false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
