import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { formatPaise } from "@/lib/paise";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { useActiveProjects } from "@/features/dashboard/queries";
import { fetchLedger, type LedgerRow } from "@/features/earnings/api";
import { fetchPool } from "@/features/pool/api";
import { fetchProjects } from "@/features/work/api";
import { useReminders, type Reminder } from "@/stores/useReminderStore";
import type { DoerProject, PoolOffer } from "@/types/domain";
import { formatTime } from "./dates";

/**
 * Everything with a date that a doer cares about, as one list.
 *
 * Every kind is built from data the app already reads: deadlines from active work,
 * payouts from the released-payout ledger, offers from the assigned-offer list, and
 * the doer's own reminders. Offers are only "due if you accept", so they render as
 * dashed outlines and can be hidden.
 */
export type CalendarKind = "deadline" | "reminder" | "payout" | "offer";

export interface CalendarEvent {
  id: string;
  kind: CalendarKind;
  title: string;
  at: Date;
  note: string;
  href: string | null;
  reminderId?: string;
  /** When a reminder was created, so a just-added one can be highlighted once. */
  addedAt?: number;
}

export const KIND_META: Record<
  CalendarKind,
  { label: string; dot: string; chip: string; bar: string }
> = {
  deadline: {
    label: "Deadlines",
    dot: "bg-danger-dot",
    bar: "bg-danger-dot",
    chip: "bg-danger-bg text-danger-ink border-l-[3px] border-danger-dot",
  },
  reminder: {
    label: "My reminders",
    dot: "bg-violet",
    bar: "bg-violet",
    chip: "bg-violet-light text-violet border-l-[3px] border-violet",
  },
  payout: {
    label: "Payouts",
    dot: "bg-success-dot",
    bar: "bg-success-dot",
    chip: "bg-success-bg text-success-ink border-l-[3px] border-success-dot",
  },
  offer: {
    label: "Offers, if you accept",
    dot: "border border-dashed border-warning-dot bg-transparent",
    bar: "bg-warning-dot",
    chip: "bg-white text-warning-ink outline outline-1 outline-dashed outline-warning-dot -outline-offset-1",
  },
};

function parse(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function buildEvents(input: {
  active: DoerProject[];
  closed: DoerProject[];
  ledger: LedgerRow[];
  offers: PoolOffer[];
  reminders: Reminder[];
}): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const titles = new Map<string, string>();
  for (const project of [...input.active, ...input.closed]) titles.set(project.id, taskTitle(project));

  for (const project of input.active) {
    const at = parse(project.deliveryAt);
    if (!at) continue;
    const status = statusDisplay(project.status, project.workingDocUrl);
    events.push({
      id: `due-${project.id}`,
      kind: "deadline",
      title: taskTitle(project),
      at,
      note: `${formatTime(at)}. ${status.label}`,
      href: `/work/${project.id}`,
    });
  }

  for (const row of input.ledger) {
    const at = parse(row.createdAt);
    if (!at) continue;
    const task = titles.get(row.projectId);
    events.push({
      id: `paid-${row.id}`,
      kind: "payout",
      title: `Paid ${formatPaise(row.amountPaise)}`,
      at,
      note: task ? `For ${task}` : "For a finished task",
      href: "/earnings",
    });
  }

  for (const offer of input.offers) {
    const at = parse(offer.deliveryAt);
    if (!at) continue;
    events.push({
      id: `offer-${offer.id}`,
      kind: "offer",
      title: taskTitle(offer),
      at,
      note: `Due if you accept. ${formatPaise(offer.payoutPaise)} before tax`,
      href: "/pool",
    });
  }

  for (const reminder of input.reminders) {
    const at = parse(reminder.at);
    if (!at) continue;
    const task = reminder.projectId ? titles.get(reminder.projectId) : undefined;
    events.push({
      id: `rem-${reminder.id}`,
      kind: "reminder",
      title: reminder.title,
      at,
      note: task ? `${formatTime(at)}. For ${task}` : `${formatTime(at)}. Your reminder`,
      href: reminder.projectId ? `/work/${reminder.projectId}` : null,
      reminderId: reminder.id,
      addedAt: new Date(reminder.createdAt).getTime(),
    });
  }

  return events.sort((a, b) => a.at.getTime() - b.at.getTime());
}

/**
 * The calendar's data, loaded and merged. Offers are opt-in, because only the
 * Calendar page shows them. The query keys match the ones the work, offers and
 * earnings pages use, so the caches are shared rather than fetched twice.
 */
export function useCalendarEvents(options: { offers?: boolean } = {}) {
  const wantOffers = options.offers ?? false;
  const active = useActiveProjects();
  // Finished work only supplies names for payouts.
  const closed = useQuery({
    queryKey: qk.work.list("closed"),
    queryFn: () => fetchProjects("closed"),
  });
  const ledger = useQuery({ queryKey: qk.earnings.ledger(), queryFn: fetchLedger });
  const pool = useQuery({
    queryKey: [...qk.pool.list(), "deadline"],
    queryFn: () => fetchPool({ sort: "deadline" }),
    enabled: wantOffers,
  });
  const { reminders } = useReminders();

  const events = useMemo(
    () =>
      buildEvents({
        active: active.data ?? [],
        closed: closed.data ?? [],
        ledger: ledger.data ?? [],
        offers: wantOffers ? (pool.data?.items ?? []) : [],
        reminders,
      }),
    [active.data, closed.data, ledger.data, pool.data, reminders, wantOffers],
  );

  return {
    events,
    activeProjects: active.data ?? [],
    isLoading: active.isLoading || ledger.isLoading,
    isError: active.isError && ledger.isError,
  };
}
