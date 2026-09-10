import { useCallback, useRef } from "react";

/**
 * Tilts an element toward the cursor.
 *
 * Writes two CSS custom properties rather than restyling in React, so the browser
 * handles it on the compositor and no re-render happens on mouse move. Pair with the
 * `cursor-tilt` class, which reads them.
 *
 * `maxDeg` stays small on purpose: a couple of degrees reads as a physical object
 * catching the light, while anything larger reads as a gimmick and makes text hard
 * to follow. Pointer events on a touch screen do not fire this, and the class is
 * neutralised under prefers-reduced-motion.
 */
export function useCursorTilt(maxDeg = 4) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Coarse pointers land in the middle of the element on tap, which would
      // produce a meaningless tilt, so leave touch alone entirely.
      if (event.pointerType !== "mouse") return;
      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      node.style.setProperty("--tilt-y", `${px * maxDeg * 2}deg`);
      node.style.setProperty("--tilt-x", `${-py * maxDeg * 2}deg`);
    },
    [maxDeg],
  );

  const onPointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-y", "0deg");
    node.style.setProperty("--tilt-x", "0deg");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
