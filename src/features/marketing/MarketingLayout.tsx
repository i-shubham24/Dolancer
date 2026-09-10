import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ScrollToTop } from "@/routes/ScrollToTop";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "./SiteFooter";

const NAV = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 rotate-[-4deg] items-center justify-center rounded-[10px] border-2 border-ink bg-blue text-inverse shadow-offset-sm">
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

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border-2 focus:border-ink focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b-2 border-ink bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1320px] items-center gap-6 px-4 py-3.5 lg:px-6">
          <Wordmark />

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                    isActive ? "bg-subtle text-ink" : "text-ink-2 hover:text-ink",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
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
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink bg-surface shadow-offset-xs md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div className="border-t-2 border-ink bg-surface px-4 py-4 md:hidden">
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

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
