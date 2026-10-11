import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { useAuth } from "@/providers/AuthProvider";
import { CONTACT } from "./content";
import { LEGAL_PAGES } from "./legal-documents";

const EXPLORE_LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/#why-dolancer", label: "Why Dolancer" },
  { to: "/contact", label: "Contact" },
];

const linkClass = "text-slate-300 transition-colors hover:text-white";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { session, user } = useAuth();
  const isLoggedIn = Boolean(session || user);
  // The wave's flat top edge is invisible only when its fill matches the
  // section above. Most marketing pages end on white; /contact ends on the
  // light canvas wash and /how-it-works on the surface-2 FAQ blue.
  const pageFill = location.pathname.startsWith("/contact")
    ? "fill-[var(--color-canvas)]"
    : location.pathname.startsWith("/how-it-works")
      ? "fill-[#eef5fb]"
      : "fill-white";
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const accountLinks = isLoggedIn
    ? [{ to: "/dashboard", label: "Dashboard" }]
    : [
        { to: "/sign-up", label: "Start earning" },
        { to: "/sign-in", label: "Log in" },
      ];

  return (
    <footer className="relative overflow-hidden bg-[#070b14] pt-16 font-sans text-slate-400 sm:pt-20 lg:pt-24">
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
        className="pointer-events-none absolute left-1/2 top-10 h-[160px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(10,101,192,0.15),transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-8 sm:px-8 sm:pt-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <Logo size="sm" className="rounded-lg" />
              <span className="text-xl font-bold tracking-tight text-white">
                Dolancer<span className="text-[#3b9eff]">.</span>
              </span>
            </Link>
            <p className="mt-3 text-[15px]">Get paid for what you are already good at.</p>

            <div className="mt-6 flex items-center gap-1.5">
              <a href={`mailto:${CONTACT.email}`} className="text-[15px] font-semibold text-white transition-colors hover:text-[#3b9eff]">
                {CONTACT.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={copiedEmail ? "Email copied" : "Copy email address"}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white"
              >
                {copiedEmail ? (
                  <Check className="h-4 w-4 text-[#3b9eff]" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="text-[13px]">Support is open {CONTACT.hours}.</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 text-[15px] font-medium lg:col-span-6 lg:justify-self-end lg:gap-x-24">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Explore</h2>
              <ul className="mt-4 space-y-3">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Account</h2>
              <ul className="mt-4 space-y-3">
                {accountLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-2">
            {LEGAL_PAGES.map((page) => {
              const current = location.pathname === `/legal/${page.kind}`;
              return (
                <Link
                  key={page.kind}
                  to={`/legal/${page.kind}`}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                    current
                      ? "border-white bg-white text-[#070b14]"
                      : "border-white/15 bg-white/[0.04] text-slate-200 hover:border-white/40 hover:text-white",
                  )}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>
          <p className="shrink-0 text-[13px]">
            © {currentYear} {CONTACT.company}. {CONTACT.jurisdiction}.
          </p>
        </div>
      </div>
    </footer>
  );
}
