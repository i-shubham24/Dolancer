import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarClock, ChevronDown, Info, Lock, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryTile } from "@/components/app/ui";
import { LineTexture } from "@/components/app/LineTexture";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { taskTitle } from "@/lib/task-title";
import { formatDayShort, formatTime } from "@/features/calendar/dates";
import type { PoolOffer } from "@/types/domain";
import { useClaimProject } from "./queries";

/** The brief without its headline, which is already the drawer's title. */
function briefParagraphs(brief: string | null): string[] {
  const lines = brief?.trim().split("\n") ?? [];
  return lines
    .slice(1)
    .join("\n")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * One offer, sliding in from the right. Accepting is a two-step decision, because
 * it is a commitment to a deadline and uses one of the three slots.
 */
export function ClaimDrawer({
  offer,
  open,
  onOpenChange,
  blockedReason,
}: {
  offer: PoolOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockedReason: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const [confirming, setConfirming] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const accept = useClaimProject();
  // Keep the last offer on screen while the drawer slides away.
  const last = useRef<PoolOffer | null>(null);
  if (offer) last.current = offer;
  const shown = offer ?? last.current;

  function close() {
    setConfirming(false);
    setBriefOpen(false);
    onOpenChange(false);
  }

  async function handleAccept() {
    if (!shown) return;
    const result = await accept.mutateAsync(shown.id);
    if (result.ok || result.kind === "rejected") close();
  }

  const due = shown?.deliveryAt ? new Date(shown.deliveryAt) : null;
  const paragraphs = briefParagraphs(shown?.brief ?? null);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <AnimatePresence>
        {open && shown ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-white shadow-[-24px_0_60px_-30px_rgba(11,31,58,0.5)] focus:outline-none sm:inset-y-3 sm:right-3 sm:rounded-[24px]"
                initial={reduceMotion ? { opacity: 0 } : { x: "105%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "105%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
              >
                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <CategoryTile category={shown.category} />
                      <span className="text-xs font-bold text-ink-muted">{shown.category}</span>
                    </span>
                    <Dialog.Close
                      aria-label="Close"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Dialog.Close>
                  </div>

                  <Dialog.Title className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.03em]">{taskTitle(shown)}</Dialog.Title>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.35 }}
                    className="relative isolate mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover p-5 text-white"
                  >
                    <LineTexture className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/[0.1]" />
                    <p className="text-xs font-bold text-white/80">You earn</p>
                    <p className="mt-1 text-[38px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{formatPaise(shown.payoutPaise)}</p>
                    <p className="mt-1.5 text-xs font-semibold text-white/85">Fixed payout • 1% TDS under Sec 194C credited to PAN</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.35 }}
                    className="mt-3 flex items-center gap-3 rounded-2xl bg-panel/60 p-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-bg text-primary" aria-hidden="true">
                      <CalendarClock className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-ink-muted">Due</p>
                      <p className="text-[15px] font-extrabold">{due ? `${formatDayShort(due)}, ${formatTime(due)}` : "Not set"}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink-2">{relativeDeadline(shown.deliveryAt)}</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24, duration: 0.35 }}
                    className="mt-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">The brief</p>
                    {paragraphs.length === 0 ? (
                      <p className="mt-1.5 text-sm text-ink-2">Your supervisor shares the detail once you accept.</p>
                    ) : (
                      <>
                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">{paragraphs[0]}</p>
                        {briefOpen
                          ? paragraphs.slice(1).map((part, index) => (
                              <p key={index} className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                                {part}
                              </p>
                            ))
                          : null}
                        {paragraphs.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => setBriefOpen((value) => !value)}
                            aria-expanded={briefOpen}
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
                          >
                            {briefOpen ? "Show less" : "Read the full brief"}
                            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", briefOpen && "rotate-180")} aria-hidden="true" />
                          </button>
                        ) : null}
                      </>
                    )}
                  </motion.div>

                  <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink-muted">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
                    The client never sees your name or contact details.
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-line-subtle p-5 sm:px-6">
                  {blockedReason ? (
                    <p className="flex items-start gap-2 rounded-xl bg-warning-bg px-3 py-2.5 text-xs font-bold text-warning-ink">
                      <Lock className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {blockedReason}
                    </p>
                  ) : confirming ? (
                    <>
                      <p className="flex items-start gap-2 rounded-xl bg-info-bg px-3 py-2.5 text-xs font-bold text-info-ink">
                        <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        You agree to deliver by {due ? `${formatDayShort(due)}, ${formatTime(due)}` : "the agreed date"}. The task will be added directly to your work.
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <Button variant="outline" onClick={() => setConfirming(false)} disabled={accept.isPending}>
                          Back
                        </Button>
                        <Button onClick={() => void handleAccept()} disabled={accept.isPending}>
                          {accept.isPending ? "Accepting..." : "Accept & start task"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <Button variant="outline" onClick={close}>
                        Not now
                      </Button>
                      <Button onClick={() => setConfirming(true)}>Accept offer</Button>
                    </div>
                  )}
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
