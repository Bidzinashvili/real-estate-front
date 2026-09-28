import type {
  ClientPersistableLockKey,
  LockState,
  TemporaryLockKey,
} from "@/features/matching/matchingEnums";

export type TemporaryLockSessionKind = "client" | "property";

const sessionLocks = new Map<string, TemporaryLockKey[]>();
const clientSearchLockOverlays = new Map<
  string,
  Partial<Record<ClientPersistableLockKey, LockState>>
>();

function sessionStorageKey(kind: TemporaryLockSessionKind, entityId: string): string {
  return `${kind}:${entityId}`;
}

function clientOverlayStorageKey(clientId: string): string {
  return `client-search-overlay:${clientId}`;
}

function readSessionJson<T>(storageKey: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeSessionJson(storageKey: string, value: unknown): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    return;
  }
}

function removeSessionJson(storageKey: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    return;
  }
}

export function clearTemporaryLockSessions(): void {
  sessionLocks.clear();
  clientSearchLockOverlays.clear();
  if (typeof window === "undefined") {
    return;
  }
  const keysToRemove: string[] = [];
  for (let index = 0; index < sessionStorage.length; index += 1) {
    const storageKey = sessionStorage.key(index);
    if (
      storageKey?.startsWith("tempLocks:") ||
      storageKey?.startsWith("client-search-overlay:")
    ) {
      keysToRemove.push(storageKey);
    }
  }
  for (const storageKey of keysToRemove) {
    sessionStorage.removeItem(storageKey);
  }
}

export function writeTemporaryLockSession(
  kind: TemporaryLockSessionKind,
  entityId: string,
  lockKeys: readonly TemporaryLockKey[],
): void {
  const memoryKey = sessionStorageKey(kind, entityId);
  sessionLocks.set(memoryKey, [...lockKeys]);
  writeSessionJson(`tempLocks:${memoryKey}`, [...lockKeys]);
}

export function peekTemporaryLockSession(
  kind: TemporaryLockSessionKind,
  entityId: string,
): TemporaryLockKey[] {
  const memoryKey = sessionStorageKey(kind, entityId);
  const memoryValue = sessionLocks.get(memoryKey);
  if (memoryValue && memoryValue.length > 0) {
    return [...memoryValue];
  }
  const stored = readSessionJson<TemporaryLockKey[]>(`tempLocks:${memoryKey}`);
  if (stored && stored.length > 0) {
    sessionLocks.set(memoryKey, [...stored]);
    return [...stored];
  }
  return [...(memoryValue ?? [])];
}

export function writeClientSearchLockOverlay(
  clientId: string,
  overlay: Partial<Record<ClientPersistableLockKey, LockState>>,
): void {
  clientSearchLockOverlays.set(clientId, { ...overlay });
  writeSessionJson(clientOverlayStorageKey(clientId), overlay);
}

export function peekClientSearchLockOverlay(
  clientId: string,
): Partial<Record<ClientPersistableLockKey, LockState>> {
  const memoryOverlay = clientSearchLockOverlays.get(clientId);
  if (memoryOverlay && Object.keys(memoryOverlay).length > 0) {
    return { ...memoryOverlay };
  }
  const stored = readSessionJson<Partial<Record<ClientPersistableLockKey, LockState>>>(
    clientOverlayStorageKey(clientId),
  );
  if (stored) {
    clientSearchLockOverlays.set(clientId, { ...stored });
    return { ...stored };
  }
  return { ...(memoryOverlay ?? {}) };
}

export function clearClientSearchLockOverlay(clientId: string): void {
  clientSearchLockOverlays.delete(clientId);
  removeSessionJson(clientOverlayStorageKey(clientId));
}
