import type { ClientStatus } from "@/features/clients/clientEnums";

export const CLIENT_DETAILS_STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "bg-success-muted text-success-foreground",
  IN_PROGRESS: "bg-primary/15 text-primary",
  ARCHIVED: "bg-muted text-muted-foreground",
};
