import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeIndianRupee, Check, Clock, GraduationCap, Layers, Lock, Rocket, ShieldUser, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion, gridMotion } from "@/components/app/card-styles";
import { Panel, PanelHeader } from "@/components/app/ui";
import { cn } from "@/lib/cn";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/features/dashboard/queries";
import { formatDayLong } from "@/features/calendar/dates";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useSetupSteps, type SetupStep } from "./steps";
import { TaskDemo } from "./TaskDemo";

const ABOUT = [
  { icon: BadgeIndianRupee, title: "Fixed pay", line: "You see the pay before you accept.", tone: "bg-success-bg text-success-ink" },
  { icon: ShieldUser, title: "A supervisor on every task", line: "One person to ask, start to finish.", tone: "bg-info-bg text-primary" },
  { icon: UserRoundX, title: "No client calls", line: "Your supervisor handles the client.", tone: "bg-violet-light text-violet" },
  { icon: Layers, title: `Up to ${MAX_ACTIVE_PROJECTS} tasks at once`, line: "Take on only what you can finish.", tone: "bg-warning-bg text-warning-ink" },
  { icon: GraduationCap, title: "Free training", line: "Short courses for your skills.", tone: "bg-secondary-light text-secondary-hover" },
  { icon: Clock, title: "Paid on approval", line: "To your bank, with a receipt.", tone: "bg-danger-bg text-danger-ink" },
];

function firstName(full: string | null | undefined): string {
  return full?.trim().split(/\s+/)[0] || "there";
}

/** The ring of steps done, white on the blue greeting banner. */
function StepsRing({ done, total }: { done: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const radius = 40;
  const share = total === 0 ? 0 : done / total;
  return (
    <span className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center" role="img" aria-label={`${done} of ${total} steps done`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="10" />
        {share > 0 ? (
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: share }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </svg>
      <span className="text-center leading-none">
        <span className="block text-[21px] font-extrabold tabular-nums">
          {done}/{total}
        </span>
        <span className="mt-1 block text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/75">steps</span>
      </span>
    </span>
  );
}

/** One setup step: a status circle, the words, and one thing on the right. */
function StepRow({ step, index }: { step: SetupStep; index: number }) {
  const done = step.state === "done";
  const locked = step.state === "locked";
  const waiting = step.state === "waiting";
  const current = step.state === "current";
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.25 + index * 0.07 }}
      className={cn(
        "grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl px-3 py-3",
        current ? "bg-info-bg ring-1 ring-primary/25" : "bg-panel/50",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          done ? "bg-success-dot text-white" : current ? "bg-primary text-white" : waiting ? "bg-warning-bg text-warning-ink" : "bg-white text-ink-3",
        )}
        aria-hidden="true"
      >
        {done ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : locked ? (
          <Lock className="h-4 w-4" />
        ) : waiting ? (
          <Clock className="h-[18px] w-[18px]" />
        ) : (
          <step.icon className="h-[18px] w-[18px]" />
        )}
      </span>
      <span className="min-w-0">
        <span className={cn("block text-[14px] font-extrabold leading-snug tracking-[-0.01em] sm:truncate", locked ? "text-ink-3" : "text-ink")}>
          {step.title}
        </span>
        <span className={cn("line-clamp-2 block text-xs font-semibold sm:truncate", locked ? "text-ink-3" : "text-ink-muted")}>{step.detail}</span>
      </span>
      <span className="flex justify-end sm:min-w-[84px]">
        {done ? (
          <span className="rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-extrabold text-success-ink">Done</span>
        ) : current ? (
          <Button asChild size="sm">
            <Link to={step.href}>
              {step.action}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        ) : waiting ? (
          <span className="rounded-full bg-warning-bg px-2.5 py-1 text-[11px] font-extrabold text-warning-ink">Checking</span>
        ) : (
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-ink-3">
            Locked
            <span className="sr-only">, opens after the step before it</span>
          </span>
        )}
      </span>
    </motion.li>
  );
}

/**
 * Home: where a doer lands after signing in until setup is finished and a first task
 * is taken. A greeting banner, then the setup steps beside a short walk through how a
 * task works, then what working here is like. Each step ticks off as it is done, and
 * Start earning opens when all of them are.
 */
export function HomePage() {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { user } = useAuth();
  const profile = useProfile();
  const { steps, doneCount, total, allDone, next, loading } = useSetupSteps();
  const markStarted = useOnboardingStore((state) => state.markStarted);

  const name = firstName(profile.data?.full_name ?? user?.email?.split("@")[0]);
  const start = () => {
    markStarted();
    navigate("/pool");
  };

  return (
    <motion.div className="space-y-4" variants={gridMotion} initial={reduceMotion ? false : "hidden"} animate="show">
      <motion.section
        variants={cardMotion}
        className={cn(
          CARD,
          "grid gap-6 overflow-hidden bg-gradient-to-br from-primary to-primary-hover p-6 text-white ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center",
        )}
        aria-labelledby="hello"
      >
        <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[0.07]" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-white/[0.05]" aria-hidden="true" />

        <div className="relative min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/75">{formatDayLong(new Date())}</p>
          <h1 id="hello" className="mt-2 text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[42px]">
            {profile.isLoading ? <span className="inline-block h-10 w-48 rounded-lg bg-white/20 align-middle" /> : <>Hi, {name}</>}
          </h1>
          <p className="mt-2 max-w-md text-[15px] font-medium text-white/90 sm:text-base">
            Welcome to Dolancer. A few short steps and your first task can reach you.
          </p>
        </div>

        <div className="relative flex items-center gap-4 rounded-2xl bg-white/[0.12] p-4 ring-1 ring-white/20">
          <StepsRing done={loading ? 0 : doneCount} total={total} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold">{allDone ? "You are ready" : `${total - doneCount} step${total - doneCount === 1 ? "" : "s"} to go`}</p>
            <p className="mt-0.5 truncate text-xs font-semibold text-white/80">
              {allDone ? "Your first task is waiting." : next ? `Next: ${next.title}` : "Waiting on a check."}
            </p>
            {allDone ? (
              <Button onClick={start} className="mt-3 w-full bg-white text-primary hover:bg-white/90">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                Start earning
              </Button>
            ) : next ? (
              <Button asChild className="mt-3 w-full bg-white text-primary hover:bg-white/90">
                <Link to={next.href}>
                  {next.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </motion.section>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <Panel aria-labelledby="setup" className="h-full">
          <PanelHeader
            id="setup"
            title="Get ready to earn"
            sub="Each step opens after the one before it."
            right={<span className="rounded-full bg-info-bg px-3 py-1 text-xs font-extrabold tabular-nums text-primary">{doneCount} of {total}</span>}
          />
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="skeleton h-16 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <ol className="flex flex-1 flex-col gap-2">
              {steps.map((step, index) => (
                <StepRow key={step.id} step={step} index={index} />
              ))}
              <li
                className={cn(
                  "mt-auto grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl px-3 py-3",
                  allDone ? "bg-gradient-to-r from-success-bg to-info-bg" : "border-2 border-dashed border-line-card",
                )}
              >
                <span
                  className={cn("flex h-10 w-10 items-center justify-center rounded-full", allDone ? "bg-success-dot text-white" : "bg-panel text-ink-3")}
                  aria-hidden="true"
                >
                  {allDone ? <Rocket className="h-[18px] w-[18px]" /> : <Lock className="h-4 w-4" />}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-[14px] font-extrabold leading-snug sm:truncate", allDone ? "text-ink" : "text-ink-3")}>Take your first task</span>
                  <span className="line-clamp-2 block text-xs font-semibold text-ink-muted sm:truncate">
                    {allDone ? "Offers can reach you now." : "Opens when every step is done."}
                  </span>
                </span>
                <Button onClick={start} disabled={!allDone} size="sm" className="sm:min-w-[84px]">
                  Start
                  <span className="hidden sm:inline">earning</span>
                </Button>
              </li>
            </ol>
          )}
        </Panel>

        <motion.div variants={cardMotion} className="h-full min-w-0">
          <TaskDemo className="h-full" />
        </motion.div>
      </div>

      <Panel aria-labelledby="about">
        <PanelHeader id="about" title="What working here is like" />
        <ul className="grid auto-rows-fr gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {ABOUT.map((item, index) => (
            <motion.li
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 + index * 0.06 }}
              className="flex items-center gap-3.5 rounded-2xl bg-panel/60 px-4 py-3.5"
            >
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", item.tone)} aria-hidden="true">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-extrabold leading-snug">{item.title}</span>
                <span className="block text-[12.5px] font-semibold leading-snug text-ink-muted">{item.line}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </Panel>
    </motion.div>
  );
}
