import { cn } from "@/shared/lib/utils";

type DealTypeBadgeProps = {
  label: string;
  className?: string;
};

export function DealTypeBadge({ label, className }: DealTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-warning px-2.5 py-0.5 text-xs font-semibold text-warning-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
