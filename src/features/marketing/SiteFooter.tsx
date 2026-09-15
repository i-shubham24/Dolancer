import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { CONTACT } from "./content";
import { cn } from "@/lib/cn";

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
    <div aria-hidden="true" className="relative h-[72px] overflow-hidden -mb-px">
      {MOSAIC.map((tile) => (
        <span
          key={`${tile.col}-${tile.row}`}
          className={cn(
            "absolute h-9 w-9 rounded-[3px]",
            tile.solid ? "bg-[#0b0f19]" : "bg-[#0b0f19]/25"
          )}
          style={{
            left: `${tile.col * 4}%`,
            bottom: tile.row === 0 ? 36 : 0,
          }}
        />
      ))}
      <span className="absolute inset-x-0 bottom-0 h-9 bg-[#0b0f19]" />
    </div>
  );
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-slate-300">
      <Mosaic />
      {/* Main Dark Footer Content */}
      <div className="bg-[#0b0f19] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[160px] bg-gradient-to-b from-blue/15 via-purple/10 to-transparent blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10 relative z-10">
        {/* Top 3-Column Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-8">
          {/* Column 1: Brand & Email (Left) */}
          <div className="md:col-span-6 lg:col-span-6 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue text-white shadow-soft-xs font-bold text-base">
                D
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Dolancer<span className="text-[#f97316]">.</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 leading-snug">
              Skilled work, briefed properly,
              <br />
              <span className="text-[#f97316] font-semibold">paid reliably.</span>
            </p>

            <div>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/40 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{CONTACT.email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: PRODUCT */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-display">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-300">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-white transition-colors">
                  Start earning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: LEGAL */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-display">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-300">
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Grievances
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Soft Organic Divider */}
        <div className="mt-12 sm:mt-16 h-px w-full bg-gradient-to-r from-transparent via-slate-800/90 to-transparent" />

        {/* Giant Watermark Typography matching reference screenshot */}
        <div className="pt-6 sm:pt-8 select-none pointer-events-none text-left">
          <span className="text-[64px] sm:text-[110px] md:text-[148px] font-extrabold tracking-tight text-[#141d30] leading-none block font-display">
            Dolancer
          </span>
        </div>

        {/* Bottom Row */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-slate-500 font-medium">
          <p>Operated by {CONTACT.company}, {CONTACT.jurisdiction}.</p>
          <p>© {currentYear} {CONTACT.company}. Support {CONTACT.hours}.</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
