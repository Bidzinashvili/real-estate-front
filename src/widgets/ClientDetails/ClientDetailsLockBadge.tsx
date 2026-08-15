import { Lock } from "lucide-react";
import type { LockState } from "@/features/clients/clientApi.types";

type ClientDetailsLockBadgeProps = {
  lock: LockState;
};

export function ClientDetailsLockBadge({ lock }: ClientDetailsLockBadgeProps) {
  if (lock !== "frozen") {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-md border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive"
      title="გაყინული მკაცრი პირობა"
    >
      <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
      გაყინული
    </span>
  );
}
