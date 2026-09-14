import type { TemporaryLockKey } from "@/features/matching/matchingEnums";

export type TemporaryLockSessionKind = "client" | "property";

const sessionLocks = new Map<string, TemporaryLockKey[]>();

function sessionStorageKey(kind: TemporaryLockSessionKind, entityId: string): string {
  return `${kind}:${entityId}`;
}

export function clearTemporaryLockSessions(): void {
  sessionLocks.clear();
}

export function writeTemporaryLockSession(
  kind: TemporaryLockSessionKind,
  entityId: string,
  lockKeys: readonly TemporaryLockKey[],
): void {
  sessionLocks.set(sessionStorageKey(kind, entityId), [...lockKeys]);
}

export function peekTemporaryLockSession(
  kind: TemporaryLockSessionKind,
  entityId: string,
): TemporaryLockKey[] {
  return [...(sessionLocks.get(sessionStorageKey(kind, entityId)) ?? [])];
}
