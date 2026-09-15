import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  badgeClass: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wallet,
    title: "Agreed Upfront Pay",
    body: "Compensation is pre-funded upfront before you claim. No bidding wars, no surprise discounts.",
    badgeClass: "bg-coral-light text-coral",
  },
  {
    icon: ShieldCheck,
    title: "Supervisor Shield",
    body: "Academic supervisors review drafts and handle all client coordination on your behalf.",
    badgeClass: "bg-blue-light text-blue",
  },
  {
    icon: Clock,
    title: "48-Hour Payouts",
    body: "Direct bank transfer via UPI or NEFT within 48 hours of sign-off. Zero invoice chasing.",
    badgeClass: "bg-success-bg text-success-ink",
  },
  {
    icon: Calendar,
    title: "Autonomous Schedule",
    body: "Accept briefs matched strictly to your verified major. Work entirely when and where you want.",
    badgeClass: "bg-purple-light text-purple",
  },
];


export function FeaturesGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="benefits" className="fresh-section py-18 bg-surface/40 relative">

      <div className="fresh-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Why Choose Dolancer
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink tracking-[-0.035em]">
            Built for specialists who value <span className="fresh-highlight fresh-underline fresh-underline-mint">clarity & respect.</span>
          </h2>
          <p className="mt-3 text-base text-ink-2 font-medium">
            Everything is designed to protect your focus and ensure fair, reliable earnings.
          </p>
        </div>

        {/* Minimal 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-line-card bg-surface p-6 shadow-soft-xs hover:border-coral/30 hover:shadow-soft-sm transition-all duration-200 flex flex-col justify-start"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feat.badgeClass} mb-5`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-extrabold text-ink tracking-tight mb-2 font-display">
                  {feat.title}
                </h3>

                <p className="text-sm text-ink-2 leading-relaxed font-medium">
                  {feat.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
