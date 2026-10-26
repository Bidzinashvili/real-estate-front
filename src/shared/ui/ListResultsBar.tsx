import { cn } from "@/shared/lib/utils";
import { typography } from "@/shared/ui/typography";

type ListResultsBarProps = {
  prefix: string;
  total: number;
  isLoading?: boolean;
  className?: string;
};

export function ListResultsBar({
  prefix,
  total,
  isLoading = false,
  className,
}: ListResultsBarProps) {
  return (
    <p className={cn(typography.helper, className)}>
      {prefix}{" "}
      <span className="font-semibold text-foreground tabular-nums">{total}</span>
      {isLoading ? (
        <span className="ml-2 text-muted-foreground">ახლდება…</span>
      ) : null}
    </p>
  );
}
