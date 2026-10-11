import {
  Lock,
  Ban,
  ShieldCheck,
  Banknote,
  CheckCircle2,
  EyeOff,
  IndianRupee,
} from "lucide-react";

interface MarqueeItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tag: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  {
    icon: Lock,
    title: "Pay fixed before you start",
    tag: "No surprises",
  },
  {
    icon: Ban,
    title: "No bidding",
    tag: "Work comes to you",
  },
  {
    icon: ShieldCheck,
    title: "A supervisor helps you",
    tag: "No client stress",
  },
  {
    icon: Banknote,
    title: "Paid to your bank or UPI",
    tag: "Within 48h",
  },
  {
    icon: CheckCircle2,
    title: "Clear work, clear deadline",
    tag: "No Extra Work",
  },
  {
    icon: EyeOff,
    title: "Your name stays private",
    tag: "Always",
  },
  {
    icon: IndianRupee,
    title: "Free to join",
    tag: "₹0 fee",
  },
];

function MarqueePill({ item }: { item: MarqueeItem }) {
  const Icon = item.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-3 rounded-full border border-white/25 bg-white/[0.12] hover:bg-white/[0.18] px-5 py-3 shadow-sm backdrop-blur-md text-white transition-colors">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
        {item.title}
      </span>
      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
        {item.tag}
      </span>
    </span>
  );
}

export function HeroMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden bg-[#0a65c0] py-5 sm:py-6 border-y border-[#0854a0] shadow-sm select-none [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
    >
      <div className="marquee-track flex w-max items-center gap-4 pr-4">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-4" aria-hidden={half === 1}>
            {MARQUEE_ITEMS.map((item) => (
              <MarqueePill key={`${half}-${item.title}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
