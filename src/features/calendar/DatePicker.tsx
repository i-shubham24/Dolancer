import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  WEEKDAYS,
  addDays,
  dayKey,
  formatDayLong,
  formatDayShort,
  formatMonthYear,
  monthGrid,
  parseDayKey,
  sameDay,
  startOfDay,
} from "./dates";

/**
 * A day picker in the app's own style, in place of the browser's date input.
 *
 * The value is a local "YYYY-MM-DD" string, the same as a native date input. The
 * grid uses a roving focus: one day is tabbable, arrow keys move by a day or a
 * week, Page Up and Page Down change month, Enter picks and Escape closes.
 */
export function DatePicker({
  id,
  value,
  onChange,
  min,
  className,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Earliest pickable day, as "YYYY-MM-DD". */
  min?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const selected = parseDayKey(value);
  const minDay = min ? parseDayKey(min) : null;
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const [focusDay, setFocusDay] = useState<Date>(selected);
  const view = new Date(focusDay.getFullYear(), focusDay.getMonth(), 1);
  const today = startOfDay(new Date());

  function openPicker() {
    const rect = buttonRef.current?.getBoundingClientRect();
    setAbove(Boolean(rect && rect.bottom + 340 > window.innerHeight && rect.top > 340));
    setFocusDay(selected);
    setOpen(true);
  }

  function close(refocus = true) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  const blocked = (day: Date) => Boolean(minDay && day < minDay);

  function pick(day: Date) {
    if (blocked(day)) return;
    onChange(dayKey(day));
    close();
  }

  // Keep keyboard focus on the focused day as it moves.
  useEffect(() => {
    if (!open) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(focusDay)}"]`)?.focus({ preventScroll: true });
  }, [open, focusDay]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function onGridKey(event: React.KeyboardEvent) {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDay, -1),
      ArrowRight: () => addDays(focusDay, 1),
      ArrowUp: () => addDays(focusDay, -7),
      ArrowDown: () => addDays(focusDay, 7),
      PageUp: () => new Date(focusDay.getFullYear(), focusDay.getMonth() - 1, focusDay.getDate()),
      PageDown: () => new Date(focusDay.getFullYear(), focusDay.getMonth() + 1, focusDay.getDate()),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      setFocusDay(move());
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(focusDay);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  }

  const shiftMonth = (step: number) =>
    setFocusDay(new Date(focusDay.getFullYear(), focusDay.getMonth() + step, 1));

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Day: ${formatDayLong(selected)}`}
        onClick={() => (open ? close() : openPicker())}
        className={cn("flex w-full items-center gap-2 text-left", className)}
      >
        <span className="min-w-0 flex-1 truncate">{formatDayShort(selected)}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Pick a day"
            data-picker
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: above ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: above ? "bottom left" : "top left" }}
            className={cn(
              "absolute left-0 z-[60] w-[288px] rounded-2xl bg-white p-3 text-ink shadow-[0_18px_44px_-14px_rgba(11,31,58,0.35)] ring-1 ring-ink/[0.07]",
              above ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-[13px] font-extrabold" aria-live="polite">
                {formatMonthYear(view)}
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div ref={gridRef} role="grid" className="grid grid-cols-7 gap-0.5" onKeyDown={onGridKey}>
              {WEEKDAYS.map((day) => (
                <span key={day} role="columnheader" aria-label={day} className="pb-1 text-center text-[10.5px] font-bold uppercase text-ink-3">
                  {day[0]}
                </span>
              ))}
              {monthGrid(view.getFullYear(), view.getMonth()).map((day) => {
                const isSelected = sameDay(day, selected);
                const isToday = sameDay(day, today);
                const outside = day.getMonth() !== view.getMonth();
                const disabled = blocked(day);
                return (
                  <button
                    key={dayKey(day)}
                    type="button"
                    role="gridcell"
                    data-day={dayKey(day)}
                    tabIndex={sameDay(day, focusDay) ? 0 : -1}
                    aria-selected={isSelected}
                    aria-disabled={disabled || undefined}
                    aria-label={formatDayLong(day)}
                    onClick={() => pick(day)}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-xl text-[13px] font-bold transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                      isSelected
                        ? "bg-primary text-white"
                        : disabled
                          ? "cursor-not-allowed text-ink-3/50"
                          : outside
                            ? "text-ink-3 hover:bg-panel"
                            : "text-ink-2 hover:bg-panel",
                      isToday && !isSelected && "ring-[1.5px] ring-primary ring-inset",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
