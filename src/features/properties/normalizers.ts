import type { PropertiesListResult } from "@/features/properties/getPropertiesQuery";
import { normalizeProperty } from "@/features/properties/propertyRecordNormalizer";
import type { Property } from "@/features/properties/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return fallback;
    const parsed = Number(trimmed);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

export function normalizePropertiesListResponse(data: unknown): PropertiesListResult {
  const list = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.properties)
      ? data.properties
      : null;

  if (!list) {
    throw new Error("Invalid properties response format.");
  }

  const properties = list
    .map((item) => normalizeProperty(item))
    .filter((item): item is Property => item !== null);

  if (Array.isArray(data)) {
    const n = properties.length;
    return { properties, total: n, page: 1, limit: Math.max(n, 1) };
  }

  if (!isRecord(data)) {
    throw new Error("Invalid properties response format.");
  }

  const total = asNumber(data.total, properties.length);
  const page = asNumber(data.page, 1);
  const limitRaw = asNumber(data.limit, Math.max(properties.length, 1));

  return {
    properties,
    total,
    page: page < 1 ? 1 : page,
    limit: limitRaw < 1 ? 1 : limitRaw,
  };
}

export function normalizePropertiesResponse(data: unknown): Property[] {
  return normalizePropertiesListResponse(data).properties;
}

export function normalizeCreatePropertyResponse(data: unknown): Property | null {
  if (data == null) {
    return null;
  }

  if (Array.isArray(data)) {
    if (data.length !== 1) {
      return null;
    }
    return normalizeProperty(data[0]);
  }

  if (!isRecord(data)) {
    return null;
  }

  const nested = data.property ?? data.data;
  if (nested !== undefined && nested !== null) {
    return normalizeProperty(nested);
  }

  return normalizeProperty(data);
}
