import re

with open('src/hooks/useMagneticHover.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement_mouse = """    const onMouseMove = (e: MouseEvent) => {
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
    };"""

content = re.sub(r'    const onMouseMove = \(e: MouseEvent\) => \{[\s\S]*?const onMouseLeave = \(\) => \{[\s\S]*?element\.style\.transition = \'transform 0\.5s cubic-bezier\(0\.25, 1, 0\.5, 1\)\';\n    \};', replacement_mouse, content)

with open('src/hooks/useMagneticHover.ts', 'w', encoding='utf-8') as f:
    f.write(content)
