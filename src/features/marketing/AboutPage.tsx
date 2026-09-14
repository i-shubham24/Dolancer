import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "./content";
import {
  StitchBadge,
  StitchButton,
  StitchColorCard,
  StitchSection,
} from "@/components/stitch/StitchPrimitives";

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
      <StitchSection className="fresh-hero fresh-editorial-hero">
        <div className="fresh-container">
          <StitchBadge>About Dolancer</StitchBadge>
          <motion.h1 initial={reduceMotion ? false : "hidden"} animate="show" variants={reveal} className="fresh-about-title mt-5 max-w-3xl">
            Skilled work should feel
            <br className="hidden sm:block" />
            <span className="fresh-highlight fresh-underline fresh-underline-yellow"> simpler than this.</span>
          </motion.h1>
          <motion.div initial={reduceMotion ? false : "hidden"} animate="show" variants={reveal} className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-ink-2">
            <p>Most freelance platforms put the entire burden on the person doing the work. You find the client, you pitch, you price yourself against strangers, you manage the relationship, you absorb the revisions, and then you chase the invoice. The platform takes a cut for introducing you and steps back.</p>
            <p>We run it the other way around. We find the client, scope the work properly, and agree a price before anyone starts. A supervisor briefs you, reviews what you produce, and handles the client entirely. You do the part you are actually good at, and you get paid for it.</p>
            <p>That means we carry things you would otherwise carry alone: the cost of winning work, the disputes, the refunds, the awkward conversations. It is why we keep a share of what a client pays, and why we would rather tell you that plainly than let you discover it later.</p>
          </motion.div>
        </div>
      </StitchSection>

      <section className="fresh-section fresh-proof">
        <div className="fresh-container grid gap-5 md:grid-cols-3">
          {principles.map((card, index) => (
            <motion.div key={card.title} initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true, amount: 0.2 }} variants={reveal}>
              <StitchColorCard tone={card.tone} className="fresh-principle-card h-full">
                <span className="text-xs font-bold tracking-[0.08em] text-ink/45">0{index + 1}</span>
                <h2 className="mt-12 text-xl font-extrabold leading-tight tracking-[-0.03em]">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{card.body}</p>
              </StitchColorCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="fresh-section fresh-final">
        <div className="fresh-container">
          <div className="fresh-final-card">
            <div>
              <StitchBadge className="fresh-who-runs-badge">Who runs this</StitchBadge>
              <h2>Clear work needs clear stewardship.</h2>
              <p>Dolancer is operated by {CONTACT.company}, registered in {CONTACT.jurisdiction}. We also run a client-facing brand, which is how work reaches this side of the platform. We do not hide that connection, and you are free to ask about it.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StitchButton asChild>
                <Link to="/sign-up">Start earning <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </StitchButton>
              <StitchButton asChild variant="secondary">
                <Link to="/contact">Ask us something</Link>
              </StitchButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
