import { Briefcase, CircleHelp, KeyRound, Wallet, type LucideIcon } from "lucide-react";
import type { TicketStatus } from "@/types/database";

export const STATUS_TONE: Record<TicketStatus, { tone: "progress" | "review" | "approved" | "changes"; label: string }> = {
  open: { tone: "progress", label: "Open" },
  pending: { tone: "review", label: "Waiting on you" },
  resolved: { tone: "approved", label: "Resolved" },
  closed: { tone: "changes", label: "Closed" },
};

/** One icon and colour per topic, for the topic tiles and the ticket rows. */
const TOPIC: Record<string, { icon: LucideIcon; tone: string; short: string }> = {
  payout: { icon: Wallet, tone: "bg-success-bg text-success-ink", short: "Payments" },
  quality: { icon: Briefcase, tone: "bg-info-bg text-primary", short: "A task" },
  account: { icon: KeyRound, tone: "bg-violet-light text-violet", short: "Account" },
  general: { icon: CircleHelp, tone: "bg-warning-bg text-warning-ink", short: "Other" },
};

export const topicOf = (id: string) => TOPIC[id] ?? TOPIC.general!;
