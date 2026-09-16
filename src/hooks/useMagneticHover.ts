import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useMagneticHover<T extends HTMLElement = HTMLDivElement>(
  strength: number = 0.3,
  radius: number = 40
) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let rafId: number | null = null;
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      if (!isHovering) {
        rafId = null;
        return; // Halt the loop!
      }
      
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      element.style.transform = `translate(${currentX}px, ${currentY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        if (!isHovering) {
            isHovering = true;
            element.style.transition = 'none'; // Disable transition while tracking
            if (!rafId) rafId = requestAnimationFrame(animate);
        }
        targetX = distX * strength;
        targetY = distY * strength;
      } else {
        if (isHovering) {
            isHovering = false;
            targetX = 0;
            targetY = 0;
            currentX = 0;
            currentY = 0;
            element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            element.style.transform = '';
            // animate() will naturally halt on next tick because isHovering is false
        }
      }
    };

    const onMouseLeave = () => {
      if (isHovering) {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        currentX = 0;
        currentY = 0;
        element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        element.style.transform = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
      
      // Reset styles
      element.style.transform = '';
      element.style.transition = '';
    };
  }, [reducedMotion, strength, radius]);

  return ref;
}
