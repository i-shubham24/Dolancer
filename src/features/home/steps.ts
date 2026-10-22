import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PencilRuler, ScrollText, ShieldCheck, UserPen, type LucideIcon } from "lucide-react";
import { qk } from "@/lib/query-keys";
import { isDemo } from "@/lib/demo-auth";
import { useActiveProjects, useGateState } from "@/features/dashboard/queries";
import { useProjects } from "@/features/work/queries";
import { fetchKycStatus } from "@/features/verification/api";
import { fetchLessons } from "@/features/training/api";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * done: finished. waiting: sent, now with our team, and it does not hold up the next
 * step. current: the one to do now. locked: opens once the steps before it are done.
 */
export type StepState = "done" | "waiting" | "current" | "locked";

export interface SetupStep {
  id: string;
  title: string;
  /** The step as the end of "Opens after you ...". */
  short: string;
  detail: string;
  /** A few plain sentences on what the step is and why it is needed. */
  about: string;
  /** What to have ready, when there is something. */
  needs?: string[];
  /** Roughly how long it takes. */
  time?: string;
  href: string;
  action: string;
  icon: LucideIcon;
  state: StepState;
  /** Set when our team turned the last attempt down and the step has to be done again. */
  problem?: string;
}

/**
 * The steps between signing up and taking a first task, in strict order. Each one
 * opens only once the one before it is done, including our team's approval, and the
 * doer is ready when every one is done.
 */
export function useSetupSteps() {
  const gate = useGateState();
  const kyc = useQuery({ queryKey: qk.kyc(), queryFn: fetchKycStatus });
  const lessons = useQuery({ queryKey: qk.training.lessons(), queryFn: fetchLessons });
  const guidelinesAt = useOnboardingStore((state) => state.guidelinesAt);

  const required = (lessons.data ?? []).filter((lesson) => !lesson.category);
  const lessonsDone = required.filter((lesson) => lesson.completed).length;
  const applicationStatus = gate.data?.applicationStatus;
  const applicationPending = applicationStatus === "pending";
  const applicationRejected = applicationStatus === "rejected";
  const kycSubmitted = kyc.data === "submitted";
  const kycRejected = kyc.data === "rejected";

  const raw: (Omit<SetupStep, "state"> & { done: boolean; waiting?: boolean })[] = [
    {
      id: "guidelines",
      title: "Read the guidelines",
      short: "read the guidelines",
      detail: "How work, pay and conduct work here.",
      about: "The short rules for how offers, work, pay and conduct work on Dolancer. Read them once and agree at the end.",
      time: "About 5 minutes",
      href: "/guidelines",
      action: "Read now",
      icon: ScrollText,
      // Agreeing is kept on the device only, so it is gone after signing out or on a
      // new phone. An approved verification means the doer got past it before, so
      // they are not sent back to step 1 and locked out of what they have done.
      done: Boolean(guidelinesAt) || Boolean(gate.data?.kycDone),
    },
    {
      id: "join",
      short: "join as a doer",
      title: applicationRejected ? "Application not approved" : applicationPending ? "Application being checked" : "Join as a doer",
      detail: applicationRejected
        ? "Support can tell you why."
        : applicationPending
          ? "A supervisor is looking at it."
          : "Tell us what you do. It takes a minute.",
      about: applicationRejected
        ? "We could not take your application forward this time. Raise a ticket and our team will tell you why."
        : "Tell us the work you do and how long you have done it. A supervisor reads it to check it fits the work here.",
      time: applicationRejected ? undefined : "About a minute",
      href: applicationRejected ? "/tickets" : "/profile",
      action: applicationRejected ? "Ask support" : "Apply",
      icon: UserPen,
      done: Boolean(gate.data?.isDoer),
      waiting: applicationPending,
      problem: applicationRejected ? "Not approved this time." : undefined,
    },
    {
      id: "verify",
      title: kycSubmitted ? "PAN and bank being checked" : "Verify your PAN and bank",
      short: "verify your PAN and bank",
      detail: kycSubmitted ? "We will tell you as soon as it is done." : "So your pay can reach you.",
      about: kycRejected
        ? "Please send them again with clear photos. The bank account must be in the same name as your profile."
        : "We need these so your pay can reach your bank. A person on our team checks them.",
      needs: ["Your photo and mobile number", "Your PAN card number and a photo of it", "Your bank account number and IFSC"],
      time: "About 5 minutes",
      href: "/verification",
      action: kycRejected ? "Send again" : "Verify now",
      icon: ShieldCheck,
      done: Boolean(gate.data?.kycDone),
      waiting: kycSubmitted,
      problem: kycRejected ? "Your last details were not approved." : undefined,
    },
    {
      id: "skills",
      title: "Pick your skills",
      short: "pick your skills",
      detail: "Offers match the skills you pick.",
      about: "Pick the kinds of work you are good at. Offers only come for the skills you pick, and you can change them later.",
      time: "About 2 minutes",
      href: "/skills",
      action: "Pick skills",
      icon: PencilRuler,
      done: Boolean(gate.data?.skillsDone),
    },
    {
      id: "training",
      title: "Finish the training",
      short: "finish the training",
      detail: required.length > 0 ? `${lessonsDone} of ${required.length} short modules done.` : "A few short modules.",
      about: "Short modules on how a task goes here, from the offer to getting paid. Each one ends with a few quick questions.",
      href: "/training",
      action: lessonsDone > 0 ? "Continue" : "Start",
      icon: GraduationCap,
      done: Boolean(gate.data?.trainingDone),
    },
  ];

  // A step after an unfinished one stays locked even if it was done somehow (the
  // demo seeds skills, for one), so the steps always read in order.
  let blocked = false;
  const steps: SetupStep[] = raw.map(({ done, waiting, ...step }) => {
    let state: StepState;
    if (blocked) state = "locked";
    else if (done) state = "done";
    else {
      state = waiting ? "waiting" : "current";
      blocked = true;
    }
    return { ...step, state };
  });

  const doneCount = steps.filter((step) => step.state === "done").length;
  return {
    steps,
    doneCount,
    total: steps.length,
    allDone: doneCount === steps.length,
    next: steps.find((step) => step.state === "current") ?? null,
    waiting: steps.filter((step) => step.state === "waiting"),
    loading: gate.isLoading || kyc.isLoading || lessons.isLoading,
    error: gate.isError || kyc.isError || lessons.isError,
  };
}

/**
 * Where a doer is, from first sign-in to working:
 * - setup: steps to do, nothing with our team.
 * - review: a step is with our team. The steps after it wait for the approval.
 * - approved: every step done, no task taken yet. Offers and messages open.
 * - working: a first task has been taken. Everything is open.
 */
export type DoerStage = "setup" | "review" | "approved" | "working";

/** The pages that open with a setup step, in step order. Guidelines and Profile always open. */
const STEP_PAGES: { to: string; label: string; step: string }[] = [
  { to: "/verification", label: "Verification", step: "verify" },
  { to: "/skills", label: "Skills", step: "skills" },
  { to: "/training", label: "Training", step: "training" },
];

/** The pages that stay locked until a stage, and why, in the doer's words. */
export const LOCKED_PAGES: { to: string; label: string; opensAt: DoerStage; when: string }[] = [
  { to: "/pool", label: "Assigned offers", opensAt: "approved", when: "Opens when every setup step is done" },
  { to: "/messages", label: "Messages", opensAt: "approved", when: "Opens when every setup step is done" },
  { to: "/work", label: "My work", opensAt: "working", when: "Opens when you take your first task" },
  { to: "/calendar", label: "Calendar", opensAt: "working", when: "Opens when you take your first task" },
];

const ORDER: DoerStage[] = ["setup", "review", "approved", "working"];

export function useDoerStage() {
  const setup = useSetupSteps();
  const active = useActiveProjects();
  const closed = useProjects("closed");
  const hasTask = (active.data?.length ?? 0) + (closed.data?.length ?? 0) > 0;
  const loading = setup.loading || active.isLoading || closed.isLoading;
  // If a check fails to load, nothing is locked: a doer is never shut out of their
  // work by a network error, and each page shows its own error.
  const failed = setup.error || active.isError || closed.isError;

  // A live doer can only take a task once every step is done, so a task means they
  // have been through setup. If a step reopens later (a new training module, say)
  // they keep their dashboard and the attention strip asks for it. The demo seeds
  // tasks before setup is finished, so there the steps decide.
  let stage: DoerStage;
  if (failed || (hasTask && (setup.allDone || !isDemo()))) stage = "working";
  else if (setup.allDone) stage = "approved";
  else if (setup.waiting.length > 0) stage = "review";
  else stage = "setup";

  // Routes match regardless of case, so /Pool must be locked like /pool.
  const matches = (path: string, to: string) => {
    const lower = path.toLowerCase();
    return lower === to || lower.startsWith(`${to}/`);
  };
  const blocker = setup.steps.find((step) => step.state === "current" || step.state === "waiting");

  /**
   * The page's name and when it opens, while it is locked; null once it is open.
   * Setup pages open one by one with their step. Nothing is locked while loading.
   */
  const lockFor = (path: string): { label: string; when: string } | null => {
    if (loading) return null;
    const stepPage = STEP_PAGES.find((item) => matches(path, item.to));
    if (stepPage) {
      const step = setup.steps.find((item) => item.id === stepPage.step);
      if (stage === "working" || !step || step.state !== "locked") return null;
      const when =
        blocker?.state === "waiting" ? "Opens when our team approves your details" : `Opens after you ${blocker?.short ?? "finish the step before"}`;
      return { label: stepPage.label, when };
    }
    const page = LOCKED_PAGES.find((item) => matches(path, item.to));
    if (page && ORDER.indexOf(stage) < ORDER.indexOf(page.opensAt)) return { label: page.label, when: page.when };
    return null;
  };

  /** True for a page that can be locked at all, whatever the stage. */
  const isLockable = (path: string) => [...STEP_PAGES, ...LOCKED_PAGES].some((item) => matches(path, item.to));

  return { stage, loading, setup, lockFor, isLockable, isLocked: (path: string) => lockFor(path) !== null };
}
