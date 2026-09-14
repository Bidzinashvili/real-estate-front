"use client";

import {
  canVerifyPropertyListing,
  isCurrentlyActiveListing,
  PROPERTY_VERIFICATION_COPY,
  propertyVerifyActionLabel,
} from "@/features/lifecycle/propertyVerification";
import type { PropertyStatus } from "@/features/properties/propertyStatus";
import {
  formatTbilisiCompactDate,
  formatTbilisiDateTime,
} from "@/shared/lib/formatDate";
import { VerifyPropertyButton } from "@/widgets/Lifecycle/VerifyPropertyButton";
import { cn } from "@/shared/lib/utils";

type PropertyVerificationStatusProps = {
  status: PropertyStatus;
  archivedAt?: string | null;
  lastVerifiedAt: string | null;
  canManage: boolean;
  isVerifying?: boolean;
  error?: string | null;
  successMessage?: string | null;
  dateFormat?: "compact" | "detailed";
  buttonSize?: "compact" | "default";
  className?: string;
  onVerify?: () => void;
};

export function PropertyVerificationStatus({
  status,
  archivedAt,
  lastVerifiedAt,
  canManage,
  isVerifying = false,
  error = null,
  successMessage = null,
  dateFormat = "compact",
  buttonSize = "compact",
  className,
  onVerify,
}: PropertyVerificationStatusProps) {
  const listing = { status, archivedAt };
  const isActiveListing = isCurrentlyActiveListing(listing);
  const showVerify =
    canManage && canVerifyPropertyListing(listing) && Boolean(onVerify);
  const compactDate = lastVerifiedAt
    ? formatTbilisiCompactDate(lastVerifiedAt)
    : null;
  const detailedDate = lastVerifiedAt
    ? formatTbilisiDateTime(lastVerifiedAt)
    : null;
  const dateLabel = dateFormat === "detailed" ? detailedDate : compactDate;
  const showActiveDate = isActiveListing && Boolean(dateLabel);
  const verifyLabel =
    dateFormat === "detailed" && status !== "NEEDS_VERIFICATION"
      ? PROPERTY_VERIFICATION_COPY.verifyTodayCombined
      : propertyVerifyActionLabel(status);

  if (!showActiveDate && !showVerify && !error && !successMessage) {
    return null;
  }

  return (
    <div
      className={cn("space-y-1.5", className)}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex flex-wrap items-center gap-2">
        {showActiveDate ? (
          <p
            className={cn(
              "font-medium text-success",
              dateFormat === "detailed" ? "text-sm" : "text-xs",
            )}
          >
            {dateFormat === "detailed"
              ? `${PROPERTY_VERIFICATION_COPY.detailLabel}: ${dateLabel}`
              : `${PROPERTY_VERIFICATION_COPY.compactLabel} ${dateLabel}`}
          </p>
        ) : null}
        {showVerify && onVerify ? (
          <VerifyPropertyButton
            label={verifyLabel}
            isVerifying={isVerifying}
            size={buttonSize}
            onVerify={onVerify}
          />
        ) : null}
      </div>
      {successMessage ? (
        <p className="text-xs font-medium text-success" role="status">
          {successMessage}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
