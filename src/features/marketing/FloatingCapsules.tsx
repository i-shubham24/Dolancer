import { Wallet, Link2, Check, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Capsules orbiting the hero.
 *
 * The sibling app floats pills with people's names and faces on them. We show
 * product states instead, and that is a deliberate difference rather than a
 * shortcut: naming invented doers, or putting stock photos of strangers on a page
 * that promises real people get paid, would be exactly the kind of fabrication this
 * site cannot afford. These say true things about the product.
 *
 * Each capsule bobs on its own delay so the group never moves in lockstep, which is
 * what makes a float read as physical rather than as an animation. The whole thing
 * is decorative, so it is hidden from assistive tech: the same facts are in the
 * copy beside it.
 */

interface Capsule {
  icon: typeof Wallet;
  label: string;
  tone: string;
  /** Position within the canvas, and how long the bob takes. */
  style: React.CSSProperties;
  delay: string;
}

const CAPSULES: Capsule[] = [
  {
    icon: Check,
    label: "Approved",
    tone: "bg-success-bg text-success-ink",
    style: { top: "4%", left: "6%" },
    delay: "0s",
  },
  {
    icon: Wallet,
    label: "Payout released",
    tone: "bg-lime text-ink",
    style: { top: "26%", right: "2%" },
    delay: "1.1s",
  },
  {
    icon: Clock,
    label: "In progress",
    tone: "bg-warning-bg text-warning-ink",
    style: { top: "50%", left: "0%" },
    delay: "2.2s",
  },
  {
    icon: Link2,
    label: "Link needed",
    tone: "bg-danger-bg text-danger-ink",
    style: { bottom: "12%", right: "12%" },
    delay: "0.6s",
  },
  {
    icon: Layers,
    label: "2 of 3 slots",
    tone: "bg-surface text-ink",
    style: { bottom: "0%", left: "18%" },
    delay: "1.7s",
  },
];

export function FloatingCapsules() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative hidden h-[24rem] w-full lg:block"
    >
      {/* The disc they orbit. */}
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rotate-6 rounded-full border-2 border-ink bg-blue" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-[46%] -translate-y-[54%] rounded-full border-2 border-ink bg-purple/20" />

      {CAPSULES.map((capsule) => (
        <span
          key={capsule.label}
          style={{ ...capsule.style, animationDelay: capsule.delay }}
          className={cn(
            "float-bob absolute inline-flex items-center gap-2 rounded-full border-2 border-ink px-3.5 py-2",
            "text-xs font-extrabold whitespace-nowrap shadow-offset-sm",
            capsule.tone,
          )}
        >
          <capsule.icon className="h-3.5 w-3.5 shrink-0" />
          {capsule.label}
        </span>
      ))}
    </div>
  );
}
