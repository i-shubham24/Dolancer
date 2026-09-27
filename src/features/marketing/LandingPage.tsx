import { ArrowUp } from "lucide-react";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { FeaturesGrid } from "./FeaturesGrid";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaBanner } from "./CtaBanner";
import { BackdropLetter } from "./BackdropLetter";
import { MicroFloaties } from "./MicroFloaties";
import { CurvedLoop } from "./CurvedLoop";
import { HeroMarquee } from "./HeroMarquee";
import { NetworkNumbers } from "./NetworkNumbers";
import { DisciplineOfferCards } from "./DisciplineOfferCards";
import { HeroSpectacular } from "./HeroSpectacular";
import { WhyDolancer } from "./WhyDolancer";

export function LandingPage() {
  return (
    <div className="fresh-page !overflow-visible">
      {/* Redesigned Hero Section aligning with HowItWorks / About theme */}
      <HeroSpectacular />

      {/* Straight auto-running ribbon flush below the hero */}
      <HeroMarquee />

      {/* Disciplines - D */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="D" position="left" offsetY="15%" />
        <DisciplineOfferCards />
      </div>

      <div className="relative overflow-clip mt-8 md:mt-12" aria-hidden="true">
        <CurvedLoop
          marqueeText="CONTENT ✦ DESIGN ✦ CREATIVE & MEDIA ✦ IT & SOFTWARE ✦ AI AGENTS & AUTOMATIONS ✦ MARKETING ✦ RESEARCH & BUSINESS ✦ SOMETHING ELSE ✦ "
          speed={1.6}
          curveAmount={-170}
          direction="right"
          interactive
        />
      </div>

      {/* 3 Steps: How Dolancers Earn - O */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="O" position="right" offsetY="23%" />
        <MicroFloaties zone="how" />
        <HowItWorksSteps />
        <WhyDolancer />
        <BackdropLetter letter="L" position="left" offsetY="82%" />
      </div>

      {/* Why Dolancers Love It / 8 Benefits - L & A (dark section, light ink) */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="A" position="right" offsetY="66%" tone="light" />
        <MicroFloaties zone="features" />
        <FeaturesGrid />
      </div>
      

      {/* Live Network Numbers - N (light wash below the dark pair) */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="N" position="left" offsetY="20%" />
        <MicroFloaties zone="numbers" />
        <NetworkNumbers />
      </div>

      {/* Real Dolancers, Real Earnings Testimonials - C (original position) */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="C" position="right" />
        <MicroFloaties zone="testimonials" />
        <TestimonialsSection />
      </div>

      {/* High-Converting CTA Banner - E (original position) */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="E" position="left" offsetY="35%" className="-ml-2" />
        <MicroFloaties zone="cta" />
        <CtaBanner />
      </div>

      {/* R - right, just before footer to complete DOLANCER (compact gap, zero clipping) */}
      <div className="relative -mt-6 sm:-mt-8 h-24 sm:h-28 md:h-32 overflow-visible select-none pointer-events-none" aria-hidden="true">
        <BackdropLetter letter="R" position="right" className="!text-[7rem] sm:!text-[8.5rem] md:!text-[10rem] !leading-none" />
        <MicroFloaties zone="prefooter" />
      </div>

      {/* Back to top: in-flow on Home only, never fixed, never in the footer */}
      <div className="flex justify-center pb-10">
        <button
          type="button"
          onClick={() => {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-line-card bg-surface px-5 py-2.5 text-sm font-bold text-ink-2 shadow-soft-sm transition-colors hover:border-primary/40 hover:text-ink"
        >
          <ArrowUp className="h-4 w-4 text-primary" aria-hidden="true" />
          Back to top
        </button>
      </div>
    </div>
  );
}
