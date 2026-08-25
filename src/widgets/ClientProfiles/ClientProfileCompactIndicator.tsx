import Link from "next/link";
import { clientProfileHref } from "@/features/clientProfiles/clientProfileRoutes";
import type { ClientProfileCompact } from "@/features/clientProfiles/types";

type ClientProfileCompactIndicatorProps = {
  clientProfileId: string | null | undefined;
  clientProfile: ClientProfileCompact | null | undefined;
  compact?: boolean;
};

export function ClientProfileCompactIndicator({
  clientProfileId,
  clientProfile,
  compact = false,
}: ClientProfileCompactIndicatorProps) {
  const profileId = clientProfileId ?? clientProfile?.id ?? null;
  if (!profileId) {
    return null;
  }

  const occurrenceCount = clientProfile?.occurrenceCount;
  const isBlacklisted = clientProfile?.blacklisted === true;

  return (
    <div className={compact ? "space-y-0.5" : "space-y-1"}>
      <div className="flex flex-wrap items-center gap-1.5">
        {typeof occurrenceCount === "number" ? (
          <span className="text-xs text-muted-foreground">
            სისტემაში {occurrenceCount}-ჯერ
          </span>
        ) : null}
        {isBlacklisted ? (
          <span className="inline-flex rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
            შავ სიაშია
          </span>
        ) : null}
      </div>
      <Link
        href={clientProfileHref(profileId)}
        onClick={(event) => event.stopPropagation()}
        className="inline-flex text-xs font-medium text-foreground underline-offset-2 hover:underline"
      >
        კლიენტის პროფილი →
      </Link>
    </div>
  );
}
