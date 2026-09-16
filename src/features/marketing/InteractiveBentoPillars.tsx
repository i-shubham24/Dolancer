import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  CircleDollarSign,
  Shield,
  Zap,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TiltCard } from "@/components/motion/TiltCard";

export function InteractiveBentoPillars({ dark = false }: { dark?: boolean }) {
  // Dark mode (footer-symmetric): glass cards, white headings, slate body.
  const H = dark ? "text-white" : "text-ink";
  const B = dark ? "text-slate-300" : "text-ink-2";
  const M = dark ? "text-slate-400" : "text-ink-muted";
  const card = dark
    ? "bg-white/[0.06] border border-white/10"
    : null;
  const panel = dark ? "bg-white/5 border-white/10" : null;

  // Card 1 state: selected skill to preview instant match
  const [selectedDemoSkill, setSelectedDemoSkill] = useState<number>(0);

  // Card 2 state: client friction simulation toggle
  const [showFrictionDemo, setShowFrictionDemo] = useState<boolean>(false);

  // Card 3 state: payout preview amount
  const [payoutAmount, setPayoutAmount] = useState<number>(14000);

  const DEMO_SKILLS = [
    { name: "Graphic Design", task: "Brand Identity & Logo Suite", pay: "₹2,800", time: "2 days" },
    { name: "WordPress & Shopify", task: "Responsive Store & Speed Optimization", pay: "₹4,200", time: "3 days" },
    { name: "Copywriting", task: "High-Converting Sales Funnel", pay: "₹2,500", time: "24 hours" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10">
      {/* CARD 1: Matched, not marketed (Lilac tone) */}
      <ScrollReveal delay={0.1}>
        <TiltCard className={cn("relative isolate overflow-hidden rounded-3xl p-6 sm:p-7 shadow-soft-md transition-all duration-300 hover:shadow-soft-lg flex flex-col justify-between h-full min-h-[340px]", card ?? "bg-card-lilac border border-highlight/20")}>
          {/* Ambient glow accent */}
          <span className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-highlight/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-highlight/15 text-highlight shadow-soft-xs">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-highlight/10 px-2.5 py-0.5 text-[11px] font-extrabold text-highlight">
              Zero Cold Pitching
            </span>
          </div>

          <h3 className={cn("text-xl font-extrabold font-display tracking-tight", H)}>
            Matched, not marketed
          </h3>
          <p className={cn("mt-1.5 text-xs sm:text-sm font-medium leading-relaxed", B)}>
            Your verified skills decide what appears in your assigned offers. No bids, no proposals, no algorithm games.
          </p>
        </div>

        {/* Interactive Micro-Matcher */}
        <div className="mt-5 pt-4 border-t border-highlight/15 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {DEMO_SKILLS.map((skill, idx) => (
              <button
                key={skill.name}
                type="button"
                onClick={() => setSelectedDemoSkill(idx)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-bold transition-all select-none",
                  selectedDemoSkill === idx
                    ? "bg-highlight text-white shadow-soft-xs"
                    : dark
                      ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                      : "bg-surface/80 border border-highlight/20 text-ink-2 hover:bg-surface"
                )}
              >
                {skill.name}
              </button>
            ))}
          </div>

          {/* Matched Brief Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDemoSkill}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-3 rounded-2xl shadow-soft-xs flex items-center justify-between",
                panel ?? "bg-surface/90 border border-highlight/20",
              )}
            >
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-highlight block">
                  Matched Live Brief
                </span>
                <p className={cn("text-xs font-bold truncate mt-0.5", H)}>
                  {DEMO_SKILLS[selectedDemoSkill]?.task}
                </p>
                <p className={cn("text-[11px] mt-0.5 font-medium", M)}>
                  {DEMO_SKILLS[selectedDemoSkill]?.time} · Direct Offer
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-highlight font-display block">
                  {DEMO_SKILLS[selectedDemoSkill]?.pay}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-ink">
                  <Check className="h-2.5 w-2.5" /> Ready
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        </TiltCard>
      </ScrollReveal>

      {/* CARD 2: Protected while you work (Pink / Coral tone) */}
      <ScrollReveal delay={0.2}>
        <TiltCard className={cn("relative isolate overflow-hidden rounded-3xl p-6 sm:p-7 shadow-soft-md transition-all duration-300 hover:shadow-soft-lg flex flex-col justify-between h-full min-h-[340px]", card ?? "bg-card-pink border border-primary/20")}>
          {/* Ambient glow accent */}
          <span className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-soft-xs">
                <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-extrabold text-primary">
              Buffer Shield
            </span>
          </div>

          <h3 className={cn("text-xl font-extrabold font-display tracking-tight", H)}>
            Protected while you work
          </h3>
          <p className={cn("mt-1.5 text-xs sm:text-sm font-medium leading-relaxed", B)}>
            Feedback and client conversations stay strictly with your supervisor. You never absorb client friction.
          </p>
        </div>

        {/* Interactive Buffer Demo */}
        <div className="mt-5 pt-4 border-t border-primary/15 space-y-2.5">
          <div className={cn("p-3 rounded-2xl shadow-soft-xs", panel ?? "bg-surface/90 border border-primary/20")}>
            <div className="flex items-center justify-between text-[11px] font-bold mb-2">
              <span className={M}>Original Brief</span>
              <span className="text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" /> Shield Active
              </span>
            </div>

            {!showFrictionDemo ? (
              <div className="space-y-1.5">
                <p className={cn("text-xs font-semibold leading-relaxed", H)}>
                  "Deliverables verified against rubric. Revisions managed by QA supervisor."
                </p>
                <button
                  type="button"
                  onClick={() => setShowFrictionDemo(true)}
                  className="w-full mt-2 py-1.5 px-3 rounded-xl bg-primary-light text-primary text-xs font-bold hover:bg-primary-light/80 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-3 w-3" />
                  Simulate Client Scope Creep
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-[#fff5f6] border border-primary/30 text-[11px] text-ink-2 font-medium">
                  <span className="font-bold text-primary">Blocked Attempt:</span> "Can you also design 3 extra banners tonight for free?"
                </div>
                <div className="p-2 rounded-xl bg-success-bg border border-success-ink/20 text-[11px] text-success-ink font-bold">
                  <span className="font-extrabold">Supervisor response:</span> Blocked. Scope is fixed. Freelancer payout unaffected.
                </div>
                <button
                  type="button"
                  onClick={() => setShowFrictionDemo(false)}
                  className="text-[11px] text-primary font-bold hover:underline block text-center w-full"
                >
                  Reset simulation
                </button>
              </div>
            )}
          </div>
        </div>
        </TiltCard>
      </ScrollReveal>

      {/* CARD 3: Paid with the brief (Yellow / Amber tone) */}
      <ScrollReveal delay={0.3}>
        <TiltCard className={cn("relative isolate overflow-hidden rounded-3xl p-6 sm:p-7 shadow-soft-md transition-all duration-300 hover:shadow-soft-lg flex flex-col justify-between h-full min-h-[340px]", card ?? "bg-card-yellow border border-amber-300/30")}>
          {/* Ambient glow accent */}
          <span className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-soft-xs">
              <CircleDollarSign className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800">
              Pre-funded Company Vault
            </span>
          </div>

          <h3 className={cn("text-xl font-extrabold font-display tracking-tight", H)}>
            Paid with the brief
          </h3>
          <p className={cn("mt-1.5 text-xs sm:text-sm font-medium leading-relaxed", B)}>
            The exact agreed amount is secured before you decide to accept. Zero hidden deductions.
          </p>
        </div>

        {/* Interactive Payout Breakdown */}
        <div className="mt-5 pt-4 border-t border-amber-300/20 space-y-2.5">
          <div className={cn("p-3.5 rounded-2xl shadow-soft-xs space-y-2", panel ?? "bg-surface/90 border border-amber-300/30")}>
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-medium", B)}>Secured Before Start:</span>
              <span className={cn("font-extrabold font-display", H)}>₹{payoutAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-medium", B)}>Platform Fee From You:</span>
              <span className="font-bold text-success-ink">₹0.00 (Zero cut)</span>
            </div>
            <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between text-xs font-bold">
              <span className={H}>Direct Deposit Release:</span>
              <span className="text-amber-700 text-sm font-extrabold font-display">
                ₹{payoutAmount.toLocaleString()}
              </span>
            </div>

            {/* Quick amount toggle pills */}
            <div className="pt-1 flex items-center justify-between gap-1 text-[11px]">
              <span className={cn("font-medium", M)}>Test value:</span>
              <div className="flex gap-1.5">
                {[4200, 14000, 28000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPayoutAmount(amt)}
                    className={cn(
                      "px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors",
                      payoutAmount === amt
                        ? "bg-amber-600 text-white"
                        : dark
                          ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                          : "bg-surface border border-line-card text-ink-2 hover:bg-hover"
                    )}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </TiltCard>
      </ScrollReveal>
    </div>
  );
}
