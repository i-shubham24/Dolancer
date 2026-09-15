import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Sparkles,
  Pause,
  Play,
  Award,
  ArrowRight,
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";

interface ScholarReview {
  id: string;
  name: string;
  role: string;
  institution: string;
  category: "research" | "stem" | "econ" | "humanities";
  earnings: string;
  briefsCompleted: number;
  highlightPill: string;
  quote: string;
  specialties: string[];
  initials: string;
  avatarGradient: string;
  tenure: string;
}

const SCHOLAR_REVIEWS: ScholarReview[] = [
  {
    id: "priya",
    name: "Priya Mukherjee",
    role: "Doctoral Fellow, Literature",
    institution: "Jawaharlal Nehru University",
    category: "humanities",
    earnings: "₹18,500/mo",
    briefsCompleted: 34,
    highlightPill: "Strict discipline match",
    quote:
      "Briefs strictly match my specialization. Having an academic supervisor review the brief first eliminates all client anxiety.",
    specialties: ["Comparative Lit", "Thematic Coding"],
    initials: "PM",
    avatarGradient: "from-rose-500 to-coral text-white",
    tenure: "14 mos on platform",
  },
  {
    id: "ananya",
    name: "Dr. Ananya Sharma",
    role: "Postdoc Fellow, Economics",
    institution: "Delhi School of Economics",
    category: "econ",
    earnings: "₹28,400/mo",
    briefsCompleted: 52,
    highlightPill: "48h bank release",
    quote:
      "Agreed pay is transparent upfront, and funds hit my bank via NEFT within 48 hours of sign-off. Never once had to chase an invoice.",
    specialties: ["Econometrics", "Stata/R"],
    initials: "AS",
    avatarGradient: "from-indigo-600 to-purple text-white",
    tenure: "18 mos on platform",
  },
  {
    id: "rahul",
    name: "Rahul Krishnamurthy",
    role: "Quant Analyst & M.Sc",
    institution: "BITS Pilani Alumni",
    category: "stem",
    earnings: "₹22,000/mo",
    briefsCompleted: 41,
    highlightPill: "Clean datasets",
    quote:
      "Datasets are clean and expectations are strictly scoped before claiming. The supervisor shields you from scope creep.",
    specialties: ["Python", "Time Series"],
    initials: "RK",
    avatarGradient: "from-blue to-cyan-600 text-white",
    tenure: "9 mos on platform",
  },
  {
    id: "vikram",
    name: "Vikram Panicker",
    role: "Research Associate, Policy",
    institution: "Ashoka University",
    category: "econ",
    earnings: "₹19,800/mo",
    briefsCompleted: 29,
    highlightPill: "Zero bidding",
    quote:
      "No writing endless proposals or bidding against bots. Briefs arrive on your board, you claim what fits your calendar, and get paid.",
    specialties: ["Policy Models", "Surveys"],
    initials: "VP",
    avatarGradient: "from-emerald-600 to-teal-700 text-white",
    tenure: "11 mos on platform",
  },
  {
    id: "sneha",
    name: "Sneha Tathade",
    role: "Bioinformatics Scholar",
    institution: "IISc Bangalore Research Scholar",
    category: "research",
    earnings: "₹24,500/mo",
    briefsCompleted: 38,
    highlightPill: "Pay protected",
    quote:
      "Academic work is treated with genuine respect here. Every brief is protected upfront before you even open your editor.",
    specialties: ["Genomics", "Biostatistics"],
    initials: "ST",
    avatarGradient: "from-amber-500 to-orange-600 text-white",
    tenure: "12 mos on platform",
  },
  {
    id: "arjun",
    name: "Arjun Deshmukh",
    role: "Systems Architect & M.Tech",
    institution: "IIT Bombay",
    category: "stem",
    earnings: "₹31,000/mo",
    briefsCompleted: 46,
    highlightPill: "Direct payout",
    quote:
      "The platform is rock solid, the supervisor handles all client friction, and the compensation is the fairest in Indian freelance.",
    specialties: ["Distributed Systems", "Security"],
    initials: "AD",
    avatarGradient: "from-violet-600 to-pink text-white",
    tenure: "15 mos on platform",
  },
];

export function TestimonialsSection() {
  const [paused, setPaused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const reduceMotion = useReducedMotion();

  const filteredReviews = SCHOLAR_REVIEWS.filter(
    (r) => selectedFilter === "all" || r.category === selectedFilter
  );

  return (
    <section id="testimonials" className="fresh-section py-20 overflow-hidden relative">
      {/* Subtle radial ambient background light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-coral/5 blur-3xl" aria-hidden="true" />

      <div className="fresh-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Verified Specialist Outcomes
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em] font-display">
            Real Dolancers. <span className="fresh-highlight fresh-underline fresh-underline-pink">Real earnings.</span>
          </h2>
          <p className="mt-3 text-base text-ink-2 font-medium">
            Hear from verified researchers, postgrads, and technical specialists across India turning expertise into reliable monthly income.
          </p>

          {/* Interactive filter pills and animation toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Specialists" },
              { id: "econ", label: "Economics & Quant" },
              { id: "stem", label: "Tech & Algorithms" },
              { id: "research", label: "Sciences & Research" },
              { id: "humanities", label: "Humanities & Law" },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === filter.id
                    ? "bg-ink text-inverse shadow-soft-xs"
                    : "bg-surface border border-line-card text-ink-2 hover:border-coral/40"
                }`}
              >
                {filter.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-card bg-surface px-3 py-1.5 text-xs font-bold text-ink-2 hover:text-ink hover:border-coral/40 transition-colors ml-2 cursor-pointer"
              title={paused ? "Resume moving carousel" : "Pause moving carousel"}
            >
              {paused ? (
                <>
                  <Play className="h-3 w-3 text-coral fill-coral" />
                  <span>Resume Flow</span>
                </>
              ) : (
                <>
                  <Pause className="h-3 w-3 text-ink-muted" />
                  <span>Pause Flow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Automatic Moving Dual-Track / Marquee Carousel */}
        <div
          className="relative mt-8 space-y-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Row 1: Smooth Leftward Animation */}
          <div className="flex w-max overflow-hidden">
            <motion.div
              animate={reduceMotion || paused ? { x: undefined } : { x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 38,
              }}
              className="flex shrink-0 items-stretch gap-4 sm:gap-5 pr-4 sm:pr-5"
            >
              {[...filteredReviews, ...filteredReviews, ...filteredReviews].map((rev, idx) => (
                <div
                  key={`r1-${rev.id}-${idx}`}
                  className="w-[270px] sm:w-[310px] shrink-0 rounded-2xl border border-line-card bg-surface p-4 sm:p-4.5 shadow-soft-xs hover:border-coral/30 hover:shadow-soft-sm transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Top: Rating & Payout */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-line-card/60">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, sIdx) => (
                          <Star key={sIdx} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-1 text-[11px] font-bold text-ink">5.0</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-ink font-display">
                          {rev.earnings}
                        </span>
                      </div>
                    </div>

                    {/* Quote Text */}
                    <p className="text-xs sm:text-[13px] text-ink-2 font-medium leading-relaxed mb-3.5">
                      "{rev.quote}"
                    </p>
                  </div>

                  {/* Bottom: Scholar Info */}
                  <div className="pt-3 border-t border-line-card/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-extrabold text-[11px] ${rev.avatarGradient}`}
                      >
                        {rev.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-xs font-extrabold text-ink truncate">
                            {rev.name}
                          </h3>
                          <CheckCircle2 className="h-3 w-3 text-success-dot shrink-0" />
                        </div>
                        <p className="text-[10px] font-medium text-ink-muted truncate">
                          {rev.institution}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-md bg-subtle px-1.5 py-0.5 text-[10px] font-bold text-ink-muted shrink-0">
                      {rev.briefsCompleted} briefs
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom live stats banner */}
        <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-line-card bg-surface/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-soft-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-light text-blue">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-ink">
                100% Authentic Scholar Network
              </p>
              <p className="text-xs text-ink-muted font-medium">
                Every testimonial is linked to verified Aadhaar ID and completed direct payouts.
              </p>
            </div>
          </div>

          <Link
            to="/sign-up"
            className="rounded-xl bg-coral text-white font-extrabold text-xs px-4 py-2.5 hover:bg-coral-hover transition-colors shadow-soft-xs whitespace-nowrap"
          >
            Apply to Join <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
