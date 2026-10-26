import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SurfaceCard } from "@/shared/ui/SurfaceCard";

type PageStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
};

function PageStateFrame({
  title,
  description,
  icon: Icon,
  className,
  children,
}: PageStateProps & { children?: ReactNode }) {
  return (
    <SurfaceCard
      padding="lg"
      className={cn("flex flex-col items-center text-center", className)}
    >
      {Icon ? (
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      ) : null}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </SurfaceCard>
  );
}

export function LoadingState({
  title = "იტვირთება…",
  description,
  className,
}: Omit<PageStateProps, "icon">) {
  return (
    <PageStateFrame title={title} description={description} className={className}>
      <Loader2
        className="mt-3 h-5 w-5 animate-spin text-muted-foreground"
        aria-hidden
      />
    </PageStateFrame>
  );
}

export function EmptyState({
  title,
  description,
  icon = Inbox,
  className,
  children,
}: PageStateProps & { children?: ReactNode }) {
  return (
    <PageStateFrame
      title={title}
      description={description}
      icon={icon}
      className={className}
    >
      {children}
    </PageStateFrame>
  );
}

export function ErrorState({
  title,
  description,
  className,
}: Omit<PageStateProps, "icon">) {
  return (
    <PageStateFrame
      title={title}
      description={description}
      icon={AlertCircle}
      className={className}
    />
  );
}
