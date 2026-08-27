import type {
  OutcomeSource,
  ReminderType,
  VerificationReason,
} from "@/features/lifecycle/lifecycleEnums";
import { formatLifecycleDate } from "@/features/lifecycle/formatLifecycleDate";

export const OUTCOME_SOURCE_LABELS: Record<OutcomeSource, string> = {
  BY_ME: "ჩემს მიერ",
  BY_OTHER: "სხვის მიერ",
};

export const CLIENT_OUTCOME_SOURCE_LABELS: Record<OutcomeSource, string> = {
  BY_ME: "მე",
  BY_OTHER: "სხვამ",
};

export const VERIFICATION_REASON_LABELS: Record<VerificationReason, string> = {
  REGULAR_VERIFICATION_OVERDUE: "გადამოწმების ვადა გავიდა",
  RENTAL_EXPIRY_RECHECK: "ქირის ვადის გადამოწმება",
  MANUAL_REMINDER_DUE: "შეხსენების ვადა ამოვიდა",
};

export function formatReminderTypeLabel(
  reminderType: ReminderType | null,
  reminderIntervalMonths: number | null,
  reminderDate: string | null,
): string | null {
  if (reminderType === "INTERVAL_MONTHS") {
    const months = reminderIntervalMonths ?? 1;
    return `ყოველ ${months} თვეში`;
  }
  if (reminderType === "RENTAL_6M_MINUS_15D") {
    return "6 თვე (-15 დღე)";
  }
  if (reminderType === "RENTAL_1Y_MINUS_15D") {
    return "1 წელი (-15 დღე)";
  }
  if (reminderType === "CUSTOM_DATE") {
    return formatLifecycleDate(reminderDate) ?? "არჩეული თარიღი";
  }
  return null;
}
