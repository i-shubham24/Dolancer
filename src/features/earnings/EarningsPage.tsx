import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Wallet, Receipt, ReceiptText } from "lucide-react";
import { ColorStat } from "@/components/brutal/ColorStat";
import { Card } from "@/components/brutal/Card";
import { SkeletonCard, Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { formatPaise } from "@/lib/paise";
import { formatDate } from "@/lib/datetime";
import { qk } from "@/lib/query-keys";
import { fetchEarningsSummary, fetchLedger } from "./api";

/**
 * Earnings.
 *
 * Two headline figures, and both are real. A "Pending" or "Clearing" balance is
 * deliberately absent: ledger_doer holds only released legs and razorpay_payouts
 * is unreadable to a doer, so any such number would be fabricated. A made-up
 * figure about someone's money is worse than an omitted one, and a zero that never
 * moves reads as "you have earned nothing".
 *
 * Gross, tax withheld and net are always shown as three separate numbers that
 * reconcile, never blended, because TDS is a statutory withholding a doer has to be
 * able to check against their own filing.
 */
export function EarningsPage() {
  const summary = useQuery({ queryKey: qk.earnings.summary(), queryFn: fetchEarningsSummary });
  const ledger = useQuery({ queryKey: qk.earnings.ledger(), queryFn: fetchLedger });

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Earnings</h1>
        <p className="mt-2 max-w-xl text-md text-ink-2">
          What you have been paid, and what was withheld getting there.
        </p>
      </header>

      {summary.isError ? (
        <ErrorState
          description="Your earnings did not load."
          onRetry={() => void summary.refetch()}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorStat
            tone="lime"
            label="Paid out to date"
            value={formatPaise(summary.data?.netPaise ?? 0)}
            subtext="Released to you, net of tax withheld"
            icon={<Wallet />}
            loading={summary.isLoading}
          />
          <ColorStat
            tone="blue"
            label="Tax withheld"
            value={formatPaise(summary.data?.taxWithheldPaise ?? 0)}
            subtext="Cumulative TDS and GST, financial year to date"
            icon={<Receipt />}
            loading={summary.isLoading}
          />
        </div>
      )}

      <Card>
        <h2 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
          How that reconciles
        </h2>
        <dl className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-ink-2">Gross released</dt>
            <dd className="text-lg font-bold tabular-nums">
              {summary.isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                formatPaise(summary.data?.grossPaise ?? 0)
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line-subtle pt-3">
            <dt className="text-sm text-ink-2">
              Tax withheld
              <span className="ml-1.5 text-xs text-ink-muted">(TDS and GST)</span>
            </dt>
            <dd className="text-lg font-bold tabular-nums text-danger-ink">
              {summary.isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                `- ${formatPaise(summary.data?.taxWithheldPaise ?? 0)}`
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t-2 border-ink pt-3">
            <dt className="text-md font-extrabold">You received</dt>
            <dd className="text-2xl font-extrabold tabular-nums tracking-[-0.03em]">
              {summary.isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                formatPaise(summary.data?.netPaise ?? 0)
              )}
            </dd>
          </div>
        </dl>
        <p className="mt-4 border-t border-line-subtle pt-3 text-[11px] leading-snug text-ink-muted">
          Tax is withheld when a payout is released, calculated on your cumulative earnings
          across the financial year rather than per project. Rates follow the country on your
          profile.
        </p>
      </Card>

      <section aria-labelledby="history" className="space-y-4">
        <h2 id="history" className="text-2xl font-extrabold tracking-[-0.03em]">
          Payout history
        </h2>

        {ledger.isLoading ? (
          <div className="space-y-3">
            <LoadingAnnounce label="Loading your payout history" />
            <SkeletonCard />
          </div>
        ) : ledger.isError ? (
          <ErrorState
            description="Your payout history did not load."
            onRetry={() => void ledger.refetch()}
          />
        ) : !ledger.data?.length ? (
          <EmptyState
            icon={<ReceiptText className="h-6 w-6" aria-hidden="true" />}
            title="No payouts yet"
            description="Once a project you delivered is approved and released, it shows up here with what you were paid."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            {/* Wide content scrolls inside its own container, never the page body. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-sm">
                <caption className="sr-only">Your released payouts</caption>
                <thead>
                  <tr className="border-b-2 border-ink bg-subtle text-left">
                    <th scope="col" className="px-4 py-3 text-2xs font-extrabold uppercase tracking-[0.05em]">
                      Released
                    </th>
                    <th scope="col" className="px-4 py-3 text-2xs font-extrabold uppercase tracking-[0.05em]">
                      Project
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-2xs font-extrabold uppercase tracking-[0.05em]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.data.map((row) => (
                    <tr key={row.id} className="border-b border-line-subtle last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 font-semibold">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/work/${row.projectId}`}
                          className="font-mono text-xs font-bold text-blue underline decoration-2 underline-offset-2 hover:text-blue-hover"
                        >
                          {row.projectId.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-extrabold tabular-nums">
                        {formatPaise(row.amountPaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line-subtle bg-surface-2 px-4 py-3 text-[11px] leading-snug text-ink-muted">
              Amounts shown are the gross released for each project. Tax is withheld across
              your financial year rather than per project, so the totals above are where the
              two reconcile.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
