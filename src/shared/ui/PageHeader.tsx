import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { typography } from "@/shared/ui/typography";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        <div className="flex items-start gap-3">
          {Icon ? (
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
          ) : null}
          <div className="min-w-0">
            <h1 className={typography.pageTitle}>{title}</h1>
            {description ? (
              <p className={typography.pageSubtitle}>{description}</p>
            ) : null}
            {meta ? <div className="mt-2">{meta}</div> : null}
          </div>
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
