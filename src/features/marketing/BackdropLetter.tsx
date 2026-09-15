import { cn } from "@/lib/cn";

/**
 * Giant faded backdrop letter (D-O-L-A-N-C-E-R system).
 *
 * One letter per homepage zone, alternating left/right so the eye
 * travels down the page and spells DOLANCER by the footer.
 * Faded solid ink at 4-6% opacity — professional, palette-safe,
 * decorative only (aria-hidden, pointer-events-none).
 */

interface BackdropLetterProps {
  letter: string;
  position?: "left" | "right";
  className?: string;
  /** Extra nudge for zones with dense cards. */
  offsetY?: string;
}

export function BackdropLetter({ letter, position = "left", className, offsetY }: BackdropLetterProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "giant-letter",
        position === "left" ? "giant-letter-left" : "giant-letter-right",
        className,
      )}
      style={offsetY ? { top: offsetY } : undefined}
    >
      {letter}
    </span>
  );
}
