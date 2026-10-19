import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, Copy, Gift, Share2, UserCheck, UserPlus, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demo, demoRespond, isDemo, type ReferralInvitee } from "@/lib/demo-data";
import { callRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
import { formatDate } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/brutal/Skeleton";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { Panel, PanelHeader } from "@/components/app/ui";

interface ReferralState {
  code: string;
  invited: ReferralInvitee[];
}

const STAGE: Record<ReferralInvitee["stage"], { label: string; tone: string }> = {
  joined: { label: "Joined", tone: "bg-panel text-ink-2" },
  verified: { label: "Verified", tone: "bg-info-bg text-primary" },
  earned: { label: "Bonus earned", tone: "bg-success-bg text-success-ink" },
};

const AVATAR_TONES = ["bg-violet-light text-violet", "bg-secondary-light text-secondary-hover", "bg-warning-bg text-warning-ink", "bg-info-bg text-info-ink"];

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "")).toUpperCase();
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
      // The referrals table carries no name or progress yet, so live rows show as joined.
      .map((row) => ({
        id: row.invitee_id ?? row.created_at,
        name: null,
        createdAt: row.created_at,
        stage: "joined" as const,
      })),
  };
}

const STEPS = [
  { icon: Share2, title: "Share your link", tone: "bg-info-bg text-primary" },
  { icon: UserPlus, title: "They join and finish a task", tone: "bg-violet-light text-violet" },
  { icon: Wallet, title: "You get a 5% bonus", tone: "bg-success-bg text-success-ink" },
];

export function ReferPage() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const referrals = useQuery({ queryKey: qk.referrals(), queryFn: fetchReferrals });

  const code = referrals.data?.code ?? "";
  const link = code ? `${window.location.origin}/sign-up?ref=${encodeURIComponent(code)}` : "";
  const invited = referrals.data?.invited ?? [];

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
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Refer and earn" sub="Invite people you trust. Earn when their first task is approved." />

      {referrals.isLoading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : referrals.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Your invite code did not load"
          action={
            <Button variant="outline" onClick={() => void referrals.refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <CardGrid className="lg:grid-cols-[minmax(0,1fr)_340px]">
          <motion.section
            variants={cardMotion}
            className={cn(
              CARD,
              "overflow-hidden bg-gradient-to-br from-primary to-primary-hover text-white ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)] lg:col-span-2",
            )}
            aria-labelledby="code"
          >
            <span className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/[0.06]" aria-hidden="true" />
            <div className="relative flex flex-wrap items-center gap-6">
              <div className="min-w-0 flex-1">
                <p id="code" className="text-[13px] font-bold text-white/80">Your invite code</p>
                <p className="mt-1 break-all font-mono text-[34px] font-extrabold leading-tight tracking-[-0.01em] sm:text-[40px]">{code || "Unavailable"}</p>
                {link ? (
                  <div className="mt-4 flex max-w-xl flex-wrap items-center gap-2 rounded-2xl bg-white/15 p-1.5 pl-3.5 ring-1 ring-white/20">
                    <code className="min-w-0 flex-1 truncate text-xs font-semibold text-white/90">{link}</code>
                    <Button onClick={() => void copy()} className="shrink-0 bg-white text-primary hover:bg-white/90">
                      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                      {copied ? "Copied" : "Copy link"}
                    </Button>
                  </div>
                ) : null}
              </div>
              <motion.span
                className="hidden h-28 w-28 shrink-0 items-center justify-center rounded-[28px] bg-white/15 ring-1 ring-white/25 sm:flex"
                initial={reduceMotion ? false : { rotate: -8, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.3 }}
                aria-hidden="true"
              >
                <Gift className="h-12 w-12" />
              </motion.span>
            </div>
          </motion.section>

          <Panel aria-labelledby="how">
            <PanelHeader id="how" title="How it works" />
            <ol className="grid gap-3 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + index * 0.1 }}
                  className="relative flex flex-col gap-3 rounded-2xl bg-panel/60 p-4"
                >
                  <span className="flex items-center justify-between">
                    <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", step.tone)} aria-hidden="true">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[28px] font-extrabold leading-none text-ink/10" aria-hidden="true">{index + 1}</span>
                  </span>
                  <span className="text-[14px] font-extrabold leading-snug tracking-[-0.01em]">{step.title}</span>
                </motion.li>
              ))}
            </ol>
            <p className="mt-3 text-[11.5px] font-medium text-ink-muted">
              The bonus comes with your next payout and counts as earnings for tax.
            </p>
          </Panel>

          <Panel aria-labelledby="joined">
            <PanelHeader
              id="joined"
              title="People who joined"
              right={<span className="rounded-full bg-info-bg px-3 py-1 text-xs font-extrabold tabular-nums text-primary">{invited.length}</span>}
            />
            {invited.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {invited.map((invitee, index) => (
                  <li key={invitee.id} className="flex items-center gap-3 rounded-2xl bg-panel/60 p-2.5 pr-3">
                    <span
                      className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold", AVATAR_TONES[index % AVATAR_TONES.length])}
                      aria-hidden="true"
                    >
                      {invitee.name ? initials(invitee.name) : <UserCheck className="h-[18px] w-[18px]" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold">{invitee.name ?? "Invited friend"}</span>
                      <span className="block text-xs font-semibold text-ink-muted">Joined {formatDate(invitee.createdAt)}</span>
                    </span>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold", STAGE[invitee.stage].tone)}>
                      {STAGE[invitee.stage].label}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-panel/60 px-4 py-8 text-center">
                <UserPlus className="h-5 w-5 text-ink-3" aria-hidden="true" />
                <p className="text-xs font-semibold text-ink-muted">Nobody yet. Share your link to start.</p>
              </div>
            )}
          </Panel>
        </CardGrid>
      )}
    </div>
  );
}
