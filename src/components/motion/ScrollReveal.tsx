import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up", 
  distance = 30,
  duration = 0.6,
  className,
  ...props 
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: distance };
      case "down": return { y: -distance };
      case "left": return { x: distance };
      case "right": return { x: -distance };
      default: return { y: distance };
    }
  };

  if (reduceMotion) {
    return <motion.div className={className} {...props}>{children}</motion.div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration, 
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
