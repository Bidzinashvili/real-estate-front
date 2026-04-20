import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import { asNumber, asString, isJsonObject } from "@/shared/lib/jsonValue";
import type {
  GetRemindersResponse,
  ReminderItem,
  ReminderListVariant,
  ReminderScheduledKind,
} from "@/features/reminders/remindersApiTypes";

export type ReminderSubjectType = "PROPERTY" | "CLIENT";

export type DashboardReminderVariant = ReminderListVariant;

export type DashboardReminderRow = {
  id: string;
  dueAtIso: string;
  sentAtIso: string | null;
  dismissedAtIso: string | null;
  subjectType: ReminderSubjectType;
  reminderVariant: DashboardReminderVariant;
  reminderKindLabel: string;
  scheduledKind: ReminderScheduledKind | null;
  subjectId: string;
  subjectTitle: string;
  note: string | null;
  rentalDurationMonths: number | null;
  rentalPeriodStartedAtIso: string | null;
  rentalPeriodEndsAtIso: string | null;
};

const LISTING_VERIFICATION_ID_PREFIX = "listing-verification:";
const CLIENT_REMINDER_ID_PREFIX = "client-reminder:";

function parseReminderVariantField(
  raw: JsonValue | undefined,
): DashboardReminderVariant | null {
  if (typeof raw !== "string") return null;
  const upper = raw.trim().toUpperCase();
  if (upper === "SCHEDULED_PROPERTY") return "SCHEDULED_PROPERTY";
  if (upper === "LISTING_VERIFICATION") return "LISTING_VERIFICATION";
  if (upper === "CLIENT_REMINDER") return "CLIENT_REMINDER";
  return null;
}

function inferReminderVariantFromId(
  reminderId: string,
): DashboardReminderVariant | null {
  if (reminderId.startsWith(LISTING_VERIFICATION_ID_PREFIX)) {
    return "LISTING_VERIFICATION";
  }
  if (reminderId.startsWith(CLIENT_REMINDER_ID_PREFIX)) {
    return "CLIENT_REMINDER";
  }
  return null;
}

function parseScheduledKindField(
  raw: JsonValue | undefined,
): ReminderScheduledKind | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "string") return null;
  const upper = raw.trim().toUpperCase();
  if (upper === "CUSTOM") return "CUSTOM";
  if (upper === "RENTAL_PERIOD_ENDING") return "RENTAL_PERIOD_ENDING";
  return null;
}

function parseCompositeReminderIds(reminderId: string): {
  propertyId: string | null;
  clientId: string | null;
} {
  if (reminderId.startsWith(LISTING_VERIFICATION_ID_PREFIX)) {
    return {
      propertyId: reminderId.slice(LISTING_VERIFICATION_ID_PREFIX.length),
      clientId: null,
    };
  }
  if (reminderId.startsWith(CLIENT_REMINDER_ID_PREFIX)) {
    return {
      propertyId: null,
      clientId: reminderId.slice(CLIENT_REMINDER_ID_PREFIX.length),
    };
  }
  return { propertyId: null, clientId: null };
}

function parseApiTargetTypeField(
  raw: JsonValue | undefined,
): ReminderSubjectType | null {
  if (typeof raw !== "string") return null;
  const upper = raw.trim().toUpperCase();
  if (upper === "PROPERTY") return "PROPERTY";
  if (upper === "CLIENT") return "CLIENT";
  return null;
}

function buildReminderKindLabel(
  variant: DashboardReminderVariant,
  scheduledKind: ReminderScheduledKind | null,
): string {
  if (variant === "LISTING_VERIFICATION") {
    return "Listing verification";
  }
  if (variant === "CLIENT_REMINDER") {
    return "Client follow-up";
  }
  if (scheduledKind === "RENTAL_PERIOD_ENDING") {
    return "Scheduled (rental ending)";
  }
  return "Scheduled";
}

function pickFirstNonEmptyString(
  record: JsonObject,
  keys: readonly string[],
): string {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === "string" && raw.trim() !== "") {
      return raw.trim();
    }
  }
  return "";
}

function asNullableTrimmedString(value: JsonValue | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseSubjectTypeHint(raw: string): ReminderSubjectType | null {
  const upper = raw.trim().toUpperCase();
  if (upper === "CLIENT" || upper === "CLIENTS") return "CLIENT";
  if (upper === "PROPERTY" || upper === "PROPERTIES" || upper === "LISTING") {
    return "PROPERTY";
  }
  return null;
}

function propertyTitleFromRecord(record: JsonObject): string {
  return (
    pickFirstNonEmptyString(record, [
      "propertyTitle",
      "property_title",
      "subjectTitle",
      "subject_title",
      "title",
    ]) ||
    pickFirstNonEmptyString(record, ["address", "propertyAddress", "property_address"]) ||
    pickFirstNonEmptyString(record, ["label", "name"]) ||
    "—"
  );
}

function clientTitleFromRecord(record: JsonObject): string {
  return (
    pickFirstNonEmptyString(record, [
      "clientName",
      "client_name",
      "subjectTitle",
      "subject_title",
      "name",
    ]) ||
    pickFirstNonEmptyString(record, ["label", "title"]) ||
    "—"
  );
}

function formatPropertyNestedLabel(propertyRecord: JsonObject): string {
  const address = pickFirstNonEmptyString(propertyRecord, ["address"]);
  const city = pickFirstNonEmptyString(propertyRecord, ["city"]);
  const district = pickFirstNonEmptyString(propertyRecord, ["district"]);
  const title = pickFirstNonEmptyString(propertyRecord, ["title", "description"]);
  const locationParts = [city, district].filter(Boolean).join(" / ");
  const addressParts = [address, locationParts ? `(${locationParts})` : ""].filter(Boolean);
  const combined = addressParts.join(" ").trim();
  if (combined !== "") return combined;
  if (title !== "") return title;
  return "—";
}

function enrichReminderRecord(record: JsonObject): JsonObject {
  const enriched = { ...record } as Record<string, JsonValue>;

  const propertyNested = record.property;
  if (propertyNested !== undefined && isJsonObject(propertyNested)) {
    const nestedPropertyId = asString(propertyNested.id).trim();
    if (
      nestedPropertyId !== "" &&
      pickFirstNonEmptyString(enriched, ["propertyId", "property_id"]) === ""
    ) {
      enriched.propertyId = nestedPropertyId;
    }
    if (pickFirstNonEmptyString(enriched, ["propertyTitle", "address", "subjectTitle"]) === "") {
      const label = formatPropertyNestedLabel(propertyNested);
      if (label !== "—") {
        enriched.propertyTitle = label;
      }
    }
  }

  const clientNested = record.client;
  if (clientNested !== undefined && isJsonObject(clientNested)) {
    const nestedClientId = asString(clientNested.id).trim();
    if (
      nestedClientId !== "" &&
      pickFirstNonEmptyString(enriched, ["clientId", "client_id"]) === ""
    ) {
      enriched.clientId = nestedClientId;
    }
    const nestedName = pickFirstNonEmptyString(clientNested, ["name"]);
    if (
      nestedName !== "" &&
      pickFirstNonEmptyString(enriched, ["clientName", "subjectTitle", "name"]) === ""
    ) {
      enriched.clientName = nestedName;
    }
  }

  return enriched as JsonObject;
}

function normalizeReminderRow(value: JsonValue): DashboardReminderRow | null {
  if (!isJsonObject(value)) return null;

  const record = enrichReminderRecord(value);

  const id = pickFirstNonEmptyString(record, [
    "id",
    "_id",
    "reminderId",
    "reminder_id",
  ]);
  if (id === "") return null;

  const dueAtIso = pickFirstNonEmptyString(record, [
    "notifyAt",
    "notify_at",
    "dueAt",
    "due_at",
    "dueDate",
    "due_date",
    "scheduledAt",
    "scheduled_at",
    "fireAt",
    "fire_at",
  ]);
  if (dueAtIso === "") return null;

  const compositeIds = parseCompositeReminderIds(id);
  const propertyIdFromRecord = pickFirstNonEmptyString(record, [
    "propertyId",
    "property_id",
  ]);
  const clientIdFromRecord = pickFirstNonEmptyString(record, [
    "clientId",
    "client_id",
  ]);
  const subjectIdRaw = pickFirstNonEmptyString(record, [
    "subjectId",
    "subject_id",
    "entityId",
    "entity_id",
  ]);

  const propertyId =
    propertyIdFromRecord !== ""
      ? propertyIdFromRecord
      : compositeIds.propertyId ?? "";
  const clientId =
    clientIdFromRecord !== ""
      ? clientIdFromRecord
      : compositeIds.clientId ?? "";

  const explicitHint = pickFirstNonEmptyString(record, [
    "subjectType",
    "subject_type",
    "targetType",
    "target_type",
    "entityType",
    "entity_type",
    "reminderFor",
    "reminder_for",
  ]);
  const explicitType = explicitHint ? parseSubjectTypeHint(explicitHint) : null;
  const apiTargetType = parseApiTargetTypeField(record.targetType);

  const kindHint = pickFirstNonEmptyString(record, ["kind", "type", "reminderType", "reminder_type"]);
  const kindUpper = kindHint.trim().toUpperCase();

  const reminderVariant =
    parseReminderVariantField(record.variant) ??
    inferReminderVariantFromId(id) ??
    "SCHEDULED_PROPERTY";

  const scheduledKindRaw = parseScheduledKindField(record.scheduledKind);
  const scheduledKind =
    reminderVariant === "SCHEDULED_PROPERTY" ? scheduledKindRaw : null;

  let subjectType: ReminderSubjectType;
  let subjectId: string;
  let subjectTitle: string;

  if (reminderVariant === "LISTING_VERIFICATION") {
    subjectType = "PROPERTY";
    subjectId = propertyId || subjectIdRaw;
    subjectTitle = propertyTitleFromRecord(record);
  } else if (reminderVariant === "CLIENT_REMINDER") {
    subjectType = "CLIENT";
    subjectId = clientId || subjectIdRaw;
    subjectTitle = clientTitleFromRecord(record);
  } else if (explicitType === "CLIENT" || apiTargetType === "CLIENT") {
    subjectType = "CLIENT";
    subjectId = clientId || subjectIdRaw;
    subjectTitle = clientTitleFromRecord(record);
  } else if (explicitType === "PROPERTY" || apiTargetType === "PROPERTY") {
    subjectType = "PROPERTY";
    subjectId = propertyId || subjectIdRaw;
    subjectTitle = propertyTitleFromRecord(record);
  } else if (clientId !== "" && propertyId === "") {
    subjectType = "CLIENT";
    subjectId = clientId;
    subjectTitle = clientTitleFromRecord(record);
  } else if (propertyId !== "") {
    subjectType = "PROPERTY";
    subjectId = propertyId;
    subjectTitle = propertyTitleFromRecord(record);
  } else if (subjectIdRaw !== "") {
    if (kindUpper.includes("CLIENT")) {
      subjectType = "CLIENT";
      subjectId = subjectIdRaw;
      subjectTitle = clientTitleFromRecord(record);
    } else {
      subjectType = "PROPERTY";
      subjectId = subjectIdRaw;
      subjectTitle = propertyTitleFromRecord(record);
    }
  } else {
    return null;
  }

  if (subjectId === "") return null;

  const note =
    asNullableTrimmedString(record.note) ??
    asNullableTrimmedString(record.message) ??
    asNullableTrimmedString(record.description);

  const sentAtIso =
    asNullableTrimmedString(record.sentAt) ??
    asNullableTrimmedString(record.sent_at);
  const dismissedAtIso =
    asNullableTrimmedString(record.dismissedAt) ??
    asNullableTrimmedString(record.dismissed_at);

  const reminderKindLabel = buildReminderKindLabel(reminderVariant, scheduledKind);

  const rentalDurationRaw = record.rentalDurationMonths;
  let rentalDurationMonths: number | null = null;
  if (rentalDurationRaw !== undefined && rentalDurationRaw !== null) {
    const parsedMonths = asNumber(rentalDurationRaw, Number.NaN);
    if (Number.isFinite(parsedMonths) && Number.isInteger(parsedMonths) && parsedMonths >= 1) {
      rentalDurationMonths = parsedMonths;
    }
  }

  const rentalPeriodStartedAtIso =
    asNullableTrimmedString(record.rentalPeriodStartedAt) ??
    asNullableTrimmedString(record.rental_period_started_at);

  const rentalPeriodEndsAtIso =
    asNullableTrimmedString(record.rentalPeriodEndsAt) ??
    asNullableTrimmedString(record.rental_period_ends_at);

  return {
    id,
    dueAtIso,
    sentAtIso,
    dismissedAtIso,
    subjectType,
    reminderVariant,
    reminderKindLabel,
    scheduledKind,
    subjectId,
    subjectTitle,
    note,
    rentalDurationMonths,
    rentalPeriodStartedAtIso,
    rentalPeriodEndsAtIso,
  };
}

function sortDashboardReminderRows(rows: DashboardReminderRow[]): DashboardReminderRow[] {
  const next = [...rows];
  next.sort((left, right) => {
    const leftTime = new Date(left.dueAtIso).getTime();
    const rightTime = new Date(right.dueAtIso).getTime();
    const leftValid = Number.isFinite(leftTime);
    const rightValid = Number.isFinite(rightTime);
    if (!leftValid && !rightValid) return 0;
    if (!leftValid) return 1;
    if (!rightValid) return -1;
    return rightTime - leftTime;
  });
  return next;
}

function normalizeReminderFromTypedItem(item: ReminderItem): DashboardReminderRow | null {
  const subjectType = item.targetType;
  const subjectId =
    subjectType === "PROPERTY"
      ? (item.propertyId ?? item.property?.id ?? "")
      : (item.clientId ?? item.client?.id ?? "");
  if (!subjectId.trim()) {
    return null;
  }
  const subjectTitle =
    item.subjectTitle?.trim() ||
    (subjectType === "PROPERTY" ? item.property?.address : item.client?.name) ||
    "—";
  return {
    id: item.id,
    dueAtIso: item.notifyAt,
    sentAtIso: item.sentAt ?? null,
    dismissedAtIso: item.dismissedAt ?? null,
    subjectType,
    reminderVariant: item.variant,
    reminderKindLabel: buildReminderKindLabel(item.variant, item.scheduledKind ?? null),
    scheduledKind: item.scheduledKind ?? null,
    subjectId,
    subjectTitle,
    note: item.note ?? null,
    rentalDurationMonths: item.rentalDurationMonths ?? null,
    rentalPeriodStartedAtIso: item.rentalPeriodStartedAt ?? null,
    rentalPeriodEndsAtIso: item.rentalPeriodEndsAt ?? null,
  };
}

function collectRowsFromArray(rawList: JsonValue[]): DashboardReminderRow[] {
  const rows: DashboardReminderRow[] = [];
  for (const item of rawList) {
    const row = normalizeReminderRow(item);
    if (row) rows.push(row);
  }
  return sortDashboardReminderRows(rows);
}

function collectRowsFromTypedArray(items: ReminderItem[]): DashboardReminderRow[] {
  const rows: DashboardReminderRow[] = [];
  for (const item of items) {
    const row = normalizeReminderFromTypedItem(item);
    if (row) {
      rows.push(row);
    }
  }
  return sortDashboardReminderRows(rows);
}

function isGetRemindersResponse(
  data: GetRemindersResponse | JsonValue,
): data is GetRemindersResponse {
  if (typeof data !== "object" || data === null || !("reminders" in data)) {
    return false;
  }
  return Array.isArray(data.reminders);
}

function extractReminderArrayFromEnvelope(data: JsonObject): JsonValue[] | null {
  const topLevelKeys: (keyof JsonObject | string)[] = [
    "reminders",
    "items",
    "results",
    "content",
    "reminderList",
    "reminder_list",
    "rows",
  ];

  for (const key of topLevelKeys) {
    const candidate = data[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  const nestedData = data.data;
  if (Array.isArray(nestedData)) {
    return nestedData;
  }

  if (nestedData !== undefined && isJsonObject(nestedData)) {
    for (const key of topLevelKeys) {
      const inner = nestedData[key];
      if (Array.isArray(inner)) {
        return inner;
      }
    }
  }

  return null;
}

export function normalizeDashboardRemindersList(
  data: GetRemindersResponse | JsonValue,
): DashboardReminderRow[] {
  if (isGetRemindersResponse(data)) {
    return collectRowsFromTypedArray(data.reminders);
  }
  if (Array.isArray(data)) {
    return collectRowsFromArray(data);
  }

  if (!isJsonObject(data)) return [];

  const rawList = extractReminderArrayFromEnvelope(data);
  if (rawList === null) return [];

  return collectRowsFromArray(rawList);
}
