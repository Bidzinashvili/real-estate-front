"use client";

import { ClipboardCheck } from "lucide-react";
import { PROPERTY_VERIFICATION_REQUEST_COPY } from "@/features/propertyVerificationRequest/propertyVerificationRequestCopy";
import { cn } from "@/shared/lib/utils";

type RequestPropertyVerificationButtonProps = {
  canRequest: boolean;
  isPending: boolean;
  isSubmitting: boolean;
  error: string | null;
  onRequest: () => void;
  className?: string;
};

export function RequestPropertyVerificationButton({
  canRequest,
  isPending,
  isSubmitting,
  error,
  onRequest,
  className,
}: RequestPropertyVerificationButtonProps) {
  if (!canRequest) {
    return null;
  }

  const isDisabled = isPending || isSubmitting;
  const label = isPending
    ? PROPERTY_VERIFICATION_REQUEST_COPY.pending
    : isSubmitting
      ? PROPERTY_VERIFICATION_REQUEST_COPY.requesting
      : PROPERTY_VERIFICATION_REQUEST_COPY.requestAction;

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={onRequest}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition",
          isDisabled
            ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
            : "border-border bg-card text-foreground hover:bg-muted",
        )}
      >
        <ClipboardCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
