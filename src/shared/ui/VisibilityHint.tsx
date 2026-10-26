"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type VisibilityHintProps = {
  visible: "public" | "private";
  className?: string;
};

export function VisibilityHint({ visible, className }: VisibilityHintProps) {
  const isPublic = visible === "public";
  const icon = isPublic ? (
    <Eye className="h-4 w-4" />
  ) : (
    <EyeOff className="h-4 w-4" />
  );
  const title = isPublic ? "ხილული სხვა აგენტებისთვის" : "მხოლოდ ჩემთვის";

  return (
    <div
      title={title}
      className={cn("flex h-4 w-4 items-center justify-center text-muted-foreground", className)}
    >
      {icon}
    </div>
  );
}
