import { cn } from "@/lib/cn";

/**
 * Outlined objects scattered around the hero.
 *
 * Flat coloured rectangles are the default move and read as filler. These are drawn
 * as objects with a described form instead: a hatched cylinder, an isometric cube
 * with one lit face, a ball resting in a curve. Everything is stroked in the same
 * near-black as the rest of the system, so they belong to it rather than sitting on
 * top of it.
 *
 * All inline SVG, so there is nothing to load, nothing to go stale, and they take
 * their colours from the theme rather than being baked into an image. Decorative,
 * so hidden from assistive tech.
 */

const STROKE = "#111111";

export function Cradle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} fill="none" aria-hidden="true">
      <path
        d="M14 14c0 30 10 50 46 50s46-20 46-50"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M30 14c0 22 6 34 30 34s30-12 30-34"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="14" r="11" fill="var(--color-purple)" stroke={STROKE} strokeWidth="3.5" />
      <circle cx="98" cy="14" r="11" fill="var(--color-blue)" stroke={STROKE} strokeWidth="3.5" />
    </svg>
  );
}

export function Cube({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 88 96" className={className} style={style} fill="none" aria-hidden="true">
      <path
        d="M44 4 82 26v44L44 92 6 70V26L44 4Z"
        fill="var(--color-surface)"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* One face catches the light. */}
      <path
        d="M44 48 82 26v44L44 92V48Z"
        fill="var(--color-lime)"
        stroke={STROKE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M6 26 44 48 82 26" stroke={STROKE} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M44 48v44" stroke={STROKE} strokeWidth="3.5" />
    </svg>
  );
}

export function Cylinder({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 130 74" className={className} style={style} fill="none" aria-hidden="true">
      <defs>
        <pattern id="doodle-hatch" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="11" stroke={STROKE} strokeWidth="2.5" />
        </pattern>
      </defs>
      <path
        d="M32 6h66a26 31 0 0 1 0 62H32a26 31 0 0 1 0-62Z"
        fill="url(#doodle-hatch)"
        stroke={STROKE}
        strokeWidth="3.5"
      />
      <ellipse cx="32" cy="37" rx="26" ry="31" fill="var(--color-coral)" stroke={STROKE} strokeWidth="3.5" />
    </svg>
  );
}

export function Squiggle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 110 34" className={className} style={style} fill="none" aria-hidden="true">
      <path
        d="M4 22c14-22 26 12 40-6s26 20 40 2"
        stroke={STROKE}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Positioned so nothing overlaps the headline column. Each bobs on its own delay,
 * because a group moving in lockstep reads as an animation rather than as objects.
 */
export function HeroDoodles({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {/* The hero keeps one quiet mark. The status capsules are already doing the
          work on the right, and every object added past that was competing with
          the headline rather than framing it. The rest live further down the page. */}
      <Squiggle className="absolute left-[1.5%] top-[26%] hidden w-20 opacity-70 xl:block" />
    </div>
  );
}
