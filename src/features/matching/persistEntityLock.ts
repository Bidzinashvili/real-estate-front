import type {
  LockState,
  PropertyFieldLockKey,
  PropertyFieldLocks,
} from "@/features/matching/matchingEnums";
import { isPropertyFieldLockKey } from "@/features/matching/matchingEnums";

export function persistEntityLock(lock: LockState): LockState {
  return lock === "frozen" ? "frozen" : "none";
}

export function cyclePersistentLockState(lock: LockState): LockState {
  return lock === "frozen" ? "none" : "frozen";
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

export function readPropertyFieldLock(
  fieldLocks: PropertyFieldLocks | undefined,
  lockKey: PropertyFieldLockKey,
): LockState {
  const lockState = fieldLocks?.[lockKey];
  return lockState === "frozen" ? "frozen" : "none";
}
