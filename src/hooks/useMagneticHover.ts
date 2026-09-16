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

    let rafId: number;
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        isHovering = true;
        targetX = distX * strength;
        targetY = distY * strength;
        element.style.transition = 'none'; // Disable transition while tracking
      } else {
        if (isHovering) {
            isHovering = false;
            targetX = 0;
            targetY = 0;
            element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }
      }
    };

    const onMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      
      // Reset styles
      element.style.transform = '';
      element.style.transition = '';
    };
  }, [reducedMotion, strength, radius]);

  return ref;
}
