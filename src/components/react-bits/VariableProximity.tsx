import { forwardRef, useEffect, useMemo, useRef } from "react";

/**
 * VariableProximity - letters swell in weight as the cursor nears them,
 * adapted from React Bits (https://reactbits.dev).
 *
 * Changes from the source: TypeScript, no motion/react dependency (the
 * stock file wraps letters in motion.spans it never animates - plain
 * spans do the same), no font-family override (letters inherit the
 * site's variable Plus Jakarta Sans instead of Roboto Flex), and the
 * rAF loop is skipped entirely under prefers-reduced-motion.
 *
 * The `label` must be plain text - per-letter spans are generated inside.
 * Requires a variable font (see the @import in src/index.css).
 */

const useAnimationFrame = (callback: () => void) => {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
};

type Position = { x: number; y: number };

const useMousePositionRef = (containerRef: React.RefObject<HTMLElement | null>) => {
  const positionRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
};

export interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = "linear",
    className = "",
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef<Position>({ x: Number.NaN, y: Number.NaN });
  // Cached letter centres relative to the container. Rebuilt only when the
  // container moves/resizes (scroll, resize, layout shift) instead of
  // getBoundingClientRect per letter on every frame while moving the mouse.
  const cachedCentresRef = useRef<{ el: HTMLSpanElement; x: number; y: number }[] | null>(null);
  const lastContainerKeyRef = useRef<string>("");

  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            const parts = s.split(" ");
            const name = parts[0]?.replace(/['"]/g, "") ?? "";
            const value = parseFloat(parts[1] ?? "");
            return [name, Number.isNaN(value) ? 0 : value] as const;
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case "exponential":
        return norm ** 2;
      case "gaussian":
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case "linear":
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    // Single layout read per frame; letter centres come from cache unless
    // the container moved (scroll/resize) or the letter list changed.
    const containerKey = `${containerRect.left}|${containerRect.top}|${containerRect.width}|${containerRect.height}|${letterRefs.current.length}`;
    if (!cachedCentresRef.current || lastContainerKeyRef.current !== containerKey) {
      const centres: { el: HTMLSpanElement; x: number; y: number }[] = [];
      letterRefs.current.forEach((letterRef) => {
        if (!letterRef) return;
        const rect = letterRef.getBoundingClientRect();
        centres.push({
          el: letterRef,
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
        });
      });
      cachedCentresRef.current = centres;
      lastContainerKeyRef.current = containerKey;
    }

    cachedCentresRef.current.forEach(({ el: letterRef, x: letterCenterX, y: letterCenterY }) => {
      const distance = calculateDistance(
        mousePositionRef.current.x,
        mousePositionRef.current.y,
        letterCenterX,
        letterCenterY,
      );

      if (distance >= radius) {
        letterRef.style.fontVariationSettings = fromFontVariationSettings;
        return;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");

      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`variable-proximity ${className}`.trim()}
      onClick={onClick}
      style={{ display: "inline", ...style }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: "inline-block",
                  fontVariationSettings: fromFontVariationSettings,
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span style={{ display: "inline-block" }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;
