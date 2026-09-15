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
import { motion, AnimatePresence } from "framer-motion";
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
  collapsed,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      onMouseEnter={() => preloadRoute(to)}
      onFocus={() => preloadRoute(to)}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-2xl px-3.5 py-2.5 text-sm font-bold tracking-[-0.01em] transition-all duration-200 overflow-hidden",
          collapsed ? "justify-center" : "gap-3",
          isActive
            ? "bg-purple text-inverse shadow-soft-sm font-extrabold"
            : "border border-transparent text-ink-2 hover:border-line-card hover:bg-surface hover:text-ink hover:shadow-soft-sm",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
              isActive ? "text-inverse" : "text-ink-2 group-hover:text-purple",
            )}
            aria-hidden="true"
          />
          {!collapsed && <span className="whitespace-nowrap">{label}</span>}
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

function SidebarContent({ onNavigate, collapsed, setCollapsed }: { onNavigate?: () => void; collapsed?: boolean; setCollapsed?: (v: boolean) => void }) {
  const { user } = useAuth();
  const profile = useProfile();

  const name = profile.data?.full_name?.trim() || user?.email || "Your account";
  const initial = (profile.data?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? "D").toUpperCase();

  return (
    <div className="flex h-full flex-col overflow-x-hidden scrollbar-hide">
      <div className={cn("mb-8 flex px-1", collapsed ? "flex-col items-center gap-4 mt-2" : "items-center justify-between")}>
        <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-2.5 overflow-hidden shrink-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple to-blue text-inverse shadow-soft-md">
            <span className="text-lg font-extrabold">D</span>
          </span>
          {!collapsed && (
            <span className="text-xl font-extrabold tracking-[-0.04em] whitespace-nowrap">
              Dolancer<span className="text-coral">.</span>
            </span>
          )}
          {!collapsed && isDemo() ? <DemoBadge /> : null}
        </Link>
        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-surface transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      {!collapsed && (
        <div className="mb-5 px-1">
          <PaletteSwitcher />
        </div>
      )}

      <nav className="space-y-1 px-1" aria-label="Main">
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </nav>

      <div className="my-5 h-px bg-line-subtle" />

      <nav className="space-y-1 px-1" aria-label="Account">
        {SECONDARY.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div
          className={cn(
            "rounded-2xl border border-line-card bg-surface p-3.5 shadow-soft-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg",
            collapsed && "flex justify-center p-2",
          )}
        >
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex items-center gap-2.5 overflow-hidden"
            aria-label="Open your profile"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-extrabold text-ink shadow-soft-sm">
              {initial}
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1 whitespace-nowrap">
                <span className="block truncate text-sm font-extrabold tracking-[-0.01em] text-ink">
                  {name}
                </span>
                <span className="block truncate text-xs font-semibold text-ink-muted">View profile</span>
              </span>
            )}
          </Link>

          {!collapsed && (
            <div className="mt-3 border-t border-line-subtle pt-3">
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold text-ink-muted transition-colors hover:bg-danger-bg hover:text-danger-ink whitespace-nowrap"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const toggleCollapsed = (v: boolean) => {
    setCollapsed(v);
    localStorage.setItem("sidebar-collapsed", String(v));
  };

  return (
    <div className="app-shell min-h-dvh bg-canvas bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--dl-purple)_12%,transparent),transparent_50%),radial-gradient(circle_at_95%_25%,color-mix(in_srgb,var(--dl-card-mint)_25%,transparent),transparent_30%),radial-gradient(circle_at_5%_75%,color-mix(in_srgb,var(--dl-card-pink)_20%,transparent),transparent_35%)]">
      <ScrollToTop />
      <CommandMenu />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line-card focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line-card/80 bg-surface/90 px-4 py-3 shadow-soft-sm backdrop-blur-xl lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-blue text-inverse shadow-soft-sm">
            <span className="text-base font-extrabold">D</span>
          </span>
          <span className="text-lg font-extrabold tracking-[-0.04em] hidden sm:block truncate">Dolancer</span>
          {isDemo() ? <DemoBadge /> : null}
        </Link>
        <div className="flex items-center gap-2 shrink-0">
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

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 w-full h-full bg-ink/30 cursor-default"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_e, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -500) {
                  setMobileOpen(false);
                }
              }}
              className="absolute inset-y-0 left-0 w-[85%] max-w-xs overflow-y-auto overscroll-contain border-r border-line-card bg-canvas p-5 shadow-soft-lg scrollbar-hide"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto flex w-full max-w-[1320px] gap-6 px-4 lg:px-6">
        <aside className={cn("sticky top-0 hidden h-dvh shrink-0 overflow-y-auto py-6 lg:block transition-[width] duration-300 ease-in-out scrollbar-hide", collapsed ? "w-20" : "w-64")}>
          <SidebarContent collapsed={collapsed} setCollapsed={toggleCollapsed} />
        </aside>

        <main id="main" className="min-w-0 flex-1 py-6 lg:my-2 lg:py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
