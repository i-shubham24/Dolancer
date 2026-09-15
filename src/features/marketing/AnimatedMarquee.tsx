import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Palette,
  Globe,
  PenTool,
  Megaphone,
  ShoppingBag,
  Headphones,
  Code2,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";

interface Discipline {
  id: string;
  name: string;
  category: "design" | "web" | "writing" | "marketing" | "ecom" | "support";
  icon: typeof Palette;
  briefsCount: number;
  avgPay: string;
  sampleBrief: {
    title: string;
    deadline: string;
    pay: string;
    supervisor: string;
    requirements: string[];
  };
}

const DISCIPLINES: Discipline[] = [
  {
    id: "graphic-design",
    name: "Graphic Design & Branding",
    category: "design",
    icon: Palette,
    briefsCount: 48,
    avgPay: "₹2,600",
    sampleBrief: {
      title: "Logo, Branding Identity & Social Assets Package",
      deadline: "2 Days",
      pay: "₹2,800",
      supervisor: "R. Kapoor · Design QA Lead",
      requirements: [
        "Logo Variations & Vector Files (.AI, .SVG, .PNG)",
        "Brand Color Palette & Typography Sheet",
        "3 Ready-to-Post Social Media Templates",
      ],
    },
  },
  {
    id: "web-development",
    name: "Web Dev (WordPress & Shopify)",
    category: "web",
    icon: Globe,
    briefsCount: 52,
    avgPay: "₹4,200",
    sampleBrief: {
      title: "Website Design, WordPress Setup & Shopify Customization",
      deadline: "3 Days",
      pay: "₹4,600",
      supervisor: "A. Verma · Web Lead",
      requirements: [
        "Responsive Homepage & Product Catalog Setup",
        "Mobile Layout & Speed Optimization",
        "Contact Form & Payment Gateway Verification",
      ],
    },
  },
  {
    id: "copywriting",
    name: "Copywriting & Product Listings",
    category: "writing",
    icon: PenTool,
    briefsCount: 39,
    avgPay: "₹2,200",
    sampleBrief: {
      title: "High-Converting Sales Copy & Product Listings",
      deadline: "24 Hours",
      pay: "₹2,500",
      supervisor: "S. Pillai · Content QA",
      requirements: [
        "Sales Funnel Landing Page Copy",
        "Benefit-Driven Bullet Points & Features",
        "SEO Keyword Integration with Meta Descriptions",
      ],
    },
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing & SEO",
    category: "marketing",
    icon: Megaphone,
    briefsCount: 36,
    avgPay: "₹3,100",
    sampleBrief: {
      title: "Social Media Management, SEO & Email Campaign",
      deadline: "3 Days",
      pay: "₹3,400",
      supervisor: "M. Fernandes · Marketing Lead",
      requirements: [
        "15 Scheduled Social Posts with Captions & Hashtags",
        "On-Page SEO Audit & Keyword Target List",
        "Welcome Email Drip Sequence Draft",
      ],
    },
  },
  {
    id: "amazon-ecom",
    name: "Amazon & E-Commerce",
    category: "ecom",
    icon: ShoppingBag,
    briefsCount: 31,
    avgPay: "₹2,700",
    sampleBrief: {
      title: "Amazon Product Listing, Sourcing & PPC Optimization",
      deadline: "2 Days",
      pay: "₹3,000",
      supervisor: "K. Bansal · E-Com QA",
      requirements: [
        "Backend Search Terms & Indexing Strategy",
        "A+ Enhanced Content Module Layouts",
        "PPC Negative Keyword Screening Table",
      ],
    },
  },
  {
    id: "customer-service",
    name: "Customer Service & Support",
    category: "support",
    icon: Headphones,
    briefsCount: 44,
    avgPay: "₹2,000",
    sampleBrief: {
      title: "Live Chat, Support Tickets & User Onboarding",
      deadline: "Daily Shifts",
      pay: "₹2,200",
      supervisor: "T. Joseph · Operations Lead",
      requirements: [
        "Zendesk / Freshdesk Ticket Queue Resolution",
        "Live Chat Average Response Time < 2 mins",
        "Daily Resolution & Feedback Summary Log",
      ],
    },
  },
  {
    id: "programming-scripts",
    name: "Programming & Scripts",
    category: "web",
    icon: Code2,
    briefsCount: 29,
    avgPay: "₹4,600",
    sampleBrief: {
      title: "Python Webhook Script & REST API Integration",
      deadline: "48 Hours",
      pay: "₹5,000",
      supervisor: "V. Sengupta · Tech Lead",
      requirements: [
        "Clean, Documented Code with Error Handling",
        "Secure Environment Config & API Keys Handling",
        "Step-by-Step Setup Guide",
      ],
    },
  },
  {
    id: "research-analysis",
    name: "Market Research & Analysis",
    category: "writing",
    icon: FileText,
    briefsCount: 26,
    avgPay: "₹3,400",
    sampleBrief: {
      title: "Competitor Benchmarking & Pricing Model Analysis",
      deadline: "3 Days",
      pay: "₹3,800",
      supervisor: "Dr. P. Nair · Research Lead",
      requirements: [
        "Competitive Feature & Pricing Matrix",
        "Executive Summary with Growth Highlights",
        "Structured 10-Slide Deck in PPTX",
      ],
    },
  },
];

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "design", label: "Graphic Design" },
  { id: "web", label: "Web Dev & IT" },
  { id: "writing", label: "Copywriting" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "ecom", label: "Amazon & E-Com" },
  { id: "support", label: "Customer Service" },
] as const;

export function AnimatedMarquee() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>("graphic-design");

  const filteredDisciplines = DISCIPLINES.filter(
    (d) => activeCategory === "all" || d.category === activeCategory
  );

  const activeDiscipline: Discipline =
    DISCIPLINES.find((d) => d.id === selectedId) ?? DISCIPLINES[0]!;

  return (
    <section id="disciplines" className="fresh-section py-18">
      <div className="fresh-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Disciplines & Live Briefs
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em] font-display">
            Every subject. <span className="fresh-highlight fresh-underline fresh-underline-lilac">Your expertise.</span>
          </h2>
          <p className="mt-3 text-base text-ink-2 font-medium">
            Only briefs strictly aligned to your verified degree and skills land on your board. Click any discipline below to preview real matching tasks.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-ink text-inverse shadow-soft-sm scale-[1.02]"
                    : "bg-surface border border-line-card text-ink-2 hover:border-coral/40 hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Two-Column Showcase: Redesigned Interactive Pills on Left, Live Brief Inspector on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Redesigned Pills Grid (Col 1-7) */}
          <div className="lg:col-span-7 flex flex-wrap gap-2.5 sm:gap-3">
            {filteredDisciplines.map((d) => {
              const Icon = d.icon;
              const isSelected = d.id === activeDiscipline.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedId(d.id)}
                  className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-coral bg-coral-light/30 shadow-soft-md ring-2 ring-coral/20 -translate-y-0.5"
                      : "border-line-card bg-surface hover:border-coral/40 hover:shadow-soft-xs hover:-translate-y-0.5"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-coral text-white"
                        : "bg-subtle text-ink-2 group-hover:bg-coral-light group-hover:text-coral"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-extrabold text-ink leading-tight">
                      {d.name}
                    </span>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-ink-muted">
                      <span className="text-coral font-bold">{d.briefsCount} open briefs</span>
                      <span>·</span>
                      <span>Avg. {d.avgPay}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-coral animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Live Matching Brief Inspector Card (Col 8-12) */}
          <div className="lg:col-span-5 sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDiscipline.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[2rem] border border-line-card bg-surface p-6 sm:p-7 shadow-soft-md relative overflow-hidden"
              >
                {/* Top Badge & Upfront Pay Header */}
                <div className="flex items-center justify-between pb-4 border-b border-line-card mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-light px-3 py-1 text-xs font-bold text-coral">
                      <Sparkles className="h-3 w-3" />
                      Live Verified Brief
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-success-ink bg-success-bg px-2.5 py-1 rounded-full">
                      <ShieldCheck className="h-3 w-3" /> Pay Protected
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-ink-muted block">Fixed Pay</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-coral font-display">
                      {activeDiscipline.sampleBrief.pay}
                    </span>
                  </div>
                </div>

                {/* Brief Title */}
                <h4 className="text-base sm:text-lg font-extrabold text-ink leading-snug mb-3">
                  {activeDiscipline.sampleBrief.title}
                </h4>

                {/* Timeline & Supervisor Row */}
                <div className="rounded-xl bg-surface-2 p-3 border border-line-card/60 space-y-2 mb-4 text-xs font-medium text-ink-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      <Clock className="h-3.5 w-3.5 text-coral" /> Turnaround:
                    </span>
                    <span className="font-bold text-ink">{activeDiscipline.sampleBrief.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue" /> QA Support:
                    </span>
                    <span className="font-bold text-ink">{activeDiscipline.sampleBrief.supervisor}</span>
                  </div>
                </div>

                {/* Deliverables checklist */}
                <div className="mb-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted block mb-2 font-display">
                    Deliverables Expected
                  </span>
                  <div className="space-y-1.5">
                    {activeDiscipline.sampleBrief.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-xs font-semibold text-ink-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-coral shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action on Brief Card */}
                <div className="pt-2 border-t border-line-card flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-medium">
                    {activeDiscipline.briefsCount} similar briefs available
                  </span>
                  <Link
                    to="/pool"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-xs font-extrabold text-inverse hover:bg-ink/90 transition-colors shadow-soft-xs"
                  >
                    <span>Claim on Board</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
