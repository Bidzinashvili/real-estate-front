import { Lock } from "lucide-react";
import type { LockState } from "@/features/clients/clientApi.types";

type ClientDetailsLockBadgeProps = {
  lock: LockState;
};

const LOCK_BADGE_CLASS: Record<LockState, string> = {
  none: "border-slate-200 bg-slate-50 text-slate-600",
  locked: "border-amber-200 bg-amber-50 text-amber-800",
  frozen: "border-rose-200 bg-rose-50 text-rose-800",
};

const LOCK_LABEL: Record<LockState, string> = {
  none: "Not strict",
  locked: "Strict",
  frozen: "Frozen",
};

export function ClientDetailsLockBadge({ lock }: ClientDetailsLockBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${LOCK_BADGE_CLASS[lock]}`}
      title={`Match filter: ${LOCK_LABEL[lock]}`}
    >
      <Lock className="h-3 w-3 shrink-0" aria-hidden="true" />
      {LOCK_LABEL[lock]}
    </span>
  );
}
