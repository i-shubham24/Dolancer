import re

with open('src/hooks/useMagneticHover.ts', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """    let rafId: number | null = null;
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
    };"""

content = re.sub(r'    let rafId: number;\n    let isHovering = false;[\s\S]*?const onMouseLeave = \(\) => \{[\s\S]*?element\.style\.transform = \'\';\n      \}\n    \};', replacement, content)

# Remove the initial rafId = requestAnimationFrame(animate); 
content = content.replace("    rafId = requestAnimationFrame(animate);\n\n    return () => {", "    return () => {")

# Fix cancelAnimationFrame type issue
content = content.replace("cancelAnimationFrame(rafId);", "if (rafId) cancelAnimationFrame(rafId);")

with open('src/hooks/useMagneticHover.ts', 'w', encoding='utf-8') as f:
    f.write(content)
