import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  color: string;
  bg: string;
}

const LEFT_FEATURES: Feature[] = [
  {
    icon: Wallet,
    title: "Agreed Upfront Pay",
    body: "Compensation is pre-funded upfront before you accept. No public marketplace, no surprise discounts.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Supervisor Shield",
    body: "Supervisors review drafts and handle all client coordination on your behalf.",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
];

const RIGHT_FEATURES: Feature[] = [
  {
    icon: Clock,
    title: "Payouts After Approval",
    body: "Direct bank transfer via UPI or NEFT after supervisor sign-off. Zero invoice chasing.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/20",
  },
  {
    icon: Calendar,
    title: "Clear Timelines",
    body: "Every brief has a strict deadline for both your delivery and the supervisor's review.",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
  },
];

export function FeaturesGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-[#050914] py-24 md:py-32 overflow-hidden">
      {/* Top curved divider matching the canvas color above it */}
      <CurvedSectionDivider variant="wave" position="top" fillColor="fill-[var(--color-canvas)]" />

      {/* Decorative ambient lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="fresh-container relative z-10 px-4 md:px-8 max-w-[1320px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
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

        {/* Network Diagram Layout (Flex-based to prevent overlap) */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10 w-full max-w-[1200px] mx-auto">
          
          {/* Connecting SVG Lines (Desktop Only) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
            {/* Top Left Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              d="M 25% 25% C 35% 25%, 40% 50%, 50% 50%" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" strokeDasharray="4 4" 
            />
            {/* Bottom Left Line */}
            <motion.path 
               initial={{ pathLength: 0 }}
               whileInView={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.4 }}
              d="M 25% 75% C 35% 75%, 40% 50%, 50% 50%" stroke="url(#line-grad-1)" strokeWidth="2" fill="none" strokeDasharray="4 4" 
            />
            {/* Top Right Line */}
            <motion.path 
               initial={{ pathLength: 0 }}
               whileInView={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.3 }}
              d="M 75% 25% C 65% 25%, 60% 50%, 50% 50%" stroke="url(#line-grad-2)" strokeWidth="2" fill="none" strokeDasharray="4 4" 
            />
            {/* Bottom Right Line */}
            <motion.path 
               initial={{ pathLength: 0 }}
               whileInView={{ pathLength: 1 }}
               transition={{ duration: 1.5, delay: 0.5 }}
              d="M 75% 75% C 65% 75%, 60% 50%, 50% 50%" stroke="url(#line-grad-2)" strokeWidth="2" fill="none" strokeDasharray="4 4" 
            />
            <defs>
              <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#5A7CFF" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="line-grad-2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#5A7CFF" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Left Column Cards */}
          <div className="flex flex-col gap-8 w-full md:w-1/3 z-10 relative">
            {LEFT_FEATURES.map((feat, i) => (
              <motion.div 
                key={feat.title}
                initial={reduceMotion ? false : { x: -30, opacity: 0 }}
                whileInView={reduceMotion ? undefined : { x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.2 + (i * 0.2) }}
                className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${feat.bg}`}>
                    <feat.icon className={`h-5 w-5 ${feat.color}`} />
                  </div>
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide leading-tight">{feat.title}</h3>
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10">
                  {feat.body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Center Hub */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 1, bounce: 0.5 }}
            className="shrink-0 z-20 relative w-36 h-36 md:w-48 md:h-48 my-8 md:my-0"
          >
            {/* Outer animated rings */}
            <div className="absolute inset-0 rounded-full border border-primary/30 animate-[ping_3s_ease-in-out_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-[spin_10s_linear_infinite] border-t-transparent" />
            <div className="absolute inset-4 rounded-full border border-indigo-400/30 animate-[spin_8s_linear_infinite_reverse] border-b-transparent" />
            
            {/* Inner Core */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#0A0D1A] to-blue-900 border-2 border-primary/50 shadow-[0_0_30px_rgba(90,124,255,0.4)] flex items-center justify-center flex-col">
              <Logo size="lg" className="opacity-90 ml-[-2px] mb-0.5" />
            </div>
          </motion.div>

          {/* Right Column Cards */}
          <div className="flex flex-col gap-8 w-full md:w-1/3 z-10 relative">
            {RIGHT_FEATURES.map((feat, i) => (
              <motion.div 
                key={feat.title}
                initial={reduceMotion ? false : { x: 30, opacity: 0 }}
                whileInView={reduceMotion ? undefined : { x: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.3 + (i * 0.2) }}
                className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${feat.bg}`}>
                    <feat.icon className={`h-5 w-5 ${feat.color}`} />
                  </div>
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wide leading-tight">{feat.title}</h3>
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed relative z-10">
                  {feat.body}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
