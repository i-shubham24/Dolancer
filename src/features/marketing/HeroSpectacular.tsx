import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, ShieldCheck, Wallet } from "lucide-react";

const STEPS = [
  {
    n: "Step 1",
    title: "Dolancer gives work",
    desc: "Tells what to do, fixes your money first.",
    img: "/images/hero/portrait-4.webp",
    icon: Briefcase,
    tag: "Money fixed first",
    glow: "bg-pink-300",
    ring: "border-white ring-pink-200",
  },
  {
    n: "Step 2",
    title: "Supervisor guides you",
    desc: "Gives you the right work, checks it.",
    img: "/images/hero/portrait-1.webp",
    icon: ShieldCheck,
    tag: "Helps you",
    active: true,
    glow: "bg-[#0a65c0]/40",
    ring: "border-[#0a65c0]",
  },
  {
    n: "Step 3",
    title: "You earn money",
    desc: "Finish the work, money comes to bank / UPI.",
    img: "/images/hero/portrait-2.webp",
    icon: Wallet,
    tag: "₹4,200 paid",
    glow: "bg-amber-300",
    ring: "border-white ring-amber-200",
  },
];

export function HeroSpectacular() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-[34px] sm:text-5xl lg:text-[64px] font-extrabold text-[#111827] tracking-[-0.03em] leading-[1.08]">
            Get paid for what you're{" "}
            <span className="text-[#0a65c0] relative inline-block">
              good at.
              <svg className="absolute -bottom-1 left-0 w-full h-3 text-[#22d3ee]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 2 8 L 98 4" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            No fight for work. Clear tasks, a supervisor to guide you, and money fixed before you start.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/sign-up"
              className="inline-flex items-center rounded-full bg-[#0a65c0] px-8 py-3.5 text-[15px] sm:text-base font-bold text-white hover:bg-[#0854a0] shadow-lg shadow-[#0a65c0]/25 transition-colors"
            >
              Start Earning <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-8 py-3.5 text-[15px] sm:text-base font-bold text-slate-700 hover:border-slate-400 transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Curvy arc workflow */}
        <div className="relative mt-10 sm:mt-12 mx-auto max-w-[720px]">
          {/* Desktop curvy line: hill shape */}
          <svg
            className="hidden sm:block absolute inset-x-0 top-0 w-full h-[130px] pointer-events-none"
            viewBox="0 0 800 160"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 110 120 C 230 120, 260 40, 400 40 C 540 40, 570 120, 690 120"
              stroke="#0a65c0"
              strokeWidth="2"
              strokeDasharray="7 7"
              strokeLinecap="round"
              opacity="0.35"
            />
            <circle cx="110" cy="120" r="4" fill="#0a65c0" opacity="0.5" />
            <circle cx="400" cy="40" r="4" fill="#0a65c0" opacity="0.5" />
            <circle cx="690" cy="120" r="4" fill="#0a65c0" opacity="0.5" />
          </svg>

          {/* Mobile curvy line: vertical wave */}
          <svg
            className="sm:hidden absolute left-1/2 -translate-x-1/2 top-0 h-full w-[60px] pointer-events-none"
            viewBox="0 0 60 600"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 30 0 C 5 110, 55 180, 30 300 C 5 420, 55 490, 30 600"
              stroke="#0a65c0"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>

          <ol className="relative flex flex-col sm:grid sm:grid-cols-3 gap-10 sm:gap-4 items-center">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const lift =
                i === 1
                  ? "sm:-mt-6"
                  : i === 0
                    ? "sm:mt-8 -translate-x-5 sm:translate-x-0"
                    : "sm:mt-8 translate-x-5 sm:translate-x-0";
              return (
                <li key={s.n} className={`relative text-center ${lift}`}>
                  <div className="relative inline-block">
                    <div
                      className={`absolute -inset-2 rounded-full blur-lg opacity-40 ${s.glow}`}
                      aria-hidden="true"
                    />
                    <img
                      src={s.img}
                      alt={s.title}
                      width={512}
                      height={512}
                      className={`relative rounded-full object-cover bg-slate-100 shadow-md ${
                        s.active
                          ? `h-24 w-24 border-[3px] ${s.ring}`
                          : `h-[72px] w-[72px] border-[3px] ${s.ring} ring-1`
                      }`}
                      loading="eager"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#0a65c0] text-white border-2 border-white shadow">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <p className="mt-2.5 text-[10.5px] font-extrabold uppercase tracking-widest text-[#0a65c0]">
                    {s.n}
                  </p>
                  <h3 className="text-[15px] font-extrabold text-slate-900">{s.title}</h3>
                  <p className="mt-0.5 text-[12.5px] text-slate-500 font-medium max-w-[200px] mx-auto">
                    {s.desc}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                      s.active ? "bg-[#0a65c0] text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {s.tag}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-8 text-center text-xs font-semibold text-slate-500">
          No bidding · Money fixed first · Supervisor talks to the client
        </p>
      </div>
    </section>
  );
}
