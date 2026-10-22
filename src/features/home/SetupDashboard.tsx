import { useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  ShieldUser,
  Ticket,
  UserRoundX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion, gridMotion } from "@/components/app/card-styles";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/features/dashboard/queries";
import { formatDayLong } from "@/features/calendar/dates";
import type { DoerStage, SetupStep } from "./steps";
import { TaskDemo } from "./TaskDemo";

type Setup = { steps: SetupStep[]; doneCount: number; total: number; next: SetupStep | null; waiting: SetupStep[]; loading: boolean; error: boolean };

const ABOUT = [
  { icon: BadgeIndianRupee, title: "Fixed pay", line: "You see the pay before you accept." },
  { icon: ShieldUser, title: "A supervisor on every task", line: "One person to ask, start to finish." },
  { icon: UserRoundX, title: "No client calls", line: "Your supervisor handles the client." },
  { icon: Layers, title: "Flexible workload", line: "Take on work that fits your time." },
  { icon: GraduationCap, title: "Free training", line: "Short courses for your skills." },
  { icon: Clock, title: "Paid on approval", line: "To your bank, with a receipt." },
];

function firstName(full: string | null | undefined): string {
  return full?.trim().split(/\s+/)[0] || "there";
}

/* Line pictures in the brand blue. Plain on purpose: they say what the step is about. */

function IdArt() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-auto w-full max-w-[230px]" aria-hidden="true">
      <rect x="26" y="40" width="130" height="84" rx="12" fill="#fff" stroke="#0a65c0" strokeWidth="3" />
      <rect x="40" y="56" width="30" height="36" rx="6" fill="#e3edf8" />
      <path d="M82 62h56M82 76h40M40 106h98" stroke="#c9dbef" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 74c14 0 24-6 30-12 6 6 16 12 30 12v26c0 22-14 34-30 40-16-6-30-18-30-40z" fill="#e7f0f9" stroke="#0a65c0" strokeWidth="3" strokeLinejoin="round" />
      <path d="m168 102 9 9 17-18" stroke="#0a65c0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckingArt() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="h-auto w-full max-w-[230px]" aria-hidden="true">
      <rect x="44" y="22" width="104" height="134" rx="14" fill="#fff" stroke="#0a65c0" strokeWidth="3" />
      <rect x="62" y="44" width="38" height="28" rx="6" fill="#e3edf8" />
      <path d="M110 50h22M110 62h16" stroke="#9cc0e6" strokeWidth="5" strokeLinecap="round" />
      <path d="M62 90h68M62 104h68M62 118h44" stroke="#c9dbef" strokeWidth="5" strokeLinecap="round" />
      <circle cx="146" cy="116" r="30" fill="#e7f0f9" stroke="#0a65c0" strokeWidth="3" />
      <circle cx="146" cy="116" r="18" fill="#fff" stroke="#0a65c0" strokeWidth="3" />
      <path d="m168 138 20 20" stroke="#0a65c0" strokeWidth="7" strokeLinecap="round" />
      <circle cx="64" cy="146" r="17" fill="#fff6e0" stroke="#f59e0b" strokeWidth="3" />
      <path d="M64 137v9l6 4" stroke="#a15c00" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** The step's own icon on a white disc, for steps without a picture of their own. */
function IconArt({ icon: Icon }: { icon: SetupStep["icon"] }) {
  return (
    <span className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white shadow-[0_16px_36px_-18px_rgba(10,101,192,0.55)]" aria-hidden="true">
      <span className="absolute inset-3 rounded-full border-2 border-dashed border-primary/20" />
      <Icon className="h-14 w-14 text-primary" strokeWidth={1.6} />
    </span>
  );
}

/** A sample offer, the kind that starts arriving once the doer is approved. */
function OfferArt() {
  return (
    <div className="w-full max-w-[250px] rounded-2xl bg-white p-4 shadow-[0_16px_36px_-18px_rgba(10,101,192,0.55)]" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-info-bg text-xs font-extrabold text-primary">WC</span>
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-extrabold">Blog posts on cloud costs</span>
          <span className="block text-[11.5px] font-semibold text-ink-muted">Writing and content</span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="rounded-xl bg-panel/70 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">You earn</span>
          <span className="block text-[15px] font-extrabold">₹8,500</span>
        </span>
        <span className="rounded-xl bg-panel/70 px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.06em] text-ink-3">Due</span>
          <span className="block text-[15px] font-extrabold">5 days</span>
        </span>
      </div>
      <span className="mt-3 flex h-9 items-center justify-center rounded-xl bg-primary text-[12.5px] font-extrabold text-white">Accept offer</span>
    </div>
  );
}

function ArtPanel({ children }: { children: React.ReactNode }) {
  // Only on wide screens, beside the words. Narrower, it would squeeze the words or
  // push the button down, so the words get the room.
  return <div className="hidden min-h-[220px] items-center justify-center rounded-[20px] bg-info-bg p-6 xl:flex">{children}</div>;
}

/** The steps down the side: a line that turns green as each one is done. */
function StepRail({ setup }: { setup: Setup }) {
  return (
    <motion.section variants={cardMotion} className={cn(CARD, "gap-4 p-5")} aria-labelledby="setup-rail">
      <div>
        <h2 id="setup-rail" className="text-[16px] font-extrabold tracking-[-0.02em]">
          Your setup
        </h2>
        <p className="text-xs font-semibold text-ink-muted">
          {setup.doneCount} of {setup.total} done
        </p>
      </div>
      <ol>
        {setup.steps.map((step, index) => {
          const last = index === setup.steps.length - 1;
          return (
            <li key={step.id} className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3 pb-4 last:pb-0">
              {!last ? (
                <span
                  className={cn("absolute bottom-0.5 left-[15px] top-[34px] w-0.5 rounded-full", step.state === "done" ? "bg-success-dot" : "bg-line-card")}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold",
                  step.state === "done" && "bg-success-dot text-white",
                  step.state === "current" && (step.problem ? "bg-danger-bg text-danger-ink" : "bg-primary text-white ring-[5px] ring-info-bg"),
                  step.state === "waiting" && "bg-warning-bg text-warning-ink",
                  step.state === "locked" && "bg-panel text-ink-3",
                )}
                aria-hidden="true"
              >
                {step.state === "done" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : step.state === "waiting" ? (
                  <Clock className="h-4 w-4" />
                ) : step.state === "locked" ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : step.problem ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="min-w-0 pt-0.5">
                {step.state === "current" || step.state === "done" ? (
                  <Link to={step.href} className="block text-[13.5px] font-extrabold leading-snug hover:text-primary">
                    {step.title}
                  </Link>
                ) : (
                  <span className={cn("block text-[13.5px] font-extrabold leading-snug", step.state === "locked" && "text-ink-3")}>{step.title}</span>
                )}
                <span className={cn("block text-[11.5px] font-semibold", step.state === "locked" ? "text-ink-3" : "text-ink-muted")}>
                  {step.state === "done"
                    ? "Done"
                    : step.state === "waiting"
                      ? "Being checked"
                      : step.state === "locked"
                        ? "Opens after the step before"
                        : step.problem
                          ? "Needs your attention"
                          : "Now"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-auto border-t border-line-subtle pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-bg text-primary" aria-hidden="true">
            <Ticket className="h-[18px] w-[18px]" />
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-extrabold">Stuck on a step?</span>
            <span className="block text-xs font-semibold text-ink-muted">Raise a ticket and our team will reply.</span>
          </span>
        </div>
        <Button asChild size="sm" variant="outline" className="mt-3 w-full">
          <Link to="/tickets">Get help</Link>
        </Button>
      </div>
    </motion.section>
  );
}

function FocusCard({ children, art }: { children: React.ReactNode; art: React.ReactNode }) {
  return (
    <motion.section variants={cardMotion} className={cn(CARD, "grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] xl:items-center")} aria-labelledby="focus">
      <div className="min-w-0">{children}</div>
      <ArtPanel>{art}</ArtPanel>
    </motion.section>
  );
}

function Eyebrow({ children, tone = "text-primary" }: { children: React.ReactNode; tone?: string }) {
  return <p className={cn("text-xs font-extrabold uppercase tracking-[0.1em]", tone)}>{children}</p>;
}

function FocusTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 id="focus" className="mt-2 text-[26px] font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-[30px]">
      {children}
    </h2>
  );
}

/** The one step to do now, with what to have ready and a single button. */
function StepFocus({ step, index, total }: { step: SetupStep; index: number; total: number }) {
  return (
    <FocusCard art={step.id === "verify" ? <IdArt /> : <IconArt icon={step.icon} />}>
      <Eyebrow tone={step.problem ? "text-danger-ink" : "text-primary"}>{step.problem ? "Needs your attention" : `Step ${index + 1} of ${total}`}</Eyebrow>
      <FocusTitle>{step.title}</FocusTitle>
      {step.problem ? (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-danger-bg px-3.5 py-2.5 text-[13px] font-bold text-danger-ink">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {step.problem}
        </p>
      ) : null}
      <p className="mt-3 max-w-[480px] text-[15px] font-medium leading-relaxed text-ink-2">{step.about}</p>
      {step.needs ? (
        <ul className="mt-4 space-y-2">
          {step.needs.map((need) => (
            <li key={need} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-2">
              <Check className="h-4 w-4 shrink-0 text-success-dot" strokeWidth={3} aria-hidden="true" />
              {need}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link to={step.href}>
            {step.action}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        {step.time ? <span className="text-[12.5px] font-bold text-ink-muted">{step.time}</span> : null}
      </div>
    </FocusCard>
  );
}

/** What our team is checking: sent, being checked, then what approval opens. */
function ReviewFocus({ waiting, after }: { waiting: SetupStep[]; after: SetupStep | null }) {
  const kyc = waiting.some((step) => step.id === "verify");
  const application = waiting.some((step) => step.id === "join");
  const what = kyc && application ? "your application and your PAN and bank" : kyc ? "your PAN and bank" : "your application";
  const timeline = [
    { state: "done", title: "Sent", line: "Your details reached us." },
    { state: "now", title: "Being checked", line: "A person on our team looks at them." },
    {
      state: "next",
      title: "Approved",
      line: after ? `Then the next step opens: ${after.short}.` : "Assigned offers opens and your first offer can reach you.",
    },
  ];
  return (
    <FocusCard art={<CheckingArt />}>
      <Eyebrow>Being checked</Eyebrow>
      <FocusTitle>Our team is checking {what}</FocusTitle>
      <p className="mt-3 max-w-[480px] text-[15px] font-medium leading-relaxed text-ink-2">
        Nothing to do here for now. We will send you an alert when it is done{after ? ", and the next step opens" : ""}.
      </p>
      <ol className="mt-5">
        {timeline.map((item, index) => (
          <li key={item.title} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-3.5 last:pb-0">
            {index < timeline.length - 1 ? (
              <span
                className={cn("absolute bottom-0 left-[13px] top-[30px] w-0.5 rounded-full", item.state === "done" ? "bg-success-dot" : "bg-line-card")}
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                item.state === "done" && "bg-success-dot text-white",
                item.state === "now" && "bg-warning-bg text-warning-ink ring-[5px] ring-warning-bg/60",
                item.state === "next" && "bg-panel text-ink-3",
              )}
              aria-hidden="true"
            >
              {item.state === "now" ? <Clock className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className={cn("block text-[14px] font-extrabold", item.state === "next" && "text-ink-muted")}>{item.title}</span>
              <span className="block text-[12.5px] font-semibold text-ink-muted">{item.line}</span>
            </span>
          </li>
        ))}
      </ol>
    </FocusCard>
  );
}

function ApprovedFocus() {
  return (
    <FocusCard art={<OfferArt />}>
      <Eyebrow tone="text-success-ink">All steps done</Eyebrow>
      <FocusTitle>You are ready for your first task</FocusTitle>
      <p className="mt-3 max-w-[480px] text-[15px] font-medium leading-relaxed text-ink-2">
        Offers that match your skills come to Assigned offers. Keep Available switched on so supervisors can send you work.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link to="/pool">
            See your offers
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <span className="text-[12.5px] font-bold text-ink-muted">My work and Calendar open after your first task.</span>
      </div>
    </FocusCard>
  );
}

/** A one-line card under the focus card: an icon, two lines, one button. */
function SideNote({ icon: Icon, title, line, action }: { icon: typeof Clock; title: string; line: string; action: React.ReactNode }) {
  return (
    <motion.section variants={cardMotion} className={cn(CARD, "flex-row flex-wrap items-center gap-4 p-5 sm:flex-nowrap")}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-info-bg text-primary" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-extrabold">{title}</span>
        <span className="block text-[12.5px] font-semibold text-ink-muted">{line}</span>
      </span>
      {action}
    </motion.section>
  );
}

function TaskDemoNote() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SideNote
        icon={Layers}
        title="How a task works"
        line="An offer arrives, you do the work, your supervisor checks it, you get paid."
        action={
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            See it
          </Button>
        }
      />
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            <Dialog.Title className="sr-only">How a task works</Dialog.Title>
            <TaskDemo />
            <Dialog.Close
              aria-label="Close"
              className="absolute -top-3 right-0 flex h-10 w-10 -translate-y-full items-center justify-center rounded-full bg-white text-ink shadow-soft-md focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/**
 * The dashboard before the first task: one step at a time, in strict order. The
 * steps run down the side, the step to do now gets the big card, and while our team
 * checks something the big card says so and the next step waits for the approval.
 */
export function SetupDashboard({ stage, setup }: { stage: Exclude<DoerStage, "working">; setup: Setup }) {
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();
  const profile = useProfile();
  const name = firstName(profile.data?.full_name ?? user?.email?.split("@")[0]);
  const next = setup.next;
  const nextIndex = next ? setup.steps.indexOf(next) : -1;

  let focus: React.ReactNode;
  if (stage === "approved") focus = <ApprovedFocus />;
  else if (stage === "review") {
    focus = <ReviewFocus waiting={setup.waiting} after={setup.steps.find((step) => step.state === "locked") ?? null} />;
  } else if (next) focus = <StepFocus step={next} index={nextIndex} total={setup.total} />;

  const heading = stage === "approved" ? `You are in, ${name}` : stage === "review" ? `Almost there, ${name}` : `Hi, ${name}`;

  return (
    <motion.div className="space-y-4" variants={gridMotion} initial={reduceMotion ? false : "hidden"} animate="show">
      <motion.header variants={cardMotion} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1">
        <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[44px]">
          {profile.isLoading ? <span className="skeleton inline-block h-11 w-64 align-middle" /> : heading}
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted sm:text-[13px]">{formatDayLong(new Date())}</p>
      </motion.header>

      {setup.loading ? (
        <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
          <div className="skeleton h-[420px] rounded-[20px]" />
          <div className="skeleton h-[340px] rounded-[20px]" />
        </div>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
          <div className="order-2 lg:order-1">
            <StepRail setup={setup} />
          </div>
          <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-2">
            {focus}
            <TaskDemoNote />
          </div>
        </div>
      )}

      <motion.section variants={cardMotion} className={cn(CARD, "gap-3.5")} aria-labelledby="about">
        <h2 id="about" className="text-[16px] font-extrabold tracking-[-0.02em]">
          What working here is like
        </h2>
        <ul className="grid auto-rows-fr gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {ABOUT.map((item) => (
            <li key={item.title} className="flex items-center gap-3.5 rounded-2xl bg-panel/60 px-4 py-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-info-bg text-primary" aria-hidden="true">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-extrabold leading-snug">{item.title}</span>
                <span className="block text-[12.5px] font-semibold leading-snug text-ink-muted">{item.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}
