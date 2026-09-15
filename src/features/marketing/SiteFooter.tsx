import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { CONTACT } from "./content";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-slate-300">
      {/* Seamless Curvy Upper Border Crest Transition from Canvas */}
      <div className="relative w-full overflow-hidden leading-none select-none pointer-events-none bg-canvas -mb-px">
        <svg
          viewBox="0 0 1440 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-10 sm:h-16 md:h-20 lg:h-24 block"
          preserveAspectRatio="none"
        >
          {/* Footer dark body rising smoothly into canvas */}
          <path
            d="M0 56C360 12 1080 12 1440 56V76H0V56Z"
            fill="#0b0f19"
          />
          {/* Crisp structural border line replacing the straight top edge */}
          <path
            d="M0 56C360 12 1080 12 1440 56"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Luminous multi-stop glowing crest border replacing straight border line */}
          <path
            d="M0 56C360 12 1080 12 1440 56"
            stroke="url(#footer-crest-glow)"
            strokeWidth="3"
            className="opacity-90"
          />
          <defs>
            <linearGradient id="footer-crest-glow" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="0.25" stopColor="#8b5cf6" stopOpacity="0.85" />
              <stop offset="0.5" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="0.75" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Centerpiece Guarantee Badge on the Curved Crest */}
        <div className="absolute left-1/2 bottom-2 sm:bottom-4 md:bottom-6 -translate-x-1/2 z-20 hidden sm:inline-flex items-center gap-2.5 rounded-full border border-slate-700/80 bg-[#111827]/95 px-4.5 py-1.5 text-xs font-semibold text-slate-200 shadow-2xl backdrop-blur-md select-none pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wide">Pre-funded Briefs · Dedicated Supervisor Shield · Instant Direct Release</span>
        </div>
      </div>

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
    </footer>
  );
}
