import { HowItWorksSteps } from "./HowItWorksSteps";
import { FeaturesGrid } from "./FeaturesGrid";
import { PayoutExplainer } from "./PayoutExplainer";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaBanner } from "./CtaBanner";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { BackdropLetter } from "./BackdropLetter";
import { MicroFloaties } from "./MicroFloaties";
import { CurvedLoop } from "./CurvedLoop";
import { HeroMarquee } from "./HeroMarquee";
import { NetworkNumbers } from "./NetworkNumbers";
import { DisciplineOfferCards } from "./DisciplineOfferCards";
import { HeroSpectacular } from "./HeroSpectacular";

export function LandingPage() {
  return (
    <div className="fresh-page !overflow-visible -mt-[120px]">
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
        <BackdropLetter letter="O" position="right" offsetY="16%" />
        <MicroFloaties zone="how" />
        <HowItWorksSteps />
      </div>

      {/* Why Dolancers Love It / 8 Benefits - L (dark section, light ink) */}
      <div className="relative overflow-clip">
        <BackdropLetter letter="L" position="left" offsetY="20%" tone="light" />
        <MicroFloaties zone="features" />
        <FeaturesGrid />
      </div>

      {/* Follow-every-payout - A */}
      <div className="fresh-section py-20 bg-[#0b0f19] relative overflow-clip">
        <BackdropLetter letter="A" position="right" offsetY="12%" tone="light" />
        <MicroFloaties zone="payout" />
        <div className="fresh-container">
          <PayoutExplainer />
        </div>
        <CurvedSectionDivider variant="wave" position="bottom" fillColor="fill-[var(--color-canvas)]" showBorderLine={false} showAccentGlow={false} />
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

      {/* R - right, just before footer to complete DOLANCER */}
      <div className="relative -mt-10 h-44 overflow-clip md:h-56" aria-hidden="true">
        <BackdropLetter letter="R" position="right" className="text-[10rem] md:text-[13rem]" />
        <MicroFloaties zone="prefooter" />
      </div>
    </div>
  );
}
