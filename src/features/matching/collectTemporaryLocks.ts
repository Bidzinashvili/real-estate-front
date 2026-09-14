import type { ClientFormValues } from "@/features/clients/clientFormSchema";
import type { ClientDetail } from "@/features/clients/types";
import {
  CLIENT_PERSISTABLE_LOCK_KEYS,
  CLIENT_SOURCE_TEMPORARY_LOCK_KEYS,
  isClientPersistableLockKey,
  PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS,
  type ClientPersistableLockKey,
  type LockState,
  type PropertyFieldLocks,
  type TemporaryLockKey,
} from "@/features/matching/matchingEnums";

function isLockField(
  field: unknown,
): field is { lock: LockState } {
  return (
    typeof field === "object" &&
    field !== null &&
    "lock" in field &&
    (field.lock === "none" || field.lock === "locked" || field.lock === "frozen")
  );
}

export function collectTemporaryLocksFromRecord(
  locks: Partial<Record<string, LockState | undefined>>,
  allowedKeys: readonly TemporaryLockKey[],
): TemporaryLockKey[] {
  return allowedKeys.filter((lockKey) => locks[lockKey] === "locked");
}

export function collectClientFormTemporaryLocks(
  values: ClientFormValues,
): TemporaryLockKey[] {
  const locks: Partial<Record<string, LockState>> = {};
  for (const fieldKey of CLIENT_PERSISTABLE_LOCK_KEYS) {
    const field = values[fieldKey as keyof ClientFormValues];
    if (isLockField(field)) {
      locks[fieldKey] = field.lock;
    }
  }
  return collectTemporaryLocksFromRecord(locks, CLIENT_SOURCE_TEMPORARY_LOCK_KEYS);
}

export function collectPropertyTemporaryLocks(
  fieldLocks: PropertyFieldLocks | undefined,
): TemporaryLockKey[] {
  return collectTemporaryLocksFromRecord(
    fieldLocks ?? {},
    PROPERTY_SOURCE_TEMPORARY_LOCK_KEYS,
  );
}

export function readClientDetailPersistedLock(
  client: ClientDetail,
  fieldKey: ClientPersistableLockKey,
): LockState {
  if (fieldKey === "districts") {
    return client.districtsLock === "frozen" ? "frozen" : "none";
  }
  if (fieldKey === "addresses") {
    return client.addressesLock === "frozen" ? "frozen" : "none";
  }
  if (fieldKey === "budgetMin") {
    return client.budgetMinLock === "frozen" ? "frozen" : "none";
  }
  if (fieldKey === "budgetMax") {
    return client.budgetMaxLock === "frozen" ? "frozen" : "none";
  }
  if (fieldKey === "pet") {
    return client.petLock === "frozen" ? "frozen" : "none";
  }

  const requirements = client.requirements;
  if (!requirements) {
    return "none";
  }

  const requirementLockKey = `${fieldKey}Lock` as keyof typeof requirements;
  const requirementLock = requirements[requirementLockKey];
  return requirementLock === "frozen" ? "frozen" : "none";
}

export function collectClientDetailTemporaryLocks(
  overlay: Partial<Record<ClientPersistableLockKey, LockState>>,
  client: ClientDetail,
): TemporaryLockKey[] {
  const resolvedLocks: Partial<Record<string, LockState>> = {};
  for (const fieldKey of CLIENT_PERSISTABLE_LOCK_KEYS) {
    resolvedLocks[fieldKey] =
      overlay[fieldKey] ?? readClientDetailPersistedLock(client, fieldKey);
  }
  return collectTemporaryLocksFromRecord(
    resolvedLocks,
    CLIENT_SOURCE_TEMPORARY_LOCK_KEYS,
  );
}

export function stripTemporaryLocksFromClientForm(
  values: ClientFormValues,
): ClientFormValues {
  function stripFieldLock<Field extends { lock: LockState }>(field: Field): Field {
    if (field.lock !== "locked") {
      return field;
    }
    return { ...field, lock: "none" } as Field;
  }

  return {
    ...values,
    districts: stripFieldLock(values.districts),
    addresses: stripFieldLock(values.addresses),
    labels: stripFieldLock(values.labels),
    budgetMin: stripFieldLock(values.budgetMin),
    budgetMax: stripFieldLock(values.budgetMax),
    pet: stripFieldLock(values.pet),
    minRooms: stripFieldLock(values.minRooms),
    maxRooms: stripFieldLock(values.maxRooms),
    minBedrooms: stripFieldLock(values.minBedrooms),
    maxBedrooms: stripFieldLock(values.maxBedrooms),
    minFloor: stripFieldLock(values.minFloor),
    maxFloor: stripFieldLock(values.maxFloor),
    excludeLastFloor: stripFieldLock(values.excludeLastFloor),
    renovations: stripFieldLock(values.renovations),
    buildingCondition: stripFieldLock(values.buildingCondition),
    projectExclude: stripFieldLock(values.projectExclude),
    minArea: stripFieldLock(values.minArea),
    maxArea: stripFieldLock(values.maxArea),
    hasBalcony: stripFieldLock(values.hasBalcony),
    balconyAreaMin: stripFieldLock(values.balconyAreaMin),
    balconyAreaMax: stripFieldLock(values.balconyAreaMax),
    goodView: stripFieldLock(values.goodView),
    elevator: stripFieldLock(values.elevator),
    centralHeating: stripFieldLock(values.centralHeating),
    airConditioner: stripFieldLock(values.airConditioner),
    kitchenType: stripFieldLock(values.kitchenType),
    furnished: stripFieldLock(values.furnished),
    minBathrooms: stripFieldLock(values.minBathrooms),
    maxBathrooms: stripFieldLock(values.maxBathrooms),
    parking: stripFieldLock(values.parking),
    minRentalPeriod: stripFieldLock(values.minRentalPeriod),
  };
}

export function resolveClientDetailLock(
  overlay: Partial<Record<ClientPersistableLockKey, LockState>>,
  client: ClientDetail,
  fieldKey: string,
): LockState {
  if (!isClientPersistableLockKey(fieldKey)) {
    return "none";
  }
  return overlay[fieldKey] ?? readClientDetailPersistedLock(client, fieldKey);
}
