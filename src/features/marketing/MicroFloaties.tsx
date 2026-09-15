import { cn } from "@/lib/cn";

/**
 * Tiny floating micro-graphics — playful but professional.
 *
 * Minimal density: exactly 2 shapes per zone. Small (10-20px),
 * palette-token colours, slow independent bob so they read as
 * physical objects, not animation. Decorative (aria-hidden).
 *
 * Zones map to sections across the marketing pages so each area gets
 * a different pair.
 */

type ShapeKind = "sparkle" | "plus" | "ring" | "dot" | "squiggle" | "pill";

interface FloatItem {
  kind: ShapeKind;
  className: string;
  delay: string;
  duration: string;
  color: string;
}

const ZONES: Record<string, FloatItem[]> = {
  hero: [
    { kind: "sparkle", className: "left-[6%] top-[18%]", delay: "0s", duration: "6s", color: "var(--color-coral)" },
    { kind: "ring", className: "right-[8%] bottom-[14%] hidden sm:block", delay: "1.4s", duration: "7s", color: "var(--color-blue)" },
  ],
  how: [
    { kind: "plus", className: "right-[5%] top-[10%]", delay: "0.6s", duration: "6.5s", color: "var(--color-purple)" },
    { kind: "dot", className: "left-[4%] bottom-[12%] hidden sm:block", delay: "2s", duration: "5.5s", color: "var(--color-coral)" },
  ],
  features: [
    { kind: "sparkle", className: "left-[3%] top-[14%]", delay: "1s", duration: "6s", color: "var(--color-blue)" },
    { kind: "squiggle", className: "right-[4%] bottom-[10%] hidden sm:block", delay: "2.2s", duration: "7.5s", color: "var(--color-purple)" },
  ],
  numbers: [
    { kind: "ring", className: "right-[6%] top-[12%]", delay: "0.3s", duration: "6s", color: "var(--color-coral)" },
    { kind: "plus", className: "left-[5%] bottom-[14%] hidden sm:block", delay: "1.8s", duration: "7s", color: "var(--color-blue)" },
  ],
  payout: [
    { kind: "pill", className: "left-[4%] top-[16%]", delay: "0.9s", duration: "6s", color: "var(--color-purple)" },
    { kind: "dot", className: "right-[5%] bottom-[12%] hidden sm:block", delay: "2.4s", duration: "5.5s", color: "var(--color-coral)" },
  ],
  testimonials: [
    { kind: "sparkle", className: "right-[5%] top-[10%]", delay: "0.4s", duration: "6.5s", color: "var(--color-coral)" },
    { kind: "ring", className: "left-[4%] bottom-[16%] hidden sm:block", delay: "1.6s", duration: "7s", color: "var(--color-purple)" },
  ],
  cta: [
    { kind: "plus", className: "left-[6%] top-[20%]", delay: "1.2s", duration: "6s", color: "var(--color-coral)" },
    { kind: "sparkle", className: "right-[6%] bottom-[18%] hidden sm:block", delay: "0.2s", duration: "5.5s", color: "var(--color-blue)" },
  ],
  prefooter: [
    { kind: "dot", className: "right-[10%] top-[30%]", delay: "0.8s", duration: "6s", color: "var(--color-purple)" },
    { kind: "squiggle", className: "left-[8%] bottom-[20%] hidden sm:block", delay: "2s", duration: "7s", color: "var(--color-coral)" },
  ],

  // Nav pages — same grammar, one accent pair per zone.
  "hiw-hero": [
    { kind: "ring", className: "left-[5%] top-[16%]", delay: "0.5s", duration: "6.5s", color: "var(--color-blue)" },
    { kind: "sparkle", className: "right-[7%] bottom-[16%] hidden sm:block", delay: "1.8s", duration: "7s", color: "var(--color-coral)" },
  ],
  "about-hero": [
    { kind: "plus", className: "left-[5%] top-[14%]", delay: "0.2s", duration: "6s", color: "var(--color-coral)" },
    { kind: "dot", className: "right-[6%] bottom-[18%] hidden sm:block", delay: "1.6s", duration: "6.5s", color: "var(--color-purple)" },
  ],
  "about-principles": [
    { kind: "squiggle", className: "left-[4%] top-[10%]", delay: "0.9s", duration: "7s", color: "var(--color-blue)" },
    { kind: "ring", className: "right-[5%] bottom-[12%] hidden sm:block", delay: "2.1s", duration: "6s", color: "var(--color-coral)" },
  ],
  "contact-hero": [
    { kind: "sparkle", className: "left-[6%] bottom-[16%]", delay: "0.4s", duration: "6s", color: "var(--color-purple)" },
    { kind: "plus", className: "right-[6%] top-[16%] hidden sm:block", delay: "1.5s", duration: "6.5s", color: "var(--color-blue)" },
  ],
  "contact-form": [
    { kind: "dot", className: "left-[3%] top-[12%]", delay: "0.7s", duration: "5.5s", color: "var(--color-coral)" },
    { kind: "squiggle", className: "right-[4%] bottom-[10%] hidden sm:block", delay: "2.3s", duration: "7s", color: "var(--color-purple)" },
  ],
};

function Shape({ kind, color }: { kind: ShapeKind; color: string }) {
  switch (kind) {
    case "sparkle":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 0c.7 4.5 2.5 6.3 7 7-4.5.7-6.3 2.5-7 7-.7-4.5-2.5-6.3-7-7 4.5-.7 6.3-2.5 7-7Z" fill={color} opacity="0.75" />
        </svg>
      );
    case "plus":
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v12M1 7h12" stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case "ring":
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6.5" stroke={color} strokeWidth="2.4" opacity="0.65" />
        </svg>
      );
    case "dot":
      return <span aria-hidden="true" className="block h-2.5 w-2.5 rounded-full" style={{ background: color, opacity: 0.7 }} />;
    case "squiggle":
      return (
        <svg width="34" height="12" viewBox="0 0 34 12" fill="none" aria-hidden="true">
          <path d="M2 8c4-7 7 4 11-1s7 5 11 1 5-2 8-1" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "pill":
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1 rounded-full border border-line-card bg-surface/90 px-2.5 py-1 text-[10px] font-extrabold text-ink shadow-soft-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />✓ paid
        </span>
      );
  }
}

export function MicroFloaties({ zone, className }: { zone: keyof typeof ZONES; className?: string }) {
  const items = ZONES[zone];
  if (!items) return null;
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 z-[1]", className)}>
      {items.map((item, i) => (
        <span
          key={`${zone}-${i}`}
          className={cn("micro-float absolute", item.className)}
          style={{ animationDelay: item.delay, animationDuration: item.duration }}
        >
          <Shape kind={item.kind} color={item.color} />
        </span>
      ))}
    </div>
  );
}
