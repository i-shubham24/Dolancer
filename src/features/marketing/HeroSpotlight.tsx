import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function HeroSpotlight({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isHovering.current = true;
    };
    
    const onMouseLeave = () => {
      isHovering.current = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let rafId: number;

    const animate = () => {
      if (spotlightRef.current && wrapperRef.current) {
        if (isHovering.current) {
          current.current.x += (mouse.current.x - current.current.x) * 0.1;
          current.current.y += (mouse.current.y - current.current.y) * 0.1;
          spotlightRef.current.style.opacity = '1';
        } else {
          const rect = wrapperRef.current.getBoundingClientRect();
          const center = { x: rect.width / 2, y: rect.height / 2 };
          current.current.x += (center.x - current.current.x) * 0.05;
          current.current.y += (center.y - current.current.y) * 0.05;
          spotlightRef.current.style.opacity = '0';
        }
        
        spotlightRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const reducedMotionStyle = reducedMotion ? {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 1
  } : {
    top: 0,
    left: 0,
    opacity: 0,
    transform: 'translate(-50%, -50%)'
  };

  return (
    <div 
      ref={wrapperRef}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden [@media(hover:none)]:hidden ${className}`}
      aria-hidden="true"
    >
      <div
        ref={spotlightRef}
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle 400px at center, color-mix(in srgb, var(--color-coral, #ff7b54) 12%, transparent), transparent)',
          transition: reducedMotion ? 'none' : 'opacity 0.5s ease',
          ...reducedMotionStyle
        }}
      />
    </div>
  );
}
