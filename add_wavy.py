import re
with open('src/features/marketing/HowItWorksPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'CurvedSectionDivider' not in content:
    content = content.replace('import { HowItWorksHeroGraphic } from "./HowItWorksHeroGraphic";', 'import { HowItWorksHeroGraphic } from "./HowItWorksHeroGraphic";\nimport { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";')

# Add wavy divider between the 5x creative and the workflow demo
old_section = r'''      {/\* Redesigned 5x Creative Interactive Four Moments Section \*/}
      <section className="bg-surface-2 py-14 lg:py-20 relative">
        <div className="fresh-container">
          <GettingStartedInteractive />
        </div>
      </section>

      <Section labelledBy="walkthrough" className="fresh-workflow !pt-6 !pb-12 lg:!pb-16">'''

new_section = '''      {/* Redesigned 5x Creative Interactive Four Moments Section */}
      <section className="bg-surface-2 py-14 lg:py-28 relative">
        <div className="fresh-container">
          <GettingStartedInteractive />
        </div>
        <CurvedSectionDivider variant="smooth-arch" position="bottom" fillColor="fill-surface" />
      </section>

      <Section labelledBy="walkthrough" className="fresh-workflow !pt-20 !pb-12 lg:!pb-16">'''

content = re.sub(old_section, new_section, content)

with open('src/features/marketing/HowItWorksPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
