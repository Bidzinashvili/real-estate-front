import type {
  HiddenPropertiesListResponse,
  HiddenPropertyCoverImage,
  HiddenPropertyItem,
  UnhideClientPropertyResponse,
} from "@/features/clientHiddenProperties/types";
import { parseDealType } from "@/features/properties/dealType";
import { parsePropertyType } from "@/features/properties/propertyModelTypes";
import { parsePropertyStatus } from "@/features/properties/propertyStatus";
import {
  asNumber,
  asString,
  isJsonObject,
  type JsonValue,
} from "@/shared/lib/jsonValue";

function asTrimmedString(value: JsonValue | undefined): string {
  return asString(value).trim();
}

function asNullableTrimmedString(value: JsonValue | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function normalizeCoverImage(value: JsonValue | undefined): HiddenPropertyCoverImage | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const url = asNullableTrimmedString(value.url);
  if (url === null) {
    return null;
  }
  const imageId = asNullableTrimmedString(value.id);
  const originalName = asTrimmedString(value.originalName) || asTrimmedString(value.original_name);
  return {
    ...(imageId ? { id: imageId } : {}),
    url,
    originalName,
  };
}

export function normalizeHiddenPropertyItem(value: unknown): HiddenPropertyItem | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const propertyId = asTrimmedString(value.id);
  if (propertyId === "") {
    return null;
  }
  return {
    id: propertyId,
    propertyType: parsePropertyType(value.propertyType),
    dealType: parseDealType(value.dealType),
    district: asTrimmedString(value.district),
    address: asTrimmedString(value.address),
    street: asNullableTrimmedString(value.street),
    pricePublic: asNumber(value.pricePublic, 0),
    status: parsePropertyStatus(value.status),
    archivedAt: asNullableTrimmedString(value.archivedAt),
    coverImage: normalizeCoverImage(value.coverImage),
    hiddenAt: asTrimmedString(value.hiddenAt),
  };
}

export function normalizeHiddenPropertiesList(value: unknown): HiddenPropertiesListResponse {
  if (!isJsonObject(value)) {
    return { hiddenProperties: [] };
  }
  const rawList = value.hiddenProperties;
  if (!Array.isArray(rawList)) {
    return { hiddenProperties: [] };
  }
  const hiddenProperties: HiddenPropertyItem[] = [];
  const seenIds = new Set<string>();
  for (const rawItem of rawList) {
    const item = normalizeHiddenPropertyItem(rawItem);
    if (!item || seenIds.has(item.id)) {
      continue;
    }
    seenIds.add(item.id);
    hiddenProperties.push(item);
  }
  return { hiddenProperties };
}

export function normalizeUnhideResponse(
  value: unknown,
  propertyId: string,
): UnhideClientPropertyResponse {
  if (!isJsonObject(value)) {
    return { unhidden: true, id: propertyId };
  }
  const responseId = asTrimmedString(value.id) || propertyId;
  return {
    unhidden: true,
    id: responseId,
  };
}
