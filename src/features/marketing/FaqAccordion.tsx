import { FAQS } from "./content";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function FaqAccordion() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Common questions</h2>
        <p className="mt-3 text-ink-2 font-medium">Everything you need to know about the product and billing.</p>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, index) => (
          <ScrollReveal key={index} delay={index * 0.1}>
            <details
              className="group rounded-2xl border border-line-card bg-surface shadow-soft-xs open:bg-surface-2 hover:bg-surface-2 transition-colors duration-200"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-bold select-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="text-[15px]">{faq.question}</span>
                <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-subtle text-ink group-open:bg-primary group-open:text-inverse transition-colors">
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-open:-rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-ink-2">
                {faq.answer}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
