import os
path = 'src/features/marketing/MarketingLayout.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

start_index = content.find('<nav className="ml-8 lg:ml-12 hidden md:flex" aria-label="Main">')
end_index = content.find('</nav>', start_index) + 6

new_nav = '''<nav className="ml-8 lg:ml-12 hidden md:flex items-center gap-1.5" aria-label="Main">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-colors",
                    isActive ? "bg-subtle text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>'''

content = content[:start_index] + new_nav + content[end_index:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
