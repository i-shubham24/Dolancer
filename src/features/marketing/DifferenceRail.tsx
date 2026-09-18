import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  IndianRupee,
  ShieldCheck,
  MousePointerClick,
  Banknote,
  BarChart3,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DIFFERENCES } from "./content";

// Define a distinct vibrant theme for each card's top section
const CARD_THEMES = [
  { bg: "bg-gradient-to-br from-blue-400 to-blue-600", shadow: "shadow-blue-500/20", icon: Ban },
  { bg: "bg-gradient-to-br from-purple-400 to-purple-600", shadow: "shadow-purple-500/20", icon: IndianRupee },
  { bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", shadow: "shadow-emerald-500/20", icon: ShieldCheck },
  { bg: "bg-gradient-to-br from-amber-400 to-orange-500", shadow: "shadow-orange-500/20", icon: MousePointerClick },
  { bg: "bg-gradient-to-br from-cyan-400 to-blue-500", shadow: "shadow-cyan-500/20", icon: Banknote },
  { bg: "bg-gradient-to-br from-indigo-400 to-violet-600", shadow: "shadow-indigo-500/20", icon: BarChart3 },
];

/**
 * Custom UI Graphic renderer for each difference point.
 * These give the "Refrens" style premium feel inside the colored header.
 */
function DifferenceGraphic({ index }: { index: number }) {
  if (index === 0) {
    // No bidding wars
    return (
      <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-3 gap-2">
        <div className="w-16 h-4 bg-line-card rounded-full" />
        <div className="w-12 h-3 bg-red-100 rounded-full flex items-center justify-center">
           <div className="w-6 h-1 bg-red-300 rounded-full" />
        </div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
           <Ban className="h-10 w-10 text-red-500 drop-shadow-md" />
        </div>
      </div>
    );
  }
  if (index === 1) {
    // Pay agreed upfront
    return (
      <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 gap-3">
        <div className="w-full flex justify-between items-center">
           <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
             <IndianRupee className="h-3 w-3 text-emerald-600" />
           </div>
           <div className="w-10 h-3 bg-emerald-50 rounded-full" />
        </div>
        <div className="w-full h-8 bg-surface-2 rounded-lg border border-line-card flex items-center justify-center">
           <span className="text-xs font-extrabold text-ink">₹ 15,000</span>
        </div>
      </div>
    );
  }
  if (index === 2) {
    // Supervisor has your back
    return (
      <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center p-3 gap-2">
        <div className="flex gap-2 w-full mt-1">
          <div className="w-6 h-6 rounded-full bg-blue-100 shrink-0" />
          <div className="space-y-1.5 w-full mt-1">
             <div className="w-full h-2 bg-line-card rounded-full" />
             <div className="w-2/3 h-2 bg-line-card rounded-full" />
          </div>
        </div>
        <div className="mt-auto w-full flex justify-end">
          <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-md flex items-center justify-center -mr-2">
             <Check className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
    );
  }
  if (index === 3) {
    // Choose what to accept
    return (
      <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-3 gap-2">
        <div className="w-full h-10 bg-emerald-500 rounded-lg shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-1.5">
           <Check className="h-4 w-4 text-white" />
           <div className="w-6 h-2 bg-white/40 rounded-full" />
        </div>
        <div className="w-full h-10 bg-surface-2 rounded-lg border border-line-card flex items-center justify-center gap-1.5">
           <X className="h-4 w-4 text-ink-muted" />
           <div className="w-6 h-2 bg-line-card rounded-full" />
        </div>
      </div>
    );
  }
  if (index === 4) {
    // No chasing invoices
    return (
      <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4">
        <div className="w-12 h-16 border-2 border-line-card rounded-lg flex flex-col gap-1.5 p-2 absolute -top-4 -right-2 rotate-12 bg-white shadow-sm">
           <div className="w-full h-1 bg-line-card rounded-full" />
           <div className="w-2/3 h-1 bg-line-card rounded-full" />
           <div className="mt-auto w-full h-3 border-2 border-red-400 rounded text-[6px] text-red-500 font-bold flex items-center justify-center -rotate-12">PAID</div>
        </div>
        <Banknote className="h-10 w-10 text-emerald-500 mt-4 drop-shadow-md z-10" />
      </div>
    );
  }
  
  // Your share grows
  return (
    <div className="relative w-28 h-28 bg-white rounded-2xl shadow-xl flex items-end justify-center p-4 gap-2">
      <div className="w-4 h-8 bg-blue-100 rounded-sm" />
      <div className="w-4 h-12 bg-blue-300 rounded-sm" />
      <div className="w-4 h-16 bg-blue-500 rounded-sm shadow-md" />
      <BarChart3 className="absolute top-4 right-4 h-6 w-6 text-blue-500 opacity-50" />
    </div>
  );
}

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
    const card = node.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;
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
          <span className="block text-sm font-extrabold uppercase tracking-widest text-primary">
            Drag the cards
          </span>
          <h2 id="differences" className="mt-4 max-w-lg text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[#0A1A44]">
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
                "flex h-12 w-12 items-center justify-center rounded-full border border-line-card",
                "transition-all duration-[120ms]",
                disabled
                  ? "cursor-not-allowed bg-muted opacity-40"
                  : "bg-white shadow-soft-sm hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-soft-md active:translate-y-0",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
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
          "drag-rail mt-10 flex gap-6 overflow-x-auto px-1 pb-10 pt-4",
          dragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        tabIndex={0}
        role="group"
        aria-label="Reasons this works differently, scrollable"
      >
        {DIFFERENCES.map((item, index) => {
          const theme = CARD_THEMES[index % CARD_THEMES.length]!;
          const Icon = theme.icon;
          
          return (
            <article
              key={item.title}
              className={cn(
                "w-[280px] sm:w-[320px] h-[360px] shrink-0 rounded-[2rem] bg-white border border-line-card/60 flex flex-col overflow-hidden",
                "shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300",
                "hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group"
              )}
            >
              {/* Top Colorful Half with Custom Graphics */}
              <div className={cn("relative h-44 w-full flex items-center justify-center", theme.bg)}>
                <DifferenceGraphic index={index} />
                
                {/* SVG Curve at the bottom of the colored header */}
                <svg
                  className="absolute bottom-0 left-0 w-full h-8 text-white translate-y-[1px]"
                  viewBox="0 0 1440 120"
                  fill="currentColor"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z"></path>
                </svg>
              </div>

              {/* Bottom White Half */}
              <div className="flex-1 p-6 pt-4 flex flex-col bg-white">
                <div className="w-10 h-10 rounded-full bg-surface-2 border border-line-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <Icon className="h-4 w-4 text-ink" />
                </div>
                <h3 className="text-xl font-extrabold leading-tight text-[#0A1A44] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
                <div className="mt-auto pt-4 flex items-center text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
                  Learn more <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
