import { CLIENT_PREFERENCE_LABELS as CLIENT_PREFERENCE_DISPLAY_LABELS } from "@/shared/i18n/enumLabels";

export const LOCK_STATES = ["none", "locked", "frozen"] as const;

export type LockState = (typeof LOCK_STATES)[number];

export const CLIENT_PREFERENCE_VALUES = [
  "YES",
  "NO",
  "DOES_NOT_MATTER",
  "NOT_SET",
] as const;

export type ClientPreferenceValue = (typeof CLIENT_PREFERENCE_VALUES)[number];

export const CLIENT_PREFERENCE_LABELS: Record<ClientPreferenceValue, string> = {
  YES: CLIENT_PREFERENCE_DISPLAY_LABELS.YES,
  NO: CLIENT_PREFERENCE_DISPLAY_LABELS.NO,
  DOES_NOT_MATTER: CLIENT_PREFERENCE_DISPLAY_LABELS.DOES_NOT_MATTER,
  NOT_SET: CLIENT_PREFERENCE_DISPLAY_LABELS.NOT_SET,
};

export function isClientPreferenceValue(
  value: string,
): value is ClientPreferenceValue {
  return (CLIENT_PREFERENCE_VALUES as readonly string[]).includes(value);
}

export const MATCH_SCOPES = ["GLOBAL", "MINE"] as const;

export type MatchScope = (typeof MATCH_SCOPES)[number];

export const APARTMENT_VERIFIABLE_FIELDS = [
  "elevator",
  "centralHeating",
  "airConditioner",
  "furnished",
  "petsAllowed",
  "goodView",
  "parkingSpaces",
  "balconyArea",
] as const;

export type ApartmentVerifiableField = (typeof APARTMENT_VERIFIABLE_FIELDS)[number];

export function isApartmentVerifiableField(
  value: string,
): value is ApartmentVerifiableField {
  return (APARTMENT_VERIFIABLE_FIELDS as readonly string[]).includes(value);
}

export const MATCH_CRITERION_KEYS = [
  "street",
  "price",
  "rooms",
  "bedrooms",
  "floor",
  "excludeLastFloor",
  "renovation",
  "buildingCondition",
  "projectExclude",
  "area",
  "hasBalcony",
  "balconyArea",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "parking",
  "pet",
  "minRentalPeriod",
  "bathrooms",
] as const;

export type MatchCriterionKey = (typeof MATCH_CRITERION_KEYS)[number];

export const CRITERION_RESULTS = ["MATCH", "MISMATCH", "SKIP"] as const;

export type CriterionResult = (typeof CRITERION_RESULTS)[number];

export const PROPERTY_FIELD_LOCK_KEYS = [
  "street",
  "price",
  "rooms",
  "bedrooms",
  "floor",
  "excludeLastFloor",
  "renovation",
  "buildingCondition",
  "project",
  "area",
  "hasBalcony",
  "balconyArea",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "parking",
  "petsAllowed",
  "minRentalPeriod",
  "bathrooms",
] as const;

export type PropertyFieldLockKey = (typeof PROPERTY_FIELD_LOCK_KEYS)[number];

export function isPropertyFieldLockKey(value: string): value is PropertyFieldLockKey {
  return (PROPERTY_FIELD_LOCK_KEYS as readonly string[]).includes(value);
}

export type PropertyFieldLocks = Partial<Record<PropertyFieldLockKey, LockState>>;

export const CLIENT_PERSISTABLE_LOCK_KEYS = [
  "districts",
  "addresses",
  "budgetMin",
  "budgetMax",
  "pet",
  "minRooms",
  "maxRooms",
  "minBedrooms",
  "maxBedrooms",
  "minFloor",
  "maxFloor",
  "excludeLastFloor",
  "renovations",
  "buildingCondition",
  "projectExclude",
  "minArea",
  "maxArea",
  "hasBalcony",
  "balconyAreaMin",
  "balconyAreaMax",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "minBathrooms",
  "maxBathrooms",
  "parking",
  "minRentalPeriod",
] as const;

export type ClientPersistableLockKey = (typeof CLIENT_PERSISTABLE_LOCK_KEYS)[number];

export function isClientPersistableLockKey(
  value: string,
): value is ClientPersistableLockKey {
  return (CLIENT_PERSISTABLE_LOCK_KEYS as readonly string[]).includes(value);
}

export const TEMPORARY_LOCK_KEYS = [
  "districts",
  "addresses",
  "street",
  "budgetMin",
  "budgetMax",
  "price",
  "minRooms",
  "maxRooms",
  "rooms",
  "minBedrooms",
  "maxBedrooms",
  "bedrooms",
  "minFloor",
  "maxFloor",
  "floor",
  "excludeLastFloor",
  "renovations",
  "renovation",
  "buildingCondition",
  "projectExclude",
  "project",
  "minArea",
  "maxArea",
  "area",
  "hasBalcony",
  "balconyAreaMin",
  "balconyAreaMax",
  "balconyArea",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "parking",
  "pet",
  "petsAllowed",
  "minRentalPeriod",
  "minBathrooms",
  "maxBathrooms",
  "bathrooms",
] as const;

export type TemporaryLockKey = (typeof TEMPORARY_LOCK_KEYS)[number];

export function isTemporaryLockKey(value: string): value is TemporaryLockKey {
  return (TEMPORARY_LOCK_KEYS as readonly string[]).includes(value);
}

export const CLIENT_SOURCE_TEMPORARY_LOCK_KEYS = [
  "districts",
  "addresses",
  "budgetMin",
  "budgetMax",
  "minRooms",
  "maxRooms",
  "minBedrooms",
  "maxBedrooms",
  "minFloor",
  "maxFloor",
  "excludeLastFloor",
  "renovations",
  "buildingCondition",
  "projectExclude",
  "minArea",
  "maxArea",
  "hasBalcony",
  "balconyAreaMin",
  "balconyAreaMax",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "parking",
  "pet",
  "minRentalPeriod",
  "minBathrooms",
  "maxBathrooms",
] as const satisfies readonly TemporaryLockKey[];

export const PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS = [
  "street",
  "price",
  "rooms",
  "bedrooms",
  "floor",
  "excludeLastFloor",
  "renovation",
  "buildingCondition",
  "project",
  "area",
  "hasBalcony",
  "balconyArea",
  "goodView",
  "elevator",
  "centralHeating",
  "airConditioner",
  "kitchenType",
  "furnished",
  "parking",
  "petsAllowed",
  "minRentalPeriod",
  "bathrooms",
] as const satisfies readonly TemporaryLockKey[];
