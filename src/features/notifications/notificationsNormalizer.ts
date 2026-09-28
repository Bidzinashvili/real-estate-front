import type { AppNotification } from "@/features/notifications/notificationsApi.types";
import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import { asNullableString, asString } from "@/shared/lib/jsonValue";

function readOptionalNullableId(value: JsonValue | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const trimmed = asString(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeNotificationRow(value: JsonValue): AppNotification | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const record = value as JsonObject;
  const id = asString(record.id).trim();
  const message = asString(record.message).trim();
  if (!id || !message) {
    return null;
  }

  return {
    id,
    message,
    createdAt: asString(record.createdAt).trim(),
    readAt: asNullableString(record.readAt),
    propertyId: readOptionalNullableId(record.propertyId),
    propertyVerificationRequestId: readOptionalNullableId(
      record.propertyVerificationRequestId,
    ),
  };
}

export function normalizeNotificationsList(payload: unknown): AppNotification[] {
  const rows: JsonValue[] = [];

  if (Array.isArray(payload)) {
    rows.push(...payload);
  } else if (typeof payload === "object" && payload !== null) {
    const record = payload as JsonObject;
    if (Array.isArray(record.notifications)) {
      rows.push(...record.notifications);
    } else if (Array.isArray(record.items)) {
      rows.push(...record.items);
    } else if (Array.isArray(record.data)) {
      rows.push(...record.data);
    }
  }

  return rows
    .map((row) => normalizeNotificationRow(row))
    .filter((row): row is AppNotification => row !== null);
}
