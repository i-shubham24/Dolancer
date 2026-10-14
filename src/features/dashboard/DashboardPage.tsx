import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/brutal/Skeleton";
import { qk } from "@/lib/query-keys";
import { isActiveStatus } from "@/lib/status";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { preloadRoute } from "@/lib/preload";
import { fetchLedger } from "@/features/earnings/api";
import { useCalendarEvents } from "@/features/calendar/events";
import { ReminderDialog } from "@/features/calendar/ReminderForm";
import { addDays, formatDayLong, formatDayRelative, startOfWeek } from "@/features/calendar/dates";
import type { DoerProject } from "@/types/domain";
import {
  useProfile,
  useGateState,
  useActiveProjects,
  usePoolPreview,
  useEarningsSummary,
} from "./queries";
import { ReadinessCard } from "./ReadinessCard";
import { AttentionStrip } from "./AttentionStrip";
import { StatCards } from "./StatCards";
import { PaidChart } from "./PaidChart";
import { UpNextCard } from "./UpNextCard";
import { pickUpNext } from "./up-next";
import { WeekCard } from "./WeekCard";
import { WorkList } from "./WorkList";
import { OffersCard } from "./OffersCard";
import { WorkTimerCard } from "./WorkTimerCard";
import { TaskPeek } from "./TaskPeek";
import { gridMotion } from "./card-styles";

function firstName(fullName: string | null | undefined): string {
  const name = fullName?.trim().split(/\s+/)[0];
  return name || "there";
}

function daypart(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** One plain sentence on where the doer's work stands. */
function summary(active: DoerProject[], next: DoerProject | null, unlocked: boolean): string {
  if (active.length === 0) {
    return unlocked
      ? "No tasks right now. Offers that match your skills show up here."
      : "Finish your setup below to start getting offers.";
  }
  const review = active.filter((p) => p.status === "in_review" || p.status === "delivered").length;
  let text = `You have ${active.length} task${active.length === 1 ? "" : "s"}`;
  if (review > 0) text += `, ${review === active.length ? (review === 1 ? "it is" : "all") : review} with your supervisor`;
  text += ".";
  if (next?.deliveryAt) {
    const day = formatDayRelative(new Date(next.deliveryAt));
    text += ` Next one is due ${day === "Today" || day === "Tomorrow" ? day.toLowerCase() : `on ${day}`}.`;
  }
  return text;
}

/**
 * The doer's home.
 *
 * A bento of the things a doer checks every day, in the order they matter: what is
 * blocked, what is next, what this week holds, then money and offers. Every figure
 * is one the database can prove. There is no pending balance, because the doer
 * cannot read payout status, and the client never appears in any form.
 */
export function DashboardPage() {
  const reduceMotion = useReducedMotion();
  const profile = useProfile();
  const gate = useGateState();
  const projects = useActiveProjects();
  const pool = usePoolPreview();
  const earnings = useEarningsSummary();
  const ledger = useQuery({ queryKey: qk.earnings.ledger(), queryFn: fetchLedger });
  const calendar = useCalendarEvents();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderTask, setReminderTask] = useState<string | null>(null);
  const [peek, setPeek] = useState<DoerProject | null>(null);
  const [peekOpen, setPeekOpen] = useState(false);

  const active = useMemo(
    () => (projects.data ?? []).filter((project) => isActiveStatus(project.status)),
    [projects.data],
  );
  const upNext = useMemo(() => pickUpNext(active), [active]);
  const dueThisWeek = useMemo(() => {
    const end = addDays(startOfWeek(new Date()), 7).getTime();
    return active
      .filter((project) => project.deliveryAt && new Date(project.deliveryAt).getTime() < end)
      .map((project) => new Date(project.deliveryAt!))
      .sort((a, b) => a.getTime() - b.getTime());
  }, [active]);

  const unlocked = gate.data?.unlocked ?? false;
  const now = new Date();

  return (
    <div className="dash-wrap">
      <ReminderDialog
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        projects={active}
        defaultProjectId={reminderTask}
      />
      <TaskPeek
        project={peek}
        open={peekOpen}
        onOpenChange={setPeekOpen}
        onRemind={(projectId) => {
          setReminderTask(projectId);
          setReminderOpen(true);
        }}
      />

      <motion.header
        className="mb-5 flex flex-wrap items-end justify-between gap-4"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{formatDayLong(now)}</p>
          <h1 className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] sm:text-[30px]">
            {profile.isLoading ? (
              <span className="skeleton inline-block h-8 w-64 align-middle" />
            ) : (
              <>
                {daypart(now.getHours())}, {firstName(profile.data?.full_name)}
              </>
            )}
          </h1>
          <p className="mt-1 text-sm font-medium text-ink-2 sm:text-md">
            {projects.isLoading ? "Checking your work..." : summary(active, upNext, unlocked)}
          </p>
        </div>
        <div className="flex w-full gap-2.5 sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link to="/pool" onMouseEnter={() => preloadRoute("/pool")} onFocus={() => preloadRoute("/pool")}>
              <Layers className="h-4 w-4" aria-hidden="true" />
              See offers
            </Link>
          </Button>
          <Button
            className="flex-1 sm:flex-none"
            onClick={() => {
              setReminderTask(null);
              setReminderOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add reminder
          </Button>
        </div>
      </motion.header>

      {gate.isLoading ? (
        <SkeletonCard className="mb-4" />
      ) : gate.data && !gate.data.unlocked ? (
        <div className="mb-4">
          <ReadinessCard gate={gate.data} />
        </div>
      ) : null}

      <AttentionStrip projects={active} />

      <motion.div
        className="dash-grid"
        variants={gridMotion}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        <StatCards
          activeCount={active.length}
          activeLoading={projects.isLoading}
          dueThisWeek={dueThisWeek}
          earnings={earnings.data}
          earningsLoading={earnings.isLoading}
          earningsError={earnings.isError}
        />
        <PaidChart rows={ledger.data ?? []} loading={ledger.isLoading} />
        <UpNextCard project={upNext} loading={projects.isLoading} unlocked={unlocked} />
        <WeekCard events={calendar.events} loading={calendar.isLoading} />
        <WorkList
          projects={active}
          loading={projects.isLoading}
          error={projects.isError}
          onRetry={() => void projects.refetch()}
          onOpen={(project) => {
            setPeek(project);
            setPeekOpen(true);
          }}
          unlocked={unlocked}
        />
        <OffersCard
          offers={pool.data ?? []}
          loading={pool.isLoading}
          error={pool.isError}
          unlocked={unlocked}
          atCap={active.length >= MAX_ACTIVE_PROJECTS}
        />
        <WorkTimerCard projects={active} fallbackId={upNext?.id ?? null} />
      </motion.div>
    </div>
  );
}
