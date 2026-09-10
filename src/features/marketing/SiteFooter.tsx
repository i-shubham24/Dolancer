import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { CONTACT } from "./content";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/sign-up", label: "Start earning" },
];

const LEGAL = [
  { to: "/legal/terms", label: "Terms of service" },
  { to: "/legal/privacy", label: "Privacy policy" },
];

/**
 * A pixel matrix along the top edge, dissolving the boundary into the dark.
 *
 * The sibling app steps into its black footer through a sculpted wave. This does
 * the same job with squares, which suits a system built on hard edges better than a
 * curve would: the tiles thin out as they rise, so the block appears to assemble
 * rather than start abruptly at a rule.
 */
const MOSAIC: { col: number; row: number; solid: boolean }[] = [
  { col: 2, row: 0, solid: true },
  { col: 5, row: 0, solid: false },
  { col: 9, row: 0, solid: true },
  { col: 14, row: 0, solid: false },
  { col: 18, row: 0, solid: true },
  { col: 23, row: 0, solid: false },
  { col: 1, row: 1, solid: false },
  { col: 4, row: 1, solid: true },
  { col: 7, row: 1, solid: true },
  { col: 11, row: 1, solid: false },
  { col: 13, row: 1, solid: true },
  { col: 17, row: 1, solid: true },
  { col: 20, row: 1, solid: false },
  { col: 22, row: 1, solid: true },
  { col: 25, row: 1, solid: false },
];

function Mosaic() {
  return (
    <div aria-hidden="true" className="relative h-[72px] overflow-hidden">
      {MOSAIC.map((tile) => (
        <span
          key={`${tile.col}-${tile.row}`}
          className={cn(
            "absolute h-9 w-9 rounded-[3px]",
            tile.solid ? "bg-ink" : "bg-ink/25",
          )}
          style={{
            left: `${tile.col * 4}%`,
            bottom: tile.row === 0 ? 36 : 0,
          }}
        />
      ))}
      {/* The solid ground the tiles sit on. */}
      <span className="absolute inset-x-0 bottom-0 h-9 bg-ink" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Mosaic />

      <div className="bg-ink text-inverse">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-10 pt-12 lg:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 rotate-[-4deg] items-center justify-center rounded-xl border-2 border-white/40 bg-blue">
                  <span className="text-xl font-extrabold text-ink">D</span>
                </span>
                <span className="text-2xl font-extrabold tracking-[-0.045em]">
                  Dolancer<span className="text-coral">.</span>
                </span>
              </div>

              <p className="mt-5 max-w-xs text-lg font-extrabold leading-[1.25] tracking-[-0.03em]">
                Skilled work, briefed properly,
                <br />
                <span className="text-lime">paid reliably.</span>
              </p>

              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/5 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-white/15"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </div>

            <nav aria-label="Site">
              <h2 className="text-2xs font-extrabold uppercase tracking-[0.12em] text-white/40">
                Product
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-1.5 font-bold text-white/70 transition-colors hover:text-inverse"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h2 className="text-2xs font-extrabold uppercase tracking-[0.12em] text-white/40">
                Legal
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {LEGAL.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-1.5 font-bold text-white/70 transition-colors hover:text-inverse"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${CONTACT.grievanceEmail}`}
                    className="font-bold text-white/70 transition-colors hover:text-inverse"
                  >
                    Grievances
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* An oversized wordmark, cropped by the footer edge. */}
          <div
            aria-hidden="true"
            className="mt-14 select-none overflow-hidden border-t border-white/10 pt-6"
          >
            <span className="block text-[15vw] font-extrabold leading-[0.78] tracking-[-0.06em] text-white/[0.06] lg:text-[11rem]">
              Dolancer
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40">
            {/* Operator disclosure is required, not optional. */}
            <p>
              Operated by {CONTACT.company}, {CONTACT.jurisdiction}.
            </p>
            <p>
              &copy; {new Date().getFullYear()} {CONTACT.company}. Support {CONTACT.hours}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
