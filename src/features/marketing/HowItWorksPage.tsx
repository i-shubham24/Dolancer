import { Link } from "react-router-dom";
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
import { HeroMarquee } from "./HeroMarquee";
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

const GATES = [
  { n: 1, title: "Join in 60s", sub: "Pick your core skills" },
  { n: 2, title: "Get Verified", sub: "ID and payout setup" },
  { n: 3, title: "Review an assigned offer", sub: "No proposal treadmill" },
  { n: 4, title: "Deliver & Auto-Payout", sub: "Direct to your bank" },
];

export function HowItWorksPage() {
  return (
    <div className="fresh-page !overflow-visible">
      {/* Light hero matching Home. The four gates are navigation: each one
          jumps to its moment below and preselects that tab. */}
      <section className="relative overflow-hidden bg-white pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <StitchBadge tone="neutral">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Everything, in the open
            </StitchBadge>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight font-display leading-[1.08]">
              From sign-up to payout in{" "}
              <span className="fresh-highlight fresh-underline fresh-underline-pink">
                four gates.
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              No part of this is hidden until after you sign up. Read it all, then decide.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-[#0a65c0] px-6 py-2 sm:px-7 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0854a0] transition-all shadow-md shadow-[#0a65c0]/20 active:scale-95"
              >
                <span>Start earning</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                to="#moment-1"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
              >
                See the moments
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Pay is visible before you accept an offer.</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> A supervisor carries the client side.</span>
            </div>
          </div>

          <ol className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto" aria-label="The four gates">
            {GATES.map((gate) => (
              <li key={gate.n}>
                <Link
                  to={`#moment-${gate.n}`}
                  className="group flex h-full flex-col rounded-2xl border border-line-card bg-surface p-4 text-left shadow-soft-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft-md"
                >
                  <span className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-primary font-mono">
                      0{gate.n}
                    </span>
                    <ArrowRight className="h-4 w-4 text-ink-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                  <span className="mt-2 text-sm font-extrabold text-ink leading-snug">{gate.title}</span>
                  <span className="mt-0.5 text-xs text-ink-muted font-medium">{gate.sub}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* One continuous light bg above the marquee (matches the white hero);
          the surface-2 blue below starts right at the marquee's lower border. */}
      <div className="relative z-20 bg-white pt-2">
        <HeroMarquee />
      </div>

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
