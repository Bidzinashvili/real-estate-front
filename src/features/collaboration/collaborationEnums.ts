export const COLLABORATION_STATUSES = [
  "PENDING_RECIPIENT",
  "PENDING_REQUESTER",
  "PENDING_ADMIN",
  "APPROVED",
  "REJECTED_BY_RECIPIENT",
  "REJECTED_BY_REQUESTER",
  "REJECTED_BY_ADMIN",
] as const;

export type CollaborationStatus = (typeof COLLABORATION_STATUSES)[number];

export const COLLABORATION_STATUS_GROUPS = [
  "PENDING",
  "WAITING_ADMIN",
  "APPROVED",
  "REJECTED",
] as const;

export type CollaborationStatusGroup = (typeof COLLABORATION_STATUS_GROUPS)[number];

export const COLLABORATION_SPLITS = [50, 33, 25] as const;

export type CollaborationSplit = (typeof COLLABORATION_SPLITS)[number];

export const COLLABORATION_PARTICIPANT_ROLES = [
  "REQUESTER",
  "RECIPIENT",
  "ADDITIONAL",
] as const;

export type CollaborationParticipantRole =
  (typeof COLLABORATION_PARTICIPANT_ROLES)[number];

export const COLLABORATION_VIEWER_ROLES = [
  "REQUESTER",
  "RECIPIENT",
  "ADDITIONAL",
  "ADMIN",
] as const;

export type CollaborationViewerRole = (typeof COLLABORATION_VIEWER_ROLES)[number];

export const COLLABORATION_NEGOTIATION_ROLES = ["REQUESTER", "RECIPIENT"] as const;

export type CollaborationNegotiationRole =
  (typeof COLLABORATION_NEGOTIATION_ROLES)[number];

export const MONITORING_STATES = ["WATCHING", "CLOSED"] as const;

export type MonitoringState = (typeof MONITORING_STATES)[number];

export function isCollaborationStatus(value: string): value is CollaborationStatus {
  return (COLLABORATION_STATUSES as readonly string[]).includes(value);
}

export function isCollaborationStatusGroup(
  value: string,
): value is CollaborationStatusGroup {
  return (COLLABORATION_STATUS_GROUPS as readonly string[]).includes(value);
}

export function isCollaborationSplit(value: number): value is CollaborationSplit {
  return (COLLABORATION_SPLITS as readonly number[]).includes(value);
}

export function additionalParticipantsNeeded(split: CollaborationSplit): number {
  if (split === 50) {
    return 0;
  }
  if (split === 33) {
    return 1;
  }
  return 2;
}

export function canViewerNegotiate(
  viewerRole: CollaborationViewerRole | null,
  awaitingRole: CollaborationNegotiationRole | null,
): boolean {
  if (awaitingRole === null) {
    return false;
  }
  if (viewerRole !== "REQUESTER" && viewerRole !== "RECIPIENT") {
    return false;
  }
  return viewerRole === awaitingRole;
}

export function canAdminDecide(status: CollaborationStatus): boolean {
  return status === "PENDING_ADMIN";
}
