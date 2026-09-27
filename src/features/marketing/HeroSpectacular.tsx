import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, ShieldCheck, Wallet } from "lucide-react";

const STEPS = [
  {
    n: "Step 1",
    title: "Client gives work",
    desc: "Tells what to do, fixes your money first.",
    img: "/images/hero/portrait-4.png",
    icon: Briefcase,
    tag: "Money fixed first",
    glow: "bg-pink-300",
    ring: "border-white ring-pink-200",
  },
  {
    n: "Step 2",
    title: "Supervisor guides you",
    desc: "Gives you the right work, checks it.",
    img: "/images/hero/portrait-1.png",
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
    img: "/images/hero/portrait-2.png",
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
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.12]">
            Get paid for what you're{" "}
            <span className="text-[#0a65c0] relative inline-block">
              good at.
              <svg className="absolute -bottom-1 left-0 w-full h-3 text-[#22d3ee]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 2 8 L 98 4" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
            No fight for work. Clear tasks, a supervisor to guide you, and money fixed before you start.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sign-up"
              className="inline-flex items-center rounded-full bg-[#0a65c0] px-6 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#0854a0] shadow-md shadow-[#0a65c0]/20"
            >
              Start earning <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:border-slate-400"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Curvy arc workflow */}
        <div className="relative mt-6 sm:mt-8 mx-auto max-w-[880px]">
          {/* Desktop curvy line — hill shape */}
          <svg
            className="hidden sm:block absolute inset-x-0 top-2 w-full h-[160px] pointer-events-none"
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

          {/* Mobile curvy line — vertical wave */}
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
                  ? "sm:-mt-8"
                  : i === 0
                    ? "sm:mt-10 -translate-x-5 sm:translate-x-0"
                    : "sm:mt-10 translate-x-5 sm:translate-x-0";
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
                      className={`relative rounded-full object-cover object-top bg-slate-100 shadow-md ${
                        s.active
                          ? `h-32 w-32 border-4 ${s.ring}`
                          : `h-24 w-24 border-4 ${s.ring} ring-1`
                      }`}
                      loading="eager"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a65c0] text-white border-2 border-white shadow">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] font-extrabold uppercase tracking-widest text-[#0a65c0]">
                    {s.n}
                  </p>
                  <h3 className="text-base font-extrabold text-slate-900">{s.title}</h3>
                  <p className="mt-0.5 text-[13px] text-slate-500 font-medium max-w-[220px] mx-auto">
                    {s.desc}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold ${
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
