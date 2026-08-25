export const OUTCOME_SOURCES = ["BY_ME", "BY_OTHER"] as const;
export type OutcomeSource = (typeof OUTCOME_SOURCES)[number];

export const VERIFICATION_REASONS = [
  "REGULAR_VERIFICATION_OVERDUE",
  "RENTAL_EXPIRY_RECHECK",
] as const;
export type VerificationReason = (typeof VERIFICATION_REASONS)[number];

export const REMINDER_TYPES = [
  "INTERVAL_MONTHS",
  "RENTAL_6M_MINUS_15D",
  "RENTAL_1Y_MINUS_15D",
  "CUSTOM_DATE",
] as const;
export type ReminderType = (typeof REMINDER_TYPES)[number];

export type ReminderConfigPayload = {
  type: ReminderType;
  intervalMonths?: number;
  notifyAt?: string;
  repeats?: boolean;
  enabled?: boolean;
};

export type EntityVerificationFields = {
  lastVerifiedAt: string | null;
  outcomeSource: OutcomeSource | null;
  verificationReason: VerificationReason | null;
  reminderEnabled: boolean;
  reminderRepeats: boolean;
  reminderType: ReminderType | null;
  reminderIntervalMonths: number | null;
  reminderDate: string | null;
  reminderSentAt: string | null;
  statusChangedAt: string | null;
  statusChangedByUserId: string | null;
  verificationOverdue: boolean;
};

export function isOutcomeSource(value: string): value is OutcomeSource {
  return (OUTCOME_SOURCES as readonly string[]).includes(value);
}

export function isVerificationReason(value: string): value is VerificationReason {
  return (VERIFICATION_REASONS as readonly string[]).includes(value);
}

export function isReminderType(value: string): value is ReminderType {
  return (REMINDER_TYPES as readonly string[]).includes(value);
}
