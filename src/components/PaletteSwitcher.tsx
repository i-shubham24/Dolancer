import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Palette as PaletteIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { PALETTES, PALETTE_META, useUiStore, type Palette } from "@/stores/useUiStore";

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const palette = useUiStore((state) => state.palette);
  const setPalette = useUiStore((state) => state.setPalette);
  const active = PALETTE_META[palette];

  useEffect(() => {
    if (!open) return;

    function closeOnPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function choose(next: Palette) {
    setPalette(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={`Change color palette. Current palette: ${active.label}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        style={{ "--palette-tray-color": active.swatches[0] } as CSSProperties}
        className="palette-tray-button inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-line-card bg-surface px-2.5 text-xs font-bold text-ink shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-highlight/40 hover:shadow-soft-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        <span className="flex h-5 w-5 overflow-hidden rounded-full ring-1 ring-black/10" aria-hidden="true">
          <span className="w-1/2" style={{ backgroundColor: active.swatches[0] }} />
          <span className="w-1/2" style={{ backgroundColor: active.swatches[1] }} />
        </span>
        <PaletteIcon className="h-4 w-4 text-ink-2" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Color palettes"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-2xl border border-line-card bg-surface p-2 shadow-soft-lg"
        >
          <p className="px-3 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
            Choose a palette
          </p>
          {PALETTES.map((option) => {
            const meta = PALETTE_META[option];
            const selected = option === palette;
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => choose(option)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary",
                  selected ? "bg-secondary-light text-ink" : "text-ink-2 hover:bg-hover hover:text-ink",
                )}
              >
                <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10" aria-hidden="true">
                  <span className="w-1/2" style={{ backgroundColor: meta.swatches[0] }} />
                  <span className="w-1/2" style={{ backgroundColor: meta.swatches[1] }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold">{meta.label}</span>
                  <span className="block truncate text-[11px] text-ink-muted">{meta.description}</span>
                </span>
                {selected ? <Check className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
