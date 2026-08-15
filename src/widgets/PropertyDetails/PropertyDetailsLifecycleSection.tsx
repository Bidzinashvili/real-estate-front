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
        className="text-sm font-semibold text-foreground"
      >
        განცხადების ციკლი
      </h2>

      <div className="space-y-1 text-sm text-foreground">
        <p>
          <span className="font-medium text-muted-foreground">სტატუსი: </span>
          {formatPropertyStatusLabel(lifecycleStatus)}
        </p>
        <p className="text-xs text-muted-foreground">
          განცხადების სტატუსი და შეხსენებები იცვლება კატალოგის ბარათის მენიუდან (სამი წერტილი ფოტოზე).
        </p>
        {lifecycleStatus === "TO_BE_VERIFIED" &&
        typeof verificationReminderIso === "string" &&
        verificationReminderIso.trim() !== "" ? (
          <p>
            <span className="font-medium text-muted-foreground">
              გადამოწმების შეხსენება:{" "}
            </span>
            {formatVerificationReminderLabel(verificationReminderIso)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
