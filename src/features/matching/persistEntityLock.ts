import type { LockState } from "@/features/matching/matchingEnums";

export function persistEntityLock(lock: LockState): LockState {
  return lock === "frozen" ? "frozen" : "none";
}
