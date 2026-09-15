import { cn } from "@/lib/cn";

interface CurvedSectionDividerProps {
  /** Variant of the curve */
  variant?: "wave" | "smooth-arch" | "gentle-curve" | "organic-crest" | "sculpted-dip";
  /** Position relative to section */
  position?: "top" | "bottom";
  /** Fill color of the curve itself (matches the adjacent section) */
  fillColor?: string;
  /** Optional stroke/border glow accent */
  showAccentGlow?: boolean;
  /** Show the crisp replacing border line along the curve (default true) */
  showBorderLine?: boolean;
  /** Custom stroke color class for the replacing border line */
  borderStrokeClass?: string;
  className?: string;
}

export function CurvedSectionDivider({
  variant = "gentle-curve",
  position = "bottom",
  fillColor = "fill-canvas",
  showAccentGlow = true,
  showBorderLine = true,
  borderStrokeClass = "text-line-card",
  className,
}: CurvedSectionDividerProps) {
  const isTop = position === "top";

  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-none select-none pointer-events-none z-10 block",
        isTop ? "-top-px" : "-bottom-px",
        className
      )}
      aria-hidden="true"
    >
      {variant === "wave" && (
        <svg
          viewBox="0 0 1440 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("w-full h-8 sm:h-12 md:h-16 lg:h-20 block", isTop && "rotate-180")}
          preserveAspectRatio="none"
        >
          {/* Fill shape beneath wave */}
          <path
            d="M0 48C240 16 480 72 720 44C960 16 1200 68 1440 40V84H0V48Z"
            className={fillColor}
          />
          {/* Crisp structural border replacing the straight line */}
          {showBorderLine && (
            <path
              d="M0 48C240 16 480 72 720 44C960 16 1200 68 1440 40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={cn("opacity-70", borderStrokeClass)}
            />
          )}
          {/* Subtle multi-tone glow along the curve */}
          {showAccentGlow && (
            <path
              d="M0 48C240 16 480 72 720 44C960 16 1200 68 1440 40"
              stroke="url(#wave-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-45"
            />
          )}
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {variant === "smooth-arch" && (
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("w-full h-6 sm:h-10 md:h-14 block", isTop && "rotate-180")}
          preserveAspectRatio="none"
        >
          {/* Fill shape beneath arch */}
          <path
            d="M0 60C420 8 1020 8 1440 60V64H0V60Z"
            className={fillColor}
          />
          {/* Crisp replacing border line */}
          {showBorderLine && (
            <path
              d="M0 60C420 8 1020 8 1440 60"
              stroke="currentColor"
              strokeWidth="1.5"
              className={cn("opacity-70", borderStrokeClass)}
            />
          )}
          {showAccentGlow && (
            <path
              d="M0 60C420 8 1020 8 1440 60"
              stroke="url(#arch-gradient)"
              strokeWidth="2.5"
              className="opacity-40"
            />
          )}
          <defs>
            <linearGradient id="arch-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" stopOpacity="0.75" />
              <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.75" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {variant === "gentle-curve" && (
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("w-full h-6 sm:h-10 md:h-12 block", isTop && "rotate-180")}
          preserveAspectRatio="none"
        >
          {/* Fill shape beneath gentle curve */}
          <path
            d="M0 46C380 14 1060 14 1440 46V56H0V46Z"
            className={fillColor}
          />
          {/* Crisp replacing border line */}
          {showBorderLine && (
            <path
              d="M0 46C380 14 1060 14 1440 46"
              stroke="currentColor"
              strokeWidth="1.5"
              className={cn("opacity-70", borderStrokeClass)}
            />
          )}
          {showAccentGlow && (
            <path
              d="M0 46C380 14 1060 14 1440 46"
              stroke="url(#curve-gradient)"
              strokeWidth="2.5"
              className="opacity-35"
            />
          )}
          <defs>
            <linearGradient id="curve-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="1" stopColor="#ec4899" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {variant === "organic-crest" && (
        <svg
          viewBox="0 0 1440 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("w-full h-8 sm:h-12 md:h-16 block", isTop && "rotate-180")}
          preserveAspectRatio="none"
        >
          {/* Fill shape beneath organic crest */}
          <path
            d="M0 32C320 60 540 10 720 36C900 62 1120 12 1440 32V72H0V32Z"
            className={fillColor}
          />
          {/* Crisp replacing border line */}
          {showBorderLine && (
            <path
              d="M0 32C320 60 540 10 720 36C900 62 1120 12 1440 32"
              stroke="currentColor"
              strokeWidth="1.5"
              className={cn("opacity-70", borderStrokeClass)}
            />
          )}
          {showAccentGlow && (
            <path
              d="M0 32C320 60 540 10 720 36C900 62 1120 12 1440 32"
              stroke="url(#crest-gradient)"
              strokeWidth="2.5"
              className="opacity-45"
            />
          )}
          <defs>
            <linearGradient id="crest-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#f97316" stopOpacity="0.7" />
              <stop offset="1" stopColor="#6366f1" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {variant === "sculpted-dip" && (
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("w-full h-6 sm:h-10 md:h-14 block", isTop && "rotate-180")}
          preserveAspectRatio="none"
        >
          {/* Fill shape beneath sculpted dip */}
          <path
            d="M0 10C420 54 1020 54 1440 10V60H0V10Z"
            className={fillColor}
          />
          {/* Crisp replacing border line */}
          {showBorderLine && (
            <path
              d="M0 10C420 54 1020 54 1440 10"
              stroke="currentColor"
              strokeWidth="1.5"
              className={cn("opacity-70", borderStrokeClass)}
            />
          )}
          {showAccentGlow && (
            <path
              d="M0 10C420 54 1020 54 1440 10"
              stroke="url(#dip-gradient)"
              strokeWidth="2.5"
              className="opacity-40"
            />
          )}
          <defs>
            <linearGradient id="dip-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#f97316" stopOpacity="0.7" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
