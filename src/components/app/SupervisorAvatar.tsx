import { ShieldUser } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The one face every chat has: the supervisor. Doers never talk to a client, so a
 * conversation always shows this mark. An optional small badge in the corner says
 * what the chat is about, such as the task's category.
 */
export function SupervisorAvatar({
  size = "md",
  badge,
  ring = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  badge?: React.ReactNode;
  /** A coloured ring around the avatar, for a chat with something new. */
  ring?: boolean;
  className?: string;
}) {
  const box = size === "lg" ? "h-14 w-14" : size === "md" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "lg" ? "h-7 w-7" : size === "md" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span
      className={cn("relative inline-flex shrink-0 rounded-full p-[2px]", ring ? "bg-gradient-to-tr from-primary to-secondary" : "bg-transparent", className)}
      aria-hidden="true"
    >
      <span className={cn("flex items-center justify-center rounded-full bg-gradient-to-br from-[#0a65c0] to-[#2f86e0] text-white ring-2 ring-white", box)}>
        <ShieldUser className={icon} strokeWidth={2} />
      </span>
      {badge ? <span className="absolute -bottom-0.5 -right-0.5 flex">{badge}</span> : null}
    </span>
  );
}
