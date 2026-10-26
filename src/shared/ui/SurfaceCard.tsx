import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import {
  surfaceCardClassName,
  surfaceCardInteractiveClassName,
} from "@/shared/ui/surfaceStyles";

type SurfaceCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClassName: Record<NonNullable<SurfaceCardProps["padding"]>, string> = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

export function SurfaceCard({
  children,
  className,
  interactive = false,
  padding = "md",
  ...rest
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        interactive ? surfaceCardInteractiveClassName : surfaceCardClassName,
        paddingClassName[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
