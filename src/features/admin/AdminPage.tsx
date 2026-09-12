import { ShieldAlert, ClipboardCheck, Layers, Wallet, MessagesSquare } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Skeleton } from "@/components/brutal/Skeleton";
import { useAuth } from "@/providers/AuthProvider";
import { isDemo } from "@/lib/demo-data";

const MODULES = [
  {
    id: "review",
    icon: ClipboardCheck,
    title: "Review queue",
    body: "Submissions waiting on a supervisor, oldest first, with the brief beside the deliverable.",
  },
  {
    id: "pool",
    icon: Layers,
    title: "Pool health",
    body: "Unclaimed briefs by age, stale scope flags, and capacity pressure across doers.",
  },
  {
    id: "payouts",
    icon: Wallet,
    title: "Payout queue",
    body: "Approved releases moving through queued, processing and paid, with failure retries.",
  },
  {
    id: "disputes",
    icon: MessagesSquare,
    title: "Disputes and tickets",
    body: "Open support threads and payout disputes in one inbox, with owners and due times.",
  },
];

/**
 * Admin shell, future-proof and role-gated.
 *
 * There is no admin backend yet: no tables, no policies, no RPCs. So this page
 * renders the module map with honest waiting states instead of invented numbers,
 * and stays invisible to every non-admin role. When the backend lands, each card
 * swaps its waiting chip for a live query. Nothing here touches doer flows.
 */
export function AdminPage() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="border-2 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-ink-muted" aria-hidden="true" />
          <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">Not available</h1>
          <p className="mt-2 text-sm text-ink-2">
            This area is not part of your account. Everything you need lives under
            Dashboard, My work and the board.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Operations</h1>
        <p className="mt-2 max-w-xl text-md text-ink-2">
          The future home of review, pool health, payouts and disputes. Modules light up
          as their backend views land.
        </p>
        {isDemo() ? (
          <p className="mt-3 inline-block rounded-full border-[1.5px] border-ink bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide">
            Sample data
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {MODULES.map((module) => (
          <Card key={module.id} className="space-y-2">
            <module.icon className="h-5 w-5 text-ink-muted" aria-hidden="true" />
            <h2 className="text-lg font-extrabold tracking-[-0.025em]">{module.title}</h2>
            <p className="text-xs leading-relaxed text-ink-2">{module.body}</p>
            <span className="inline-block rounded-full border border-line-card bg-surface-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-muted">
              Waiting on backend
            </span>
          </Card>
        ))}
      </div>

      <Card className="bg-surface-2">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.05em] text-ink-muted">
          Ground rules for this area
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-ink-2">
          <li>Doer anonymity holds here too: no client identity renders on any doer surface.</li>
          <li>Money figures must come from released ledger rows, never invented.</li>
          <li>Every action lands in an audit trail before it ships.</li>
        </ul>
      </Card>
    </div>
  );
}
