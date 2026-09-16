import re

with open('src/features/marketing/HeroSpotlight.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    let rafId: number | null = null;
    let isSettled = false;

    const animate = () => {
      if (!spotlightRef.current || !wrapperRef.current) {
        rafId = null;
        return;
      }

      if (isHovering.current) {
        isSettled = false;
        current.current.x += (mouse.current.x - current.current.x) * 0.1;
        current.current.y += (mouse.current.y - current.current.y) * 0.1;
        spotlightRef.current.style.opacity = '1';
        spotlightRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
      } else {
        const rect = wrapperRef.current.getBoundingClientRect();
        const center = { x: rect.width / 2, y: rect.height / 2 };
        
        const diffX = Math.abs(center.x - current.current.x);
        const diffY = Math.abs(center.y - current.current.y);
        
        if (diffX > 0.5 || diffY > 0.5) {
          current.current.x += (center.x - current.current.x) * 0.05;
          current.current.y += (center.y - current.current.y) * 0.05;
          spotlightRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
        } else {
          isSettled = true;
        }
        spotlightRef.current.style.opacity = '0';
      }
      
      if (isSettled && !isHovering.current) {
        rafId = null; // Halt loop
      } else {
        rafId = requestAnimationFrame(animate);
      }
    };
    
    // Start initial loop
    rafId = requestAnimationFrame(animate);"""

# Replace the animate function and the variable declaration
content = re.sub(r'    let rafId: number;\n\n    const animate = \(\) => \{[\s\S]*?rafId = requestAnimationFrame\(animate\);\n    \};[\s]*rafId = requestAnimationFrame\(animate\);', replacement, content)

# Need to also re-trigger the loop in onMouseMove if it settled
# But onMouseMove is in the first useEffect, and animate is in the second.
# Wait, this means they don't share rafId.
# Let's combine them into one useEffect.
