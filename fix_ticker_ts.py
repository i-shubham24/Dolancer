import re

with open('src/features/marketing/LiveActivityTicker.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix React import
content = content.replace("import React, { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';")

# Fix shuffleArray TS error
shuffle_replacement = """function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArr[i] as T;
    newArr[i] = newArr[j] as T;
    newArr[j] = temp;
  }
  return newArr;
}"""
content = re.sub(r'function shuffleArray<T>\(array: T\[\]\): T\[\] \{[\s\S]*?return newArr;\n\}', shuffle_replacement, content)

# Fix msg TS error
msg_fix = """      const msg = shuffledMessages[index % shuffledMessages.length];
      if (!msg) return;
      setCurrentMessage(msg);"""
content = content.replace("      const msg = shuffledMessages[index % shuffledMessages.length];\n      setCurrentMessage(msg);", msg_fix)

with open('src/features/marketing/LiveActivityTicker.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
