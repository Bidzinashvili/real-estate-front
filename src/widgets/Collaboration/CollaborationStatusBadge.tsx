import type { CollaborationStatus } from "@/features/collaboration/collaborationEnums";
import { COLLABORATION_STATUS_LABELS } from "@/features/collaboration/collaborationLabels";

type CollaborationStatusBadgeProps = {
  status: CollaborationStatus;
};

function badgeClassName(status: CollaborationStatus): string {
  if (status === "APPROVED") {
    return "bg-success-muted text-success-foreground";
  }
  if (status === "PENDING_ADMIN") {
    return "bg-warning-muted text-warning-foreground";
  }
  if (status === "PENDING_RECIPIENT") {
    return "bg-primary/15 text-primary";
  }
  return "bg-destructive/10 text-destructive";
}

export function CollaborationStatusBadge({ status }: CollaborationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClassName(status)}`}
    >
      {COLLABORATION_STATUS_LABELS[status]}
    </span>
  );
}
