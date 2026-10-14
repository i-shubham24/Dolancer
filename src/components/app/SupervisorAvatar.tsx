import { cn } from "@/lib/cn";
import { CategoryTile } from "./ui";

/**
 * The supervisor avatar for tasks and chats.
 *
 * Displays the colorful, category-keyed initials logo (such as "WC", "MA") so
 * doers can immediately distinguish conversations at a glance rather than seeing
 * the same repetitive blue shield.
 */
export function SupervisorAvatar({
  size = "md",
  category,
  initials,
  badge,
  ring = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  /** The project or supervisor discipline category (e.g. "Writing & Content") */
  category?: string;
  /** Explicit 2-letter initials if category is not provided */
  initials?: string;
  badge?: React.ReactNode;
  /** A coloured ring around the avatar, for a chat with something new. */
  ring?: boolean;
  className?: string;
}) {
  const box =
    size === "lg"
      ? "h-14 w-14 text-base"
      : size === "md"
        ? "h-12 w-12 text-sm"
        : "h-9 w-9 text-xs";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 rounded-full p-[2px]",
        ring ? "bg-gradient-to-tr from-primary to-secondary" : "bg-transparent",
        className,
      )}
      aria-hidden="true"
    >
      <CategoryTile
        category={category || (initials ? `Custom-${initials}` : "Supervisor")}
        letters={initials}
        className={cn("rounded-full ring-2 ring-white font-black tracking-tight shadow-xs", box)}
      />
      {badge ? <span className="absolute -bottom-0.5 -right-0.5 flex">{badge}</span> : null}
    </span>
  );
}
