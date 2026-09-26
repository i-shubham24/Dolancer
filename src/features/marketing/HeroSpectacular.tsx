import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroEngineer {
  id: number;
  name: string;
  designation: string;
  image: string;
  bgColor: string;
  size: "sm" | "md" | "lg";
}

const ENGINEERS: HeroEngineer[] = [
  {
    id: 1,
    name: "Guy Hawkins",
    designation: "Mechanical Engineer",
    image: "/images/hero/portrait-1.png",
    bgColor: "bg-[#74b9ff]",
    size: "sm",
  },
  {
    id: 2,
    name: "Cameron Williamson",
    designation: "Computer Engineer",
    image: "/images/hero/portrait-2.png",
    bgColor: "bg-[#ffcc80]",
    size: "md",
  },
  {
    id: 3,
    name: "Bessie Cooper",
    designation: "Computer Engineer",
    image: "/images/hero/portrait-3.png",
    bgColor: "bg-[#80cbc4]",
    size: "lg",
  },
  {
    id: 4,
    name: "Esther Howard",
    designation: "Computer Engineer",
    image: "/images/hero/portrait-4.png",
    bgColor: "bg-[#f8bbd0]",
    size: "md",
  },
  {
    id: 5,
    name: "Robert Fox",
    designation: "Mechanical Engineer",
    image: "/images/hero/portrait-5.png",
    bgColor: "bg-[#d1c4e9]",
    size: "sm",
  },
];

export function HeroSpectacular() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20">
      {/* Subtle Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Top Header & Copy */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight font-display leading-[1.12]">
            Get paid for what you're{" "}
            <span className="text-[#0a65c0] relative inline-block">
              good at.
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Skip the bidding wars. Join our verified doer network to find scoped work, collaborate with a supervisor, and earn according to clear upfront terms.
          </p>

          {/* Action Buttons from Old Hero */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-[#0a65c0] px-6 py-2 sm:px-7 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0854a0] transition-all shadow-md shadow-[#0a65c0]/20 active:scale-95"
            >
              <span>Join the network</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* 5 Engineer Cascading Cards with Stepped Bracket Line Visible Below Profiles */}
        <div className="relative mt-6 sm:mt-8 lg:mt-10 max-w-[960px] mx-auto overflow-x-auto pb-4 scrollbar-none flex justify-center">
          <div className="relative flex items-start justify-center gap-5 w-[920px] shrink-0 pt-2 pb-10">
            
            {/* Stepped connecting line running clearly below profiles */}
            <svg
              className="absolute inset-0 w-[920px] h-[320px] pointer-events-none z-0 overflow-visible"
              viewBox="0 0 920 320"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M -1000 196 L 144 196 C 154 196 154 232 164 232 L 332 232 C 342 232 342 280 352 280 L 568 280 C 578 280 578 232 588 232 L 756 232 C 766 232 766 196 776 196 L 1920 196"
                stroke="#0a65c0"
                strokeWidth="1.75"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            </svg>

            {/* Cards Flex Row */}
            {ENGINEERS.map((engineer) => {
              const isCenter = engineer.size === "lg";
              const isMid = engineer.size === "md";

              return (
                <div
                  key={engineer.id}
                  className={`flex flex-col items-center flex-shrink-0 transition-transform duration-300 hover:-translate-y-1 relative z-10 ${
                    isCenter 
                      ? "w-[216px]" 
                      : isMid 
                        ? "w-[168px]" 
                        : "w-[144px]"
                  }`}
                >
                  {/* Colored Portrait Box */}
                  <div
                    className={`w-full overflow-hidden rounded-2xl ${engineer.bgColor} shadow-sm border border-slate-200/50 flex items-end justify-center ${
                      isCenter 
                        ? "h-[220px]" 
                        : isMid 
                          ? "h-[180px]" 
                          : "h-[145px]"
                    }`}
                  >
                    <img
                      src={engineer.image}
                      alt={engineer.name}
                      className="w-full h-full object-cover object-bottom"
                      loading="eager"
                    />
                  </div>

                  {/* Name & Designation Pill Badge (solid white background hides the line behind it) */}
                  <div className={`w-[94%] -mt-3.5 relative z-20 rounded-xl bg-white text-center shadow-[0_3px_12px_rgba(0,0,0,0.06)] border border-slate-100 ${
                    isCenter ? "px-3 py-2 sm:py-2.5" : "px-2 py-1.5 sm:py-2"
                  }`}>
                    <p className={`font-bold text-slate-800 tracking-tight leading-tight ${
                      isCenter ? "text-xs sm:text-[13px]" : "text-[10px] sm:text-[11px]"
                    }`}>
                      {engineer.name}
                    </p>
                    <p className="mt-0.5 text-[8.5px] sm:text-[10px] text-slate-500 font-medium leading-none">
                      {engineer.designation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
