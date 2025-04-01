import { cn } from "../../lib/utils";

interface ColorBadgeProps {
  color: string;
  className?: string;
}

export function ColorBadge({ color, className }: ColorBadgeProps) {
  return (
    <div
      className={cn("w-3 h-3 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
}
