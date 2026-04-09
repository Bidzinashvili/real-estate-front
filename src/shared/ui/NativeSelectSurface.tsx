"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type NativeSelectSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function NativeSelectSurface({
  children,
  className,
}: NativeSelectSurfaceProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {children}
      <ChevronDown
        className="pointer-events-none absolute right-[10px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}
