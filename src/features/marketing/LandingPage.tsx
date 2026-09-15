import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import {
  StitchBadge,
  StitchButton,
  StitchSection,
} from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { HeroCardStack } from "./HeroCardStack";
import { MetricsBar } from "./MetricsBar";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { AnimatedMarquee } from "./AnimatedMarquee";
import { FeaturesGrid } from "./FeaturesGrid";
import { NumbersSection } from "./NumbersSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaBanner } from "./CtaBanner";
import { PayoutExplainer } from "./PayoutExplainer";

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="fresh-page">
      {/* Redesigned Hero Section aligning with HowItWorks / About theme */}
      <section className="fresh-hero relative">
        <div className="fresh-dot-field" aria-hidden="true" />
        <div className="fresh-container fresh-hero-grid items-center py-10 lg:py-16">
          {/* Left Hero Copy */}
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            variants={reveal}
            className="fresh-hero-copy"
          >
            <StitchBadge tone="brand">
              <Sparkles className="h-3.5 w-3.5 text-coral" />
              India's Premier Freelance Intelligence Network
            </StitchBadge>

            <h1 className="mt-5 max-w-2xl font-display !text-4xl sm:!text-6xl lg:!text-7xl !font-extrabold !leading-[1.04] tracking-[-0.045em] text-ink">
              Turn your expertise into
              <br />
              <span className="fresh-highlight fresh-underline fresh-underline-mint">
                reliable earnings.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-ink-2 font-medium leading-relaxed">
              Accept academic and technical briefs that match your verified skills. Deliver quality work on your schedule. Get paid reliably with upfront rates and dedicated supervisor support.
            </p>

            <div className="fresh-actions">
              <StitchButton asChild variant="primary" className="px-8 py-4 text-base">
                <Link to="/sign-up">
                  <Sparkles className="h-4 w-4" />
                  Start Earning Today
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </StitchButton>

              <StitchButton asChild variant="secondary" className="px-7 py-4 text-base">
                <Link to="/pool">
                  <Briefcase className="h-4 w-4 mr-1 text-ink-2" />
                  Browse Task Board
                </Link>
              </StitchButton>
            </div>

            <div className="fresh-trust-row">
              <span>
                <CheckCircle2 className="h-4 w-4 text-coral" />
                Pay agreed upfront
              </span>
              <span>
                <CheckCircle2 className="h-4 w-4 text-blue" />
                Supervisor reviewed
              </span>
              <span>
                <CheckCircle2 className="h-4 w-4 text-success-dot" />
                Payout guaranteed
              </span>
            </div>
          </motion.div>

          {/* Right Hero Visual Stack */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <HeroCardStack />
          </motion.div>
        </div>

        {/* Curvy divider below hero */}
        <CurvedSectionDivider
          variant="smooth-arch"
          position="bottom"
          fillColor="fill-canvas"
          showAccentGlow
          showBorderLine
        />
      </section>

      {/* Metrics Bar */}
      <MetricsBar />

      {/* 3 Steps: How Dolancers Earn */}
      <HowItWorksSteps />

      {/* Animated Disciplines Marquee */}
      <AnimatedMarquee />

      {/* Why Dolancers Love It / 8 Benefits */}
      <FeaturesGrid />

      {/* Numbers That Speak */}
      <NumbersSection />

      {/* Payout Explainer Interactive Slider with Curvy Borders (No Straight Lines) */}
      <StitchSection className="fresh-section py-20 bg-surface/50 relative">
        {/* Top curved divider replacing straight border-t */}
        <CurvedSectionDivider
          variant="wave"
          position="top"
          fillColor="fill-canvas"
          showAccentGlow
          showBorderLine
        />

        <div className="fresh-container">
          <PayoutExplainer />
        </div>

        {/* Bottom curved divider replacing straight border-b */}
        <CurvedSectionDivider
          variant="organic-crest"
          position="bottom"
          fillColor="fill-canvas"
          showAccentGlow
          showBorderLine
        />
      </StitchSection>

      {/* Real Dolancers, Real Earnings Testimonials */}
      <TestimonialsSection />

      {/* High-Converting CTA Banner */}
      <CtaBanner />
    </div>
  );
}
