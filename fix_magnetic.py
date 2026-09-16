import re

with open('src/hooks/useMagneticHover.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix infinite rAF loop
replacement = """    const animate = () => {
      // Only animate if we are hovering OR if we haven't settled back to origin
      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      
      if (isHovering || diffX > 0.01 || diffY > 0.01) {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        element.style.transform = `translate(${currentX}px, ${currentY}px)`;
      } else {
        // Snap to exact zero to prevent floating point jitter
        if (currentX !== 0 || currentY !== 0) {
          currentX = 0;
          currentY = 0;
          element.style.transform = `translate(0px, 0px)`;
        }
      }

      rafId = requestAnimationFrame(animate);
    };"""

content = re.sub(r'    const animate = \(\) => \{\n      currentX \+= \(targetX - currentX\) \* 0\.15;\n      currentY \+= \(targetY - currentY\) \* 0\.15;\n\n      element\.style\.transform = `translate\(\$\{currentX\}px, \$\{currentY\}px\)`\n\n      rafId = requestAnimationFrame\(animate\);\n    \};', replacement, content)

with open('src/hooks/useMagneticHover.ts', 'w', encoding='utf-8') as f:
    f.write(content)
