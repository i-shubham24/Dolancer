import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface Position {
  /** Set when the list lines up with the trigger's left edge. */
  left?: number;
  /** Set near the right edge of the screen, so the list grows leftwards instead. */
  right?: number;
  /** Set when the list opens below the trigger. */
  top?: number;
  /** Set when there is no room below, so the list opens upwards. */
  bottom?: number;
  width: number;
  above: boolean;
}

const MAX_LIST_HEIGHT = 280;

/**
 * A dropdown that matches the app instead of the browser's native list.
 *
 * It follows the listbox pattern: the trigger is a button, the list takes focus
 * while open and tracks the highlighted option with aria-activedescendant, and the
 * arrow keys, Home, End, Enter, Space, Escape and Tab all behave as expected.
 *
 * `portal` lifts the list out to the page so a card with overflow hidden cannot
 * clip it. Inside a modal dialog it must stay inline, or the dialog would treat a
 * click on the list as a click outside itself.
 */
export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = "Choose one",
  disabled = false,
  title,
  portal = true,
  className,
  id: givenId,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Accessible name, used when no visible label points at the trigger. */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  title?: string;
  portal?: boolean;
  /** Classes for the trigger button, so each surface can style it. */
  className?: string;
  id?: string;
}) {
  const reduceMotion = useReducedMotion();
  const autoId = useId();
  const id = givenId ?? autoId;
  const listId = `${id}-list`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  const place = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const height = Math.min(MAX_LIST_HEIGHT, options.length * 44 + 12);
    const above = rect.bottom + 8 + height > window.innerHeight && rect.top - 8 - height > 0;
    // 384px is the list's widest (24rem); if that would run off screen, grow leftwards.
    const horizontal =
      rect.left + 384 > window.innerWidth - 8
        ? { right: Math.max(8, window.innerWidth - rect.right) }
        : { left: rect.left };
    setPosition({
      ...horizontal,
      ...(above ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
      width: rect.width,
      above,
    });
  }, [options.length]);

  function openList() {
    if (disabled || options.length === 0) return;
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    if (portal) place();
    setOpen(true);
  }

  function close(refocus = true) {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  }

  // Focus the list once it is on screen, and keep the highlighted option visible.
  useLayoutEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);
  const justOpened = useRef(false);
  useEffect(() => {
    justOpened.current = open;
  }, [open]);
  useEffect(() => {
    if (!open) return;
    // Centre the chosen option when the list opens, then just keep the highlight in view.
    document
      .getElementById(`${id}-opt-${active}`)
      ?.scrollIntoView({ block: justOpened.current ? "center" : "nearest" });
    justOpened.current = false;
  }, [open, active, id]);

  // Close on a click elsewhere; follow the trigger when the page scrolls or resizes.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    if (!portal) return () => document.removeEventListener("pointerdown", onPointer);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, portal, place]);

  function onListKey(event: React.KeyboardEvent) {
    const last = options.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(last, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(last);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      close(false);
    }
  }

  const list = (
    <AnimatePresence>
      {open ? (
        <motion.ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={label ? undefined : id}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: position?.above ? 6 : -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: position?.above ? 4 : -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={
            portal && position
              ? {
                  position: "fixed",
                  left: position.left,
                  right: position.right,
                  top: position.top,
                  bottom: position.bottom,
                  minWidth: position.width,
                  transformOrigin: `${position.above ? "bottom" : "top"} ${position.right !== undefined ? "right" : "left"}`,
                }
              : { transformOrigin: "top left" }
          }
          className={cn(
            "z-[60] max-h-[280px] max-w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl bg-white p-1.5 text-ink outline-none",
            "shadow-[0_18px_44px_-14px_rgba(11,31,58,0.35)] ring-1 ring-ink/[0.07]",
            !portal && "absolute left-0 right-0 top-full mt-2",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors",
                  index === active ? "bg-panel text-ink" : "text-ink-2",
                  isSelected && "font-bold text-primary",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </motion.ul>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", !portal && "w-full")}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        disabled={disabled}
        title={title}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label ? `${label}: ${selected?.label ?? placeholder}` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
        className={cn("inline-flex items-center gap-2 text-left disabled:cursor-not-allowed", className)}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? placeholder}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      {portal ? createPortal(list, document.body) : list}
    </div>
  );
}
