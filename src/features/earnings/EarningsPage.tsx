import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Download, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/Select";
import { gridMotion } from "@/components/app/card-styles";
import { EmptyPanel, PageHeader } from "@/components/app/page";
import { Panel, PanelHeader } from "@/components/app/ui";
import { formatPaise } from "@/lib/paise";
import { formatDate } from "@/lib/datetime";
import { fyLabel, fyOptions, fyStartYear, inFinancialYear } from "@/lib/fy";
import { qk } from "@/lib/query-keys";
import { taskTitle } from "@/lib/task-title";
import { useProjects } from "@/features/work/queries";
import { MoneyStats } from "@/features/dashboard/StatCards";
import { PaidChart } from "@/features/dashboard/PaidChart";
import { MoneySplitCard } from "@/features/dashboard/FinanceCards";
import { fetchEarningsSummary, fetchLedger } from "./api";

/**
 * Earnings.
 *
 * Every figure is real. A "Pending" or "Clearing" balance is deliberately absent:
 * ledger_doer holds only released legs and razorpay_payouts is unreadable to a
 * doer, so any such number would be fabricated. A made-up figure about someone's
 * money is worse than an omitted one.
 *
 * Gross, tax withheld and net are always separate numbers that reconcile, never
 * blended, because TDS is a statutory withholding a doer has to be able to check
 * against their own filing.
 */
export function EarningsPage() {
  const reduceMotion = useReducedMotion();
  const summary = useQuery({ queryKey: qk.earnings.summary(), queryFn: fetchEarningsSummary });
  const ledger = useQuery({ queryKey: qk.earnings.ledger(), queryFn: fetchLedger });
  const closed = useProjects("closed");
  const [fy, setFy] = useState<string>("all");

  const rows = useMemo(() => ledger.data ?? [], [ledger.data]);
  const years = useMemo(() => fyOptions(rows.map((row) => row.createdAt)), [rows]);
  const visible = useMemo(
    () => (fy === "all" ? rows : rows.filter((row) => inFinancialYear(row.createdAt, Number(fy)))),
    [rows, fy],
  );
  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const project of closed.data ?? []) map.set(project.id, taskTitle(project));
    return map;
  }, [closed.data]);

  const thisYear = fyStartYear(new Date());
  const yearRows = rows.filter((row) => inFinancialYear(row.createdAt, thisYear));

  function exportCsv() {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const lines = [
      "Released,Task,Gross (INR)",
      ...visible.map((row) =>
        [
          escape(new Date(row.createdAt).toLocaleDateString("en-IN")),
          escape(titles.get(row.projectId) ?? row.projectId),
          (row.amountPaise / 100).toFixed(2),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `dolancer-payouts-${fy === "all" ? "all" : fyLabel(Number(fy))}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dash-wrap">
      <PageHeader
        eyebrow="Money"
        title="Earnings"
        sub="What you were paid, and what was withheld."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={visible.length === 0}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      {summary.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Earnings did not load"
          action={
            <Button variant="outline" onClick={() => void summary.refetch()}>
              Try again
            </Button>
          }
          className="mb-4"
        />
      ) : null}

      <motion.div className="fin-grid" variants={gridMotion} initial={reduceMotion ? false : "hidden"} animate="show">
        <MoneyStats
          linkTo=""
          earnings={summary.data}
          loading={summary.isLoading}
          error={summary.isError}
          yearPaise={yearRows.reduce((sum, row) => sum + row.amountPaise, 0)}
          yearCount={yearRows.length}
          yearLabel={fyLabel(thisYear)}
        />
        <PaidChart rows={rows} loading={ledger.isLoading} />
        <MoneySplitCard earnings={summary.data} loading={summary.isLoading} />

        <Panel className="[grid-area:pays]" aria-labelledby="history">
          <PanelHeader
            id="history"
            title="Payout history"
            sub="Gross released for each task. Tax is worked out across the year."
            right={
              years.length > 0 ? (
                <Select
                  label="Financial year"
                  value={fy}
                  onChange={setFy}
                  options={[{ value: "all", label: "All years" }, ...years.map((year) => ({ value: String(year), label: `FY ${fyLabel(year)}` }))]}
                  className="h-9 rounded-full bg-panel px-3.5 text-xs font-bold text-ink-2 hover:bg-hover"
                />
              ) : null
            }
          />
          {ledger.isLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-14 w-full rounded-2xl" />
              <div className="skeleton h-14 w-full rounded-2xl" />
            </div>
          ) : ledger.isError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-panel/60 p-6 text-center">
              <p className="text-sm font-bold">Payout history did not load.</p>
              <Button variant="outline" size="sm" onClick={() => void ledger.refetch()}>
                Try again
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-panel/60 px-4 py-8 text-center">
              <ReceiptText className="h-5 w-5 text-ink-3" aria-hidden="true" />
              <p className="text-xs font-semibold text-ink-muted">
                {rows.length === 0 ? "No payouts yet. Approved tasks show up here once paid." : "Nothing paid in this year."}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {visible.map((row, index) => (
                <motion.li
                  key={row.id}
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.2 + index * 0.05 }}
                >
                  <Link
                    to={`/work/${row.projectId}`}
                    className="flex items-center gap-3 rounded-2xl bg-panel/60 p-2.5 pr-3.5 transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success-bg text-success-ink" aria-hidden="true">
                      <ReceiptText className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold">{titles.get(row.projectId) ?? "A finished task"}</span>
                      <span className="block text-xs font-semibold text-ink-muted">Released {formatDate(row.createdAt)}</span>
                    </span>
                    <span className="shrink-0 text-[15px] font-extrabold tabular-nums">{formatPaise(row.amountPaise)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </Panel>
      </motion.div>
    </div>
  );
}
