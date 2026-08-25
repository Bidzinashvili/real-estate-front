import type { LockState } from "@/features/clients/clientApi.types";
import { PreferenceLockButton } from "@/widgets/ClientForm/PreferenceLockButton";

type ClientDetailsLockBadgeProps = {
  lock: LockState;
  onChange?: (next: LockState) => void;
  disabled?: boolean;
};

export function ClientDetailsLockBadge({
  lock,
  onChange,
  disabled = false,
}: ClientDetailsLockBadgeProps) {
  return (
    <PreferenceLockButton
      value={lock}
      onChange={onChange ?? (() => {})}
      disabled={disabled || !onChange}
    />
  );
}
