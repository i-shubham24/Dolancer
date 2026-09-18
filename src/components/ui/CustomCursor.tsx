import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Extra aggressive check to disable on touch devices
    if (
      window.matchMedia("(hover: none)").matches ||
      window.innerWidth < 768 ||
      ('ontouchstart' in window) ||
      navigator.maxTouchPoints > 0
    ) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let glowX = mouseX;
    let glowY = mouseY;
    
    let isVisibleLocal = false;
    
    let animationFrameId: number;

    const updateCursor = () => {
      // Lerp for the glow (follows loosely)
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisibleLocal) {
        isVisibleLocal = true;
        setIsVisible(true);
      }
      
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if we're hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isClickable);
    };

    const handleMouseLeave = () => {
      isVisibleLocal = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleLocal = true;
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    
    updateCursor();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (
    typeof window !== 'undefined' && 
    (window.matchMedia('(hover: none)').matches || window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0)
  ) {
    return null;
  }

  return (
    <>
      {/* Soft Blue Spotlight Glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
          transition: "opacity 0.3s ease",
        }}
      >
        <div 
          className="w-[400px] h-[400px] rounded-full" 
          style={{ 
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
            transform: isHovering ? "scale(1.5)" : "scale(1)",
            transition: "transform 0.3s ease",
            willChange: "transform"
          }}
        />
      </div>

      {/* Solid Glowing Blue Ball with Hover Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_2px_rgba(59,130,246,0.8)] relative z-10" />
        
        {/* Expanding Ring on Hover */}
        <div
          className="absolute w-9 h-9 border-[1.5px] border-blue-400 rounded-full"
          style={{ 
            opacity: isHovering ? 1 : 0,
            transform: isHovering ? "scale(1)" : "scale(0.3)",
            transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
            willChange: "transform, opacity"
          }}
        />
      </div>
    </>
  );
}
