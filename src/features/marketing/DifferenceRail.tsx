import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Wallet,
  UserCheck,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DIFFERENCES } from "./content";

const ICONS = [Ban, Wallet, UserCheck, Clock, ShieldCheck, TrendingUp];
const TINTS = ["bg-coral", "bg-blue", "bg-lime", "bg-purple", "bg-warning-bg", "bg-success-bg"];
const INK = ["text-ink", "text-inverse", "text-ink", "text-inverse", "text-ink", "text-ink"];

/**
 * A deck you push, rather than a grid you scan.
 *
 * Built on native scroll with CSS snap, so it keeps every behaviour a real scroller
 * has for free: touch momentum, trackpad swipe, keyboard arrows, and a working
 * scrollbar for anyone who wants one. Grabbing to drag is layered on top for mouse
 * users, who otherwise have no way to push it.
 *
 * The arrow buttons disable at each end rather than wrapping around, because a deck
 * that silently teleports back to the start loses your place.
 */
export function DifferenceRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const syncEdges = useCallback(() => {
    const node = railRef.current;
    if (!node) return;
    setAtStart(node.scrollLeft <= 4);
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    const node = railRef.current;
    if (!node) return;
    const observer = new ResizeObserver(syncEdges);
    observer.observe(node);
    return () => observer.disconnect();
  }, [syncEdges]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const node = railRef.current;
    if (!node) return;
    // One card plus its gap, so a press always lands cleanly on the next snap point.
    const card = node.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : node.clientWidth * 0.8;
    node.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const node = railRef.current;
    if (!node) return;
    drag.current = { startX: event.clientX, startScroll: node.scrollLeft };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = railRef.current;
    const state = drag.current;
    if (!node || !state) return;
    node.scrollLeft = state.startScroll - (event.clientX - state.startX);
  }

  function endDrag() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] text-inverse">
            Drag the cards
          </span>
          <h2 id="differences" className="mt-4 max-w-lg text-4xl font-extrabold tracking-[-0.04em]">
            Why this is not another freelance site
          </h2>
        </div>

        <div className="flex gap-2">
          {(
            [
              { dir: -1 as const, Icon: ArrowLeft, label: "Previous", disabled: atStart },
              { dir: 1 as const, Icon: ArrowRight, label: "Next", disabled: atEnd },
            ]
          ).map(({ dir, Icon, label, disabled }) => (
            <button
              key={label}
              type="button"
              onClick={() => scrollByCard(dir)}
              disabled={disabled}
              aria-label={label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink",
                "transition-all duration-[120ms]",
                disabled
                  ? "cursor-not-allowed bg-muted opacity-40"
                  : "bg-surface shadow-offset-sm hover:-translate-x-px hover:-translate-y-px hover:bg-lime hover:shadow-offset-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={railRef}
        onScroll={syncEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={cn(
          // overflow-x also clips the vertical axis, so the lift and the grown
          // shadow need actual room inside the scroller or they get shaved off.
          "drag-rail mt-6 flex gap-5 overflow-x-auto px-1 pb-7 pt-5",
          dragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        // A scroll container needs to be reachable and labelled to be usable by
        // keyboard, which native arrow-key scrolling then handles.
        tabIndex={0}
        role="group"
        aria-label="Reasons this works differently, scrollable"
      >
        {DIFFERENCES.map((item, index) => {
          const Icon = ICONS[index % ICONS.length] ?? ShieldCheck;
          return (
            <article
              key={item.title}
              className={cn(
                "w-[17rem] shrink-0 rounded-2xl border-2 border-ink bg-surface p-6",
                "shadow-offset-md transition-all duration-[180ms] ease-spring",
                "hover:-translate-y-1 hover:shadow-offset-lg sm:w-[19rem]",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink shadow-offset-xs",
                  TINTS[index % TINTS.length],
                  INK[index % INK.length],
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold leading-tight tracking-[-0.03em]">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{item.body}</p>
              <span
                aria-hidden="true"
                className="mt-6 block text-5xl font-extrabold leading-none tracking-[-0.05em] text-ink/10"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
