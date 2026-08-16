"use client";

import {
  formatPropertyStatusLabel,
  type PropertyStatus,
} from "@/features/properties/types";
import {
  formatPropertyDateTime,
  propertyStatusBadgeClass,
} from "@/widgets/PropertyDetails/propertyViewFormatters";

type PropertyDetailsLifecycleSectionProps = {
  lifecycleStatus: PropertyStatus;
  verificationReminderIso?: string | null;
};

export function PropertyDetailsLifecycleSection({
  lifecycleStatus,
  verificationReminderIso = null,
}: PropertyDetailsLifecycleSectionProps) {
  const reminderLabel = formatPropertyDateTime(verificationReminderIso);

  return (
    <section
      className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6"
      aria-labelledby="lifecycle-heading"
    >
      <h2 id="lifecycle-heading" className="text-sm font-semibold text-foreground">
        სტატუსი
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${propertyStatusBadgeClass(lifecycleStatus)}`}
        >
          {formatPropertyStatusLabel(lifecycleStatus)}
        </span>
      </div>
      {lifecycleStatus === "TO_BE_VERIFIED" && reminderLabel ? (
        <p className="mt-3 text-sm text-foreground">
          <span className="text-muted-foreground">შეხსენება: </span>
          {reminderLabel}
        </p>
      ) : reminderLabel ? (
        <p className="mt-3 text-sm text-foreground">
          <span className="text-muted-foreground">შეხსენება: </span>
          {reminderLabel}
        </p>
      ) : null}
    </section>
  );
}
