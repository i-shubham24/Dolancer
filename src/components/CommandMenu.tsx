import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Wallet,
  Bell,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Gift,
  LifeBuoy,
  User,
  Search,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { preloadRoute } from "@/lib/preload";

export const PALETTE_EVENT = "dolancer:open-palette";

interface Action {
  id: string;
  label: string;
  hint: string;
  to: string;
  icon: typeof LayoutDashboard;
  keywords: string;
}

const ACTIONS: Action[] = [
  { id: "dashboard", label: "Dashboard", hint: "Home", to: "/dashboard", icon: LayoutDashboard, keywords: "home overview start" },
  { id: "pool", label: "Browse the board", hint: "Claim work", to: "/pool", icon: Layers, keywords: "board jobs claim tasks offers" },
  { id: "work", label: "My work", hint: "Active projects", to: "/work", icon: Briefcase, keywords: "projects active tasks progress submit" },
  { id: "earnings", label: "Earnings", hint: "Payouts", to: "/earnings", icon: Wallet, keywords: "money payout pay tax tds earnings" },
  { id: "alerts", label: "Alerts", hint: "Notifications", to: "/notifications", icon: Bell, keywords: "notifications alerts updates" },
  { id: "verification", label: "Verification", hint: "Get verified", to: "/verification", icon: ShieldCheck, keywords: "verify kyc documents identity payout" },
  { id: "skills", label: "Skills", hint: "Match work", to: "/skills", icon: Sparkles, keywords: "skills match categories" },
  { id: "training", label: "Training", hint: "Learn", to: "/training", icon: GraduationCap, keywords: "training lessons learn course" },
  { id: "refer", label: "Refer", hint: "Invite", to: "/refer", icon: Gift, keywords: "refer invite friend bonus" },
  { id: "profile", label: "Profile", hint: "Account", to: "/profile", icon: User, keywords: "profile account name settings" },
  { id: "support", label: "Support", hint: "Tickets", to: "/tickets", icon: LifeBuoy, keywords: "support help ticket contact issue" },
];

/**
 * Command palette. Navigation only, so there is no backend surface to secure
 * and no workflow to disturb. Opens on Cmd/Ctrl K or the PALETTE_EVENT.
 */
export function CommandMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    function onSignal() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onSignal);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onSignal);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open ]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return ACTIONS;
    return ACTIONS.filter((action) =>
      `${action.label} ${action.hint} ${action.keywords}`.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function go(to: string) {
    setOpen(false);
    navigate(to);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          aria-label="Quick navigation"
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-modal focus:outline-none"
        >
          <div className="flex items-center gap-2.5 border-b-2 border-ink px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <Dialog.Title className="sr-only">Quick navigation</Dialog.Title>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((i) => Math.min(i + 1, results.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const picked = results[active];
                  if (picked) go(picked.to);
                }
              }}
              placeholder="Where to? Try earnings, board, training..."
              aria-label="Where to"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-ink-3"
            />
            <kbd className="shrink-0 rounded-md border-[1.5px] border-ink bg-subtle px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-2">
              ESC
            </kbd>
          </div>

          <ul role="listbox" aria-label="Destinations" className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-ink-2">
                Nothing matches that. Try board, earnings or training.
              </li>
            ) : (
              results.map((action, index) => (
                <li key={action.id} role="option" aria-selected={index === active}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(index);
                      preloadRoute(action.to);
                    }}
                    onClick={() => go(action.to)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border-[1.5px] px-3 py-2.5 text-left transition-colors",
                      index === active
                        ? "border-ink bg-lime-light"
                        : "border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink",
                        index === active ? "bg-lime" : "bg-surface-2",
                      )}
                    >
                      <action.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold tracking-[-0.01em]">
                        {action.label}
                      </span>
                      <span className="block text-[11px] text-ink-muted">{action.hint}</span>
                    </span>
                    {index === active ? (
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="flex items-center gap-4 border-t border-line-subtle px-4 py-2.5 text-[11px] text-ink-muted">
            <span><kbd className="font-mono font-bold">↑↓</kbd> move</span>
            <span><kbd className="font-mono font-bold">↵</kbd> open</span>
            <span className="ml-auto hidden sm:inline">Cmd or Ctrl K anywhere</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
