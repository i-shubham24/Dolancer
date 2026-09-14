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
import { PaletteSwitcher } from "@/components/PaletteSwitcher";

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
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-all duration-200",
          isActive
            ? "bg-blue-light text-blue"
            : "border border-transparent text-ink-2 hover:border-line-card hover:bg-surface hover:text-ink",
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
      className="rounded-full border border-line-card bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
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
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-blue text-inverse shadow-soft-md">
          <span className="text-lg font-extrabold">D</span>
        </span>
        <span className="text-xl font-extrabold tracking-[-0.04em]">
          Dolancer<span className="text-coral">.</span>
        </span>
        {isDemo() ? <DemoBadge /> : null}
      </Link>
      <div className="mb-5 px-1">
        <PaletteSwitcher />
      </div>

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
        <div className="rounded-2xl border border-line-card/80 bg-surface/85 p-3 shadow-soft-lg backdrop-blur-sm">
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex items-center gap-2.5"
            aria-label="Open your profile"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-light text-sm font-extrabold text-ink">
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
    <div className="app-shell min-h-dvh bg-canvas bg-[radial-gradient(circle_at_12%_0%,color-mix(in_srgb,var(--dl-purple)_10%,transparent),transparent_28%),radial-gradient(circle_at_90%_18%,color-mix(in_srgb,var(--dl-secondary)_8%,transparent),transparent_24%)]">
      <ScrollToTop />
      <CommandMenu />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line-card focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line-card/80 bg-surface/80 px-4 py-3 shadow-soft-sm backdrop-blur-xl lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blue text-inverse shadow-soft-sm">
            <span className="text-base font-extrabold">D</span>
          </span>
          <span className="text-lg font-extrabold tracking-[-0.04em]">Dolancer</span>
          {isDemo() ? <DemoBadge /> : null}
        </Link>
        <div className="flex items-center gap-2">
          <PaletteSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line-card bg-surface/90 shadow-soft-sm"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto overscroll-contain border-r border-line-card bg-canvas p-5 shadow-soft-lg">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1320px] gap-6 px-4 lg:px-6">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 overflow-y-auto py-6 lg:block">
          <SidebarContent />
        </aside>

        <main id="main" className="min-w-0 flex-1 rounded-[28px] py-6 lg:my-4 lg:bg-surface/35 lg:px-7 lg:py-8 lg:shadow-soft-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
