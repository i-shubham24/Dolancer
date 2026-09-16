import re

with open('src/features/marketing/SkillsMarquee.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix React import
content = content.replace("import React from 'react';", "")
content = content.replace("import React, ", "import ")

with open('src/features/marketing/SkillsMarquee.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
