import Link from "next/link";
import type { CollaborationRequestDto } from "@/features/collaboration/collaborationApi.types";
import {
  COLLABORATION_SPLIT_LABELS,
} from "@/features/collaboration/collaborationLabels";
import { DEAL_TYPE_LABELS, lookupEnumLabel } from "@/shared/i18n/enumLabels";
import { CollaborationStatusBadge } from "@/widgets/Collaboration/CollaborationStatusBadge";
import { CollaborationParticipantsList } from "@/widgets/Collaboration/CollaborationParticipantsList";
import {
  formatCollaborationPropertyAddress,
  formatCollaborationPropertyDistrict,
} from "@/widgets/Collaboration/collaborationPropertyDisplay";

type CollaborationRequestCardProps = {
  collaboration: CollaborationRequestDto;
  href: string;
};

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }
  return parsedDate.toLocaleString("ka-GE");
}

export function CollaborationRequestCard({
  collaboration,
  href,
}: CollaborationRequestCardProps) {
  const listing = collaboration.property;
  const identitiesRevealed = collaboration.status === "APPROVED";

  return (
    <article className="space-y-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {formatCollaborationPropertyAddress(listing)}
          </p>
          <p className="text-xs text-muted-foreground">
            {listing
              ? `${formatCollaborationPropertyDistrict(listing) ?? "—"} · ${lookupEnumLabel(DEAL_TYPE_LABELS, listing.dealType) ?? listing.dealType}`
              : "—"}
          </p>
        </div>
        <CollaborationStatusBadge status={collaboration.status} />
      </div>
      <p className="text-sm font-medium text-foreground">
        თანამშრომლობის წილი: {COLLABORATION_SPLIT_LABELS[collaboration.split]}
      </p>
      <p className="text-xs text-muted-foreground">
        მოთხოვნა: {formatDateTime(collaboration.createdAt)}
      </p>
      {collaboration.client ? (
        <p className="text-xs text-muted-foreground">
          კლიენტი: {collaboration.client.name ?? "დეტალები დამალულია დამტკიცებამდე"}
        </p>
      ) : null}
      <CollaborationParticipantsList
        participants={collaboration.participants}
        identitiesRevealed={identitiesRevealed}
      />
      <Link
        href={href}
        className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
      >
        დეტალების ნახვა
      </Link>
    </article>
  );
}
