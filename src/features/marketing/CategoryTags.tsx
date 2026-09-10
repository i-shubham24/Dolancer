import { cn } from "@/lib/cn";
import { CATEGORIES } from "./content";

/**
 * Disciplines drawn as luggage tags rather than boxes.
 *
 * A grid of bordered rectangles with a title and a line of text says nothing about
 * what it holds. A tag does: it is a thing you attach to something, which is exactly
 * what picking a discipline is. The punched hole and the colour band down the spine
 * carry that without a word of explanation.
 *
 * They sit at slight alternating angles, as though dropped rather than aligned, and
 * straighten when you reach for one.
 */

const BANDS = [
  "bg-coral",
  "bg-blue",
  "bg-lime",
  "bg-purple",
  "bg-warning-dot",
  "bg-success-dot",
  "bg-info-dot",
  "bg-danger-dot",
];

const TILTS = ["-rotate-[1.2deg]", "rotate-[0.9deg]", "-rotate-[0.5deg]", "rotate-[1.5deg]"];

export function CategoryTags() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CATEGORIES.map((category, index) => (
        <li key={category.name}>
          <div
            className={cn(
              "group relative flex h-full overflow-hidden rounded-2xl border-2 border-ink bg-surface",
              "shadow-offset-sm transition-all duration-[220ms] ease-spring",
              "hover:rotate-0 hover:-translate-y-1.5 hover:shadow-offset-lg",
              TILTS[index % TILTS.length],
            )}
          >
            {/* The spine. Widens on hover, so the card responds as one object. */}
            <span
              aria-hidden="true"
              className={cn(
                "w-3 shrink-0 border-r-2 border-ink transition-all duration-[220ms] group-hover:w-5",
                BANDS[index % BANDS.length],
              )}
            />

            <div className="relative min-w-0 flex-1 py-5 pl-6 pr-5">
              {/* The punched hole, as on a tag that gets tied to something. */}
              <span
                aria-hidden="true"
                className="absolute left-2.5 top-6 h-2.5 w-2.5 rounded-full border-[1.5px] border-ink bg-canvas"
              />

              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-extrabold leading-tight tracking-[-0.01em]">
                  {category.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-xs font-extrabold text-ink/20"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-2">{category.blurb}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
