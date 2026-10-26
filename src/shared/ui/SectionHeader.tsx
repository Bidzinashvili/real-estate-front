import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { typography } from "@/shared/ui/typography";

type SectionHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  title,
  description,
  icon,
  action,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </span>
          ) : null}
          <h2 className={cn(typography.sectionTitle, titleClassName)}>{title}</h2>
        </div>
        {description ? (
          <p className={typography.sectionSubtitle}>{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
