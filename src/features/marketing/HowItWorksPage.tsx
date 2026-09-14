import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CircleDollarSign, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StitchBadge, StitchColorCard, StitchOrbitalGraphic, StitchSection } from "@/components/stitch/StitchPrimitives";
import { STEPS } from "./content";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";
import { DifferenceRail } from "./DifferenceRail";
import { CategoryTags } from "./CategoryTags";

function Section({
  children,
  className = "",
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <StitchSection aria-labelledby={labelledBy} className={`fresh-section ${className}`}>
      <div className="fresh-container">{children}</div>
    </StitchSection>
  );
}

export function HowItWorksPage() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="fresh-page">
      <section className="fresh-hero">
        <div className="fresh-dot-field" aria-hidden="true" />
        <div className="fresh-container fresh-process-hero">
          <motion.div initial={reduceMotion ? false : "hidden"} animate="show" variants={reveal}>
            <StitchBadge><Sparkles className="h-3.5 w-3.5" /> Everything, in the open</StitchBadge>
            <h1 className="mt-5 max-w-3xl">
              The whole thing,
              <br />
              <span className="fresh-highlight fresh-underline fresh-underline-mint">start to paid.</span>
            </h1>
            <p className="mt-6 max-w-xl">
              No part of this is hidden until after you sign up. Read it all, then decide.
            </p>
            <div className="fresh-process-proof">
              <span><Check /> Pay is visible before you claim.</span>
              <span><ShieldCheck /> A supervisor carries the client side.</span>
            </div>
          </motion.div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 2 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="fresh-process-hero-art"
          >
            <StitchOrbitalGraphic />
            <div className="fresh-process-ticket">
              <span className="fresh-live-dot" />
              Matched project
              <strong>₹24,000</strong>
              <small>7 days · Writing and content</small>
            </div>
            <div className="fresh-process-chip"><CircleDollarSign /> payout protected</div>
          </motion.div>
        </div>
      </section>

      <Section labelledBy="steps" className="fresh-process-steps">
        <div className="fresh-section-heading">
          <div><span className="fresh-eyebrow">The route is simple</span><h2 id="steps">Getting started</h2></div>
          <p>Four clear moments. No proposal treadmill, no mystery invoice, no disappearing client.</p>
        </div>
        <ol className="fresh-step-grid mt-10">
          {STEPS.map((step, index) => (
            <motion.li key={step.title} initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true, amount: 0.2 }} variants={reveal} className="fresh-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-extrabold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="walkthrough" className="fresh-workflow">
        <div className="fresh-process-bento">
          <StitchColorCard tone="lilac"><span className="fresh-bento-icon"><Sparkles /></span><strong>Matched, not marketed</strong><p>Your skills decide what appears on your board.</p></StitchColorCard>
          <StitchColorCard tone="pink"><span className="fresh-bento-icon"><ShieldCheck /></span><strong>Protected while you work</strong><p>Feedback and client conversations stay with the supervisor.</p></StitchColorCard>
          <StitchColorCard tone="yellow"><span className="fresh-bento-icon"><CircleDollarSign /></span><strong>Paid with the brief</strong><p>The amount is clear before you decide to claim.</p></StitchColorCard>
        </div>
        <WorkflowDemo />
      </Section>

      <Section labelledBy="payout" className="fresh-payout">
        <PayoutExplainer />
      </Section>

      <Section labelledBy="differences" className="fresh-difference">
        <DifferenceRail />
      </Section>

      <Section labelledBy="disciplines" className="fresh-steps">
        <h2 id="disciplines" className="fresh-section-heading-text">
          What gets briefed here
        </h2>
        <p className="mt-3 max-w-xl text-md text-ink-2">
          Pick the disciplines you are genuinely strong in. Only work matching them reaches
          your board, so accuracy matters more than breadth.
        </p>
        <div className="mt-10">
          <CategoryTags />
        </div>
      </Section>

      <Section labelledBy="cta">
        <div className="fresh-final-card mx-auto max-w-4xl">
          <div className="fresh-final-content flex flex-wrap items-center justify-between gap-8">
            <div className="min-w-0 flex-1">
              <StitchBadge>That is all of it</StitchBadge>
              <h2
                id="cta"
                className="mt-4 max-w-md text-3xl font-extrabold leading-[1.1] tracking-[-0.04em]"
              >
                Ready when you are.
              </h2>
            </div>

            <div className="fresh-cta-actions flex shrink-0 flex-col gap-2.5">
              <Button asChild size="lg">
                <Link to="/sign-up">
                  Create your account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/contact">Ask a question first</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
