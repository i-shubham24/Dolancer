import { useState } from "react";
import { Link, NavLink, useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ScrollToTop } from "@/routes/ScrollToTop";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/motion-primitives/dock";
import { SiteFooter } from "./SiteFooter";
import { PaletteSwitcher } from "@/components/PaletteSwitcher";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 rotate-[-4deg] items-center justify-center rounded-[10px] border border-line-card bg-blue text-inverse shadow-soft-sm">
        <span className="text-lg font-extrabold">D</span>
      </span>
      <span className="text-xl font-extrabold tracking-[-0.04em]">
        Dolancer<span className="text-coral">.</span>
      </span>
    </Link>
  );
}

/**
 * The public shell.
 *
 * A signed-in visitor keeps the marketing site rather than being bounced out of it,
 * because people do come back to re-read the money and verification pages after
 * they have joined. The primary action just changes to point at their dashboard.
 */
export function MarketingLayout() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const location = useLocation();
  const currentOutlet = useOutlet();
  const reduceMotion = useReducedMotion();

  return (
    <div className="fresh-site flex min-h-dvh flex-col bg-canvas">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line-card focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      <header className="fresh-header sticky top-0 z-30">
        <div className="fresh-nav-shell mx-auto flex w-full max-w-[1320px] items-center gap-6 pl-5 pr-5 py-2.5 lg:pl-6 lg:pr-7 lg:py-3">
          <Wordmark />

          <nav className="ml-8 lg:ml-12 hidden md:flex" aria-label="Main">
            {/* Dock-magnified nav links: each pill grows toward the cursor. */}
            <Dock
              expand={false}
              panelHeight={40}
              distance={110}
              ariaLabel="Main navigation"
              className="gap-1.5 rounded-full bg-transparent px-0"
            >
              {NAV.map((item) => (
                <DockItem key={item.to} baseWidth={item.to === "/how-it-works" ? 118 : item.to === "/about" ? 70 : 82}>
                  <DockIcon>
                    <NavLink
                      to={item.to}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        cn(
                          "flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-colors",
                          isActive ? "bg-subtle text-ink" : "text-ink-2 hover:text-ink",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </DockIcon>
                  <DockLabel className="border-line-card bg-surface text-ink-2 shadow-soft-xs">{item.label}</DockLabel>
                </DockItem>
              ))}
            </Dock>
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <PaletteSwitcher />
            {session ? (
              <Button asChild size="sm">
                <Link to="/dashboard">
                  Go to dashboard
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/sign-up">Start earning</Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "fresh-menu-button ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-line-card bg-surface shadow-soft-sm md:hidden",
              open && "is-open",
            )}
          >
            <span className="fresh-menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {open ? (
          <div className="border-t border-line-card bg-surface px-4 py-4 md:hidden">
            <nav className="space-y-1" aria-label="Main">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-ink-2 hover:bg-hover hover:text-ink"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <PaletteSwitcher />
              {session ? (
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                    <Link to="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/sign-up">Start earning</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main id="main" className="fresh-main flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  );
}
