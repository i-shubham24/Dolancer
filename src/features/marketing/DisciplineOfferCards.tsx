import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Using Unsplash images that have relatively clean backgrounds to mimic the cutout feel
const DISCIPLINES = [
  {
    id: "content",
    name: "Writing &\nContent",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "design",
    name: "Design &\nCreative",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "it",
    name: "IT &\nSoftware",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "marketing",
    name: "Digital\nMarketing",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "data",
    name: "Data &\nAdmin",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "video",
    name: "Video &\nAnimation",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
  },
];

export function DisciplineOfferCards() {
  return (
    <section className="fresh-section py-20 bg-white relative">
      <div className="fresh-container">
        <div className="mb-16 text-center">
          <span className="block text-xs font-extrabold uppercase tracking-widest text-primary mb-4">
            Your Expertise
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A1A44] tracking-[-0.02em] max-w-3xl mx-auto font-display leading-[1.1]">
            Choose what you're <span className="text-[#0A1A44] relative inline-block z-10">good at.
              <svg className="absolute -bottom-1 left-0 w-full h-4 text-[#22d3ee] -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 2 8 L 98 4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h2>
          <p className="mt-8 text-ink-muted font-medium text-lg max-w-2xl mx-auto">
            Select your verified disciplines and receive scoped briefs matched precisely to your strengths. You only work on what you do best.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DISCIPLINES.map((discipline, idx) => (
            <motion.div
              key={discipline.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-[2rem] bg-[#f9fafb] border border-line-card/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-h-[260px] flex flex-col"
            >
              <div className="p-8 z-10 flex flex-col h-full">
                
                <h3 className="text-2xl lg:text-3xl font-extrabold text-ink tracking-tight mb-auto w-3/4 leading-tight whitespace-pre-line">
                  {discipline.name}
                </h3>

                <Link 
                  to="/sign-up" 
                  className="mt-6 flex items-center gap-1 text-primary font-extrabold text-sm hover:gap-2 transition-all w-fit"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Integrating the photo artistically to mimic a cutout/placed image */}
              <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-56 sm:h-56 translate-x-4 translate-y-4 group-hover:scale-105 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 rounded-tl-[3rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent z-10 mix-blend-screen opacity-50" />
                <img 
                  src={discipline.image} 
                  alt={discipline.name}
                  className="w-full h-full object-cover rounded-tl-[3rem] shadow-[-10px_-10px_30px_rgba(0,0,0,0.05)] border-t border-l border-white"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
