import re

with open('src/hooks/useMagneticHover.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    const animate = () => {
      if (isHovering) {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }

      rafId = requestAnimationFrame(animate);
    };"""

content = re.sub(r'    const animate = \(\) => \{[\s\S]*?rafId = requestAnimationFrame\(animate\);\n    \};', replacement, content)

with open('src/hooks/useMagneticHover.ts', 'w', encoding='utf-8') as f:
    f.write(content)
