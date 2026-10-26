import type { LockState } from "@/features/clients/clientApi.types";
import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
import type { ClientPreferenceValue } from "@/features/matching/matchingEnums";
import { isClientPreferenceValue } from "@/features/matching/matchingEnums";
import { persistEntityLock } from "@/features/matching/persistEntityLock";
import type {
  BuildingCondition,
  KitchenType,
  Renovation,
} from "@/features/clients/clientEnums";
import {
  BUILDING_CONDITIONS,
  KITCHEN_TYPES,
  RENOVATION_VALUES,
} from "@/features/clients/clientEnums";
import type {
  ClientBuildingConditionRequirement,
  ClientKitchenTypeRequirement,
  ClientRenovationsRequirement,
} from "@/features/clients/clientRequirementValues";
import { isClientRequirementPreference } from "@/features/clients/clientRequirementValues";

export function parseLockState(value: JsonValue | undefined): LockState | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "none") {
    return "none";
  }
  if (normalized === "locked") {
    return "locked";
  }
  if (normalized === "frozen") {
    return "frozen";
  }
  return undefined;
}

export function isLockState(value: JsonValue | undefined): value is LockState {
  return parseLockState(value) !== undefined;
}

export function coalesceLock(
  parsedLock: LockState,
  parallelRaw: JsonValue | undefined,
): LockState {
  const fromParallel = parseLockState(parallelRaw);
  if (fromParallel !== undefined) {
    return fromParallel;
  }
  return parsedLock;
}

function camelFieldKeyToSnakeLock(fieldKey: string): string {
  const withUnderscores = fieldKey.replace(/([A-Z])/g, "_$1").toLowerCase();
  return `${withUnderscores}_lock`;
}

export function readParallelLock(
  record: JsonObject,
  fieldKey: string,
): JsonValue | undefined {
  const camelLockKey = `${fieldKey}Lock`;
  const camelCandidate = record[camelLockKey];
  if (camelCandidate !== undefined && camelCandidate !== null) {
    return camelCandidate;
  }
  const snakeLockKey = camelFieldKeyToSnakeLock(fieldKey);
  const snakeCandidate = record[snakeLockKey];
  if (snakeCandidate !== undefined && snakeCandidate !== null) {
    return snakeCandidate;
  }
  const locksRaw = record.locks;
  if (locksRaw !== null && typeof locksRaw === "object" && !Array.isArray(locksRaw)) {
    const lockMap = locksRaw as JsonObject;
    const nestedByField = lockMap[fieldKey];
    if (nestedByField !== undefined && nestedByField !== null) {
      return nestedByField;
    }
    const nestedByCamelLock = lockMap[camelLockKey];
    if (nestedByCamelLock !== undefined && nestedByCamelLock !== null) {
      return nestedByCamelLock;
    }
  }
  return undefined;
}

type LockedObject = { value: JsonValue | undefined; lock: JsonValue | undefined };

function isLockedObject(value: JsonValue | undefined): value is LockedObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return "value" in value && "lock" in value;
}

export function parseLockedStringArray(raw: JsonValue | undefined): {
  value: string[];
  lock: LockState;
} {
  if (Array.isArray(raw)) {
    return {
      value: raw.filter((item): item is string => typeof item === "string"),
      lock: "none",
    };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    const strings = Array.isArray(inner)
      ? inner.filter((item): item is string => typeof item === "string")
      : [];
    return { value: strings, lock };
  }
  return { value: [], lock: "none" };
}

export function parseLockedNumberNullable(raw: JsonValue | undefined): {
  value: number | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return { value: raw, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (typeof inner === "number" && Number.isFinite(inner)) {
      return { value: inner, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
}

export function parseLockedBooleanNullable(raw: JsonValue | undefined): {
  value: boolean | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "boolean") {
    return { value: raw, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (typeof inner === "boolean") {
      return { value: inner, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
}

export function parseLockedBoolean(raw: JsonValue | undefined, fallback: boolean): {
  value: boolean;
  lock: LockState;
} {
  if (typeof raw === "boolean") {
    return { value: raw, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (typeof inner === "boolean") {
      return { value: inner, lock };
    }
    return { value: fallback, lock };
  }
  return { value: fallback, lock: "none" };
}

function parseRenovationsInnerValue(inner: JsonValue | undefined): ClientRenovationsRequirement {
  if (Array.isArray(inner)) {
    return inner.filter(
      (item): item is Renovation =>
        typeof item === "string" && (RENOVATION_VALUES as readonly string[]).includes(item),
    );
  }
  if (typeof inner === "string") {
    if (isClientRequirementPreference(inner)) {
      return inner;
    }
    if ((RENOVATION_VALUES as readonly string[]).includes(inner)) {
      return [inner as Renovation];
    }
  }
  return "NOT_SET";
}

export function parseLockedRenovations(raw: JsonValue | undefined): {
  value: ClientRenovationsRequirement;
  lock: LockState;
} {
  if (Array.isArray(raw)) {
    return {
      value: parseRenovationsInnerValue(raw),
      lock: "none",
    };
  }
  if (isLockedObject(raw)) {
    const lock = persistEntityLock(parseLockState(raw.lock) ?? "none");
    return { value: parseRenovationsInnerValue(raw.value), lock };
  }
  if (typeof raw === "string") {
    return { value: parseRenovationsInnerValue(raw), lock: "none" };
  }
  return { value: "NOT_SET", lock: "none" };
}

export function parseLockedPreference(raw: JsonValue | undefined): {
  value: ClientPreferenceValue;
  lock: LockState;
} {
  if (typeof raw === "string" && isClientPreferenceValue(raw)) {
    return { value: raw, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = persistEntityLock(parseLockState(raw.lock) ?? "none");
    const inner = raw.value;
    if (typeof inner === "string" && isClientPreferenceValue(inner)) {
      return { value: inner, lock };
    }
    return { value: "NOT_SET", lock };
  }
  return { value: "NOT_SET", lock: "none" };
}

function parseBuildingConditionInnerValue(
  inner: JsonValue | undefined,
): ClientBuildingConditionRequirement {
  if (inner === null || inner === undefined) {
    return "NOT_SET";
  }
  if (typeof inner !== "string") {
    return "NOT_SET";
  }
  if (isClientRequirementPreference(inner)) {
    return inner;
  }
  if ((BUILDING_CONDITIONS as readonly string[]).includes(inner)) {
    return inner as BuildingCondition;
  }
  return "NOT_SET";
}

export function parseLockedBuildingCondition(raw: JsonValue | undefined): {
  value: ClientBuildingConditionRequirement;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: "NOT_SET", lock: "none" };
  }
  if (typeof raw === "string") {
    return { value: parseBuildingConditionInnerValue(raw), lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    return { value: parseBuildingConditionInnerValue(raw.value), lock };
  }
  return { value: "NOT_SET", lock: "none" };
}

function parseKitchenTypeInnerValue(inner: JsonValue | undefined): ClientKitchenTypeRequirement {
  if (inner === null || inner === undefined) {
    return "NOT_SET";
  }
  if (typeof inner !== "string") {
    return "NOT_SET";
  }
  if (isClientRequirementPreference(inner)) {
    return inner;
  }
  if ((KITCHEN_TYPES as readonly string[]).includes(inner)) {
    return inner as KitchenType;
  }
  return "NOT_SET";
}

export function parseLockedKitchenType(raw: JsonValue | undefined): {
  value: ClientKitchenTypeRequirement;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: "NOT_SET", lock: "none" };
  }
  if (typeof raw === "string") {
    return { value: parseKitchenTypeInnerValue(raw), lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    return { value: parseKitchenTypeInnerValue(raw.value), lock };
  }
  return { value: "NOT_SET", lock: "none" };
}

export function parseLockedPetPreference(raw: JsonValue | undefined): {
  value: ClientPreferenceValue;
  lock: LockState;
} {
  if (typeof raw === "boolean") {
    return { value: raw ? "YES" : "NO", lock: "none" };
  }
  return parseLockedPreference(raw);
}

export function parseLockedStringArrayList(raw: JsonValue | undefined): {
  value: string[];
  lock: LockState;
} {
  return parseLockedStringArray(raw);
}

export function parseLockedStringNullable(raw: JsonValue | undefined): {
  value: string | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "string") {
    return { value: raw, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (typeof inner === "string") {
      return { value: inner, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
}
