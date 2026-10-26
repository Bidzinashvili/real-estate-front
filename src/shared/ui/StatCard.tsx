import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { typography } from "@/shared/ui/typography";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  interactive?: boolean;
  className?: string;
  valueClassName?: string;
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  interactive = false,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <SurfaceCard padding="sm" interactive={interactive} className={cn("h-full", className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border/80">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className={typography.fieldLabel}>{label}</p>
          <p className={cn(typography.cardValue, "mt-0.5", valueClassName)}>{value}</p>
          {hint ? <p className={cn(typography.helper, "mt-1")}>{hint}</p> : null}
        </div>
      </div>
    </SurfaceCard>
  );
}
