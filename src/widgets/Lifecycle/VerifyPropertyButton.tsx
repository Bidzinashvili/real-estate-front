"use client";

import { BadgeCheck } from "lucide-react";
import { PROPERTY_VERIFICATION_COPY } from "@/features/lifecycle/propertyVerification";
import { cn } from "@/shared/lib/utils";

type VerifyPropertyButtonProps = {
  label: string;
  isVerifying: boolean;
  disabled?: boolean;
  size?: "compact" | "default";
  onVerify: () => void;
};

export function VerifyPropertyButton({
  label,
  isVerifying,
  disabled = false,
  size = "default",
  onVerify,
}: VerifyPropertyButtonProps) {
  const isCompact = size === "compact";

  return (
    <button
      type="button"
      disabled={disabled || isVerifying}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onVerify();
      }}
      className={cn(
        "inline-flex touch-manipulation items-center justify-center gap-1.5 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        isCompact
          ? "h-8 border border-success/30 bg-success-muted px-2.5 text-[11px] text-success-foreground hover:bg-success-muted/80"
          : "h-9 border border-success/30 bg-success-muted px-3 text-xs text-success-foreground hover:bg-success-muted/80",
      )}
      aria-label={label}
    >
      <BadgeCheck className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      {isVerifying ? PROPERTY_VERIFICATION_COPY.verifying : label}
    </button>
  );
}
