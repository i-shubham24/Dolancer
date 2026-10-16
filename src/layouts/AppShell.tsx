import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/routes/ScrollToTop";
import {
  House,
  LayoutDashboard,
  Layers,
  Briefcase,
  MessageCircle,
  CalendarDays,
  Bell,
  ShieldCheck,
  GraduationCap,
  PencilRuler,
  Menu,
  X,
  LogOut,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { preloadRoute } from "@/lib/preload";
import { CommandMenu, PALETTE_EVENT } from "@/components/CommandMenu";
import { isDemo } from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { signOut } from "@/features/auth/api";
import { useAvailabilityAutopilot, useProfile } from "@/features/dashboard/queries";
import { AvailabilityToggle } from "@/features/dashboard/AvailabilityToggle";
import { useNotifications } from "@/features/notifications/api";
import { useReminderAlerts } from "@/features/calendar/useReminderAlerts";
import { useNotificationPopups } from "@/features/notifications/useNotificationPopups";
import { PopupStack } from "@/features/notifications/PopupStack";
import { usePopupStore } from "@/stores/usePopupStore";
import { useUnreadChats } from "@/features/messages/queries";
import { useHomeVisible } from "@/features/home/steps";
import { Logo } from "@/components/ui/Logo";

type NavEntry = { to: string; label: string; icon: typeof LayoutDashboard; isNew?: boolean };

const NAV: NavEntry[] = [
  { to: "/home", label: "Home", icon: House },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/work", label: "My work", icon: Briefcase },
  { to: "/messages", label: "Messages", icon: MessageCircle, isNew: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/pool", label: "Assigned offers", icon: Layers },
];

const SECONDARY: NavEntry[] = [
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/skills", label: "Skills", icon: PencilRuler },
  { to: "/training", label: "Training", icon: GraduationCap },
];

/** Pages opened from the profile, so the profile card shows as current on them. */
const ACCOUNT_PAGES = ["/profile", "/notifications", "/refer", "/tickets"];

/** Nav items slide in one after another when the shell first appears. */
const navList: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } } };
const navEntry: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function useUnreadCount(): number {
  const notifications = useNotifications();
  return (notifications.data ?? []).filter((item) => !item.readAt).length;
}

function NavItem({
  to,
  label,
  icon: Icon,
  isNew,
  badge,
  onNavigate,
  collapsed,
}: NavEntry & { badge?: number; onNavigate?: () => void; collapsed?: boolean }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      onMouseEnter={() => preloadRoute(to)}
      onFocus={() => preloadRoute(to)}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-[14px] px-3 py-2.5 text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
          collapsed ? "justify-center" : "gap-3",
          isActive
            ? "bg-white font-extrabold text-primary shadow-[0_2px_8px_-2px_rgba(15,23,42,0.12)]"
            : "text-ink-2 hover:bg-white/70 hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="nav-indicator"
              className="absolute -left-4 bottom-2.5 top-2.5 w-1 rounded-r-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              aria-hidden="true"
            />
          ) : null}
          <Icon
            className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-primary" : "text-ink-2 group-hover:text-ink")}
            aria-hidden="true"
          />
          {!collapsed ? <span className="whitespace-nowrap">{label}</span> : null}
          {!collapsed && badge ? (
            <span className="ml-auto rounded-full bg-primary px-1.5 py-px text-[10.5px] font-extrabold text-white">
              {badge}
              <span className="sr-only">{to === "/home" ? " steps left" : " unread"}</span>
            </span>
          ) : null}
          {!collapsed && !badge && isNew ? (
            <span className="ml-auto rounded-md bg-secondary-light px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.06em] text-secondary-hover">
              New
            </span>
          ) : null}
          {collapsed && badge ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          ) : null}
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
      className="rounded-full border border-line-card bg-[var(--dl-card-yellow)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
    >
      Demo
    </span>
  );
}

function SidebarContent({
  onNavigate,
  collapsed,
  setCollapsed,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
}) {
  const { user } = useAuth();
  const profile = useProfile();
  const unread = useUnreadCount();
  const unreadChats = useUnreadChats();
  const home = useHomeVisible();
  const nav = home.visible ? NAV : NAV.filter((item) => item.to !== "/home");

  const reduceMotion = useReducedMotion();
  const name = profile.data?.full_name?.trim() || user?.email || "Your account";
  const initial = (profile.data?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? "D").toUpperCase();

  return (
    <div className="flex h-full flex-col overflow-x-hidden scrollbar-hide">
      <div className={cn("mb-5 flex px-1", collapsed ? "mt-1 flex-col items-center gap-4" : "items-center justify-between")}>
        <Link to="/dashboard" onClick={onNavigate} className="flex shrink-0 items-center gap-2.5 overflow-hidden">
          <Logo size="md" className="rounded-[10px]" />
          {!collapsed ? (
            <span className="whitespace-nowrap text-xl font-extrabold tracking-[-0.04em]">Dolancer</span>
          ) : null}
          {!collapsed && isDemo() ? <DemoBadge /> : null}
        </Link>
        {setCollapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white hover:text-ink lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <p className="px-3 pb-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-3">Work</p>
      ) : null}
      <motion.nav
        className="space-y-0.5"
        aria-label="Main"
        variants={navList}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        {nav.map((item) => (
          <motion.div key={item.to} variants={navEntry}>
            <NavItem
              {...item}
              badge={
                item.to === "/messages" ? unreadChats : item.to === "/home" && !home.loading ? home.remaining : undefined
              }
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          </motion.div>
        ))}
      </motion.nav>

      {collapsed ? (
        <div className="mx-2 my-4 h-px bg-line-subtle" />
      ) : (
        <p className="px-3 pb-1.5 pt-5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-3">Account</p>
      )}
      <motion.nav
        className="space-y-0.5"
        aria-label="Account"
        variants={navList}
        initial={reduceMotion ? false : "hidden"}
        animate="show"
      >
        {SECONDARY.map((item) => (
          <motion.div key={item.to} variants={navEntry}>
            <NavItem {...item} onNavigate={onNavigate} collapsed={collapsed} />
          </motion.div>
        ))}
      </motion.nav>

      <div className="mt-auto pt-6">
        <ProfileMenu name={name} initial={initial} unread={unread} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

/**
 * The account card at the foot of the sidebar: it opens the profile, where Earnings,
 * Alerts, Refer and Support live as shortcuts. A dot on the avatar says there are
 * unread alerts.
 */
function ProfileMenu({
  name,
  initial,
  unread,
  collapsed,
  onNavigate,
}: {
  name: string;
  initial: string;
  unread: number;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const here = ACCOUNT_PAGES.some((to) => pathname.startsWith(to));

  const avatar = (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--dl-card-yellow)] text-sm font-extrabold text-ink">
      {initial}
      {unread > 0 ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-danger-dot ring-2 ring-white" aria-hidden="true" /> : null}
    </span>
  );

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)]",
        here && "ring-2 ring-inset ring-primary/30",
        collapsed && "flex justify-center p-2",
      )}
    >
      <Link
        to="/profile"
        onClick={onNavigate}
        onMouseEnter={() => preloadRoute("/profile")}
        title={collapsed ? "Your profile" : undefined}
        aria-label={`${name}, open your profile${unread > 0 ? `, ${unread} unread alerts` : ""}`}
        className="flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-primary"
      >
        {avatar}
        {!collapsed ? (
          <span className="min-w-0 flex-1 whitespace-nowrap">
            <span className="block truncate text-sm font-extrabold tracking-[-0.01em] text-ink">{name}</span>
            <span className="block truncate text-xs font-semibold text-ink-muted">View profile</span>
          </span>
        ) : null}
      </Link>

      {!collapsed ? (
        <div className="mt-2.5 border-t border-line-subtle pt-2">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-2 py-1.5 text-xs font-bold text-ink-muted transition-colors hover:bg-danger-bg hover:text-danger-ink"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BellLink({ className }: { className?: string }) {
  const unread = useUnreadCount();
  return (
    <Link
      to="/notifications"
      onMouseEnter={() => preloadRoute("/notifications")}
      aria-label={unread > 0 ? `Alerts, ${unread} unread` : "Alerts"}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-white text-ink-2 ring-1 ring-ink/[0.05] transition-colors hover:text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <BellIcon />
      {unread > 0 ? (
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger-dot ring-2 ring-white" aria-hidden="true" />
      ) : null}
    </Link>
  );
}

/** The bell gives a small shake each time a pop-up arrives. */
function BellIcon() {
  const reduceMotion = useReducedMotion();
  const bumps = usePopupStore((state) => state.bumps);
  return (
    <motion.span
      key={bumps}
      className="flex"
      initial={false}
      animate={reduceMotion || bumps === 0 ? undefined : { rotate: [0, -16, 13, -9, 6, 0] }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 10%" }}
    >
      <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
    </motion.span>
  );
}

/** Search, availability and alerts, the same on every signed-in page. */
function TopBar({ onAlerts }: { onAlerts: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="mb-5 hidden items-center gap-3 lg:flex"
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(PALETTE_EVENT))}
        className="flex h-11 w-full max-w-[400px] items-center gap-2.5 rounded-[14px] bg-white px-4 text-left text-sm font-medium text-ink-3 ring-1 ring-ink/[0.05] transition-colors hover:text-ink-2 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        Search pages
        <kbd className="ml-auto rounded-md bg-panel px-1.5 py-0.5 font-sans text-[11px] font-bold text-ink-muted">Ctrl K</kbd>
      </button>
      <div className="flex-1" />
      <AvailabilityToggle />
      {/* No bell on the Alerts page itself: it would only link to where you are. */}
      {onAlerts ? null : <BellLink />}
    </motion.div>
  );
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  useReminderAlerts();
  useNotificationPopups();
  useAvailabilityAutopilot();
  const onAlerts = location.pathname.startsWith("/notifications");

  const toggleCollapsed = (v: boolean) => {
    setCollapsed(v);
    try {
      localStorage.setItem("sidebar-collapsed", String(v));
    } catch {
      // Storage can be blocked. The choice then lasts until the next reload.
    }
  };

  return (
    <div className="app-shell min-h-dvh overflow-x-clip bg-panel lg:bg-frame">
      <ScrollToTop />
      <PopupStack />
      <CommandMenu />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line-card focus:bg-[var(--dl-card-yellow)] focus:px-4 focus:py-2 focus:text-sm focus:font-extrabold"
      >
        Skip to content
      </a>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/[0.06] bg-side/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
          <Logo size="sm" className="rounded-lg" />
          <span className="hidden truncate text-lg font-extrabold tracking-[-0.04em] sm:block">Dolancer</span>
          {isDemo() ? <DemoBadge /> : null}
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          {onAlerts ? null : <BellLink />}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white ring-1 ring-ink/[0.05]"
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
              className="absolute inset-0 h-full w-full cursor-default bg-ink/30"
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
              className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col overflow-y-auto overscroll-contain bg-side px-4 py-5 shadow-soft-lg scrollbar-hide"
            >
              <div className="mb-4 shrink-0">
                <AvailabilityToggle />
              </div>
              <div className="flex-1">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto flex w-full max-w-[1480px] gap-3.5 lg:p-3.5">
        <aside
          className={cn(
            "sticky top-3.5 hidden h-[calc(100dvh-1.75rem)] shrink-0 overflow-y-auto rounded-3xl bg-side px-4 py-5 transition-[width] duration-300 ease-in-out scrollbar-hide lg:block",
            collapsed ? "w-[84px]" : "w-60",
          )}
        >
          <SidebarContent collapsed={collapsed} setCollapsed={toggleCollapsed} />
        </aside>

        <main id="main" className="min-w-0 flex-1 px-4 py-5 lg:min-h-[calc(100dvh-1.75rem)] lg:rounded-3xl lg:bg-panel lg:px-6 lg:py-5">
          <TopBar onAlerts={onAlerts} />
          {/* Each page eases in as you move between them, like the reel's screen changes. */}
          {/* Threads under /messages share the same key so switching chats does not remount the page. */}
          <motion.div
            key={location.pathname.startsWith("/messages") ? "/messages" : location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
