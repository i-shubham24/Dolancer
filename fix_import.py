import os
path = 'src/features/marketing/MarketingLayout.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('import { Dock, DockIcon, DockItem, DockLabel } from "@/components/motion-primitives/dock";\n', '')
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
