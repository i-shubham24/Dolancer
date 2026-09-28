import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Mail, 
  ShieldCheck, 
  Lock, 
  Headphones, 
  Copy, 
  Check, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { CONTACT } from "./content";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  // The wave's flat top edge is invisible only when its fill matches the
  // section above. Most marketing pages end on white; /contact ends on the
  // light canvas wash, which needs a canvas fill to join without a seam.
  const pageFill = location.pathname.startsWith("/contact")
    ? "fill-[var(--color-canvas)]"
    : "fill-white";
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="relative bg-[#070b14] text-slate-300 overflow-hidden font-sans pt-16 sm:pt-20 lg:pt-24 pb-8">
      {/* Wavy top border, fill matched to the section above so the join has no straight seam */}
      <CurvedSectionDivider 
        variant="wave" 
        position="top" 
        fillColor={pageFill} 
        showBorderLine={false} 
        showAccentGlow={false} 
      />

      {/* Subtle Ambient Glow */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[160px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(10,101,192,0.15),transparent_75%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8 z-10">
        
        {/* Creative 3-Pillar Micro Highlight Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-[#0a65c0]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-white">Safe & Private</p>
              <p className="text-[11px] text-slate-400">Work without sharing your personal info</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-white">Guaranteed Pay</p>
              <p className="text-[11px] text-slate-400">Money is safely locked before you start</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Headphones className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-white">Help Every Step</p>
              <p className="text-[11px] text-slate-400">We guide you and handle client talks</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Brand & Contact (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <Logo size="sm" />
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Dolancer<span className="text-[#0a65c0]">.</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Get clear project offers, skip the client drama, and get <span className="text-white font-semibold">guaranteed pay</span> sent straight to your bank account.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#0a65c0]/60 hover:bg-[#0a65c0]/10 hover:text-white transition-all"
              >
                <Mail className="h-3.5 w-3.5 text-[#0a65c0]" />
                <span>{CONTACT.email}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Product Column (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5 font-display">
              Dolancer
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/how-it-works" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#why-dolancer" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Why Dolancer
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all text-[#0a65c0] hover:text-blue-300">
                  <span>Start earning</span>
                  <span className="text-[9px] bg-[#0a65c0]/20 text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Free</span>
                </Link>
              </li>
              <li>
                <Link to="/sign-in" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3.5 font-display">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/legal/terms" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1.5 transition-all">
                  <span>Help & Support</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">24/7</span>
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-white hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                  Allowed work rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Creative Guarantee Card (3 cols) */}
          <div className="md:col-span-3">
            <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#0a65c0]" />
                <span className="text-xs font-bold text-white">Safe Pay Promise</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Your pay is locked safely before you start work. You never have to chase payments or worry about client disputes.
              </p>
              <Link 
                to="/how-it-works"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0a65c0] hover:text-blue-300 transition-colors"
              >
                <span>See how payments work</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-1 text-xs text-slate-500 font-medium text-center">
          <p>© {currentYear} {CONTACT.company}. All rights reserved.</p>
          <span className="hidden sm:inline text-slate-800">|</span>
          <p>Operated in {CONTACT.jurisdiction}. Support {CONTACT.hours}.</p>
        </div>

      </div>
    </footer>
  );
}
