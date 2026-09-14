import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import { asBoolean, asNumber, isJsonObject } from "@/shared/lib/jsonValue";
import type {
  GetRemindersResponse,
  ReminderClientPreview,
  ReminderCoverImage,
  ReminderFeedActions,
  ReminderItem,
  ReminderListVariant,
  ReminderPropertyPreview,
  ReminderScheduledKind,
} from "@/features/reminders/remindersApiTypes";

export type ReminderSubjectType = "PROPERTY" | "CLIENT";

export type DashboardReminderVariant = ReminderListVariant;

export type DashboardReminderRow = {
  id: string;
  notifyAt: string;
  dueAtIso: string;
  createdAtIso: string | null;
  sentAtIso: string | null;
  triggeredAtIso: string | null;
  dismissedAtIso: string | null;
  isDue: boolean;
  subjectType: ReminderSubjectType;
  targetType: ReminderSubjectType;
  reminderVariant: DashboardReminderVariant;
  reminderKindLabel: string;
  scheduledKind: ReminderScheduledKind | null;
  subjectId: string;
  subjectTitle: string;
  note: string | null;
  rentalDurationMonths: number | null;
  rentalPeriodStartedAtIso: string | null;
  rentalPeriodEndsAtIso: string | null;
  property: ReminderPropertyPreview | null;
  client: ReminderClientPreview | null;
  actions: ReminderFeedActions;
};

export type NormalizedRemindersList = {
  reminders: DashboardReminderRow[];
  total: number;
  page: number;
  limit: number;
};

export const LISTING_VERIFICATION_ID_PREFIX = "listing-verification:";
export const CLIENT_REMINDER_ID_PREFIX = "client-reminder:";

const DISABLED_ACTIONS: ReminderFeedActions = {
  canUpdate: false,
  canDelete: false,
  canDismiss: false,
  canSnooze: false,
};

function parseReminderVariantField(
  raw: JsonValue | undefined,
): DashboardReminderVariant | null {
  if (typeof raw !== "string") return null;
  const upper = raw.trim().toUpperCase();
  if (upper === "SCHEDULED_PROPERTY") return "SCHEDULED_PROPERTY";
  if (upper === "SCHEDULED_CLIENT") return "SCHEDULED_CLIENT";
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
    return "განცხადების გადამოწმება";
  }
  if (variant === "CLIENT_REMINDER") {
    return "კლიენტის შეხსენება";
  }
  if (variant === "SCHEDULED_CLIENT") {
    return "დაგეგმილი (კლიენტი)";
  }
  if (scheduledKind === "RENTAL_PERIOD_ENDING") {
    return "დაგეგმილი (ქირის დასრულება)";
  }
  return "დაგეგმილი";
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

function parseCoverImage(value: JsonValue | undefined): ReminderCoverImage | null {
  if (!isJsonObject(value)) return null;
  const url = asNullableTrimmedString(value.url);
  if (url === null) return null;
  return {
    id: pickFirstNonEmptyString(value, ["id"]) || url,
    url,
    originalName: pickFirstNonEmptyString(value, ["originalName", "original_name"]) || "",
  };
}

function parseDistricts(value: JsonValue | undefined): string[] {
  if (!Array.isArray(value)) return [];
  const districts: string[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim() !== "") {
      districts.push(item.trim());
    }
  }
  return districts;
}

function parsePropertyPreview(
  value: JsonValue | undefined,
): ReminderPropertyPreview | null {
  if (!isJsonObject(value)) return null;
  const previewId = pickFirstNonEmptyString(value, ["id"]);
  if (previewId === "") return null;
  return {
    id: previewId,
    address: pickFirstNonEmptyString(value, ["address"]),
    city: pickFirstNonEmptyString(value, ["city"]),
    district: pickFirstNonEmptyString(value, ["district"]),
    status: pickFirstNonEmptyString(value, ["status"]),
    title: asNullableTrimmedString(value.title),
    propertyType: asNullableTrimmedString(value.propertyType),
    dealType: asNullableTrimmedString(value.dealType),
    archivedAt: asNullableTrimmedString(value.archivedAt),
    coverImage: parseCoverImage(value.coverImage),
  };
}

function parseClientPreview(value: JsonValue | undefined): ReminderClientPreview | null {
  if (!isJsonObject(value)) return null;
  const previewId = pickFirstNonEmptyString(value, ["id"]);
  if (previewId === "") return null;
  return {
    id: previewId,
    name: pickFirstNonEmptyString(value, ["name"]) || "—",
    status: asNullableTrimmedString(value.status),
    dealType: asNullableTrimmedString(value.dealType),
    archivedAt: asNullableTrimmedString(value.archivedAt),
    districts: parseDistricts(value.districts),
  };
}

function parseActions(value: JsonValue | undefined): ReminderFeedActions {
  if (!isJsonObject(value)) {
    return DISABLED_ACTIONS;
  }
  return {
    canUpdate: asBoolean(value.canUpdate, false),
    canDelete: asBoolean(value.canDelete, false),
    canDismiss: asBoolean(value.canDismiss, false),
    canSnooze: asBoolean(value.canSnooze, false),
  };
}

function propertyTitleFromPreview(preview: ReminderPropertyPreview | null): string {
  if (!preview) return "";
  if (preview.title && preview.title.trim() !== "") return preview.title.trim();
  const locationParts = [preview.city, preview.district].filter(Boolean).join(" / ");
  const addressParts = [preview.address, locationParts ? `(${locationParts})` : ""].filter(
    Boolean,
  );
  return addressParts.join(" ").trim();
}

function parseIsDue(record: JsonObject, notifyAt: string): boolean {
  if (typeof record.isDue === "boolean") {
    return record.isDue;
  }
  const dueAtTime = new Date(notifyAt).getTime();
  if (!Number.isFinite(dueAtTime)) {
    return false;
  }
  return dueAtTime <= Date.now();
}

function normalizeReminderRow(value: JsonValue): DashboardReminderRow | null {
  if (!isJsonObject(value)) return null;

  const id = pickFirstNonEmptyString(value, ["id", "_id", "reminderId", "reminder_id"]);
  if (id === "") return null;

  const notifyAt = pickFirstNonEmptyString(value, [
    "notifyAt",
    "notify_at",
    "dueAt",
    "due_at",
  ]);
  if (notifyAt === "") return null;

  const propertyPreview = parsePropertyPreview(value.property);
  const clientPreview = parseClientPreview(value.client);
  const compositeIds = parseCompositeReminderIds(id);
  const propertyIdFromRecord = pickFirstNonEmptyString(value, ["propertyId", "property_id"]);
  const clientIdFromRecord = pickFirstNonEmptyString(value, ["clientId", "client_id"]);

  const propertyId =
    propertyIdFromRecord !== ""
      ? propertyIdFromRecord
      : propertyPreview?.id ?? compositeIds.propertyId ?? "";
  const clientId =
    clientIdFromRecord !== ""
      ? clientIdFromRecord
      : clientPreview?.id ?? compositeIds.clientId ?? "";

  const apiTargetType = parseApiTargetTypeField(value.targetType);
  const reminderVariant =
    parseReminderVariantField(value.variant) ??
    inferReminderVariantFromId(id) ??
    (apiTargetType === "CLIENT" ? "SCHEDULED_CLIENT" : "SCHEDULED_PROPERTY");

  const scheduledKindRaw = parseScheduledKindField(value.scheduledKind);
  const scheduledKind =
    reminderVariant === "SCHEDULED_PROPERTY" || reminderVariant === "SCHEDULED_CLIENT"
      ? scheduledKindRaw
      : null;

  let subjectType: ReminderSubjectType;
  if (apiTargetType !== null) {
    subjectType = apiTargetType;
  } else if (reminderVariant === "CLIENT_REMINDER" || reminderVariant === "SCHEDULED_CLIENT") {
    subjectType = "CLIENT";
  } else {
    subjectType = "PROPERTY";
  }

  const subjectId = subjectType === "PROPERTY" ? propertyId : clientId;
  if (subjectId === "") return null;

  const subjectTitle =
    subjectType === "PROPERTY"
      ? propertyTitleFromPreview(propertyPreview) ||
        pickFirstNonEmptyString(value, ["subjectTitle", "address", "title"]) ||
        "—"
      : clientPreview?.name ||
        pickFirstNonEmptyString(value, ["subjectTitle", "clientName", "name"]) ||
        "—";

  const rentalDurationRaw = value.rentalDurationMonths;
  let rentalDurationMonths: number | null = null;
  if (rentalDurationRaw !== undefined && rentalDurationRaw !== null) {
    const parsedMonths = asNumber(rentalDurationRaw, Number.NaN);
    if (Number.isFinite(parsedMonths) && Number.isInteger(parsedMonths) && parsedMonths >= 1) {
      rentalDurationMonths = parsedMonths;
    }
  }

  return {
    id,
    notifyAt,
    dueAtIso: notifyAt,
    createdAtIso: asNullableTrimmedString(value.createdAt),
    sentAtIso: asNullableTrimmedString(value.sentAt) ?? asNullableTrimmedString(value.sent_at),
    triggeredAtIso:
      asNullableTrimmedString(value.triggeredAt) ??
      asNullableTrimmedString(value.triggered_at),
    dismissedAtIso:
      asNullableTrimmedString(value.dismissedAt) ??
      asNullableTrimmedString(value.dismissed_at),
    isDue: parseIsDue(value, notifyAt),
    subjectType,
    targetType: subjectType,
    reminderVariant,
    reminderKindLabel: buildReminderKindLabel(reminderVariant, scheduledKind),
    scheduledKind,
    subjectId,
    subjectTitle,
    note:
      asNullableTrimmedString(value.note) ??
      asNullableTrimmedString(value.message) ??
      asNullableTrimmedString(value.description),
    rentalDurationMonths,
    rentalPeriodStartedAtIso:
      asNullableTrimmedString(value.rentalPeriodStartedAt) ??
      asNullableTrimmedString(value.rental_period_started_at),
    rentalPeriodEndsAtIso:
      asNullableTrimmedString(value.rentalPeriodEndsAt) ??
      asNullableTrimmedString(value.rental_period_ends_at),
    property: propertyPreview,
    client: clientPreview,
    actions: parseActions(value.actions),
  };
}

function normalizeReminderFromTypedItem(item: ReminderItem): DashboardReminderRow | null {
  const subjectType = item.targetType;
  const propertyPreview = item.property ?? null;
  const clientPreview = item.client ?? null;
  const subjectId =
    subjectType === "PROPERTY"
      ? (item.propertyId ?? propertyPreview?.id ?? "")
      : (item.clientId ?? clientPreview?.id ?? "");
  if (!subjectId.trim()) {
    return null;
  }
  const subjectTitle =
    item.subjectTitle?.trim() ||
    (subjectType === "PROPERTY"
      ? propertyTitleFromPreview(propertyPreview) || propertyPreview?.address
      : clientPreview?.name) ||
    "—";
  const notifyAt = item.notifyAt;
  return {
    id: item.id,
    notifyAt,
    dueAtIso: notifyAt,
    createdAtIso: item.createdAt ?? null,
    sentAtIso: item.sentAt ?? null,
    triggeredAtIso: item.triggeredAt ?? null,
    dismissedAtIso: item.dismissedAt ?? null,
    isDue:
      typeof item.isDue === "boolean" ? item.isDue : new Date(notifyAt).getTime() <= Date.now(),
    subjectType,
    targetType: subjectType,
    reminderVariant: item.variant,
    reminderKindLabel: buildReminderKindLabel(item.variant, item.scheduledKind ?? null),
    scheduledKind: item.scheduledKind ?? null,
    subjectId,
    subjectTitle,
    note: item.note ?? null,
    rentalDurationMonths: item.rentalDurationMonths ?? null,
    rentalPeriodStartedAtIso: item.rentalPeriodStartedAt ?? null,
    rentalPeriodEndsAtIso: item.rentalPeriodEndsAt ?? null,
    property: propertyPreview,
    client: clientPreview,
    actions: item.actions ?? DISABLED_ACTIONS,
  };
}

function collectRowsFromArray(rawList: JsonValue[]): DashboardReminderRow[] {
  const rows: DashboardReminderRow[] = [];
  for (const item of rawList) {
    const row = normalizeReminderRow(item);
    if (row) rows.push(row);
  }
  return rows;
}

function collectRowsFromTypedArray(items: ReminderItem[]): DashboardReminderRow[] {
  const rows: DashboardReminderRow[] = [];
  for (const item of items) {
    const row = normalizeReminderFromTypedItem(item);
    if (row) {
      rows.push(row);
    }
  }
  return rows;
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

function paginationFromRecord(
  data: JsonObject,
  reminderCount: number,
): Pick<NormalizedRemindersList, "total" | "page" | "limit"> {
  const page = asNumber(data.page, 1);
  const limit = asNumber(data.limit, reminderCount || 20);
  const total = asNumber(data.total, reminderCount);
  return {
    total: Number.isFinite(total) ? total : reminderCount,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : reminderCount || 20,
  };
}

export function normalizeDashboardRemindersList(
  data: GetRemindersResponse | JsonValue,
): NormalizedRemindersList {
  if (isGetRemindersResponse(data)) {
    const reminders = collectRowsFromTypedArray(data.reminders);
    return {
      reminders,
      total: data.total,
      page: data.page,
      limit: data.limit,
    };
  }
  if (Array.isArray(data)) {
    const reminders = collectRowsFromArray(data);
    return {
      reminders,
      total: reminders.length,
      page: 1,
      limit: reminders.length || 20,
    };
  }

  if (!isJsonObject(data)) {
    return { reminders: [], total: 0, page: 1, limit: 20 };
  }

  const rawList = extractReminderArrayFromEnvelope(data);
  if (rawList === null) {
    return { reminders: [], total: 0, page: 1, limit: 20 };
  }

  const reminders = collectRowsFromArray(rawList);
  return {
    reminders,
    ...paginationFromRecord(data, reminders.length),
  };
}

export function isKeepStyleReminder(variant: DashboardReminderVariant): boolean {
  return variant === "SCHEDULED_PROPERTY" || variant === "SCHEDULED_CLIENT";
}

export function isLifecycleReminderId(reminderId: string): boolean {
  return (
    reminderId.startsWith(LISTING_VERIFICATION_ID_PREFIX) ||
    reminderId.startsWith(CLIENT_REMINDER_ID_PREFIX)
  );
}

export function isLifecycleVerificationReminder(
  reminder: Pick<DashboardReminderRow, "id" | "reminderVariant">,
): boolean {
  if (
    reminder.reminderVariant === "LISTING_VERIFICATION" ||
    reminder.reminderVariant === "CLIENT_REMINDER"
  ) {
    return true;
  }
  return isLifecycleReminderId(reminder.id);
}

export function isAlarmOverlayReminder(reminder: DashboardReminderRow): boolean {
  if (isLifecycleVerificationReminder(reminder)) {
    return false;
  }
  return isKeepStyleReminder(reminder.reminderVariant) || reminder.actions.canSnooze;
}
