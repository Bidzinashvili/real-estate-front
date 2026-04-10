import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";
import type {
  PatchListingOrClientReminderBody,
  PatchReminderBody,
  PatchScheduledCustomReminderBody,
  PatchScheduledRentalEndingReminderBody,
} from "@/features/reminders/remindersApiTypes";
import { datetimeLocalValueToIso } from "@/shared/lib/datetimeLocalIso";

export function isDashboardReminderEditable(row: DashboardReminderRow): boolean {
  if (row.reminderVariant !== "SCHEDULED_PROPERTY") {
    return true;
  }
  return row.sentAtIso === null;
}

export type DashboardReminderEditFormSnapshot = {
  notifyLocal: string;
  note: string;
  rentalDurationMonthsInput: string;
  rentalStartedLocal: string;
  rentalEndedLocal: string;
};

export function buildDashboardReminderPatch(
  row: DashboardReminderRow,
  form: DashboardReminderEditFormSnapshot,
): { patch: PatchReminderBody } | { errorMessage: string } | null {
  const notifyIso = datetimeLocalValueToIso(form.notifyLocal);
  if (form.notifyLocal.trim() !== "" && notifyIso === null) {
    return { errorMessage: "Enter a valid date and time for the reminder." };
  }

  if (row.reminderVariant === "LISTING_VERIFICATION") {
    if (notifyIso === null) {
      return { errorMessage: "A date and time is required." };
    }
    if (notifyIso === row.dueAtIso) {
      return null;
    }
    const listingPatch: PatchListingOrClientReminderBody = { notifyAt: notifyIso };
    return { patch: listingPatch };
  }

  if (row.reminderVariant === "CLIENT_REMINDER") {
    if (notifyIso === null) {
      return { errorMessage: "A date and time is required." };
    }
    if (notifyIso === row.dueAtIso) {
      return null;
    }
    const clientPatch: PatchListingOrClientReminderBody = { notifyAt: notifyIso };
    return { patch: clientPatch };
  }

  if (row.reminderVariant !== "SCHEDULED_PROPERTY") {
    return { errorMessage: "This reminder cannot be edited here." };
  }

  if (row.scheduledKind === "RENTAL_PERIOD_ENDING") {
    const notifyChanged =
      notifyIso !== null && notifyIso !== row.dueAtIso;

    const parsedMonths = Number.parseInt(form.rentalDurationMonthsInput.trim(), 10);
    const startedIso = datetimeLocalValueToIso(form.rentalStartedLocal);
    const endedIso = datetimeLocalValueToIso(form.rentalEndedLocal);

    const baselineMonths = row.rentalDurationMonths;
    const baselineStarted = row.rentalPeriodStartedAtIso;
    const baselineEnded = row.rentalPeriodEndsAtIso;

    const monthsValue = Number.isFinite(parsedMonths) ? parsedMonths : Number.NaN;
    const rentalFormComplete =
      Number.isInteger(monthsValue) &&
      monthsValue >= 1 &&
      form.rentalStartedLocal.trim() !== "" &&
      startedIso !== null &&
      form.rentalEndedLocal.trim() !== "" &&
      endedIso !== null;

    const monthsChanged =
      Number.isInteger(monthsValue) &&
      monthsValue >= 1 &&
      monthsValue !== baselineMonths;
    const startedChanged =
      startedIso !== null &&
      startedIso !== (baselineStarted ?? "");
    const endedChanged = endedIso !== null && endedIso !== (baselineEnded ?? "");

    const rentalChanged = monthsChanged || startedChanged || endedChanged;

    if (!notifyChanged && !rentalChanged) {
      return null;
    }

    if (rentalChanged) {
      if (!rentalFormComplete) {
        return {
          errorMessage:
            "Rental ending reminders need duration (months) and both period start and end.",
        };
      }
      const rentalPatch: PatchScheduledRentalEndingReminderBody = {
        rentalDurationMonths: monthsValue,
        rentalPeriodStartedAt: startedIso,
        rentalPeriodEndsAt: endedIso,
      };
      if (notifyChanged && notifyIso !== null) {
        rentalPatch.notifyAt = notifyIso;
      }
      return { patch: rentalPatch };
    }

    if (notifyChanged && notifyIso !== null) {
      const notifyOnlyPatch: PatchScheduledRentalEndingReminderBody = {
        notifyAt: notifyIso,
      };
      return { patch: notifyOnlyPatch };
    }

    return null;
  }

  const trimmedNote = form.note.trim();
  const nextNote = trimmedNote === "" ? null : trimmedNote;
  const noteChanged = nextNote !== row.note;

  const notifyChanged =
    notifyIso !== null && notifyIso !== row.dueAtIso;

  if (!noteChanged && !notifyChanged) {
    return null;
  }

  const customPatch: PatchScheduledCustomReminderBody = {};
  if (notifyChanged && notifyIso !== null) {
    customPatch.notifyAt = notifyIso;
  }
  if (noteChanged) {
    customPatch.note = nextNote;
  }

  if (Object.keys(customPatch).length === 0) {
    return null;
  }

  return { patch: customPatch };
}
