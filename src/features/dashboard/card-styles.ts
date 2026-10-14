import type { Variants } from "framer-motion";

/**
 * The dashboard's shared card look and entrance.
 *
 * Cards are white on the tinted app panel, with a hairline ring and a soft drop
 * rather than the app-wide shadow tokens, so they read as the brightest layer.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** The grid staggers its cards in, one after another, like the reel's opening. */
export const gridMotion: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.08 } },
};

export const cardMotion: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Seconds until the nth card in the grid has landed, for things that start after. */
export const landedAt = (index: number) => 0.08 + index * 0.075 + 0.45;

export const CARD =
  "relative flex min-w-0 flex-col rounded-[20px] bg-white p-[18px] ring-1 ring-ink/[0.05] shadow-[0_1px_2px_rgba(15,23,42,0.03),0_6px_18px_-8px_rgba(15,23,42,0.1)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.03),0_18px_36px_-18px_rgba(15,23,42,0.22)]";
