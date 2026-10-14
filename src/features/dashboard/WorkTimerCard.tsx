import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Pause, Play, Square, Timer } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { taskTitle } from "@/lib/task-title";
import { sessionElapsed, useWorkTimer } from "@/stores/useTimerStore";
import type { DoerProject } from "@/types/domain";
import { RollingDigits } from "@/components/common/RollingDigits";
import { Select } from "@/components/ui/Select";
import { cardMotion } from "./card-styles";
import { LineTexture } from "./LineTexture";

function clock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60];
  return parts.map((part) => String(part).padStart(2, "0")).join(":");
}

function duration(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  if (minutes === 0) return "under a minute";
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes % 60}m`;
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Below this, a per-hour figure swings wildly and means nothing. */
const MIN_FOR_RATE_MS = 15 * 60_000;

/**
 * A private stopwatch per task. It answers a question fixed pay leaves open:
 * roughly what did this task pay per hour? Stored on this device only.
 */
export function WorkTimerCard({ projects, fallbackId }: { projects: DoerProject[]; fallbackId: string | null }) {
  const reduceMotion = useReducedMotion();
  const timer = useWorkTimer();
  const [now, setNow] = useState(() => Date.now());
  const running = Boolean(timer.session?.startedAt);

  useEffect(() => {
    if (!running) return;
    setNow(Date.now());
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [running]);

  const ids = new Set(projects.map((project) => project.id));
  const currentId =
    timer.session?.projectId ??
    (timer.selected && ids.has(timer.selected) ? timer.selected : null) ??
    fallbackId ??
    projects[0]?.id ??
    null;
  const project = projects.find((item) => item.id === currentId) ?? null;
  const elapsed = sessionElapsed(timer.session, now);
  const total = (currentId ? (timer.totals[currentId] ?? 0) : 0) + (timer.session ? elapsed : 0);
  const perHour = project && total >= MIN_FOR_RATE_MS ? project.payoutPaise / (total / 3_600_000) : null;

  function start() {
    if (!currentId) return;
    if (!timer.session && timer.selected !== currentId) timer.select(currentId);
    timer.play();
  }

  function stop() {
    const saved = timer.stop();
    if (saved > 0 && project) {
      toast.success(`Saved ${duration(saved)} on ${taskTitle(project)}`);
    }
  }

  return (
    <motion.section
      variants={cardMotion}
      aria-labelledby="work-timer"
      className="relative isolate flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-[radial-gradient(120%_90%_at_100%_0%,var(--color-navy-2)_0%,var(--color-navy)_55%)] p-[18px] text-white shadow-[0_18px_40px_-18px_rgba(11,31,58,0.7)] [grid-area:timer]"
    >
      <LineTexture className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/[0.07]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="work-timer" className="text-[15px] font-extrabold tracking-[-0.02em]">
            Work timer
          </h2>
          <p className="mt-0.5 text-xs font-medium text-white/65">Track time on a task</p>
        </div>
        <Timer className="h-5 w-5 text-white/75" aria-hidden="true" />
      </div>

      {projects.length === 0 ? (
        <p className="mt-6 text-sm font-semibold text-white/75">
          Accept a task to start timing your work on it.
        </p>
      ) : (
        <>
          <div className="mt-3 max-w-full self-start">
            <Select
              label="Task to time"
              value={currentId ?? ""}
              onChange={timer.select}
              disabled={Boolean(timer.session)}
              title={timer.session ? "Stop the timer to switch task" : undefined}
              options={projects.map((item) => ({ value: item.id, label: taskTitle(item) }))}
              className="max-w-[15rem] rounded-full bg-white/12 py-1.5 pl-3 pr-2.5 text-xs font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-80"
            />
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <span
              className="text-[40px] font-extrabold leading-none tracking-[-0.02em] tabular-nums sm:text-[42px]"
              role="timer"
              aria-live="off"
              aria-label={`Timer ${clock(elapsed)}`}
            >
              <RollingDigits text={clock(elapsed)} />
            </span>
            {running ? (
              <motion.span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-success-dot"
                animate={reduceMotion ? undefined : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              onClick={running ? timer.pause : start}
              aria-label={running ? "Pause timer" : "Start timer"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {running ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </motion.button>
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.92 }}
              onClick={stop}
              disabled={!timer.session}
              aria-label="Stop and save time"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full bg-danger-dot text-white transition-transform hover:scale-105",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40 disabled:hover:scale-100",
              )}
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </motion.button>
          </div>

          <div className="min-h-3 flex-1" aria-hidden="true" />
          <div className="mt-3 border-t border-white/15 pt-3 text-xs font-semibold text-white/85">
            {total > 0 ? (
              <>
                {capitalise(duration(total))} on this task so far.
                {perHour ? (
                  <>
                    {" "}About <b className="text-white">{formatPaise(Math.round(perHour / 1000) * 1000)} an hour.</b>
                  </>
                ) : null}
              </>
            ) : (
              "Press play when you start working."
            )}
            <span className="mt-1 block text-[10.5px] text-white/55">Saved on this device. Only you can see it.</span>
          </div>
        </>
      )}
    </motion.section>
  );
}
