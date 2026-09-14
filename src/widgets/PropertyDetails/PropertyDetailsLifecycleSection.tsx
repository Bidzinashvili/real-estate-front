"use client";

import type { Property } from "@/features/properties/types";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { PropertyVerificationStatus } from "@/widgets/Lifecycle/PropertyVerificationStatus";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";

type PropertyDetailsLifecycleSectionProps = {
  property: Property;
  showRecordTimestamp?: boolean;
  canVerify?: boolean;
  isVerifying?: boolean;
  verifyError?: string | null;
  verifySuccessMessage?: string | null;
  onVerify?: () => void;
};

export function PropertyDetailsLifecycleSection({
  property,
  showRecordTimestamp = false,
  canVerify = false,
  isVerifying = false,
  verifyError = null,
  verifySuccessMessage = null,
  onVerify,
}: PropertyDetailsLifecycleSectionProps) {
  const archivedLabel = formatLifecycleDate(property.archivedAt);
  const isArchivedListing = isPropertyArchived(property);

  return (
    <section
      className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6"
      aria-labelledby="lifecycle-heading"
    >
      <h2 id="lifecycle-heading" className="text-sm font-semibold text-foreground">
        სტატუსი
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LifecycleStatusBadge
          kind="property"
          status={property.status}
          outcomeSource={property.outcomeSource}
          verificationReason={property.verificationReason}
          isArchived={isArchivedListing}
        />
        {isArchivedListing ? (
          <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {ARCHIVE_COPY.archivedBadge}
          </span>
        ) : null}
      </div>
      <PropertyVerificationStatus
        className="mt-3"
        status={property.status}
        archivedAt={property.archivedAt}
        lastVerifiedAt={property.lastVerifiedAt}
        canManage={canVerify}
        isVerifying={isVerifying}
        error={verifyError}
        successMessage={verifySuccessMessage}
        dateFormat="detailed"
        buttonSize="default"
        onVerify={onVerify}
      />
      {showRecordTimestamp ? (
        <RecordTimestamp
          className="mt-3"
          createdAt={property.createdAt}
          updatedAt={property.updatedAt}
        />
      ) : null}
      {archivedLabel ? (
        <p className="mt-1 text-sm text-foreground">
          <span className="text-muted-foreground">{ARCHIVE_COPY.archivedAtLabel}: </span>
          {archivedLabel}
        </p>
      ) : null}
    </section>
  );
}
