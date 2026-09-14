import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import {
  StitchBadge as Badge,
  StitchButton,
  StitchColorCard,
  StitchOrbitalGraphic,
  StitchSection,
} from "@/components/stitch/StitchPrimitives";
import { FAQS, STEPS, DIFFERENCES } from "./content";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";

const ease = [0.16, 1, 0.3, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const list = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <StitchSection id={id} className={`fresh-section ${className}`}>
      <div className="fresh-container">{children}</div>
    </StitchSection>
  );
}

function ArrowMark() {
  return (
    <svg className="fresh-arrow" viewBox="0 0 140 70" fill="none" aria-hidden="true">
      <path d="M4 10c39-8 82 1 98 25 9 14 5 25-16 29" />
      <path d="m78 57 9 8 1-13" />
    </svg>
  );
}

export function LandingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fresh-page">
      <section className="fresh-hero">
        <div className="fresh-orb fresh-orb-one" aria-hidden="true" />
        <div className="fresh-orb fresh-orb-two" aria-hidden="true" />
        <div className="fresh-dot-field" aria-hidden="true" />
        <div className="fresh-container fresh-hero-grid">
          <motion.div initial={reduceMotion ? false : "hidden"} animate="show" variants={list} className="fresh-hero-copy">
            <motion.div variants={rise}>
              <Badge><Sparkles className="h-3.5 w-3.5" /> The work-first creator platform</Badge>
            </motion.div>
            <motion.h1 variants={rise}>
              Get paid for what you
              <span className="fresh-highlight fresh-underline fresh-underline-pink"> are good at.</span>
            </motion.h1>
            <motion.p variants={rise}>
              Find focused projects, know the payout before you start, and work with a supervisor
              who protects your time. No pitching. No chasing. Just making.
            </motion.p>
            <motion.div variants={rise} className="fresh-actions">
              <StitchButton asChild><Link to="/sign-up">Start earning <ArrowUpRight /></Link></StitchButton>
              <Link className="fresh-text-link" to="/how-it-works">See how it works <ArrowUpRight /></Link>
            </motion.div>
            <motion.div variants={rise} className="fresh-trust-row">
              <span><Check /> Pay agreed upfront</span>
              <span><Check /> Supervisor backed</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="fresh-hero-art"
          >
            <div className="fresh-art-card fresh-art-main">
              <div className="fresh-card-topline"><span className="fresh-live-dot" /> Matched for you <span>•••</span></div>
              <div className="fresh-project-icon">✦</div>
              <p className="fresh-kicker">Design system / product</p>
              <h2>Build a calm, clear onboarding experience</h2>
              <p className="fresh-muted">A focused brief with room for your best thinking.</p>
              <div className="fresh-project-meta"><span>₹24,000</span><span>7 days</span></div>
              <div className="fresh-progress"><span /></div>
              <button type="button" className="fresh-card-button">View brief <ArrowUpRight /></button>
            </div>
            <div className="fresh-art-card fresh-art-float">
              <Wallet />
              <strong>Payout released</strong>
              <span>₹18,600 <small>today</small></span>
            </div>
            <div className="fresh-art-note">Good work, <strong>on your terms.</strong></div>
            <ArrowMark />
          </motion.div>
        </div>
      </section>

      <Section className="fresh-proof">
        <div className="fresh-proof-intro"><span className="fresh-eyebrow">A better way to work</span><h2>Built around the part you are actually good at.</h2></div>
        <motion.div initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true, amount: 0.2 }} variants={list} className="fresh-proof-grid">
          <StitchColorCard tone="lilac" className="fresh-stat-card"><span>01</span><strong>No bidding</strong><p>The brief arrives with the rate already set. Your portfolio speaks for you.</p></StitchColorCard>
          <StitchColorCard tone="pink" className="fresh-stat-card"><span>02</span><strong>Protected delivery</strong><p>A supervisor handles the client relationship and keeps feedback useful.</p></StitchColorCard>
          <StitchColorCard tone="mint" className="fresh-stat-card"><span>03</span><strong>Clear payouts</strong><p>See gross, withholding, and net in one simple ledger after approval.</p></StitchColorCard>
        </motion.div>
      </Section>

      <Section id="walkthrough" className="fresh-workflow">
        <div className="fresh-section-heading"><div><span className="fresh-eyebrow">Inside the workflow</span><h2>From brief to paid, without the noise.</h2></div><p>Click through a real project journey. Every step is designed to keep your attention on the work.</p></div>
        <div className="fresh-workflow-panel">
          <div className="fresh-graphic-strip">
            <StitchOrbitalGraphic />
            <div>
              <Badge tone="success">Live delivery system</Badge>
              <h3>Every project has a visible path from brief to payout.</h3>
              <p>The graphic language is decorative. The states underneath remain real and interactive.</p>
            </div>
          </div>
          <WorkflowDemo />
        </div>
      </Section>

      <Section className="fresh-difference">
        <div className="fresh-section-heading"><div><span className="fresh-eyebrow">Why Dolancer</span><h2>More signal. Less freelance theatre.</h2></div><p>Professional work should feel clear before it starts and calm while it is happening.</p></div>
        <div className="fresh-difference-grid">
          {DIFFERENCES.slice(0, 4).map((difference, index) => (
            <motion.article key={difference.title} initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true }} variants={rise} className={`fresh-difference-card fresh-difference-card-${index + 1}`}>
              <span className="fresh-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{difference.title}</h3>
              <p>{difference.body}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section className="fresh-payout">
        <div className="fresh-payout-heading"><span className="fresh-eyebrow">Money, made legible</span><h2>Know what lands in your account.</h2><p>Move the sliders and see exactly how the payout reconciles. No mystery numbers.</p></div>
        <div className="fresh-payout-panel"><PayoutExplainer /></div>
      </Section>

      <Section className="fresh-steps">
        <div className="fresh-section-heading"><div><span className="fresh-eyebrow">Getting started</span><h2>Four small steps to better work.</h2></div></div>
        <div className="fresh-step-grid">
          {STEPS.map((step, index) => (
            <motion.div key={step.title} initial={reduceMotion ? false : "hidden"} whileInView={reduceMotion ? undefined : "show"} viewport={{ once: true }} variants={rise} className={`fresh-step fresh-step-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.body}</p><i aria-hidden="true" /></motion.div>
          ))}
        </div>
      </Section>

      <Section className="fresh-faq">
        <div className="fresh-section-heading"><div><span className="fresh-eyebrow">Questions, answered</span><h2>Everything clear before you join.</h2></div></div>
        <div className="fresh-faq-grid">
          <div className="fresh-faq-aside"><div className="fresh-faq-orbit"><ShieldCheck /></div><strong>Your time stays yours.</strong><p>Read the details, look around, and verify only when you are ready to earn.</p><Link to="/legal/terms">Read our standards <ArrowUpRight /></Link></div>
          <div className="fresh-faq-list">{FAQS.slice(0, 6).map((faq) => <details key={faq.question}><summary>{faq.question}<ChevronDown /></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </Section>

      <Section className="fresh-final">
        <div className="fresh-final-card"><div><Badge>Free to join</Badge><h2>Make room for your best work.</h2><p>Join in minutes. Explore the platform properly before you decide to verify.</p></div><StitchButton asChild><Link to="/sign-up">Create your account <ArrowUpRight /></Link></StitchButton></div>
      </Section>
    </div>
  );
}
