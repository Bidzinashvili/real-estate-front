import type {
  TrashAgent,
  TrashClientRecord,
  TrashListResult,
  TrashPropertyRecord,
  TrashSortBy,
  TrashSortOrder,
  TrashSummary,
} from "@/features/adminTrash/types";
import {
  TRASH_ORDER_VALUES,
  TRASH_SORT_VALUES,
} from "@/features/adminTrash/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function isTrashSortBy(value: string): value is TrashSortBy {
  return (TRASH_SORT_VALUES as readonly string[]).includes(value);
}

function isTrashSortOrder(value: string): value is TrashSortOrder {
  return (TRASH_ORDER_VALUES as readonly string[]).includes(value);
}

export function readArchivedAt(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  return readString(payload.archivedAt);
}

export function parseTrashSortBy(value: string | null): TrashSortBy {
  if (value && isTrashSortBy(value)) {
    return value;
  }
  return "deletedAt";
}

export function parseTrashSortOrder(value: string | null): TrashSortOrder {
  if (value && isTrashSortOrder(value)) {
    return value;
  }
  return "desc";
}

function normalizeAgent(value: unknown): TrashAgent | null {
  if (!isRecord(value)) {
    return null;
  }
  const agentId = readString(value.id);
  const fullName = readString(value.fullName) ?? readString(value.name) ?? "";
  const email = readString(value.email) ?? "";
  if (!agentId) {
    return null;
  }
  return {
    id: agentId,
    fullName,
    email,
  };
}

function readStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    const single = readString(value);
    return single ? [single] : [];
  }
  return value
    .map((item) => readString(item))
    .filter((item): item is string => item !== null);
}

export function normalizeTrashSummary(payload: unknown): TrashSummary {
  const record = isRecord(payload) ? payload : {};
  return {
    properties: readNumber(record.properties, 0),
    clients: readNumber(record.clients, 0),
  };
}

export function normalizeTrashProperty(payload: unknown): TrashPropertyRecord | null {
  if (!isRecord(payload)) {
    return null;
  }
  const recordId = readString(payload.id);
  const deletedAt = readString(payload.deletedAt);
  if (!recordId || !deletedAt) {
    return null;
  }
  return {
    id: recordId,
    deletedAt,
    archivedAt: readString(payload.archivedAt),
    status: readString(payload.status) ?? "",
    address: readString(payload.address) ?? "",
    city: readString(payload.city),
    district: readString(payload.district),
    agent: normalizeAgent(payload.agent),
    createdAt: readString(payload.createdAt),
    updatedAt: readString(payload.updatedAt),
  };
}

export function normalizeTrashClient(payload: unknown): TrashClientRecord | null {
  if (!isRecord(payload)) {
    return null;
  }
  const recordId = readString(payload.id);
  const deletedAt = readString(payload.deletedAt);
  if (!recordId || !deletedAt) {
    return null;
  }
  return {
    id: recordId,
    deletedAt,
    archivedAt: readString(payload.archivedAt),
    status: readString(payload.status) ?? "",
    name: readString(payload.name) ?? "",
    phones: readStringList(payload.phones),
    agent: normalizeAgent(payload.agent),
    createdAt: readString(payload.createdAt),
    updatedAt: readString(payload.updatedAt),
  };
}

function readListItems(payload: Record<string, unknown>, keys: string[]): unknown[] {
  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return [];
}

export function normalizeTrashPropertyList(
  payload: unknown,
): TrashListResult<TrashPropertyRecord> {
  const record = isRecord(payload) ? payload : {};
  const rawItems = readListItems(record, ["properties", "items"]);
  const items = rawItems
    .map((item) => normalizeTrashProperty(item))
    .filter((item): item is TrashPropertyRecord => item !== null);
  return {
    items,
    total: readNumber(record.total, items.length),
    page: readNumber(record.page, 1),
    limit: readNumber(record.limit, items.length || 20),
  };
}

export function normalizeTrashClientList(
  payload: unknown,
): TrashListResult<TrashClientRecord> {
  const record = isRecord(payload) ? payload : {};
  const rawItems = readListItems(record, ["clients", "items"]);
  const items = rawItems
    .map((item) => normalizeTrashClient(item))
    .filter((item): item is TrashClientRecord => item !== null);
  return {
    items,
    total: readNumber(record.total, items.length),
    page: readNumber(record.page, 1),
    limit: readNumber(record.limit, items.length || 20),
  };
}
