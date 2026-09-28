import type { LockState } from "@/features/clients/clientApi.types";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

type ClientDetailsLockBadgeProps = {
  lock: LockState;
  persistedLock?: LockState;
  onChange?: (next: LockState) => void;
  disabled?: boolean;
};

export function ClientDetailsLockBadge({
  lock,
  persistedLock = "none",
  onChange,
  disabled = false,
}: ClientDetailsLockBadgeProps) {
  const isPersistedFrozen = persistedLock === "frozen";
  return (
    <PreferenceLockButton
      mode="client-search"
      value={lock}
      isPersistedFrozen={isPersistedFrozen}
      onChange={onChange ?? (() => {})}
      disabled={disabled || !onChange}
    />
  );
}
