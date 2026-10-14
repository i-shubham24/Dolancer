import {
  AlarmClock,
  Bell,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  Power,
  RotateCcw,
  MessageSquarePlus,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { PopupKind } from "@/stores/usePopupStore";

/** One icon and one colour per kind of alert, shared by pop-ups and the Alerts page. */
export const KIND_STYLE: Record<PopupKind, { icon: LucideIcon; tile: string; label: string }> = {
  message: { icon: MessageSquare, tile: "bg-info-bg text-primary", label: "Message" },
  payout: { icon: Wallet, tile: "bg-success-bg text-success-ink", label: "Payout" },
  approved: { icon: CheckCircle2, tile: "bg-success-bg text-success-ink", label: "Approved" },
  changes: { icon: RotateCcw, tile: "bg-danger-bg text-danger-ink", label: "Changes" },
  work: { icon: Briefcase, tile: "bg-violet-light text-violet", label: "Work" },
  verified: { icon: ShieldCheck, tile: "bg-success-bg text-success-ink", label: "Account" },
  reminder: { icon: AlarmClock, tile: "bg-violet-light text-violet", label: "Reminder" },
  availability: { icon: Power, tile: "bg-warning-bg text-warning-ink", label: "Status" },
  chat: { icon: MessageSquarePlus, tile: "bg-secondary-light text-secondary-hover", label: "New work" },
  info: { icon: Bell, tile: "bg-panel text-ink-2", label: "Update" },
};
