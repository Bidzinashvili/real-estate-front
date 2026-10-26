import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";
import { typography } from "@/shared/ui/typography";

type SectionCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
};

export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  padding = "md",
  className,
}: SectionCardProps) {
  return (
    <SurfaceCard padding="none" className={cn("overflow-hidden", className)}>
      <div className="flex flex-col gap-3 border-b border-border/80 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-start gap-2.5">
          {icon ? (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className={typography.sectionTitle}>{title}</h2>
            {description ? (
              <p className={typography.sectionSubtitle}>{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div
        className={cn(
          padding === "none" && "",
          padding === "sm" && "p-3 sm:p-4",
          padding === "md" && "p-4 sm:p-5",
          padding === "lg" && "p-5 sm:p-6",
        )}
      >
        {children}
      </div>
    </SurfaceCard>
  );
}
