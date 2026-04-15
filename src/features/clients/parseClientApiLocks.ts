import type { LockState } from "@/features/clients/clientApi.types";
import type { JsonObject, JsonValue } from "@/shared/lib/jsonValue";
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

export function parseLockedRenovation(raw: JsonValue | undefined): {
  value: Renovation | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "string" && (RENOVATION_VALUES as readonly string[]).includes(raw)) {
    return { value: raw as Renovation, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (
      typeof inner === "string" &&
      (RENOVATION_VALUES as readonly string[]).includes(inner)
    ) {
      return { value: inner as Renovation, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
}

export function parseLockedBuildingCondition(raw: JsonValue | undefined): {
  value: BuildingCondition | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "string" && (BUILDING_CONDITIONS as readonly string[]).includes(raw)) {
    return { value: raw as BuildingCondition, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (
      typeof inner === "string" &&
      (BUILDING_CONDITIONS as readonly string[]).includes(inner)
    ) {
      return { value: inner as BuildingCondition, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
}

export function parseLockedKitchenType(raw: JsonValue | undefined): {
  value: KitchenType | null;
  lock: LockState;
} {
  if (raw === null || raw === undefined) {
    return { value: null, lock: "none" };
  }
  if (typeof raw === "string" && (KITCHEN_TYPES as readonly string[]).includes(raw)) {
    return { value: raw as KitchenType, lock: "none" };
  }
  if (isLockedObject(raw)) {
    const lock = parseLockState(raw.lock) ?? "none";
    const inner = raw.value;
    if (inner === null || inner === undefined) {
      return { value: null, lock };
    }
    if (typeof inner === "string" && (KITCHEN_TYPES as readonly string[]).includes(inner)) {
      return { value: inner as KitchenType, lock };
    }
    return { value: null, lock };
  }
  return { value: null, lock: "none" };
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
