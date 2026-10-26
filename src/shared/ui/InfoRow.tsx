import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { typography } from "@/shared/ui/typography";

type InfoRowProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function InfoRow({ label, value, icon, className }: InfoRowProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4", className)}>
      <dt className="inline-flex min-w-[7rem] items-center gap-1.5 sm:max-w-[40%]">
        {icon ? (
          <span className="text-muted-foreground" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className={typography.fieldLabel}>{label}</span>
      </dt>
      <dd className={cn(typography.fieldValue, "min-w-0 flex-1 font-medium")}>{value}</dd>
    </div>
  );
}
