import { useState } from "react";
import { Link, NavLink, useOutlet } from "react-router-dom";
import { ScrollToTop } from "@/routes/ScrollToTop";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SiteFooter } from "./SiteFooter";
import { ScrollRevealController } from "@/components/common/ScrollEnhancements";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <Logo size="md" />
      <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
        Dolancer<span className="text-[#0a65c0]">.</span>
      </span>
    </Link>
  );
}

export function MarketingLayout() {
  const [open, setOpen] = useState(false);
  const { session, user } = useAuth();
  const isLoggedIn = Boolean(session || user);
  const currentOutlet = useOutlet();

  return (
    <div className="fresh-site flex min-h-dvh flex-col bg-white relative">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-slate-300 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold focus:text-slate-900"
      >
        Skip to content
      </a>

      {/* Top Navbar matching reference design */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6 sm:px-8">
          {/* Left: Wordmark */}
          <Wordmark />

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-8 mx-auto" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-[#0a65c0] font-bold" : "text-slate-600 hover:text-[#0a65c0]"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Auth buttons matching reference pills */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <Button asChild size="sm" className="rounded-full bg-[#0a65c0] text-white hover:bg-[#0854a0] shadow-sm px-6 h-10 font-semibold text-sm">
                <Link to="/dashboard">
                  Go to dashboard
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Link 
                  to="/sign-in"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                >
                  Log in
                </Link>
                <Link 
                  to="/sign-up"
                  className="rounded-full bg-[#0a65c0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0854a0] transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="border-t border-slate-100 bg-white px-6 py-5 md:hidden shadow-lg">
            <nav className="space-y-2" aria-label="Mobile Main">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-2 text-base font-semibold",
                      isActive ? "bg-blue-50 text-[#0a65c0]" : "text-slate-700 hover:bg-slate-50"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-2.5 pt-4 border-t border-slate-100">
              {isLoggedIn ? (
                <Button asChild onClick={() => setOpen(false)} className="rounded-full bg-[#0a65c0] text-white hover:bg-[#0854a0] h-11 text-base">
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center justify-center rounded-full border border-slate-300 text-base font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center justify-center rounded-full bg-[#0a65c0] text-base font-semibold text-white hover:bg-[#0854a0]"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main id="main" className="fresh-main flex-1">
        {currentOutlet}
      </main>

      <SiteFooter />
      <ScrollRevealController />
    </div>
  );
}
