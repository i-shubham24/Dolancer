import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import {
  StitchBadge,
  StitchButton,
  StitchSection,
} from "@/components/stitch/StitchPrimitives";
import { HeroCardStack } from "./HeroCardStack";
import { MetricsBar } from "./MetricsBar";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { AnimatedMarquee } from "./AnimatedMarquee";
import { FeaturesGrid } from "./FeaturesGrid";
import { NumbersSection } from "./NumbersSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaBanner } from "./CtaBanner";
import { PayoutExplainer } from "./PayoutExplainer";
import { BackdropLetter } from "./BackdropLetter";
import { MicroFloaties } from "./MicroFloaties";
import VariableProximity from "@/components/react-bits/VariableProximity";
import { CurvedLoop } from "./CurvedLoop";

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="fresh-page">
      {/* Redesigned Hero Section aligning with HowItWorks / About theme */}
      <section ref={heroRef} className="fresh-hero relative overflow-clip">
        {/* Swarm one — vivid coral→blue — chasing the cursor across the hero.
            Literal brand hexes (not palette vars) so the active palette's
            remapped tokens can't muddy them into gray. z-20 floats the swarm
            ABOVE the hero content; pointer-events-none keeps every click
            landing on the real buttons underneath. */}
        
        <MicroFloaties zone="hero" />
        <div className="fresh-dot-field" aria-hidden="true" />
        <div className="fresh-container fresh-hero-grid relative z-10 items-center py-10 lg:py-16">
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
              <VariableProximity
                label="Turn your expertise into"
                fromFontVariationSettings="'wght' 640"
                toFontVariationSettings="'wght' 800"
                containerRef={heroRef}
                radius={160}
                falloff="gaussian"
              />
              <br />
              <span className="fresh-highlight fresh-underline fresh-underline-mint">
                <VariableProximity
                  label="reliable earnings."
                  fromFontVariationSettings="'wght' 640"
                  toFontVariationSettings="'wght' 800"
                  containerRef={heroRef}
                  radius={160}
                  falloff="gaussian"
                />
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
      </section>

      {/* Social Proof / Trusted By */}
      <MetricsBar />

      {/* 3 Steps: How Dolancers Earn — D */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="D" position="left" offsetY="25%" />
        <MicroFloaties zone="how" />
        <HowItWorksSteps />
      </div>

      {/* Curved discipline ribbon bridging the steps and the live-brief marquee.
          The band has no fixed height — the SVG's aspect ratio sizes it, and
          the arc is fully contained in its own viewBox so nothing bleeds into
          the neighbouring sections. */}
      <div className="relative overflow-clip" aria-hidden="true">
        <CurvedLoop
          marqueeText="Graphic Design ✦ Web Development ✦ Copywriting ✦ Digital Marketing ✦ E-Commerce ✦ Support ✦ "
          speed={1.6}
          curveAmount={-170}
          direction="right"
          interactive
        />
      </div>

      {/* Animated Disciplines Marquee — O */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="O" position="right" offsetY="20%" />
        <AnimatedMarquee />
      </div>

      {/* Why Dolancers Love It / 8 Benefits — L */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="L" position="left" offsetY="30%" />
        <MicroFloaties zone="features" />
        {/* Swarm two — vivid lime→purple — floating over the benefits grid. */}
        
        <FeaturesGrid />
      </div>

      {/* Numbers That Speak — A */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="A" position="right" offsetY="25%" />
        <MicroFloaties zone="numbers" />
        <NumbersSection />
      </div>

      {/* Payout Explainer Interactive Slider with Curvy Borders (No Straight Lines) — N */}
      <StitchSection className="fresh-section py-20 bg-surface/50 relative overflow-clip">
        <BackdropLetter letter="N" position="left" />
        <MicroFloaties zone="payout" />
        {/* Top curved divider replacing straight border-t */}
        

        <div className="fresh-container">
          <PayoutExplainer />
        </div>
      </StitchSection>

      {/* Real Dolancers, Real Earnings Testimonials — C */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="C" position="right" />
        <MicroFloaties zone="testimonials" />
        <TestimonialsSection />
      </div>

      {/* High-Converting CTA Banner — E */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="E" position="left" offsetY="35%" className="-ml-2" />
        <MicroFloaties zone="cta" />
        <CtaBanner />
      </div>

      {/* R — right, just before footer to complete DOLANCER */}
      <div className="relative -mt-10 h-44 overflow-clip md:h-56" aria-hidden="true">
        <BackdropLetter letter="R" position="right" className="text-[10rem] md:text-[13rem]" />
        <MicroFloaties zone="prefooter" />
      </div>
    </div>
  );
}
