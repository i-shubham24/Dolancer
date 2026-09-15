import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Star,
  Clock,
  Zap,
  Palette,
  Globe,
  PenTool,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  MousePointerClick,
} from "lucide-react";

interface BriefCardData {
  id: string;
  title: string;
  discipline: string;
  subdiscipline: string;
  payout: string;
  deadline: string;
  tag: string;
  tagType: "urgent" | "verified" | "featured";
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  criteria: string[];
}

const CARDS: BriefCardData[] = [
  {
    id: "card-1",
    title: "Logo, Branding & Vector Assets",
    discipline: "Graphic Design",
    subdiscipline: "Logo, Websites, Branding & Infographics",
    payout: "₹2,800",
    deadline: "36 hrs left",
    tag: "High Demand",
    tagType: "featured",
    icon: Palette,
    iconBg: "bg-coral-light",
    iconColor: "text-coral",
    criteria: ["Vector files included", "Pre-funded", "Supervisor review"],
  },
  {
    id: "card-2",
    title: "Website Design & Shopify Store",
    discipline: "Web Development",
    subdiscipline: "Programming, WordPress & Shopify",
    payout: "₹4,200",
    deadline: "48 hrs left",
    tag: "Verified Brief",
    tagType: "verified",
    icon: Globe,
    iconBg: "bg-blue-light",
    iconColor: "text-blue",
    criteria: ["Responsive mobile layout", "Pay locked", "Direct release"],
  },
  {
    id: "card-3",
    title: "Sales Copy & Product Listings",
    discipline: "Copywriting",
    subdiscipline: "Sales Copy, Funnels & Product Listings",
    payout: "₹2,500",
    deadline: "24 hrs left",
    tag: "Urgent Brief",
    tagType: "urgent",
    icon: PenTool,
    iconBg: "bg-success-bg",
    iconColor: "text-success-ink",
    criteria: ["Benefit bullet points", "SEO keyword targets", "100% upfront pay"],
  },
];

export function HeroCardStack() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CARDS.length);
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-2 sm:p-6 min-h-[490px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dashed Orbital Aesthetic Rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg
          className="h-[360px] w-[360px] sm:h-[450px] sm:w-[450px] text-coral/20 animate-pulse"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="49"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      {/* Floating 4.9 Star Rating Top Badge */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: -16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="absolute top-1 left-2 sm:top-2 sm:left-4 z-30 flex items-center gap-1.5 rounded-full border border-line-card bg-surface/90 px-3.5 py-1.5 text-xs font-bold text-ink shadow-soft-md backdrop-blur-md"
      >
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
        <span>4.9 Rated by Doers</span>
      </motion.div>

      {/* Floating "Click to flip cards" indicator */}
      <motion.button
        type="button"
        onClick={handleNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="absolute top-1 right-2 sm:top-2 sm:right-4 z-30 flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral-light px-3 py-1 text-xs font-bold text-coral shadow-soft-sm hover:bg-coral hover:text-inverse transition-colors"
      >
        <MousePointerClick className="h-3.5 w-3.5" />
        <span>Flip brief ({activeIndex + 1}/{CARDS.length})</span>
      </motion.button>

      {/* Interactive Overlaying Cards Deck */}
      <div className="relative w-full max-w-[390px] h-[350px] z-10 mt-6">
        {CARDS.map((card, i) => {
          // Compute position in stack relative to activeIndex
          const offset = (i - activeIndex + CARDS.length) % CARDS.length;
          const isTop = offset === 0;
          const isSecond = offset === 1;

          // Compute 3D stacked translations
          const zIndex = isTop ? 20 : isSecond ? 10 : 5;
          const translateY = isTop ? (isHovered ? -8 : 0) : isSecond ? (isHovered ? 26 : 16) : (isHovered ? 52 : 32);
          const translateX = isTop ? 0 : isSecond ? (isHovered ? 22 : 14) : (isHovered ? 44 : 26);
          const rotate = isTop ? (isHovered ? -1.5 : 0) : isSecond ? (isHovered ? 4 : 2.5) : (isHovered ? 7 : 4.5);
          const scale = isTop ? 1 : isSecond ? 0.96 : 0.92;
          const opacity = isTop ? 1 : isSecond ? 0.85 : 0.65;

          const IconComponent = card.icon;

          return (
            <motion.div
              key={card.id}
              onClick={() => handleSelect(i)}
              animate={
                reduceMotion
                  ? { opacity: isTop ? 1 : 0 }
                  : {
                      x: translateX,
                      y: translateY,
                      rotate: rotate,
                      scale: scale,
                      opacity: opacity,
                      zIndex: zIndex,
                    }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 rounded-[2.2rem] border p-6 sm:p-7 shadow-soft-lg cursor-pointer backdrop-blur-md transition-colors ${
                isTop
                  ? "border-line-card bg-surface hover:border-coral/50"
                  : "border-line-card/70 bg-surface/90 hover:bg-surface"
              }`}
            >
              {/* Card Header: Icon + Badge + Payout */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} font-bold shadow-soft-sm border border-line-card/30`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
                        card.tagType === "urgent"
                          ? "border-warning-dot/40 bg-warning-bg text-warning-ink"
                          : card.tagType === "featured"
                          ? "border-coral/30 bg-coral-light text-coral"
                          : "border-success-ink/30 bg-success-bg text-success-ink"
                      }`}
                    >
                      {card.tagType === "urgent" && <Zap className="h-2.5 w-2.5 fill-current" />}
                      {card.tagType === "featured" && <Sparkles className="h-2.5 w-2.5" />}
                      {card.tagType === "verified" && <ShieldCheck className="h-2.5 w-2.5" />}
                      {card.tag}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block">
                    Fixed Pay
                  </span>
                  <span className="text-2xl font-extrabold text-coral tracking-tight font-display">
                    {card.payout}
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <h3 className="text-lg sm:text-xl font-extrabold tracking-[-0.03em] text-ink font-display leading-tight line-clamp-1">
                {card.title}
              </h3>
              <p className="text-xs font-semibold text-ink-muted mt-1 mb-4">
                {card.discipline} · <span className="text-ink-2">{card.subdiscipline}</span>
              </p>

              {/* Criteria Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {card.criteria.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-0.5 text-[11px] font-bold text-ink-2"
                  >
                    <CheckCircle2 className="h-3 w-3 text-success-dot" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Card Footer: Deadline + Interactive Flip Hint */}
              <div className="flex items-center justify-between pt-3.5 border-t border-line-card/70 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-ink-2">
                  <Clock className="h-3.5 w-3.5 text-ink-muted" />
                  <span>{card.deadline}</span>
                </div>

                <span className="inline-flex items-center gap-1 text-coral font-bold group-hover:underline">
                  <span>{isTop ? "Claim brief" : "Bring to front"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Avg. Monthly Payout Badge (Bottom) */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileHover={{ scale: 1.03, y: -2 }}
        className="relative sm:absolute -bottom-4 right-0 sm:bottom-0 sm:right-0 z-30 mt-4 sm:mt-0 flex items-center gap-3 rounded-2xl border border-line-card bg-surface/95 px-4 py-2.5 shadow-soft-lg backdrop-blur-md"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime font-extrabold text-sm text-ink shadow-soft-sm">
          ₹
        </span>
        <div>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block leading-tight">
            Avg. monthly payout
          </span>
          <span className="text-base font-extrabold tracking-tight text-ink font-display">
            ₹118,400<span className="text-xs font-bold text-ink-muted">/mo</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
