import os, re
path = 'src/features/marketing/MarketingLayout.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# The original nav block
old_nav = r'''          <nav className="ml-8 lg:ml-12 hidden md:flex" aria-label="Main">
            {/\* Dock-magnified nav links: each pill grows toward the cursor\. \*/}
            <Dock
              expand={false}
              panelHeight={40}
              distance={110}
              ariaLabel="Main navigation"
              className="gap-1\.5 rounded-full bg-transparent px-0"
            >
              {NAV\.map\(\(item\) => \(
                <DockItem key={item\.to} baseWidth={item\.to === "/how-it-works" \? 118 : item\.to === "/about" \? 70 : 82}>
                  <DockIcon>
                    <NavLink
                      to={item\.to}
                      aria-label={item\.label}
                      className={\(\{ isActive \}\) =>
                        cn\(
                          "flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-colors",
                          isActive \? "bg-subtle text-ink" : "text-ink-2 hover:text-ink",
                        \)
                      }
                    >
                      {item\.label}
                    </NavLink>
                  </DockIcon>
                  <DockLabel className="border-line-card bg-surface text-ink-2 shadow-soft-xs">{item\.label}</DockLabel>
                </DockItem>
              \)\)}
            </Dock>
          </nav>'''

new_nav = '''          <nav className="ml-8 lg:ml-12 hidden md:flex items-center gap-1.5" aria-label="Main">
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

content = re.sub(old_nav, new_nav, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
