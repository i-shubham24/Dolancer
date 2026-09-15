import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";

export function AboutComparison() {
  const points = [
    {
      bad: "Writing dozens of unpaid proposals",
      good: "Pre-funded briefs waiting on your board",
    },
    {
      bad: "Race-to-the-bottom bidding wars",
      good: "Payouts guaranteed and agreed upfront",
    },
    {
      bad: "Absorbing client friction & scope creep",
      good: "Dedicated supervisor manages the client",
    },
    {
      bad: "Chasing unpaid invoices for 60 days",
      good: "Instant direct bank deposit upon sign-off",
    },
  ];

  return (
    <section className="fresh-section py-16 bg-surface">
      <div className="fresh-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <StitchBadge>The Difference</StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-display text-ink tracking-tight">
            A structurally better way to work
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-2 font-medium">
            We removed the operational overhead so you can focus 100% on the craft.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="hidden sm:grid grid-cols-2 gap-6 mb-4 px-6">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-muted">Traditional Platforms</div>
            <div className="text-xs font-bold uppercase tracking-widest text-coral">The Dolancer Way</div>
          </div>
          
          <div className="space-y-4">
            {points.map((point, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-stretch gap-4">
                {/* Traditional Side */}
                <div className="flex-1 rounded-2xl border border-line-card bg-surface-2 p-5 flex items-center gap-4 opacity-75 grayscale-[50%]">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <p className="text-sm font-semibold text-ink-2 line-through decoration-red-500/30">{point.bad}</p>
                </div>
                
                {/* Arrow Connector (Hidden on Mobile) */}
                <div className="hidden sm:flex items-center justify-center shrink-0">
                  <ArrowRight className="h-5 w-5 text-ink-muted/50" />
                </div>
                
                {/* Dolancer Side */}
                <div className="flex-1 rounded-2xl border border-coral/20 bg-coral/5 p-5 flex items-center gap-4 shadow-soft-xs">
                  <div className="h-8 w-8 rounded-full bg-coral/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-coral" />
                  </div>
                  <p className="text-sm font-extrabold text-ink">{point.good}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
