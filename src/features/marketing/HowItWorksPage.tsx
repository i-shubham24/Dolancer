import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StitchBadge, StitchSection } from "@/components/stitch/StitchPrimitives";
import { GettingStartedInteractive } from "./GettingStartedInteractive";
import { InteractiveBentoPillars } from "./InteractiveBentoPillars";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";
import { DifferenceRail } from "./DifferenceRail";
import { CategoryTags } from "./CategoryTags";
import { HowItWorksHeroGraphic } from "./HowItWorksHeroGraphic";

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
      <section className="fresh-hero relative">
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
            className="relative w-full lg:pr-10 xl:pr-16"
          >
            <HowItWorksHeroGraphic />
          </motion.div>
        </div>
      </section>

      {/* Redesigned 5x Creative Interactive Four Moments Section */}
      <section className="bg-[#faf8f5] py-14 lg:py-20 relative">
        <div className="fresh-container">
          <GettingStartedInteractive />
        </div>
      </section>

      <Section labelledBy="walkthrough" className="fresh-workflow !pt-6 !pb-12 lg:!pb-16">
        {/* Redesigned Bento Pillars (formerly the empty pastel cards in screenshot) */}
        <InteractiveBentoPillars />

        {/* Real Product Walkthrough */}
        <WorkflowDemo />
      </Section>

      <section aria-labelledby="payout" className="fresh-section fresh-payout bg-[#faf8f5] py-20 relative overflow-hidden">
        <div className="fresh-container relative z-20">
          <PayoutExplainer />
        </div>
      </section>

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
