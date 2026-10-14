import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ListChecks, Wallet } from "lucide-react";
import { qk } from "@/lib/query-keys";
import { isActiveStatus } from "@/lib/status";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { fyLabel, fyStartYear, inFinancialYear } from "@/lib/fy";
import { taskTitle } from "@/lib/task-title";
import { cn } from "@/lib/cn";
import { useUiStore } from "@/stores/useUiStore";
import { useProjects } from "@/features/work/queries";
import { fetchLedger, type LedgerRow } from "@/features/earnings/api";
import { formatPaise } from "@/lib/paise";
import { useCalendarEvents } from "@/features/calendar/events";
import { addDays, formatDayLong, formatDayRelative, formatDayShort, startOfWeek } from "@/features/calendar/dates";
import type { DoerProject } from "@/types/domain";
import {
  useProfile,
  useGateState,
  useActiveProjects,
  usePoolPreview,
  useEarningsSummary,
} from "./queries";
import { AttentionStrip } from "./AttentionStrip";
import { MoneyStats, TaskStats } from "./StatCards";
import { MoneySplitCard, RecentPayouts } from "./FinanceCards";
import { PaidChart } from "./PaidChart";
import { UpNextCard } from "./UpNextCard";
import { pickUpNext } from "./up-next";
import { WeekCard } from "./WeekCard";
import { WorkList } from "./WorkList";
import { OffersCard } from "./OffersCard";
import { WorkTimerCard } from "./WorkTimerCard";
import { TaskPeek } from "./TaskPeek";
import { gridMotion } from "@/components/app/card-styles";

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
      : "Finish your setup on Home to start getting offers.";
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

/** One plain sentence on money, from released payouts only. */
function moneySummary(netPaise: number | undefined, rows: LedgerRow[]): string {
  if (rows.length === 0) return "No payouts yet. Your first one shows here after approval.";
  const last = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]!;
  const lastDay = formatDayShort(new Date(last.createdAt));
  return `${formatPaise(netPaise ?? 0)} has reached you after tax. Last payout on ${lastDay}.`;
}

type DashView = "tasks" | "finances";

const VIEWS: { id: DashView; label: string; icon: typeof Wallet }[] = [
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "finances", label: "Finances", icon: Wallet },
];

/** Tasks or Finances: one half of the dashboard at a time, so neither is crowded. */
function ViewSwitch({ value, onChange }: { value: DashView; onChange: (view: DashView) => void }) {
  return (
    <div role="tablist" aria-label="Dashboard view" className="flex flex-1 gap-1 rounded-full bg-white p-1 ring-1 ring-ink/[0.05] sm:flex-none">
      {VIEWS.map((view) => {
        const active = view.id === value;
        return (
          <button
            key={view.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(view.id)}
            className={cn(
              "relative flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-[13.5px] font-bold transition-colors sm:flex-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active ? "text-white" : "text-ink-2 hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId="dash-view"
                className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_-6px_rgba(10,101,192,0.7)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <view.icon className="relative h-4 w-4" aria-hidden="true" />
            <span className="relative">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
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
  const [peek, setPeek] = useState<DoerProject | null>(null);
  const [peekOpen, setPeekOpen] = useState(false);
  const view = useUiStore((state) => state.dashView);
  const setView = useUiStore((state) => state.setDashView);
  const closed = useProjects("closed");

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

  // Money this financial year, from released payouts only.
  const fy = fyStartYear(now);
  const yearRows = (ledger.data ?? []).filter((row) => inFinancialYear(row.createdAt, fy));
  const yearPaise = yearRows.reduce((sum, row) => sum + row.amountPaise, 0);
  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const project of [...(closed.data ?? []), ...active]) map.set(project.id, taskTitle(project));
    return map;
  }, [closed.data, active]);

  return (
    <div className="dash-wrap">
      <TaskPeek project={peek} open={peekOpen} onOpenChange={setPeekOpen} />

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
            {view === "finances"
              ? moneySummary(earnings.data?.netPaise, ledger.data ?? [])
              : projects.isLoading
                ? "Checking your work..."
                : summary(active, upNext, unlocked)}
          </p>
        </div>
        <div className="flex w-full items-center sm:w-auto">
          <ViewSwitch value={view} onChange={setView} />
        </div>
      </motion.header>


      {view === "tasks" ? <AttentionStrip projects={active} /> : null}

      <AnimatePresence mode="wait" initial={false}>
        {view === "tasks" ? (
          <motion.div
            key="tasks"
            className="dash-grid"
            variants={gridMotion}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, transition: { duration: 0.15 } }}
          >
            <TaskStats activeCount={active.length} activeLoading={projects.isLoading} dueThisWeek={dueThisWeek} />
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
        ) : (
          <motion.div
            key="finances"
            className="fin-grid"
            variants={gridMotion}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit={reduceMotion ? undefined : { opacity: 0, y: 8, transition: { duration: 0.15 } }}
          >
            <MoneyStats
              earnings={earnings.data}
              loading={earnings.isLoading}
              error={earnings.isError}
              yearPaise={yearPaise}
              yearCount={yearRows.length}
              yearLabel={fyLabel(fy)}
            />
            <PaidChart rows={ledger.data ?? []} loading={ledger.isLoading} />
            <MoneySplitCard earnings={earnings.data} loading={earnings.isLoading} />
            <RecentPayouts rows={ledger.data ?? []} titles={titles} loading={ledger.isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
