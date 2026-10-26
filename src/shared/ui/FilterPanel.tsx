import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { surfaceCardClassName } from "@/shared/ui/surfaceStyles";

type FilterPanelProps = {
  children: ReactNode;
  className?: string;
};

export function FilterPanel({ children, className }: FilterPanelProps) {
  return (
    <div className={cn(surfaceCardClassName, "space-y-4 p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}
