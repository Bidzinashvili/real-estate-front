import type {
  LockState,
  PropertyFieldLockKey,
  PropertyFieldLocks,
} from "@/features/matching/matchingEnums";
import { isPropertyFieldLockKey, PROPERTY_FIELD_LOCK_KEYS } from "@/features/matching/matchingEnums";

export function persistEntityLock(lock: LockState): LockState {
  return lock === "frozen" ? "frozen" : "none";
}

export function readPropertyFieldLock(
  fieldLocks: PropertyFieldLocks | undefined,
  lockKey: PropertyFieldLockKey,
): LockState {
  const lockState = fieldLocks?.[lockKey];
  if (lockState === "frozen") {
    return "frozen";
  }
  if (lockState === "locked") {
    return "locked";
  }
  return "none";
}

export function applyPropertyFieldLock(
  fieldLocks: PropertyFieldLocks,
  lockKey: PropertyFieldLockKey,
  nextLock: LockState,
): PropertyFieldLocks {
  const nextLocks: PropertyFieldLocks = { ...fieldLocks };
  if (nextLock === "none") {
    nextLocks[lockKey] = "none";
    return nextLocks;
  }
  nextLocks[lockKey] = nextLock;
  return nextLocks;
}

export function persistPropertyFieldLocks(
  fieldLocks: PropertyFieldLocks | undefined,
): PropertyFieldLocks | undefined {
  if (!fieldLocks) {
    return undefined;
  }

  const persisted: PropertyFieldLocks = {};
  for (const [lockKey, lockState] of Object.entries(fieldLocks)) {
    if (!isPropertyFieldLockKey(lockKey)) {
      continue;
    }
    if (lockState === "frozen") {
      persisted[lockKey] = "frozen";
    }
  }

  return Object.keys(persisted).length > 0 ? persisted : undefined;
}

export function buildPropertyFieldLocksUpdate(
  initialLocks: PropertyFieldLocks | undefined,
  currentLocks: PropertyFieldLocks | undefined,
): PropertyFieldLocks | undefined {
  const initial = initialLocks ?? {};
  const current = currentLocks ?? {};
  const payload: PropertyFieldLocks = {};

  for (const lockKey of PROPERTY_FIELD_LOCK_KEYS) {
    const initialLock = initial[lockKey] === "frozen" ? "frozen" : "none";
    const currentLock = readPropertyFieldLock(current, lockKey);

    if (currentLock === "frozen") {
      payload[lockKey] = "frozen";
      continue;
    }

    if (initialLock === "frozen") {
      payload[lockKey] = currentLock === "locked" ? "locked" : "none";
    }
  }

  return Object.keys(payload).length > 0 ? payload : undefined;
}
