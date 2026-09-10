import { CATEGORIES } from "./content";

/**
 * A tilted scrolling band of disciplines.
 *
 * Matched to the sibling app's partner belt: a white strip with black rules top and
 * bottom, rotated slightly off true. The band is deliberately wider than the
 * viewport and pulled left, because a rotated element that is only 100% wide leaves
 * bare triangles at both ends. The parent clips the overflow.
 *
 * The track holds the list twice and slides exactly half its width, so the loop is
 * seamless. It pauses on hover and on keyboard focus, and stops entirely under
 * prefers-reduced-motion, since a permanently moving strip is genuinely unpleasant
 * for some people. The duplicate copy is hidden from assistive tech so each
 * discipline is announced once.
 */
export function Marquee() {
  const items = CATEGORIES.map((category) => category.name);

  return (
    <div className="relative overflow-x-clip py-6">
      <div className="w-[112%] -translate-x-[6%] -rotate-[1.8deg] overflow-hidden border-y-2 border-ink bg-surface py-3.5">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center"
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {items.map((name) => (
                <li key={name} className="flex items-center gap-8 pr-8">
                  <span className="whitespace-nowrap text-lg font-extrabold tracking-[-0.03em]">
                    {name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rotate-45 border-[1.5px] border-ink bg-lime"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
