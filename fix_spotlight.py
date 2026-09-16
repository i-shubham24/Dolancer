import re

with open('src/features/marketing/HeroSpotlight.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    const animate = () => {
      if (spotlightRef.current && wrapperRef.current) {
        if (isHovering.current) {
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
          }
          spotlightRef.current.style.opacity = '0';
        }
      }
      rafId = requestAnimationFrame(animate);
    };"""

content = re.sub(r'    const animate = \(\) => \{\n      if \(spotlightRef\.current && wrapperRef\.current\) \{[\s\S]*?\}\n      rafId = requestAnimationFrame\(animate\);\n    \};', replacement, content)

with open('src/features/marketing/HeroSpotlight.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
