import { EyeOff } from "lucide-react";
import { HIDE_FROM_OTHERS_COPY } from "@/features/hideFromOthers/hideFromOthersCopy";

type HideFromOthersBadgeProps = {
  isHidden: boolean;
};

export function HideFromOthersBadge({ isHidden }: HideFromOthersBadgeProps) {
  if (!isHidden) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-white"
      title={HIDE_FROM_OTHERS_COPY.hint}
    >
      <EyeOff className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {HIDE_FROM_OTHERS_COPY.badgeLabel}
    </span>
  );
}
