import { parseDealType } from "@/features/properties/dealType";
import { parsePropertyStatus } from "@/features/properties/propertyStatus";
import { parsePropertyType } from "@/features/properties/propertyModelTypes";
import type {
  PropertyOwner,
  PropertyOwnerContact,
  PropertyOwnerLinkedProperty,
  PropertyOwnerLookupResult,
  PropertyOwnersListResponse,
  PropertyOwnerSummary,
} from "@/features/propertyOwners/types";
import {
  asBoolean,
  asNumber,
  asString,
  asNullableString,
  isJsonObject,
} from "@/shared/lib/jsonValue";
import type { JsonValue } from "@/shared/lib/jsonValue";

function asNullableNumber(value: JsonValue | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function normalizePropertyOwnerContact(
  value: unknown,
): PropertyOwnerContact | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  const phone = asString(value.phone).trim();
  if (!id || !phone) {
    return null;
  }

  const normalizedPhone = asNullableString(value.normalizedPhone)?.trim();

  return {
    id,
    label: asString(value.label).trim(),
    phone,
    normalizedPhone: normalizedPhone ? normalizedPhone : undefined,
    isPrimary: asBoolean(value.isPrimary, false),
  };
}

function normalizeLinkedProperty(
  value: unknown,
): PropertyOwnerLinkedProperty | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  return {
    id,
    dealType: parseDealType(value.dealType),
    propertyType: parsePropertyType(value.propertyType),
    city: asString(value.city),
    district: asString(value.district),
    address: asString(value.address),
    street: asNullableString(value.street),
    status: parsePropertyStatus(value.status),
    archivedAt: asNullableString(value.archivedAt),
    title: asNullableString(value.title),
  };
}

export function normalizePropertyOwner(value: unknown): PropertyOwner | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  const name = asString(value.name).trim();
  if (!id || !name) {
    return null;
  }

  const contacts = Array.isArray(value.contacts)
    ? value.contacts
        .map((contact) => normalizePropertyOwnerContact(contact))
        .filter((contact): contact is PropertyOwnerContact => contact !== null)
    : [];

  const properties = Array.isArray(value.properties)
    ? value.properties
        .map((listing) => normalizeLinkedProperty(listing))
        .filter((listing): listing is PropertyOwnerLinkedProperty => listing !== null)
    : undefined;

  const propertyCountRaw = asNullableNumber(value.propertyCount);

  return {
    id,
    name,
    comment: asNullableString(value.comment),
    contacts,
    propertyCount:
      propertyCountRaw ?? (properties !== undefined ? properties.length : 0),
    properties,
    createdAt: asNullableString(value.createdAt) ?? "",
    updatedAt: asNullableString(value.updatedAt) ?? "",
  };
}

export function normalizePropertyOwnerSummary(
  value: unknown,
): PropertyOwnerSummary | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  const name = asString(value.name).trim();
  if (!id || !name) {
    return null;
  }

  return { id, name };
}

export function normalizePropertyOwnersListResponse(
  value: unknown,
): PropertyOwnersListResponse {
  const record = isJsonObject(value) ? value : {};
  const rawList = Array.isArray(record.owners)
    ? record.owners
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.data)
        ? record.data
        : [];

  const owners = rawList
    .map((owner) => normalizePropertyOwner(owner))
    .filter((owner): owner is PropertyOwner => owner !== null);

  return {
    total: asNumber(record.total, owners.length),
    page: asNumber(record.page, 1),
    limit: asNumber(record.limit, 20),
    owners,
  };
}

export function normalizePropertyOwnerLookupResult(
  value: unknown,
): PropertyOwnerLookupResult {
  if (!isJsonObject(value)) {
    return { owner: null, matchedContact: null };
  }

  return {
    owner: normalizePropertyOwner(value.owner),
    matchedContact: normalizePropertyOwnerContact(value.matchedContact),
  };
}
