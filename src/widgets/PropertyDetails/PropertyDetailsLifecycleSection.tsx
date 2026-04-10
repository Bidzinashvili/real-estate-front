"use client";

import {
  formatPropertyStatusLabel,
  type PropertyStatus,
} from "@/features/properties/types";

function formatVerificationReminderLabel(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  return Number.isNaN(parsed.getTime()) ? isoTimestamp : parsed.toLocaleString();
}

type PropertyDetailsLifecycleSectionProps = {
  lifecycleStatus: PropertyStatus;
  verificationReminderIso?: string | null;
};

export function PropertyDetailsLifecycleSection({
  lifecycleStatus,
  verificationReminderIso = null,
}: PropertyDetailsLifecycleSectionProps) {
  return (
    <section className="space-y-4" aria-labelledby="lifecycle-heading">
      <h2
        id="lifecycle-heading"
        className="text-sm font-semibold text-slate-800"
      >
        Listing lifecycle
      </h2>

      <div className="space-y-1 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-600">Status: </span>
          {formatPropertyStatusLabel(lifecycleStatus)}
        </p>
        <p className="text-xs text-slate-500">
          Change listing status and set reminders from the catalog card menu (three dots on the
          listing image).
        </p>
        {lifecycleStatus === "TO_BE_VERIFIED" &&
        typeof verificationReminderIso === "string" &&
        verificationReminderIso.trim() !== "" ? (
          <p>
            <span className="font-medium text-slate-600">
              Verification reminder:{" "}
            </span>
            {formatVerificationReminderLabel(verificationReminderIso)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
