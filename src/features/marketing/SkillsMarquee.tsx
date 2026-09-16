

const row1Skills = [
  'UI/UX Design', 'React & Next.js', 'Content Writing', 'Data Analysis', 
  'Video Editing', 'Python', 'WordPress', 'Copywriting', 'Graphic Design', 'SEO Strategy'
];

const row2Skills = [
  'Branding', 'Social Media', 'Product Photography', 'Figma', 
  'JavaScript', 'Email Marketing', 'Presentation Design', 'Research', 'Translation', 'Mobile Dev'
];

export function SkillsMarquee() {
  return (
    <section className="py-12 overflow-hidden">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.5rem)); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(calc(-50% - 0.5rem)); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          animation: scroll-left 35s linear infinite;
        }
        .marquee-track-right {
          animation: scroll-right 35s linear infinite;
        }
        .marquee-container:hover .marquee-track-left,
        .marquee-container:hover .marquee-track-right {
          animation-play-state: paused;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          WebkitMaskImage: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 mask-gradient marquee-container flex flex-col gap-4">
        {/* Row 1 */}
        <div className="flex w-max marquee-track-left gap-4">
          {[...row1Skills, ...row1Skills].map((skill, index) => (
            <div 
              key={`r1-${index}`} 
              className="bg-surface border border-line-card px-4 py-2 rounded-full text-sm font-bold text-ink-2 whitespace-nowrap"
            >
              {skill}
            </div>
          ))}
        </div>
        
        {/* Row 2 */}
        <div className="flex w-max marquee-track-right gap-4">
          {[...row2Skills, ...row2Skills].map((skill, index) => (
            <div 
              key={`r2-${index}`} 
              className="bg-surface border border-line-card px-4 py-2 rounded-full text-sm font-bold text-ink-2 whitespace-nowrap"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
