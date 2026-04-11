export const CLIENT_INVITE_LINK_STATUSES = ["ACTIVE", "USED", "EXPIRED"] as const;
export type ClientInviteLinkStatus = (typeof CLIENT_INVITE_LINK_STATUSES)[number];

export const CLIENT_INVITE_LINK_STATUS_LABELS: Record<ClientInviteLinkStatus, string> = {
  ACTIVE: "Active",
  USED: "Used",
  EXPIRED: "Expired",
};
