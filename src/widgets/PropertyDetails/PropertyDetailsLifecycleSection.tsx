"use client";

import type { Property } from "@/features/properties/types";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { RecordTimestamp } from "@/widgets/RecordTimestamp/RecordTimestamp";

type PropertyDetailsLifecycleSectionProps = {
  property: Property;
  showRecordTimestamp?: boolean;
};

export function PropertyDetailsLifecycleSection({
  property,
  showRecordTimestamp = false,
}: PropertyDetailsLifecycleSectionProps) {
  const lastVerifiedLabel = formatLifecycleDate(property.lastVerifiedAt);
  const archivedLabel = formatLifecycleDate(property.archivedAt);

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
        />
        {isPropertyArchived(property) ? (
          <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            არქივში
          </span>
        ) : null}
      </div>
      {showRecordTimestamp ? (
        <RecordTimestamp
          className="mt-3"
          createdAt={property.createdAt}
          updatedAt={property.updatedAt}
        />
      ) : null}
      {lastVerifiedLabel ? (
        <p className="mt-3 text-sm text-foreground">
          <span className="text-muted-foreground">გადამოწმებულია: </span>
          {lastVerifiedLabel}
        </p>
      ) : null}
      {archivedLabel ? (
        <p className="mt-1 text-sm text-foreground">
          <span className="text-muted-foreground">დაარქივებულია: </span>
          {archivedLabel}
        </p>
      ) : null}
    </section>
  );
}
