import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { KIND_META, type CalendarEvent } from "@/features/calendar/events";
import {
  WEEKDAYS,
  addDays,
  dayKey,
  formatDayLong,
  formatDayRelative,
  formatDayShort,
  formatTime,
  parseDayKey,
  sameDay,
  weekDays,
} from "@/features/calendar/dates";
import { MoreLink, Panel } from "@/components/app/ui";
import { ReminderDialog } from "@/features/calendar/ReminderForm";
import { useActiveProjects } from "./queries";

const RANGE = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long" });

function AgendaCard({ event, isBeyond = false }: { event: CalendarEvent; isBeyond?: boolean }) {
  const meta = KIND_META[event.kind];
  const formattedDay = formatDayShort(event.at);
  const formattedTime = formatTime(event.at);
  const isToday = sameDay(event.at, new Date());

  return (
    <Link
      to={event.href ?? "/calendar"}
      className={cn(
        "group flex items-start gap-3 rounded-2xl border p-3 transition-all",
        "hover:border-primary/30 hover:bg-panel/90 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-primary",
        isBeyond
          ? "border-line-subtle/50 bg-panel/35"
          : "border-line-subtle/80 bg-panel/60",
      )}
    >
      <span
        className={cn(
          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white",
          meta.dot,
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink-3">
            {event.kind === "deadline" ? "Deadline" : meta.label.replace(", if you accept", "")}
          </span>
          <span className="rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-ink-2 shadow-2xs">
            {isBeyond ? `${formattedDay}, ${formattedTime}` : isToday ? `Today, ${formattedTime}` : `${formattedDay}, ${formattedTime}`}
          </span>
        </div>
        <p className="mt-1 truncate text-[13px] font-extrabold text-ink group-hover:text-primary transition-colors">
          {event.title}
        </p>
        <p className="mt-0.5 truncate text-[11.5px] font-semibold text-ink-muted">
          {event.note}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

/**
 * This week at a glance: a Monday-to-Sunday strip with interactive day filtering,
 * rich agenda items, upcoming deadline preview, and integrated workload capacity hub
 * so the calendar card completely and handsomely fills the vertical grid space.
 */
export function WeekCard({ events, loading }: { events: CalendarEvent[]; loading: boolean }) {
  const reduceMotion = useReducedMotion();
  const today = new Date();
  const todayKey = dayKey(today);
  const days = useMemo(() => weekDays(parseDayKey(todayKey)), [todayKey]);
  const [picked, setPicked] = useState<string | null>(null);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderDay, setReminderDay] = useState<Date | undefined>(undefined);

  const activeQuery = useActiveProjects();
  const activeProjects = activeQuery.data ?? [];

  const inWeek = useMemo(
    () => events.filter((event) => event.kind !== "offer" && days.some((day) => sameDay(day, event.at))),
    [events, days],
  );

  const visible = picked ? inWeek.filter((event) => dayKey(event.at) === picked) : inWeek;

  // Upcoming deadlines in the next 10 days beyond this Sunday
  const upcomingBeyondWeek = useMemo(() => {
    const endOfWeek = addDays(days[6]!, 1);
    const horizon = addDays(endOfWeek, 10);
    return events
      .filter((e) => e.kind !== "offer" && e.at >= endOfWeek && e.at <= horizon)
      .sort((a, b) => a.at.getTime() - b.at.getTime());
  }, [events, days]);

  const nextUpcoming = useMemo(() => {
    const future = events
      .filter((e) => e.kind !== "offer" && e.at.getTime() >= Date.now() - 60_000)
      .sort((a, b) => a.at.getTime() - b.at.getTime());
    return future[0] ?? null;
  }, [events]);

  const first = days[0]!;
  const last = days[6]!;

  return (
    <Panel className="[grid-area:week] h-full flex flex-col justify-between" aria-labelledby="this-week">
      <ReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        projects={activeProjects}
        defaultDay={reminderDay}
      />

      {/* Top Header */}
      <div>
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 id="this-week" className="text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                This week
              </h2>
              {picked ? (
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  Show all
                </button>
              ) : inWeek.length > 0 ? (
                <span className="rounded-full bg-panel px-2 py-0.5 text-[11px] font-extrabold text-ink-muted">
                  {inWeek.length} {inWeek.length === 1 ? "task" : "tasks"}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs font-medium text-ink-muted">
              {picked
                ? formatDayLong(parseDayKey(picked))
                : `${first.getMonth() === last.getMonth() ? first.getDate() : RANGE.format(first)} to ${RANGE.format(last)}`}
            </p>
          </div>
          <MoreLink to="/calendar">Calendar</MoreLink>
        </div>

        {/* 7-Day Strip */}
        <div className="mb-3.5 grid grid-cols-7 gap-1" role="group" aria-label="Pick a day">
          {days.map((day, index) => {
            const key = dayKey(day);
            const isToday = sameDay(day, today);
            const isPicked = picked === key;
            const kinds = [...new Set(inWeek.filter((event) => dayKey(event.at) === key).map((event) => event.kind))];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isPicked}
                aria-label={`${formatDayShort(day)}${kinds.length ? `, ${kinds.length} item(s)` : ", no items"}`}
                onClick={() => setPicked(isPicked ? null : key)}
                className={cn(
                  "relative flex flex-col items-center justify-between rounded-xl py-2 px-1 text-center transition-all",
                  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                  isToday
                    ? "text-white"
                    : isPicked
                      ? "bg-panel ring-2 ring-primary/40 text-ink"
                      : "hover:bg-panel/70 text-ink",
                )}
              >
                {isToday ? (
                  <motion.span
                    className="absolute inset-0 rounded-xl bg-primary shadow-[0_8px_18px_-8px_rgba(10,101,192,0.8)]"
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26, delay: 0.3 }}
                    aria-hidden="true"
                  />
                ) : null}
                <span className={cn("relative block text-[10.5px] font-bold uppercase", isToday ? "text-white/80" : "text-ink-3")}>
                  {WEEKDAYS[index]![0]}
                </span>
                <span className="relative mt-0.5 block text-[15px] font-extrabold">{day.getDate()}</span>
                <span className="relative mt-1 flex h-1.5 justify-center gap-[3px]" aria-hidden="true">
                  {kinds.length > 0 ? (
                    kinds.slice(0, 3).map((kind) => (
                      <span
                        key={kind}
                        className={cn("h-[5px] w-[5px] rounded-full", isToday ? "bg-white" : KIND_META[kind].dot)}
                      />
                    ))
                  ) : (
                    <span className="h-[5px] w-[5px] rounded-full bg-transparent" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Agenda / Events List */}
      <div className="flex-1 flex flex-col justify-start gap-2.5 overflow-y-auto scrollbar-hide py-1" aria-live="polite">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-14 w-full rounded-2xl" />
            <div className="skeleton h-14 w-full rounded-2xl" />
          </div>
        ) : picked ? (
          visible.length > 0 ? (
            <div className="space-y-2">
              {visible.map((event) => (
                <AgendaCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-subtle bg-panel/30 p-5 text-center my-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <p className="text-[13px] font-bold text-ink">
                No deadlines on {formatDayShort(parseDayKey(picked))}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted max-w-[220px]">
                A clear day for deep focus, research, and working ahead.
              </p>
            </div>
          )
        ) : inWeek.length === 0 && upcomingBeyondWeek.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-subtle bg-panel/30 p-6 text-center my-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-bg text-success-ink mb-2">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-[13.5px] font-bold text-ink">Schedule is all clear</p>
            <p className="mt-1 text-xs text-ink-muted max-w-[240px]">
              No deadlines due this week. Perfect time to pick up new work from assigned offers.
            </p>
            <Button asChild size="sm" className="mt-3 text-xs font-bold">
              <Link to="/pool">Explore offers</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* This week's events */}
            {inWeek.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {inWeek.map((event) => (
                    <motion.div
                      key={event.id}
                      layout={!reduceMotion}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AgendaCard event={event} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : null}

            {/* If week has few events, show upcoming deadlines from next week */}
            {inWeek.length < 3 && upcomingBeyondWeek.length > 0 ? (
              <div className="pt-2 border-t border-line-subtle/70 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    Coming Up Next Week
                  </span>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {upcomingBeyondWeek.length} scheduled
                  </span>
                </div>
                {upcomingBeyondWeek.slice(0, 2).map((event) => (
                  <AgendaCard key={event.id} event={event} isBeyond />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Bottom Hub: Workload status & Quick Reminder */}
      <div className="mt-auto pt-3 border-t border-line-subtle">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-panel/60 p-2.5 sm:px-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-ink">
                {nextUpcoming ? `Next: ${formatDayRelative(nextUpcoming.at)}` : "All clear"}
              </p>
              <p className="truncate text-[11px] font-semibold text-ink-muted">
                {activeProjects.length === 1 ? "1 active task in progress" : `${activeProjects.length} active tasks`}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              // With a day picked, the reminder starts on that day.
              setReminderDay(picked ? parseDayKey(picked) : undefined);
              setReminderOpen(true);
            }}
            className="shrink-0 h-8 gap-1 text-xs font-bold bg-white hover:bg-panel shadow-2xs px-2.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden min-[380px]:inline">Reminder</span>
          </Button>
        </div>
      </div>
    </Panel>
  );
}
