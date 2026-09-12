import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { ScrollToTop } from "@/routes/ScrollToTop";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Wallet,
  Bell,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Gift,
  LifeBuoy,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { preloadRoute } from "@/lib/preload";
import { CommandMenu } from "@/components/CommandMenu";
import { isDemo } from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { signOut } from "@/features/auth/api";
import { useProfile } from "@/features/dashboard/queries";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/work", label: "My work", icon: Briefcase },
  { to: "/pool", label: "Job board", icon: Layers },
  { to: "/earnings", label: "Earnings", icon: Wallet },
  { to: "/notifications", label: "Alerts", icon: Bell },
];

const SECONDARY = [
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/training", label: "Training", icon: GraduationCap },
  { to: "/refer", label: "Refer", icon: Gift },
  { to: "/tickets", label: "Support", icon: LifeBuoy },
];

function NavItem({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      onMouseEnter={() => preloadRoute(to)}
      onFocus={() => preloadRoute(to)}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold tracking-[-0.01em] transition-all duration-[120ms]",
          isActive
            ? "border-[1.5px] border-ink bg-coral text-ink shadow-offset-xs"
            : "border-[1.5px] border-transparent text-ink-2 hover:border-ink hover:bg-surface hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-ink" : "text-ink-muted")} aria-hidden="true" />
          {label}
        </>
      )}
    </NavLink>
  );
}

/** Marks the sample-data build, so nobody mistakes it for a live account. */
function DemoBadge() {
  return (
    <span
      title="Sample data. Changes last until you reload."
      className="rounded-full border-[1.5px] border-ink bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
    >
      Demo
    </span>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const profile = useProfile();

  const name = profile.data?.full_name?.trim() || user?.email || "Your account";
  const initial = (profile.data?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? "D").toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <Link to="/dashboard" onClick={onNavigate} className="mb-8 flex items-center gap-2.5 px-1">
        <span className="flex h-9 w-9 rotate-[-4deg] items-center justify-center rounded-[10px] border-2 border-ink bg-blue text-inverse shadow-offset-sm">
          <span className="text-lg font-extrabold">D</span>
        </span>
        <span className="text-xl font-extrabold tracking-[-0.04em]">
          Dolancer<span className="text-coral">.</span>
        </span>
        {isDemo() ? <DemoBadge /> : null}
      </Link>

      <nav className="space-y-1 px-1" aria-label="Main">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="my-5 h-px bg-line-subtle" />

      <nav className="space-y-1 px-1" aria-label="Account">
        {SECONDARY.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border-[1.5px] border-ink bg-surface p-3 shadow-offset-xs">
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex items-center gap-2.5"
            aria-label="Open your profile"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-lime text-sm font-extrabold">
              {initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold tracking-[-0.01em]">
                {name}
              </span>
              <span className="block truncate text-[11px] text-ink-muted">View profile</span>
            </span>
          </Link>

          <div className="mt-3 border-t border-line-subtle pt-3">
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-xs font-bold text-ink-muted transition-colors hover:text-danger-ink"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-canvas">
      <ScrollToTop />
      <CommandMenu />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border-2 focus:border-ink focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink bg-surface px-4 py-3 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 rotate-[-4deg] items-center justify-center rounded-[10px] border-2 border-ink bg-blue text-inverse shadow-offset-xs">
            <span className="text-base font-extrabold">D</span>
          </span>
          <span className="text-lg font-extrabold tracking-[-0.04em]">Dolancer</span>
          {isDemo() ? <DemoBadge /> : null}
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-md border-2 border-ink bg-surface shadow-offset-xs"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto overscroll-contain border-r-2 border-ink bg-canvas p-5">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1320px] gap-6 px-4 lg:px-6">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 overflow-y-auto py-6 lg:block">
          <SidebarContent />
        </aside>

        <main id="main" className="min-w-0 flex-1 py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
