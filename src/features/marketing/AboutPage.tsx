import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "./content";
import {
  StitchBadge,
  StitchButton,
  StitchColorCard,
} from "@/components/stitch/StitchPrimitives";
import { AboutHeroInteractive } from "./AboutHeroInteractive";
import { MicroFloaties } from "./MicroFloaties";
import { AboutComparison } from "./AboutComparison";

export function AboutPage() {
  const reduceMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const principles = [
    {
      title: "You stay anonymous",
      body: "Clients never learn your name, where you are, what you are paid, or that you work through us. They see a discipline and nothing else. This protects you as much as it protects them.",
      tone: "lilac" as const,
    },
    {
      title: "You are not an employee",
      body: "You choose what to accept and when to stop. Nothing is assigned to you against your will, and pausing is a switch you control.",
      tone: "mint" as const,
    },
    {
      title: "You are always paid",
      body: "If work you delivered was sound and the client changed their mind, that is our problem to absorb, not yours. If we ever part ways, anything you have earned is still paid out.",
      tone: "pink" as const,
    },
  ];

  return (
    <div className="fresh-page !overflow-visible -mt-[120px]">
      {/* Redesigned High-Craft Editorial & Interactive Hero (Dark Theme) */}
      <section className="relative pt-[90px] lg:pt-[110px] pb-10 lg:pb-16 bg-[#050914] overflow-hidden">
        {/* Dark Dotted pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        
        {/* Dynamic Light Background Orbs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-400/10 blur-[100px] mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[10%] w-[60%] h-[50%] rounded-full bg-blue-600/15 blur-[120px] mix-blend-screen" />
        </div>
        
        <MicroFloaties zone="about-hero" />
        <div className="fresh-container relative z-10">
          <AboutHeroInteractive />
        </div>
        
        {/* Hanging bottom curve to cleanly transition to the next section's background (bg-surface) */}
        <div className="absolute -bottom-px left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg className="relative block w-full h-[40px] lg:h-[70px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z" className="fill-surface" />
          </svg>
        </div>
      </section>

      <AboutComparison />

      {/* Principles Section with Curvy Framing */}
      <section className="fresh-section fresh-proof bg-surface-2 pt-16 pb-32 relative overflow-hidden">
        <MicroFloaties zone="about-principles" />
        <div className="fresh-container relative z-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <StitchBadge>Our Core Principles</StitchBadge>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-display text-ink tracking-tight">
              Three rules we will not compromise on
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-2 font-medium">
              Freelancing works best when incentives are aligned and rules are clear.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((card, index) => (
              <motion.div key={card.title} initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true, amount: 0.2 }} variants={reveal}>
                <StitchColorCard tone={card.tone} className="fresh-principle-card h-full p-7 rounded-3xl">
                  <span className="text-xs font-bold tracking-[0.08em] text-ink/45 font-mono">0{index + 1}</span>
                  <h3 className="mt-8 text-xl font-extrabold leading-tight tracking-[-0.03em]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75 font-medium">{card.body}</p>
                </StitchColorCard>
              </motion.div>
            ))}
          </div>
        </div>

        
      </section>

      <section className="fresh-section fresh-final">
        <div className="fresh-container">
          <div className="fresh-final-card max-w-5xl mx-auto">
            <div>
              <StitchBadge className="fresh-who-runs-badge">Who runs this</StitchBadge>
              <h2>Clear work needs clear stewardship.</h2>
              <p>Dolancer is operated by {CONTACT.company}, registered in {CONTACT.jurisdiction}. We also run a client-facing brand, which is how work reaches this side of the platform. We do not hide that connection, and you are free to ask about it.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <StitchButton asChild className="w-full">
                <Link to="/sign-up">Start earning <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" /></Link>
              </StitchButton>
              <StitchButton asChild variant="outline" className="w-full bg-surface">
                <Link to="/contact">Ask us something</Link>
              </StitchButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
