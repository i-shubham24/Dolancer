import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ end, duration = 2, className, prefix = "", suffix = "" }: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [count, setCount] = useState(reduceMotion ? end : 0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutQuad = (t: number) => t * (2 - t);

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const currentCount = Math.floor(easeOutQuad(progress) * end);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, isInView, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
