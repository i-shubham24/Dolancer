import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";

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
    body: "Compensation is pre-funded upfront before you accept. No public marketplace, no surprise discounts.",
    badgeClass: "bg-primary-light text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Supervisor Shield",
    body: "Supervisors review drafts and handle all client coordination on your behalf.",
    badgeClass: "bg-secondary-light text-secondary",
  },
  {
    icon: Clock,
    title: "Payouts After Approval",
    body: "Direct bank transfer via UPI or NEFT after supervisor sign-off. Zero invoice chasing.",
    badgeClass: "bg-success-bg text-success-ink",
  },
  {
    icon: Calendar,
    title: "Autonomous Schedule",
    body: "Accept offers matched to your verified disciplines. Work within the agreed scope and deadline.",
    badgeClass: "bg-highlight-light text-highlight",
  },
];


export function FeaturesGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="benefits" className="fresh-section pt-20 pb-18 bg-[#0b0f19] relative">
      <CurvedSectionDivider variant="wave" position="top" fillColor="fill-[var(--color-canvas)]" />

      <div className="fresh-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <StitchBadge tone="light">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Why Choose Dolancer
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-[-0.035em]">
            Built for specialists who value <span className="text-white fresh-underline fresh-underline-mint">clarity & respect.</span>
          </h2>
          <p className="mt-3 text-base text-slate-300 font-medium">
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
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm hover:border-primary/50 transition-all duration-200 flex flex-col justify-start"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feat.badgeClass} mb-5`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-extrabold text-white tracking-tight mb-2 font-display">
                  {feat.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-medium">
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
