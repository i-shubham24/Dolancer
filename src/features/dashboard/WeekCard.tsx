import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { KIND_META, type CalendarEvent } from "@/features/calendar/events";
import { EventRow } from "@/features/calendar/EventRow";
import { WEEKDAYS, dayKey, formatDayShort, parseDayKey, sameDay, weekDays } from "@/features/calendar/dates";
import { MoreLink, Panel, PanelHeader } from "./ui";

const RANGE = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long" });

/**
 * This week at a glance: a Monday-to-Sunday strip with a dot per kind of date, and
 * the week's list underneath. Tapping a day narrows the list to that day, tapping
 * it again shows the whole week.
 */
export function WeekCard({ events, loading }: { events: CalendarEvent[]; loading: boolean }) {
  const reduceMotion = useReducedMotion();
  const today = new Date();
  const todayKey = dayKey(today);
  // Rebuilt only when the date changes, not on every render.
  const days = useMemo(() => weekDays(parseDayKey(todayKey)), [todayKey]);
  const [picked, setPicked] = useState<string | null>(null);

  const inWeek = useMemo(
    () => events.filter((event) => event.kind !== "offer" && days.some((day) => sameDay(day, event.at))),
    [events, days],
  );
  const visible = picked ? inWeek.filter((event) => dayKey(event.at) === picked) : inWeek;
  const first = days[0]!;
  const last = days[6]!;

  return (
    <Panel className="[grid-area:week]" aria-labelledby="this-week">
      <PanelHeader
        id="this-week"
        title="This week"
        sub={`${first.getMonth() === last.getMonth() ? first.getDate() : RANGE.format(first)} to ${RANGE.format(last)}`}
        right={<MoreLink to="/calendar">Calendar</MoreLink>}
      />

      <div className="mb-3 grid grid-cols-7 gap-1" role="group" aria-label="Pick a day">
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
              aria-label={`${formatDayShort(day)}${kinds.length ? `, ${kinds.length} kind${kinds.length === 1 ? "" : "s"} of item` : ", nothing"}`}
              onClick={() => setPicked(isPicked ? null : key)}
              className={cn(
                "relative rounded-xl pb-2 pt-1.5 text-center transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                isToday ? "text-white" : isPicked ? "bg-panel" : "hover:bg-panel/70",
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
                {kinds.slice(0, 3).map((kind) => (
                  <span key={kind} className={cn("h-[5px] w-[5px] rounded-full", isToday ? "bg-white" : KIND_META[kind].dot)} />
                ))}
              </span>
              {isPicked && !isToday ? (
                <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary" aria-hidden="true" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2" aria-live="polite">
        {loading ? (
          <>
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </>
        ) : visible.length === 0 ? (
          <p className="rounded-xl bg-panel/60 px-3 py-4 text-center text-xs font-semibold text-ink-muted">
            {picked ? "Nothing on this day." : "Nothing due this week. A good week to take an offer."}
          </p>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {visible.slice(0, 4).map((event) => (
              <motion.div
                key={event.id}
                layout={!reduceMotion}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <EventRow event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {!loading && visible.length > 4 ? (
          <Link to="/calendar" className="text-center text-xs font-bold text-primary">
            {visible.length - 4} more this week
          </Link>
        ) : null}
      </div>
    </Panel>
  );
}
