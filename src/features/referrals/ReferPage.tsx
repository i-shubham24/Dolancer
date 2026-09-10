import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Refer someone</h1>
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
          <Card className="border-2 bg-lime shadow-offset-md">
            <div className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink/65">
              Your invite code
            </div>
            <div className="mt-2 font-mono text-4xl font-extrabold tracking-[-0.02em]">
              {code || "Unavailable"}
            </div>
            {link ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-md border-[1.5px] border-ink bg-surface px-3 py-2 text-xs">
                  {link}
                </code>
                <Button variant="dark" size="sm" onClick={() => void copy()}>
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
    </div>
  );
}
