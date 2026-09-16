import re

with open('src/features/marketing/LiveActivityTicker.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the toast dark and symmetrical to the nav
old_wrapper = 'className="bg-white/95 backdrop-blur-sm border border-line-card rounded-2xl shadow-soft-md px-4 py-3 pointer-events-auto flex items-center gap-3"'
new_wrapper = 'className="bg-coral border border-coral-light/20 rounded-full shadow-[0_8px_24px_color-mix(in_srgb,var(--color-coral)_40%,transparent)] px-5 py-3 pointer-events-auto flex items-center gap-3"'
content = content.replace(old_wrapper, new_wrapper)

# Update text color
old_text = '<span className="text-sm font-medium text-ink-2">'
new_text = '<span className="text-sm font-bold text-inverse">'
content = content.replace(old_text, new_text)

# Make the dot pop more on dark
content = content.replace('bg-green-400', 'bg-lime-400')
content = content.replace('bg-green-500', 'bg-lime-500')

with open('src/features/marketing/LiveActivityTicker.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
