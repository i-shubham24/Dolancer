import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StitchBadge, StitchSection } from "@/components/stitch/StitchPrimitives";
import { GettingStartedInteractive } from "./GettingStartedInteractive";
import { MicroFloaties } from "./MicroFloaties";
import { InteractiveBentoPillars } from "./InteractiveBentoPillars";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";
import { DifferenceRail } from "./DifferenceRail";
import { CategoryTags } from "./CategoryTags";
import { HowItWorksHeroGraphic } from "./HowItWorksHeroGraphic";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { FaqAccordion } from "./FaqAccordion";
import { MagneticButton } from "@/components/motion/MagneticButton";

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
      <section className="fresh-hero relative z-10 !pt-2 lg:!pt-2 !pb-16 lg:!pb-24 flex items-center !min-h-0 !overflow-visible">
        <MicroFloaties zone="hiw-hero" />
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
              <span><Check /> Pay is visible before you accept an offer.</span>
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
      <section className="bg-surface-2 py-14 lg:py-28 relative">
        <div className="fresh-container">
          <GettingStartedInteractive />
        </div>
        <CurvedSectionDivider variant="wave" position="bottom" fillColor="fill-[var(--color-canvas)]" />
      </section>

      <Section labelledBy="walkthrough" className="fresh-workflow !pt-20 !pb-12 lg:!pb-16">
        {/* Real Product Walkthrough - what a project actually looks like, first */}
        <div><WorkflowDemo /></div>
      </Section>

      {/* Trio pillars - dark, footer-symmetric */}
      <section className="fresh-section bg-[#0b0f19] !py-20 relative overflow-clip">
        <div className="fresh-container">
          <InteractiveBentoPillars dark />
        </div>
      </section>

      <section aria-labelledby="payout" className="fresh-section bg-[#0b0f19] py-20 relative overflow-hidden">
        <MicroFloaties zone="payout" />
        <div className="fresh-container relative z-20">
          <PayoutExplainer />
        </div>
      </section>

      <Section labelledBy="differences" className="fresh-difference">
        <DifferenceRail />
      </Section>

      <section className="relative fresh-steps fresh-section">
        <div className="fresh-container">
          <h2 id="disciplines" className="fresh-section-heading-text">
            What gets offered here
          </h2>
          <p className="mt-3 max-w-xl text-md text-ink-2">
            Pick the disciplines you are genuinely strong in. Supervisors use them to route suitable
            offers, so accuracy matters more than breadth.
          </p>
          <div className="mt-10 pb-16">
            <CategoryTags />
          </div>
        </div>
        <CurvedSectionDivider variant="wave" position="bottom" fillColor="fill-surface-2" />
      </section>

      <section className="bg-surface-2 py-16 fresh-section">
        <div className="fresh-container">
          <FaqAccordion />
        </div>
      </section>

      <Section labelledBy="cta">
        <MicroFloaties zone="cta" />
        <div className="fresh-final-card mx-auto max-w-4xl">
          <div className="fresh-final-content flex flex-wrap items-center justify-between gap-8">
            <div className="min-w-0 flex-1">
              <StitchBadge>That is all of it</StitchBadge>
              <h2
                id="cta"
                className="mt-4 max-w-md text-3xl font-extrabold leading-[1.1] tracking-[-0.04em]"
              >
                Start earning on your terms.
              </h2>
            </div>

            <div className="fresh-cta-actions flex shrink-0 flex-col gap-2.5">
              <MagneticButton>
                <Button asChild size="lg" className="w-full">
                  <Link to="/sign-up">
                    Create your account
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button asChild variant="outline">
                <Link to="/contact">Ask a question first</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
