import {
  isClientStatus,
  isDealType,
  type ClientStatus,
  type DealType,
} from "@/features/clients/clientEnums";
import type {
  ClientProfile,
  ClientProfileAudit,
  ClientProfileCompact,
  ClientProfileHistoryNote,
  ClientProfileListItem,
  ClientProfileLookupProfile,
  ClientProfileLookupResult,
  ClientProfileOwningAgent,
  ClientProfilePhone,
  ClientProfilesListResponse,
} from "@/features/clientProfiles/types";
import {
  asBoolean,
  asNumber,
  asNullableString,
  asString,
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

function asStringArray(value: JsonValue | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item !== "");
}

function parseDealTypeValue(value: JsonValue | undefined): DealType | null {
  const raw = asString(value).trim();
  return isDealType(raw) ? raw : null;
}

function parseDealTypes(value: JsonValue | undefined): DealType[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => parseDealTypeValue(item))
    .filter((dealType): dealType is DealType => dealType !== null);
}

function parseClientStatusValue(value: JsonValue | undefined): ClientStatus | null {
  const raw = asString(value).trim();
  return isClientStatus(raw) ? raw : null;
}

export function normalizeClientProfilePhone(
  value: unknown,
): ClientProfilePhone | null {
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
    createdAt: asNullableString(value.createdAt) ?? "",
    updatedAt: asNullableString(value.updatedAt) ?? "",
  };
}

function normalizeOwningAgent(value: unknown): ClientProfileOwningAgent | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }
  const fullName =
    asString(value.fullName).trim() ||
    asString(value.name).trim() ||
    asString(value.email).trim();
  return {
    id,
    fullName,
  };
}

export function normalizeClientProfileHistoryNote(
  value: unknown,
): ClientProfileHistoryNote | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  const owningAgent = value.owningAgent
    ? normalizeOwningAgent(value.owningAgent)
    : undefined;
  const userId = asNullableString(value.userId)?.trim();

  return {
    id,
    name: asNullableString(value.name),
    dealType: parseDealTypeValue(value.dealType),
    status: parseClientStatusValue(value.status),
    archivedAt: asNullableString(value.archivedAt),
    createdAt: asNullableString(value.createdAt) ?? "",
    districts: asStringArray(value.districts),
    budgetMin: asNullableNumber(value.budgetMin),
    budgetMax: asNullableNumber(value.budgetMax),
    userId: userId ? userId : undefined,
    owningAgent: owningAgent === undefined ? undefined : owningAgent,
  };
}

function normalizeAudits(value: JsonValue | undefined): ClientProfileAudit[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!isJsonObject(item)) {
        return null;
      }
      const id = asString(item.id).trim();
      const action = asString(item.action).trim();
      if (!id || !action) {
        return null;
      }
      return {
        id,
        action,
        createdAt: asNullableString(item.createdAt) ?? "",
        userId: asNullableString(item.userId),
      } satisfies ClientProfileAudit;
    })
    .filter((audit): audit is ClientProfileAudit => audit !== null);
}

function readCanViewDetails(value: unknown, fallback: boolean): boolean {
  if (!isJsonObject(value) || typeof value.canViewDetails !== "boolean") {
    return fallback;
  }
  return value.canViewDetails;
}

function normalizePhones(value: JsonValue | undefined): ClientProfilePhone[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((phoneItem) => normalizeClientProfilePhone(phoneItem))
    .filter((phoneItem): phoneItem is ClientProfilePhone => phoneItem !== null);
}

function normalizeHistoryNotes(
  value: JsonValue | undefined,
): ClientProfileHistoryNote[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((note) => normalizeClientProfileHistoryNote(note))
    .filter((note): note is ClientProfileHistoryNote => note !== null);
}

export function normalizeClientProfileCompact(
  value: unknown,
): ClientProfileCompact | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }
  return {
    id,
    blacklisted: asBoolean(value.blacklisted, false),
    occurrenceCount: asNumber(value.occurrenceCount, 0),
  };
}

export function normalizeClientProfileLookupProfile(
  value: unknown,
): ClientProfileLookupProfile | null {
  if (!isJsonObject(value)) {
    return null;
  }
  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  const canViewDetails = readCanViewDetails(value, false);

  return {
    id,
    name: canViewDetails ? asNullableString(value.name) : null,
    phones: canViewDetails ? normalizePhones(value.phones) : [],
    clients: canViewDetails ? normalizeHistoryNotes(value.clients) : [],
    comment: canViewDetails ? asNullableString(value.comment) : null,
    blacklistReason: canViewDetails ? asNullableString(value.blacklistReason) : null,
    blacklisted: asBoolean(value.blacklisted, false),
    canViewDetails,
    occurrenceCount: asNumber(value.occurrenceCount, 0),
    ownOccurrenceCount: asNumber(value.ownOccurrenceCount, 0),
  };
}

export function normalizeClientProfile(value: unknown): ClientProfile | null {
  if (!isJsonObject(value)) {
    return null;
  }

  const id = asString(value.id).trim();
  if (!id) {
    return null;
  }

  const canViewDetails = readCanViewDetails(value, true);
  const phones = canViewDetails ? normalizePhones(value.phones) : [];
  const clients = canViewDetails ? normalizeHistoryNotes(value.clients) : [];

  return {
    id,
    name: canViewDetails ? asNullableString(value.name) : null,
    comment: canViewDetails ? asNullableString(value.comment) : null,
    phones,
    clients,
    blacklisted: asBoolean(value.blacklisted, false),
    blacklistReason: canViewDetails ? asNullableString(value.blacklistReason) : null,
    blacklistedAt: canViewDetails ? asNullableString(value.blacklistedAt) : null,
    blacklistedByUserId: canViewDetails
      ? asNullableString(value.blacklistedByUserId)
      : null,
    occurrenceCount: asNumber(value.occurrenceCount, 0),
    ownOccurrenceCount: asNumber(value.ownOccurrenceCount, 0),
    firstSeenAt: asNullableString(value.firstSeenAt),
    lastSeenAt: asNullableString(value.lastSeenAt),
    dealTypes: parseDealTypes(value.dealTypes),
    canViewDetails,
    audits: canViewDetails ? normalizeAudits(value.audits) : [],
    createdAt: asNullableString(value.createdAt) ?? "",
    updatedAt: asNullableString(value.updatedAt) ?? "",
  };
}

function resolvePrimaryPhone(profile: {
  phones: ClientProfilePhone[];
  primaryPhone?: string | null;
}): string | null {
  const explicit = profile.primaryPhone?.trim();
  if (explicit) {
    return explicit;
  }
  const primary = profile.phones.find((phoneItem) => phoneItem.isPrimary);
  if (primary?.phone) {
    return primary.phone;
  }
  return profile.phones[0]?.phone ?? null;
}

export function normalizeClientProfileListItem(
  value: unknown,
): ClientProfileListItem | null {
  const profile = normalizeClientProfile(value);
  if (!profile) {
    return null;
  }
  const record = isJsonObject(value) ? value : {};
  const explicitPrimary = asNullableString(record.primaryPhone);
  return {
    id: profile.id,
    name: profile.canViewDetails ? profile.name : null,
    comment: profile.canViewDetails ? profile.comment : null,
    primaryPhone: profile.canViewDetails
      ? resolvePrimaryPhone({
          phones: profile.phones,
          primaryPhone: explicitPrimary,
        })
      : null,
    phones: profile.phones,
    blacklisted: profile.blacklisted,
    occurrenceCount: profile.occurrenceCount,
    ownOccurrenceCount: profile.ownOccurrenceCount,
    firstSeenAt: profile.firstSeenAt,
    lastSeenAt: profile.lastSeenAt,
    dealTypes: profile.dealTypes,
    canViewDetails: profile.canViewDetails,
  };
}

export function normalizeClientProfilesListResponse(
  value: unknown,
): ClientProfilesListResponse {
  const record = isJsonObject(value) ? value : {};
  const rawList = Array.isArray(record.profiles)
    ? record.profiles
    : Array.isArray(record.items)
      ? record.items
      : Array.isArray(record.data)
        ? record.data
        : [];

  const profiles = rawList
    .map((profile) => normalizeClientProfileListItem(profile))
    .filter((profile): profile is ClientProfileListItem => profile !== null);

  return {
    total: asNumber(record.total, profiles.length),
    page: asNumber(record.page, 1),
    limit: asNumber(record.limit, 20),
    profiles,
  };
}

export function emptyLookupResult(): ClientProfileLookupResult {
  return {
    matched: false,
    profileId: null,
    matchedPhone: null,
    occurrenceCount: 0,
    ownOccurrenceCount: 0,
    firstSeenAt: null,
    lastSeenAt: null,
    dealTypes: [],
    blacklisted: false,
    profile: null,
  };
}

export function normalizeClientProfileLookupResult(
  value: unknown,
): ClientProfileLookupResult {
  if (!isJsonObject(value)) {
    return emptyLookupResult();
  }

  const profile = normalizeClientProfileLookupProfile(value.profile);
  const profileId =
    asNullableString(value.profileId)?.trim() || profile?.id || null;

  return {
    matched: asBoolean(value.matched, Boolean(profileId)),
    profileId,
    matchedPhone: asNullableString(value.matchedPhone),
    occurrenceCount: asNumber(value.occurrenceCount, profile?.occurrenceCount ?? 0),
    ownOccurrenceCount: asNumber(
      value.ownOccurrenceCount,
      profile?.ownOccurrenceCount ?? 0,
    ),
    firstSeenAt: asNullableString(value.firstSeenAt),
    lastSeenAt: asNullableString(value.lastSeenAt),
    dealTypes: parseDealTypes(value.dealTypes),
    blacklisted: asBoolean(
      value.blacklisted,
      profile?.blacklisted ?? false,
    ),
    profile,
  };
}
