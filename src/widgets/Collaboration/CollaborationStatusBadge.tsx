import type {
  CollaborationNegotiationRole,
  CollaborationStatus,
  CollaborationViewerRole,
} from "@/features/collaboration/collaborationEnums";
import { formatCollaborationStatusLabel } from "@/features/collaboration/collaborationLabels";

type CollaborationStatusBadgeProps = {
  status: CollaborationStatus;
  viewerRole?: CollaborationViewerRole | null;
  awaitingRole?: CollaborationNegotiationRole | null;
};

function badgeClassName(status: CollaborationStatus): string {
  if (status === "APPROVED") {
    return "bg-success-muted text-success-foreground";
  }
  if (status === "PENDING_ADMIN") {
    return "bg-warning-muted text-warning-foreground";
  }
  if (status === "PENDING_RECIPIENT" || status === "PENDING_REQUESTER") {
    return "bg-primary/15 text-primary";
  }
  return "bg-destructive/10 text-destructive";
}

export function CollaborationStatusBadge({
  status,
  viewerRole = null,
  awaitingRole = null,
}: CollaborationStatusBadgeProps) {
  const label = formatCollaborationStatusLabel(status, viewerRole, awaitingRole);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClassName(status)}`}
    >
      {label}
    </span>
  );
}
