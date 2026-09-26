import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowCircleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor on touch devices or small screens
    if (
      window.matchMedia("(hover: none)").matches ||
      window.innerWidth < 768 ||
      ("ontouchstart" in window) ||
      navigator.maxTouchPoints > 0
    ) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let isVisible = false;
    let isHovering = false;
    let animationFrameId: number;

    const setVisible = (visible: boolean) => {
      if (isVisible === visible) return;
      isVisible = visible;
      const opacity = visible ? "1" : "0";
      if (cursorRef.current) cursorRef.current.style.opacity = opacity;
      if (glowRef.current) glowRef.current.style.opacity = opacity;
    };

    const setHover = (hover: boolean) => {
      if (isHovering === hover) return;
      isHovering = hover;
      if (ringRef.current) {
        ringRef.current.style.opacity = hover ? "1" : "0";
        ringRef.current.style.transform = hover ? "scale(1)" : "scale(0.35)";
      }
      if (glowCircleRef.current) {
        glowCircleRef.current.style.transform = hover ? "scale(1.4)" : "scale(1)";
      }
    };

    // Smooth trailing lerp loop solely for the soft ambient background glow
    const updateGlow = () => {
      glowX += (mouseX - glowX) * 0.22;
      glowY += (mouseY - glowY) * 0.22;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateGlow);
    };

    // Instant mouse event handler - direct transform for 0ms cursor lag
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setVisible(true);

      // Instant hardware-rate transform for primary cursor ball
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Fast clickable detection without expensive getComputedStyle
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest(
            'a, button, input, select, textarea, [role="button"], [tabindex], .cursor-pointer, summary, label'
          ) !== null;
        setHover(isClickable);
      }
    };

    const handleMouseDown = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = "scale(0.75)";
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = "#2563eb";
      }
    };

    const handleMouseUp = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = "scale(1)";
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = "#60a5fa";
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });

    updateGlow();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (
    typeof window !== "undefined" &&
    (window.matchMedia("(hover: none)").matches ||
      window.innerWidth < 768 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0)
  ) {
    return null;
  }

  return (
    <>
      {/* Soft Blue Spotlight Glow (Smooth ambient trail) */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div
          ref={glowCircleRef}
          className="w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
            transform: "scale(1)",
            transition: "transform 0.2s ease-out",
            willChange: "transform",
          }}
        />
      </div>

      {/* Solid Glowing Blue Ball with Hover Ring (0ms latency direct hardware transform) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.15s ease-out",
        }}
      >
        <div
          ref={dotRef}
          className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_2px_rgba(59,130,246,0.8)] relative z-10 transition-transform duration-75"
        />

        {/* Expanding Ring on Hover */}
        <div
          ref={ringRef}
          className="absolute w-9 h-9 border-[1.5px] border-blue-400 rounded-full"
          style={{
            opacity: 0,
            transform: "scale(0.35)",
            transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease-out",
            willChange: "transform, opacity",
          }}
        />
      </div>
    </>
  );
}
