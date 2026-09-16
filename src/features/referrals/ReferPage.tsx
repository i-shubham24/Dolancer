import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { Copy, Check, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demo, demoRespond, isDemo } from "@/lib/demo-data";
import { callRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
import { formatDate } from "@/lib/datetime";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";

interface ReferralState {
  code: string;
  invited: { id: string; createdAt: string; joined: boolean }[];
}

/**
 * ensure_invite_code is idempotent and returns the caller's existing code if they
 * already have one, so calling it on every visit is safe. A unique constraint on
 * inviter_id makes concurrent calls converge rather than mint duplicates.
 */
async function fetchReferrals(): Promise<ReferralState> {
  if (isDemo()) return demoRespond(() => demo.referrals);

  const code = unwrap(await callRpc<string>("ensure_invite_code"));

  const { data, error } = await supabase
    .from("referrals")
    .select(selectColumns("invite_code", "invitee_id", "created_at"))
    .order("created_at", { ascending: true })
    .limit(50);
  if (error) throw new Error(error.message);

  const rows =
    (data as unknown as { invite_code: string; invitee_id: string | null; created_at: string }[] | null) ??
    [];

  return {
    code: code ?? rows[0]?.invite_code ?? "",
    invited: rows
      .filter((row) => row.invitee_id !== null)
      .map((row) => ({
        id: row.invitee_id ?? row.created_at,
        createdAt: row.created_at,
        joined: true,
      })),
  };
}

export function ReferPage() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const referrals = useQuery({ queryKey: qk.referrals(), queryFn: fetchReferrals });

  const code = referrals.data?.code ?? "";
  const link = code ? `${window.location.origin}/sign-up?ref=${encodeURIComponent(code)}` : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the link and copy it manually.");
    }
  }

  return (
    <motion.div
      className="relative mx-auto max-w-4xl space-y-6 overflow-hidden px-1 py-1 sm:px-2"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 top-48 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />
      <header className="relative rounded-3xl bg-surface/70 px-5 py-6 backdrop-blur-sm sm:px-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-highlight">Network protocol · 5% bonus</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Referrals &amp; network</h1>
        <p className="mt-2 text-md text-ink-2">
          Know someone good? Invite them, and you earn a bonus once they finish and get
          approved on their first project.
        </p>
      </header>

      {referrals.isLoading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : referrals.isError ? (
        <ErrorState
          description="Your invite code did not load."
          onRetry={() => void referrals.refetch()}
        />
      ) : (
        <>
          <Card className="relative overflow-hidden border-transparent bg-highlight-light/60 shadow-soft-md">
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-highlight/15 blur-2xl" aria-hidden="true" />
            <div className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink/65">
              Your invite code
            </div>
            <div className="mt-2 font-mono text-4xl font-extrabold tracking-[-0.02em]">
              {code || "Unavailable"}
            </div>
            {link ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-xl border border-line-card bg-white/80 px-3 py-2 text-xs">
                  {link}
                </code>
                <Button variant="outline" size="sm" onClick={() => void copy()}>
                  {copied ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </div>
            ) : null}
          </Card>

          <section aria-labelledby="invited" className="space-y-3">
            <h2 id="invited" className="text-2xl font-extrabold tracking-[-0.03em]">
              People you invited
            </h2>
            <ol className="grid gap-2 sm:grid-cols-3" aria-label="How a referral pays out">
              <li className="rounded-2xl border border-line-card bg-white/90 p-4 shadow-soft-sm">
                <div className="text-2xl font-extrabold tracking-[-0.03em]">1</div>
                <div className="mt-1 text-sm font-extrabold">Shared</div>
                <div className="text-[11px] text-ink-muted">
                  {code ? "Your link is live." : "Your link appears once loaded."}
                </div>
              </li>
              <li className="rounded-2xl border border-line-card bg-white/90 p-4 shadow-soft-sm">
                <div className="text-2xl font-extrabold tracking-[-0.03em]">
                  {referrals.data?.invited.length ?? 0}
                </div>
                <div className="mt-1 text-sm font-extrabold">Joined</div>
                <div className="text-[11px] text-ink-muted">Signed up with your code.</div>
              </li>
              <li className="rounded-2xl border border-dashed border-line-card bg-surface-2 p-4">
                <div className="text-2xl font-extrabold tracking-[-0.03em]">Auto</div>
                <div className="mt-1 text-sm font-extrabold">Bonus on approval</div>
                <div className="text-[11px] text-ink-muted">
                  Lands automatically when their first project is approved.
                </div>
              </li>
            </ol>
            {referrals.data && referrals.data.invited.length > 0 ? (
              <ul className="space-y-2">
                {referrals.data.invited.map((invitee) => (
                  <li key={invitee.id}>
                    <Card className="flex items-center justify-between gap-3 py-3">
                      <span className="text-sm font-bold">Joined via your link</span>
                      <span className="text-xs text-ink-muted">
                        {formatDate(invitee.createdAt)}
                      </span>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<Gift className="h-6 w-6" aria-hidden="true" />}
                title="Nobody yet"
                description="Share your link. When someone joins with it and gets their first project approved, your bonus lands in your balance."
              />
            )}
          </section>

          <p className="text-[11px] leading-relaxed text-ink-muted">
            The bonus is credited to your balance and is paid out with your next payout. It
            counts toward your earnings for tax, the same as project work does.
          </p>
        </>
      )}
    </motion.div>
  );
}
