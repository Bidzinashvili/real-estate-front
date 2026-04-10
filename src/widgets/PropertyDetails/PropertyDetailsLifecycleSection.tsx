"use client";

import {
  formatPropertyStatusLabel,
  isPropertyStatus,
  PROPERTY_STATUSES,
  type PropertyStatus,
} from "@/features/properties/types";
import { NativeSelectSurface } from "@/shared/ui/NativeSelectSurface";

const LIFECYCLE_SELECT_CLASS =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400";

type PropertyDetailsLifecycleSectionProps = {
  canEdit: boolean;
  lifecycleStatus: PropertyStatus;
  reminderLocal: string;
  onLifecycleStatusChange: (next: PropertyStatus) => void;
  onReminderLocalChange: (next: string) => void;
};

export function PropertyDetailsLifecycleSection({
  canEdit,
  lifecycleStatus,
  reminderLocal,
  onLifecycleStatusChange,
  onReminderLocalChange,
}: PropertyDetailsLifecycleSectionProps) {
  return (
    <section className="space-y-4" aria-labelledby="lifecycle-heading">
      <h2
        id="lifecycle-heading"
        className="text-sm font-semibold text-slate-800"
      >
        Listing lifecycle
      </h2>

      {!canEdit ? (
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-600">Status: </span>
          {formatPropertyStatusLabel(lifecycleStatus)}
        </p>
      ) : (
        <>
          <div>
            <label
              htmlFor="property-lifecycle-status"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Listing status (operational)
            </label>
            <NativeSelectSurface>
              <select
                id="property-lifecycle-status"
                aria-label="Property listing lifecycle status"
                value={lifecycleStatus}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (isPropertyStatus(raw)) {
                    onLifecycleStatusChange(raw);
                  }
                }}
                className={LIFECYCLE_SELECT_CLASS}
              >
                {PROPERTY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatPropertyStatusLabel(status)}
                  </option>
                ))}
              </select>
            </NativeSelectSurface>
            <p className="mt-1 text-xs text-slate-500">
              This is separate from deal type (sale / rent). The server clears the verification
              reminder when you change status away from needs verification.
            </p>
          </div>

          {lifecycleStatus === "TO_BE_VERIFIED" ? (
            <div>
              <label
                htmlFor="property-verification-reminder"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Verification reminder
              </label>
              <input
                id="property-verification-reminder"
                type="datetime-local"
                value={reminderLocal}
                onChange={(event) => onReminderLocalChange(event.target.value)}
                className={LIFECYCLE_SELECT_CLASS}
              />
              <p className="mt-1 text-xs text-slate-500">
                The server uses this for scheduled verification reminders (in-app notification to
                your account). Leave empty for no reminder; saving with an empty field clears any
                scheduled reminder.
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
