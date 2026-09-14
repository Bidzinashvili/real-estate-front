import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import { asBoolean, asNullableString } from "@/shared/lib/jsonValue";
import {
  isOutcomeSource,
  isReminderType,
  isVerificationReason,
  type EntityVerificationFields,
  type OutcomeSource,
  type ReminderType,
  type VerificationReason,
} from "@/features/lifecycle/lifecycleEnums";

function asNullableNumber(value: JsonValue | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseOutcomeSource(value: JsonValue | undefined): OutcomeSource | null {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isOutcomeSource(candidate) ? candidate : null;
}

function parseVerificationReason(value: JsonValue | undefined): VerificationReason | null {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isVerificationReason(candidate) ? candidate : null;
}

function parseReminderType(value: JsonValue | undefined): ReminderType | null {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isReminderType(candidate) ? candidate : null;
}

export function parseEntityVerificationFields(
  record: JsonObject,
): EntityVerificationFields {
  return {
    lastVerifiedAt: asNullableString(record.lastVerifiedAt),
    outcomeSource: parseOutcomeSource(record.outcomeSource),
    verificationReason: parseVerificationReason(record.verificationReason),
    reminderEnabled: asBoolean(record.reminderEnabled, false),
    reminderRepeats: asBoolean(record.reminderRepeats, false),
    reminderType: parseReminderType(record.reminderType),
    reminderIntervalMonths: asNullableNumber(record.reminderIntervalMonths),
    reminderDate: asNullableString(record.reminderDate),
    reminderSentAt: asNullableString(record.reminderSentAt),
    statusChangedAt: asNullableString(record.statusChangedAt),
    statusChangedByUserId: asNullableString(record.statusChangedByUserId),
    verificationOverdue: asBoolean(record.verificationOverdue, false),
  };
}

export function emptyVerificationFields(
  overrides: Partial<EntityVerificationFields> = {},
): EntityVerificationFields {
  return {
    lastVerifiedAt: null,
    outcomeSource: null,
    verificationReason: null,
    reminderEnabled: false,
    reminderRepeats: false,
    reminderType: null,
    reminderIntervalMonths: null,
    reminderDate: null,
    reminderSentAt: null,
    statusChangedAt: null,
    statusChangedByUserId: null,
    verificationOverdue: false,
    ...overrides,
  };
}
