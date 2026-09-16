import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Search, CheckCircle2, Wallet, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";

export function HowItWorksSteps() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);


  return (
    <section id="how-it-works" className="fresh-section py-20 overflow-hidden">
      <div ref={containerRef} className="fresh-container relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Simple & Transparent
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em]">
            How Dolancers <span className="fresh-highlight fresh-underline fresh-underline-pink">earn.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 font-medium">
            Three clear work steps after setup, from an assigned offer to an approval-based payout. No bidding wars, no unpaid invoices.
          </p>
        </div>

        
        {/* Animated Connected SVG Line */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-48 bottom-48 w-1 z-0" aria-hidden="true">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 4 100" fill="none">
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="var(--color-line-card)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.line
              x1="2"
              y1="0"
              x2="2"
              y2="100"
              stroke="var(--color-coral)"
              strokeWidth="4"
              style={{ pathLength: reduceMotion ? 1 : pathLength }}
            />
          </svg>
        </div>

        {/* 3 Step Showcase */}
        <div className="space-y-16 sm:space-y-24 relative z-10">

          {/* STEP 01 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Copy side */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-blue border border-line-card/40">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-ink-muted font-display block">
                    STEP 01
                  </span>
                    <span className="text-[11px] font-bold text-coral">Assigned offer</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-[-0.03em] font-display">
                Receive a project offer
              </h3>
              <p className="text-ink-2 text-base leading-relaxed font-medium">
                A supervisor routes a specific project to you when the scope fits your verified disciplines. The offer shows the agreed payout, deadline and workspace before you accept it.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-coral hover:underline">
                  <span>Manually routed by a supervisor</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Visual Card 01 - Text at most 80%, dedicated 20% for number */}
            <div className="relative rounded-3xl border border-line-card bg-surface p-6 sm:p-7 shadow-soft-sm overflow-hidden flex items-center justify-between min-h-[250px]">
              {/* Text content restricted to at most 80% */}
              <div className="w-[78%] sm:w-[80%] max-w-[80%] space-y-3.5 relative z-10 pr-3 sm:pr-5">
                <div className="pb-3 border-b border-line-card/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                      Graphic Design · Branding
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-coral font-display">₹2,400</span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-ink leading-tight">
                    Logo, Websites & Branding Suite
                  </p>
                  <p className="text-xs text-ink-muted mt-1 font-medium">
                    Due in 2 days · Supervisor allocated
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coral">
                      Web Dev · Shopify & WP
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-coral font-display">₹3,800</span>
                  </div>
                  <p className="text-sm sm:text-base font-extrabold text-ink leading-tight">
                    Website Design & Responsive Setup
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-extrabold text-success-ink">
                      <Check className="h-3 w-3" /> Ready to review
                    </span>
                    <span className="text-xs text-ink-muted font-medium">Verified milestone</span>
                  </div>
                </div>
              </div>

              {/* Dedicated 20% reserved exclusively for number */}
              <div className="w-[22%] sm:w-[20%] flex items-center justify-center select-none pointer-events-none shrink-0 border-l border-line-card/40 pl-2">
                <motion.span 
                  whileInView={reduceMotion ? undefined : { scale: 1.15, textShadow: "0px 0px 20px rgba(var(--color-coral-rgb), 0.5)", color: "var(--color-coral)" }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl sm:text-6xl font-extrabold font-display text-ink/15 transition-colors"
                >
                  01
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* STEP 02 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Visual Card 02 - Text at most 80%, dedicated 20% for number */}
            <div className="order-2 lg:order-1 relative rounded-3xl border border-line-card bg-surface p-6 sm:p-7 shadow-soft-sm overflow-hidden flex items-center justify-between min-h-[250px]">
              {/* Text content restricted to at most 80% */}
              <div className="w-[78%] sm:w-[80%] max-w-[80%] space-y-3.5 relative z-10 pr-3 sm:pr-5">
                <div className="flex items-center justify-between pb-3 border-b border-line-card/60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-coral" />
                    <span className="text-sm font-extrabold text-ink">Supervisor Protected</span>
                  </div>
                  <span className="rounded-full bg-warning-bg px-2.5 py-0.5 text-[10px] font-extrabold text-warning-ink border border-warning-dot/20">
                    Draft Under Review
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink-2">
                    <span>Quality Verification</span>
                    <span className="font-extrabold text-ink">95% complete</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-subtle overflow-hidden">
                    <div className="h-full w-[95%] rounded-full bg-coral" />
                  </div>
                </div>

                <div className="pt-1.5 text-xs text-ink-2 font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success-dot shrink-0" />
                  <span className="truncate">"Deliverables & guidelines verified. Forwarding to client."</span>
                </div>
              </div>

              {/* Dedicated 20% reserved exclusively for number */}
              <div className="w-[22%] sm:w-[20%] flex items-center justify-center select-none pointer-events-none shrink-0 border-l border-line-card/40 pl-2">
                <motion.span 
                  whileInView={reduceMotion ? undefined : { scale: 1.15, textShadow: "0px 0px 20px rgba(var(--color-coral-rgb), 0.5)", color: "var(--color-coral)" }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl sm:text-6xl font-extrabold font-display text-ink/15 transition-colors"
                >
                  02
                </motion.span>
              </div>
            </div>

            {/* Step 02 Copy */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-coral-light text-coral border border-line-card/40">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-ink-muted font-display block">
                    STEP 02
                  </span>
                  <span className="text-[11px] font-bold text-coral">Execution</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-[-0.03em] font-display">
                Accept & Deliver
              </h3>
              <p className="text-ink-2 text-base leading-relaxed font-medium">
                Accept the offer when the scope and deadline work for you. Your supervisor reviews drafts and handles the client side, so you do not need to identify or chase the client.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-coral hover:underline">
                  <span>Zero direct client messaging hassle</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* STEP 03 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Step 03 Copy */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-lime text-ink border border-line-card/40">
                  <Wallet className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-ink-muted font-display block">
                    STEP 03
                  </span>
                  <span className="text-[11px] font-bold text-success-ink">Settlement</span>
                </div>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-[-0.03em] font-display">
                Get Paid Fast
              </h3>
              <p className="text-ink-2 text-base leading-relaxed font-medium">
                Once the approval gate clears, the payout follows the configured release process to your registered payout account. No invoicing and no chasing.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-success-ink hover:underline">
                  <span>Payout guaranteed upfront</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Visual Card 03 - Text at most 80%, dedicated 20% for number */}
            <div className="relative rounded-3xl border border-line-card bg-surface p-6 sm:p-7 shadow-soft-sm overflow-hidden flex items-center justify-between min-h-[250px]">
              {/* Text content restricted to at most 80% */}
              <div className="w-[78%] sm:w-[80%] max-w-[80%] relative z-10 pr-3 sm:pr-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-bg text-success-ink shrink-0">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-success-ink block leading-none">
                      Payout Released
                    </span>
                    <span className="text-xs font-medium text-ink-muted">
                      Direct NEFT / UPI transfer
                    </span>
                  </div>
                </div>

                <p className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight font-display">
                  ₹18,400
                </p>
                <p className="text-xs font-medium text-ink-muted mt-0.5">
                  Sent to HDFC Bank ****4910
                </p>

                <div className="mt-3 pt-2.5 border-t border-line-card/60 flex items-center justify-between text-xs font-bold text-ink-2">
                  <span>Transaction ID</span>
                  <span className="font-mono text-ink">TXN-89412</span>
                </div>
              </div>

              {/* Dedicated 20% reserved exclusively for number */}
              <div className="w-[22%] sm:w-[20%] flex items-center justify-center select-none pointer-events-none shrink-0 border-l border-line-card/40 pl-2">
                <motion.span 
                  whileInView={reduceMotion ? undefined : { scale: 1.15, textShadow: "0px 0px 20px rgba(var(--color-coral-rgb), 0.5)", color: "var(--color-coral)" }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl sm:text-6xl font-extrabold font-display text-ink/15 transition-colors"
                >
                  03
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
