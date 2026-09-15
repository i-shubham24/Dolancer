import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "./content";
import {
  StitchBadge,
  StitchButton,
  StitchColorCard,
} from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { AboutHeroInteractive } from "./AboutHeroInteractive";
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
      body: "You choose what to claim and when to stop. Nothing is assigned to you against your will, and pausing is a switch you control.",
      tone: "mint" as const,
    },
    {
      title: "You are always paid",
      body: "If work you delivered was sound and the client changed their mind, that is our problem to absorb, not yours. If we ever part ways, anything you have earned is still paid out.",
      tone: "pink" as const,
    },
  ];

  return (
    <div className="fresh-page">
      {/* Redesigned High-Craft Editorial & Interactive Hero */}
      <section className="fresh-hero relative pb-10">
        <div className="fresh-container">
          <AboutHeroInteractive />
        </div>
      </section>

      <AboutComparison />

      {/* Principles Section with Curvy Framing */}
      <section className="fresh-section fresh-proof bg-[#faf8f5] pt-16 pb-32 relative overflow-hidden">
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

        {/* Curvy divider into Final Section */}
        <CurvedSectionDivider
          variant="wave"
          position="bottom"
          fillColor="fill-canvas"
          showAccentGlow
        />
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
              <StitchButton asChild variant="secondary" className="w-full bg-surface">
                <Link to="/contact">Ask us something</Link>
              </StitchButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
