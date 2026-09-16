import re
with open('src/styles/base.css', 'r', encoding='utf-8') as f:
    content = f.read()

old_css = r'''  \.fresh-hero::before \{
    position: absolute;
    inset: 1\.5rem max\(1rem, calc\(\(100% - 1320px\) / 2\)\) 1\.5rem;
    border-radius: 2\.5rem;
    border: 1px solid color-mix\(in srgb, var\(--color-purple\) 15%, var\(--dl-line-card\)\);
    background: color-mix\(in srgb, var\(--color-surface-2\) 88%, transparent\);
    box-shadow: 0 24px 70px color-mix\(in srgb, var\(--color-purple\) 12%, transparent\);
    backdrop-filter: blur\(16px\);
    content: "";
  \}'''

new_css = '''  .fresh-hero::before {
    position: absolute;
    inset: 0 0 1.5rem;
    border-radius: 0 0 2.5rem 2.5rem;
    border-bottom: 1px solid color-mix(in srgb, var(--color-purple) 15%, var(--dl-line-card));
    background: color-mix(in srgb, var(--color-surface-2) 88%, transparent);
    box-shadow: 0 24px 70px color-mix(in srgb, var(--color-purple) 12%, transparent);
    backdrop-filter: blur(16px);
    content: "";
  }'''

content = re.sub(old_css, new_css, content)

with open('src/styles/base.css', 'w', encoding='utf-8') as f:
    f.write(content)
