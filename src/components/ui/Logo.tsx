import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
  xl: "h-14 w-14",
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <img 
      src="/logo.svg" 
      alt="Dolancer Logo" 
      className={cn("object-contain", sizeClasses[size], className)}
    />
  );
}
