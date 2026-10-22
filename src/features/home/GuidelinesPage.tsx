import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Check, Inbox, Lock, UserRound, Wallet, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, PageHeader } from "@/components/app/page";
import { TickBox } from "@/components/app/TickBox";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/datetime";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * The platform rules in short, plain points. Every point here comes from the Terms
 * and the Allowed Work rules, which stay the full version and are linked below.
 */
const SECTIONS: { icon: LucideIcon; title: string; tone: string; points: string[] }[] = [
  {
    icon: Inbox,
    title: "How work reaches you",
    tone: "bg-info-bg text-primary",
    points: [
      "Offers match the skills you pick, while you are set to Available.",
      "Your supervisor writes the brief and fixes the pay before you see it.",
      "Accept only what you can finish on time to maintain high quality.",
    ],
  },
  {
    icon: Briefcase,
    title: "Doing the work",
    tone: "bg-violet-light text-violet",
    points: [
      "Do it yourself. Do not pass it on or share it.",
      "Work in the company workspace on the task page and keep your progress updated.",
      "Submit on the task page. Files sent in chat do not count as delivery.",
      "If the brief limits AI tools, follow it. Never misstate how the work was made.",
    ],
  },
  {
    icon: Lock,
    title: "Privacy",
    tone: "bg-warning-bg text-warning-ink",
    points: [
      "Your supervisor is your only contact. Never try to find or contact a client.",
      "Keep briefs, files and messages private, during the task and after it.",
      "Do not put your phone, email or social handles in chat or in the work.",
    ],
  },
  {
    icon: Wallet,
    title: "Pay and tax",
    tone: "bg-success-bg text-success-ink",
    points: [
      "Your pay is fixed when you accept the offer.",
      "It is released after the work is approved, to your verified bank account.",
      "Tax the law requires is withheld, and every payout comes with a receipt.",
    ],
  },
  {
    icon: UserRound,
    title: "Your account",
    tone: "bg-secondary-light text-secondary-hover",
    points: [
      "One account per person, in your own name, with true details.",
      "Breaking these rules, or missing deadlines again and again, can pause offers or close the account.",
    ],
  },
];

export function GuidelinesPage() {
  const navigate = useNavigate();
  const guidelinesAt = useOnboardingStore((state) => state.guidelinesAt);
  const accept = useOnboardingStore((state) => state.acceptGuidelines);
  const [agree, setAgree] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back={{ to: "/dashboard", label: "Dashboard" }} title="Platform guidelines" sub="The rules for working on Dolancer, in short." />

      <CardGrid>
        {SECTIONS.map((section, index) => (
          <motion.section key={section.title} variants={cardMotion} className={cn(CARD, "gap-3.5")} aria-labelledby={`g-${index}`}>
            <div className="flex items-center gap-3">
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", section.tone)} aria-hidden="true">
                <section.icon className="h-5 w-5" />
              </span>
              <h2 id={`g-${index}`} className="text-[16px] font-extrabold tracking-[-0.02em]">
                <span className="mr-1.5 text-ink-3">{index + 1}.</span>
                {section.title}
              </h2>
            </div>
            <ul className="space-y-2">
              {section.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-success-dot" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.section>
        ))}

        <motion.section variants={cardMotion} className={cn(CARD, "gap-4")}>
          <p className="text-[13px] font-semibold text-ink-2">
            The full rules are in the{" "}
            <Link to="/legal/terms" className="font-bold text-primary hover:underline">
              Terms
            </Link>{" "}
            and the{" "}
            <Link to="/legal/allowed-work" className="font-bold text-primary hover:underline">
              Allowed Work rules
            </Link>
            .
          </p>
          {guidelinesAt ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-success-bg px-4 py-3">
              <span className="flex items-center gap-2 text-[13.5px] font-extrabold text-success-ink">
                <Check className="h-4 w-4" aria-hidden="true" />
                You agreed on {formatDate(guidelinesAt)}
              </span>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard">Back to your steps</Link>
              </Button>
            </div>
          ) : (
            <>
              <TickBox checked={agree} onChange={setAgree}>
                I have read these guidelines and I will follow them
              </TickBox>
              <Button
                size="lg"
                className="w-full"
                disabled={!agree}
                onClick={() => {
                  accept();
                  toast.success("Step done. On to the next one.");
                  navigate("/dashboard");
                }}
              >
                Agree and continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </motion.section>
      </CardGrid>
    </div>
  );
}
