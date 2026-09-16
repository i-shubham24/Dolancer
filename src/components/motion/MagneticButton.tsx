import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
}

export function MagneticButton({ 
  children, 
  strength = 30, 
  radius = 60,
  className,
  ...props 
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < radius) {
      setPosition({ 
        x: (distanceX / radius) * strength, 
        y: (distanceY / radius) * strength 
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
