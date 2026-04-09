import type { PropertiesListResult } from "@/features/properties/getPropertiesQuery";
import type {
  CreatePropertyResponse,
  PropertyListResponse,
} from "@/features/properties/propertyApiTypes";
import { normalizeProperty } from "@/features/properties/propertyRecordNormalizer";
import type { Property } from "@/features/properties/types";
import { asNumber } from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";

export function normalizePropertiesListResponse(
  data: PropertyListResponse,
): PropertiesListResult {
  const properties = data.properties
    .map((item) => normalizeProperty(item as JsonValue))
    .filter((item): item is Property => item !== null);

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

export function normalizePropertiesResponse(data: PropertyListResponse): Property[] {
  return normalizePropertiesListResponse(data).properties;
}

export function normalizeCreatePropertyResponse(
  data: CreatePropertyResponse | null | undefined,
): Property | null {
  if (data === undefined || data === null) {
    return null;
  }

  return normalizeProperty(data as JsonValue);
}
