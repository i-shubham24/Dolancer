import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Landmark, Lock, Plus, Wallet } from "lucide-react";
import { CARD, cardMotion, gridMotion } from "@/components/app/card-styles";
import { PageHeader } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { formatPaise } from "@/lib/paise";
import { formatDateTime } from "@/lib/datetime";
import { fyLabel, fyOptions, inFinancialYear } from "@/lib/fy";
import { taskTitle } from "@/lib/task-title";
import { toUserError } from "@/lib/user-error";
import { useActiveProjects, useEarningsSummary } from "@/features/dashboard/queries";
import { useProjects } from "@/features/work/queries";
import { AddMethodDialog } from "./AddMethodDialog";
import {
  activeMethod,
  fetchPayoutMethods,
  fetchPayouts,
  makePrimaryMethod,
  methodName,
  type Payout,
  type PayoutMethod,
  type PayoutMethodKind,
} from "./api";

const SHOWN = 8;

const STATUS: Record<Payout["status"], { label: string; dot: string; text: string }> = {
  sending: { label: "Sending now", dot: "bg-primary ring-4 ring-primary/15", text: "text-primary" },
  paid: { label: "In your account", dot: "bg-success-dot", text: "text-success-ink" },
  rerouted: { label: "UPI failed, sent to bank", dot: "bg-warning-dot", text: "text-warning-ink" },
  failed: { label: "Did not go through", dot: "bg-danger-dot", text: "text-danger-ink" },
};

/** A coloured dot and plain words. No pill, so the row stays calm. */
function StatusLine({ status }: { status: Payout["status"] }) {
  const style = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-extrabold", style.text)}>
      <span className={cn("h-2 w-2 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
      {style.label}
    </span>
  );
}

function payoutMeta(payout: Payout): string {
  if (payout.status === "sending") return `Approved ${formatDateTime(payout.approvedAt)} · to ${payout.methodName}`;
  if (payout.status === "failed") return `${formatDateTime(payout.approvedAt)} · ${payout.methodName} did not take it. Check where your pay goes; we send it again.`;
  const when = formatDateTime(payout.settledAt ?? payout.approvedAt);
  const where = payout.status === "rerouted" ? `UPI did not answer, so it went to ${payout.methodName}` : payout.methodName;
  return [when, where, payout.utr ? `UTR ${payout.utr}` : null].filter(Boolean).join(" · ");
}

/** A spreadsheet cell, quoted, and kept from being read as a formula. */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadStatement(payouts: Payout[], titles: Map<string, string>) {
  const rows = [
    ["Approved", "Task", "Amount (INR, before tax)", "Status", "Sent to", "UTR"],
    ...payouts.map((payout) => [
      formatDateTime(payout.approvedAt),
      titles.get(payout.projectId) ?? "A finished task",
      (payout.amountPaise / 100).toFixed(2),
      STATUS[payout.status].label,
      payout.methodName,
      payout.utr ?? "",
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "dolancer-payouts.csv";
  link.click();
  URL.revokeObjectURL(url);
}

/** Approved, sending, in the account: where a payout on its way has got to. */
function Tracker({ payout, title }: { payout: Payout; title: string }) {
  const steps = [
    { title: "Approved", line: formatDateTime(payout.approvedAt), state: "done" },
    { title: payout.methodKind === "upi" ? "Sending to UPI" : "Sending to your bank", line: payout.methodName, state: "now" },
    { title: "In your account", line: "We send you an alert", state: "next" },
  ] as const;
  return (
    <motion.section variants={cardMotion} className={cn(CARD, "gap-4 ring-[1.5px] ring-primary/30")} aria-label={`Payout on its way for ${title}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <StatusLine status="sending" />
          <h2 className="mt-1.5 text-[16px] font-extrabold leading-snug tracking-[-0.02em]">{title}</h2>
        </div>
        <span className="text-[26px] font-extrabold tabular-nums tracking-[-0.03em]">{formatPaise(payout.amountPaise)}</span>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3 sm:gap-0">
        {steps.map((step) => (
          <li key={step.title} className="relative flex gap-3 sm:block sm:pt-6">
            <span
              className={cn(
                "absolute left-0 right-0 top-[5px] hidden h-[3px] sm:block",
                step.state === "done" ? "bg-success-dot" : "bg-line-card",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "relative z-[1] mt-0.5 block h-3 w-3 shrink-0 rounded-full sm:absolute sm:left-0 sm:top-0 sm:mt-0",
                step.state === "done" && "bg-success-dot",
                step.state === "now" && "bg-primary ring-[5px] ring-primary/20",
                step.state === "next" && "bg-line-card",
              )}
              aria-hidden="true"
            />
            <span className="min-w-0 sm:pr-3">
              <span className={cn("block text-[13px] font-extrabold", step.state === "next" && "text-ink-2")}>{step.title}</span>
              <span className={cn("block truncate text-xs font-semibold", step.state === "now" ? "text-primary" : "text-ink-muted")}>{step.line}</span>
            </span>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}

function MethodRow({
  method,
  methods,
  onChange,
  onMakeFirst,
  busy,
}: {
  method: PayoutMethod;
  methods: PayoutMethod[];
  onChange: () => void;
  onMakeFirst: () => void;
  busy: boolean;
}) {
  const now = Date.now();
  const waiting = method.activeFrom && new Date(method.activeFrom).getTime() > now;
  const current = activeMethod(methods, now);
  const role = waiting
    ? `Starts getting payouts ${formatDateTime(method.activeFrom)}`
    : method.id === current?.id
      ? "Gets your payouts"
      : methods.length > 1
        ? "Used if the other one fails"
        : "Gets your payouts";
  return (
    <li
      className={cn(
        "grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2 rounded-2xl p-3.5 sm:grid-cols-[44px_minmax(0,1fr)_auto]",
        method.primary ? "bg-info-bg ring-[1.5px] ring-primary/30" : "bg-panel/60",
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[12px] font-extrabold text-primary" aria-hidden="true">
        {method.kind === "upi" ? "UPI" : <Landmark className="h-5 w-5" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14.5px] font-extrabold">{methodName(method)}</span>
        <span className="block text-xs font-semibold text-ink-muted">Name checked: {method.holderName}</span>
        <span className={cn("block text-xs font-bold", waiting ? "text-warning-ink" : "text-ink-2")}>{role}</span>
      </span>
      <span className="col-span-2 flex justify-end gap-4 sm:col-span-1 sm:flex-col sm:items-end sm:gap-1.5">
        <button type="button" onClick={onChange} className="text-[13px] font-extrabold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary">
          Change
        </button>
        {!method.primary ? (
          <button
            type="button"
            onClick={onMakeFirst}
            disabled={busy}
            className="text-[13px] font-extrabold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
          >
            Make first
          </button>
        ) : null}
      </span>
    </li>
  );
}

/**
 * Payouts: reached from the Earnings tab, not the sidebar.
 *
 * Left, where pay goes (UPI and a bank account, one of each) and the money totals.
 * Right, any payout on its way, then every payout with where it went and the bank's
 * reference number.
 */
export function PayoutsPage() {
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const methods = useQuery({ queryKey: qk.payouts.methods(), queryFn: fetchPayoutMethods });
  const payouts = useQuery({
    queryKey: qk.payouts.list(),
    queryFn: fetchPayouts,
    // While something is on its way, look again now and then so it lands on its own.
    refetchInterval: (query) => ((query.state.data ?? []).some((payout) => payout.status === "sending") ? 5_000 : false),
  });
  const earnings = useEarningsSummary();
  const active = useActiveProjects();
  const closed = useProjects("closed");

  const [dialog, setDialog] = useState<{ kind: PayoutMethodKind; replacing: PayoutMethod | null } | null>(null);
  const [fy, setFy] = useState("all");
  const [all, setAll] = useState(false);

  const makeFirst = useMutation({
    mutationFn: makePrimaryMethod,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.payouts.methods() });
      toast.success("Done. Payouts go there first now.");
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not change that. Try again.")),
  });

  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const project of [...(closed.data ?? []), ...(active.data ?? [])]) map.set(project.id, taskTitle(project));
    return map;
  }, [closed.data, active.data]);

  const list = payouts.data ?? [];
  const sending = list.filter((payout) => payout.status === "sending");
  const settled = list.filter((payout) => payout.status !== "sending");
  const years = useMemo(() => fyOptions(settled.map((payout) => payout.approvedAt)), [settled]);
  const visible = settled.filter((payout) => fy === "all" || inFinancialYear(payout.approvedAt, Number(fy)));
  const shown = all ? visible : visible.slice(0, SHOWN);

  const onItsWay = sending.reduce((sum, payout) => sum + payout.amountPaise, 0);
  const waitingApproval = (active.data ?? [])
    .filter((project) => project.status === "in_review" || project.status === "delivered")
    .reduce((sum, project) => sum + project.payoutPaise, 0);

  const methodList = methods.data ?? [];
  const missingKind: PayoutMethodKind | null = !methodList.some((method) => method.kind === "upi")
    ? "upi"
    : !methodList.some((method) => method.kind === "bank")
      ? "bank"
      : null;

  return (
    <div>
      <PageHeader
        back={{ to: "/dashboard?view=earnings", label: "Earnings" }}
        title="Payouts"
        sub="Your pay is sent as soon as your supervisor approves the work."
        actions={
          <Button variant="outline" size="sm" disabled={list.length === 0} onClick={() => downloadStatement(list, titles)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download statement
          </Button>
        }
      />

      <motion.div
        className="grid items-start gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]"
        variants={gridMotion}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <motion.section variants={cardMotion} className={cn(CARD, "gap-4")} aria-labelledby="where-pay-goes">
            <div>
              <h2 id="where-pay-goes" className="text-[16px] font-extrabold tracking-[-0.02em]">
                Where your pay goes
              </h2>
              <p className="text-xs font-semibold text-ink-muted">
                {methodList.length > 1 ? "The first one gets your payouts. If it fails, we use the other." : "Add a UPI ID or a bank account in your name."}
              </p>
            </div>
            {methods.isLoading ? (
              <div className="space-y-2">
                <div className="skeleton h-20 w-full rounded-2xl" />
                <div className="skeleton h-20 w-full rounded-2xl" />
              </div>
            ) : methods.isError ? (
              <p className="rounded-2xl bg-panel/60 p-4 text-center text-sm font-bold">
                Could not load this.{" "}
                <button type="button" className="text-primary" onClick={() => void methods.refetch()}>
                  Try again
                </button>
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {methodList.map((method) => (
                  <MethodRow
                    key={method.id}
                    method={method}
                    methods={methodList}
                    busy={makeFirst.isPending}
                    onChange={() => setDialog({ kind: method.kind, replacing: method })}
                    onMakeFirst={() => makeFirst.mutate(method.id)}
                  />
                ))}
              </ul>
            )}
            <p className="flex items-start gap-2.5 rounded-2xl bg-panel/60 px-3.5 py-3 text-[12.5px] font-semibold text-ink-2">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              Changing where your pay goes needs a code sent to your phone. New details start getting payouts after 24 hours, so nobody else can move your money.
            </p>
            {missingKind && !methods.isLoading && !methods.isError ? (
              <Button variant="outline" className="w-full" onClick={() => setDialog({ kind: missingKind, replacing: null })}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                {methodList.length === 0 ? "Add UPI or bank account" : missingKind === "upi" ? "Add a UPI ID" : "Add a bank account"}
              </Button>
            ) : null}
          </motion.section>

          <motion.section variants={cardMotion} className={cn(CARD, "gap-1")} aria-labelledby="money">
            <h2 id="money" className="mb-2 text-[16px] font-extrabold tracking-[-0.02em]">
              Money
            </h2>
            {[
              { label: "On its way", value: onItsWay, loading: payouts.isLoading },
              { label: "Waiting for approval", value: waitingApproval, loading: active.isLoading },
              { label: "Paid to you, after tax", value: earnings.data?.netPaise ?? 0, loading: earnings.isLoading },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 border-b border-line-subtle py-2.5 last:border-0">
                <span className="text-[13.5px] font-semibold text-ink-2">{row.label}</span>
                {row.loading ? <span className="skeleton h-4 w-16 rounded" /> : <span className="text-[14.5px] font-extrabold tabular-nums">{formatPaise(row.value)}</span>}
              </div>
            ))}
          </motion.section>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {sending.map((payout) => (
            <Tracker key={payout.id} payout={payout} title={titles.get(payout.projectId) ?? "A finished task"} />
          ))}

          <motion.section variants={cardMotion} className={cn(CARD, "gap-4")} aria-labelledby="every-payout">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="every-payout" className="text-[16px] font-extrabold tracking-[-0.02em]">
                  Every payout
                </h2>
                <p className="text-xs font-semibold text-ink-muted">Where each one went and the bank reference</p>
              </div>
              {years.length > 0 ? (
                <Select
                  label="Financial year"
                  value={fy}
                  onChange={(value) => {
                    setFy(value);
                    setAll(false);
                  }}
                  options={[{ value: "all", label: "All years" }, ...years.map((year) => ({ value: String(year), label: `FY ${fyLabel(year)}` }))]}
                  className="h-9 rounded-full bg-panel px-3.5 text-xs font-bold text-ink-2 hover:bg-hover"
                />
              ) : null}
            </div>

            {payouts.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="skeleton h-[72px] w-full rounded-2xl" />
                ))}
              </div>
            ) : payouts.isError ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-panel/60 p-6 text-center">
                <p className="text-sm font-bold">Payouts did not load.</p>
                <button type="button" onClick={() => void payouts.refetch()} className="text-xs font-bold text-primary">
                  Try again
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-panel/60 px-4 py-10 text-center">
                <Wallet className="h-5 w-5 text-ink-3" aria-hidden="true" />
                <p className="text-xs font-semibold text-ink-muted">
                  {settled.length === 0 ? "Your first payout shows here once a task is approved." : "Nothing paid in this year."}
                </p>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-2">
                  {shown.map((payout) => (
                    <li key={payout.id}>
                      <Link
                        to={`/work/${payout.projectId}`}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-2xl bg-panel/60 px-4 py-3 transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <span className="min-w-0">
                          <StatusLine status={payout.status} />
                          <span className="mt-1 line-clamp-2 block text-[14px] font-extrabold sm:truncate">{titles.get(payout.projectId) ?? "A finished task"}</span>
                        </span>
                        <span className="row-span-2 text-right">
                          <span className="block text-[16px] font-extrabold tabular-nums">{formatPaise(payout.amountPaise)}</span>
                          <span className="block text-[11.5px] font-semibold text-ink-muted">before tax</span>
                        </span>
                        <span className="min-w-0 break-words text-xs font-semibold text-ink-muted">{payoutMeta(payout)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {visible.length > SHOWN ? (
                  <button
                    type="button"
                    onClick={() => setAll((value) => !value)}
                    className="self-center rounded-full bg-panel px-4 py-2 text-xs font-bold text-ink-2 transition-colors hover:bg-hover hover:text-ink"
                  >
                    {all ? "Show fewer" : `Show all ${visible.length}`}
                  </button>
                ) : null}
              </>
            )}
          </motion.section>
        </div>
      </motion.div>

      {dialog ? (
        <AddMethodDialog
          open
          onOpenChange={(open) => {
            if (!open) setDialog(null);
          }}
          methods={methodList}
          replacing={dialog.replacing}
          startKind={dialog.kind}
        />
      ) : null}
    </div>
  );
}
